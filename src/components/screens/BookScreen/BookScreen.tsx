"use client";

import { Box, Flex, IconButton, Spinner, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getWork,
  saveReadingPosition,
  getReadingPosition,
} from "@/data/repositories/workIndexedDbRepository";

type BookScreenProps = {
  identifier: string;
};

const FADE_TIMEOUT_MS = 3000;

/** imgタグをalt属性のテキストに置換し、スクリプト・危険な属性を除去する */
function sanitizeHtml(html: string): string {
  return html
    // imgタグはaltテキストのみ残す
    .replace(/<img[^>]*alt\s*=\s*"([^"]*?)"[^>]*\/?>/gi, (_, alt: string) => alt)
    .replace(/<img[^>]*alt\s*=\s*'([^']*?)'[^>]*\/?>/gi, (_, alt: string) => alt)
    .replace(/<img[^>]*\/?>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*')/gi, "")
    .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, "")
    // 連続する3つ以上の<br>を最大2つに制限（縦書き列高さの超過を防止）
    .replace(/(<br\s*\/?>\s*){3,}/gi, "<br><br>");
}

/** XHTMLから main_text 部分を抽出する（ネストしたdivに対応） */
function extractMainContent(html: string): string {
  const startMatch = html.match(
    /<div[^>]+class=["'][^"']*main_text[^"']*["'][^>]*>/i
  );
  if (startMatch && startMatch.index !== undefined) {
    const startIdx = startMatch.index + startMatch[0].length;
    let depth = 1;
    let i = startIdx;
    while (i < html.length && depth > 0) {
      const openIdx = html.indexOf("<div", i);
      const closeIdx = html.indexOf("</div", i);
      if (closeIdx === -1) break;
      if (openIdx !== -1 && openIdx < closeIdx) {
        depth++;
        i = openIdx + 4;
      } else {
        depth--;
        if (depth === 0) return sanitizeHtml(html.slice(startIdx, closeIdx));
        i = closeIdx + 6;
      }
    }
  }
  // main_text が見つからない場合は body 全体にフォールバック
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return sanitizeHtml(bodyMatch[1]);
  return sanitizeHtml(html);
}

/**
 * BOOK画面のコンポーネント
 * 縦書きマルチカラムで作品を表示し、ページネーション機能を提供する
 */
export function BookScreen({ identifier }: BookScreenProps) {
  const router = useRouter();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [contentAreaWidth, setContentAreaWidth] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // currentPage+1 が奇数ならページ番号は右、偶数なら左
  const isOddPageNumber = (currentPage + 1) % 2 !== 0;

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(
      () => setControlsVisible(false),
      FADE_TIMEOUT_MS
    );
  }, []);

  useEffect(() => {
    const loadWork = async () => {
      const work = await getWork(identifier);
      if (!work?.content) {
        setHtmlContent("");
        return;
      }
      const content = extractMainContent(work.content);
      setHtmlContent(content);
      const savedPage = await getReadingPosition(identifier);
      setCurrentPage(savedPage);
    };

    loadWork();
    fadeTimer.current = setTimeout(
      () => setControlsVisible(false),
      FADE_TIMEOUT_MS
    );
    return () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, [identifier]);

  // コンテンツ描画後にページ数と幅を計算（ウィンドウリサイズ時にも再計算）
  const calcLayout = useCallback(() => {
    if (!innerRef.current || !contentAreaRef.current) return;

    // インラインスタイルをリセットして CSS クラス(left:2em/right:2em)で自然幅を復元
    contentAreaRef.current.style.width = "";
    contentAreaRef.current.style.right = "";

    const computedLH = parseFloat(getComputedStyle(innerRef.current).lineHeight);
    const columnWidth =
      Number.isFinite(computedLH) && computedLH > 0 ? computedLH : 32;

    const rawAreaWidth = contentAreaRef.current.clientWidth;
    const columnsPerPage = Math.max(1, Math.floor(rawAreaWidth / columnWidth));
    const snappedPageWidth = columnsPerPage * columnWidth;

    const totalWidth = innerRef.current.offsetWidth;
    const totalColumns = Math.ceil(totalWidth / columnWidth);
    const count = Math.max(1, Math.ceil(totalColumns / columnsPerPage));

    // インラインスタイルで列幅倍数にスナップ（CSS クラスより優先される）
    contentAreaRef.current.style.width = `${snappedPageWidth}px`;
    // right: 2em CSS クラスをインラインで上書きして幅が再び制約されないようにする
    contentAreaRef.current.style.right = "auto";

    setContentAreaWidth(snappedPageWidth);
    setPageCount(count);
    setCurrentPage((prev) => Math.min(prev, count - 1));
  }, []);

  useEffect(() => {
    if (!htmlContent) return;
    calcLayout();
  }, [htmlContent, calcLayout]);

  // ウィンドウリサイズ時に再計算
  // contentAreaRef ではなく containerRef を監視して自己ループを防ぐ
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      calcLayout();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [calcLayout]);

  const handlePrevPage = () => {
    showControls();
    if (currentPage <= 0) return;
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    void saveReadingPosition(identifier, newPage);
  };

  const handleNextPage = () => {
    showControls();
    if (currentPage >= pageCount - 1) return;
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    void saveReadingPosition(identifier, newPage);
  };

  const handleClose = () => {
    router.push("/");
  };

  return (
    <Box
      ref={containerRef}
      as="main"
      w="full"
      h="100svh"
      bg="#16AEFA"
      position="relative"
      overflow="hidden"
      onClick={showControls}
    >
      {/* 縦書きコンテンツエリア（padding内の領域）
          pageWidth確定後はビューポートを列幅の倍数に切り詰め、
          translateX のずれが左端に溢れないようにする */}
      <Box
        ref={contentAreaRef}
        position="absolute"
        top="2em"
        left="2em"
        right="2em"
        bottom="5em"
        overflow="hidden"
      >
        {htmlContent === null ? (
          <Flex w="full" h="full" align="center" justify="center">
            <Spinner color="#012639" />
          </Flex>
        ) : (
          <Box
            ref={innerRef}
            className="book-content"
            position="absolute"
            right="0"
            top="0"
            h="full"
            style={{
              transform: `translateX(${currentPage * contentAreaWidth}px)`,
              transition: "transform 0.3s ease",
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </Box>

      {/* ページ番号: 奇数ページ→右下、偶数ページ→左下 */}
      <Text
        position="absolute"
        bottom="2em"
        {...(isOddPageNumber ? { right: "2em" } : { left: "2em" })}
        fontFamily="'Noto Serif JP', serif"
        fontSize="16px"
        fontWeight="700"
        lineHeight="18px"
        color="#012639"
      >
        {currentPage + 1}
      </Text>

      {/* フローティングコントロール */}
      <Box
        position="absolute"
        bottom="0"
        left="50%"
        transform="translateX(-50%)"
        opacity={controlsVisible ? 1 : 0}
        transition="opacity 0.5s ease"
        pointerEvents={controlsVisible ? "auto" : "none"}
      >
        <Flex direction="row" align="center">
          {/* 前のページへ（← → 次への方向なので left押下で+1） */}
          <IconButton
            aria-label="次のページ"
            variant="solid"
            bg="#18181B"
            color="white"
            w="44px"
            h="44px"
            onClick={handleNextPage}
            disabled={currentPage >= pageCount - 1}
          >
            <ChevronLeft size={20} />
          </IconButton>

          {/* TOPに戻る */}
          <IconButton
            aria-label="TOPに戻る"
            variant="solid"
            bg="#18181B"
            color="white"
            w="44px"
            h="44px"
            onClick={handleClose}
          >
            <X size={20} />
          </IconButton>

          {/* 右を押したら前のページ（縦書き本の進行方向） */}
          <IconButton
            aria-label="前のページ"
            variant="solid"
            bg="#18181B"
            color="white"
            w="44px"
            h="44px"
            onClick={handlePrevPage}
            disabled={currentPage <= 0}
          >
            <ChevronRight size={20} />
          </IconButton>
        </Flex>
      </Box>
    </Box>
  );
}
