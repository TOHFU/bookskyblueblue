"use client";

import { ChakraProvider } from "@chakra-ui/react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import { appSystem } from "@/styles/theme";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [{ cache, flush }] = useState(() => {
    // createCache は compat オプションを無視するため、作成後に明示的にセットする必要がある。
    // _insert 関数は cache を closure で参照するため、後からセットしても有効。
    // key: "css" は Chakra UI のデフォルトキーと統一してクラス名プレフィクスを合わせる。
    const c = createCache({ key: "css" });
    // compat:true にすることで:
    //   1. Global コンポーネントが SSR 時に <style> をツリーに挿入せず null を返す
    //   2. _insert が CSS 文字列を cache.inserted[name] に格納する（useServerInsertedHTML で抽出可能になる）
    c.compat = true;

    const inserted: string[] = [];
    const origInsert = c.insert.bind(c);
    c.insert = (...args: Parameters<typeof origInsert>) => {
      const serialized = args[1];
      if (c.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return origInsert(...args);
    };

    const flush = () => inserted.splice(0);
    return { cache: c, flush };
  });

  // SSR 時にスタイルを <head> に注入して React ツリー内への <style> 挿入を防ぐ
  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;

    let styles = "";
    for (const name of names) {
      const val = cache.inserted[name];
      if (typeof val === "string") styles += val;
    }
    if (!styles) return null;

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ChakraProvider value={appSystem}>{children}</ChakraProvider>
    </CacheProvider>
  );
}
