"use client";

import { ChakraProvider } from "@chakra-ui/react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { appSystem } from "@/styles/theme";
import { useTimeBasedBgColor } from "@/hooks/useTimeBasedBgColor";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [{ cache, flush }] = useState(() => {
    const c = createCache({ key: "css" });
    // compat:true を作成後にセット。_insert は cache を closure で参照するため有効。
    // compat=true で Global は SSR 時に <style> をツリーに挿入せず null を返し、
    // CSS 文字列を cache.inserted[name] に格納するようになる。
    c.compat = true;

    // グローバルスタイル（selector=""）とコンポーネントスタイルを分けて追跡する。
    // クライアントの Global コンポーネントは
    //   document.querySelector(`style[data-emotion="css-global ${name}"]`)
    // を探して rehydration を行う。
    // 我々が "css globalName" で emit するとこのクエリがヒットせず
    // Global がスタイルを再挿入 → next チェーン順序が変わり hash がズレる。
    const globalInserted: string[] = [];
    const componentInserted: string[] = [];

    const origInsert = c.insert.bind(c);
    c.insert = (...args: Parameters<typeof origInsert>) => {
      const [selector, serialized] = args;
      const name = serialized.name;
      if (c.inserted[name] === undefined) {
        if (selector === "") {
          // selector="" は Global コンポーネントからの呼び出し
          globalInserted.push(name);
        } else {
          componentInserted.push(name);
        }
      }
      return origInsert(...args);
    };

    const flush = () => ({
      globals: globalInserted.splice(0),
      components: componentInserted.splice(0),
    });

    return { cache: c, flush };
  });

  useServerInsertedHTML(() => {
    const { globals, components } = flush();
    const elements: ReactNode[] = [];

    // グローバルスタイルは 1 件ずつ "css-global NAME" で emit する。
    // こうすることでクライアントの Global コンポーネントが
    // data-emotion="css-global NAME" を見つけて rehydration できる。
    for (const name of globals) {
      const val = cache.inserted[name];
      if (typeof val === "string") {
        elements.push(
          <style
            key={`${cache.key}-global-${name}`}
            data-emotion={`${cache.key}-global ${name}`}
            dangerouslySetInnerHTML={{ __html: val }}
          />,
        );
      }
    }

    // コンポーネントスタイルはまとめて "css NAME1 NAME2 ..." で emit する。
    if (components.length > 0) {
      let styles = "";
      for (const name of components) {
        const val = cache.inserted[name];
        if (typeof val === "string") styles += val;
      }
      if (styles) {
        elements.push(
          <style
            key={cache.key}
            data-emotion={`${cache.key} ${components.join(" ")}`}
            dangerouslySetInnerHTML={{ __html: styles }}
          />,
        );
      }
    }

    if (elements.length === 0) return null;
    return <>{elements}</>;
  });

  return (
    <CacheProvider value={cache}>
      <ChakraProvider value={appSystem}>
        <TimeBgColorApplier />
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}

/** 現在時刻に基づいて --chakra-colors-bg CSS変数を動的に更新するコンポーネント */
function TimeBgColorApplier() {
  const color = useTimeBasedBgColor();

  useEffect(() => {
    document.documentElement.style.setProperty("--chakra-colors-bg", color);
  }, [color]);

  return null;
}
