"use client";

import { ChakraProvider } from "@chakra-ui/react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { useLayoutEffect } from "react";
import { useState } from "react";
import type { ReactNode } from "react";
import { appSystem } from "@/styles/theme";
import { useTimeBasedBgColor } from "@/hooks/useTimeBasedBgColor";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [{ cache, flush }] = useState(() => {
    const nextCache = createCache({ key: "chakra" });
    nextCache.compat = true;

    const prevInsert = nextCache.insert;
    let inserted: string[] = [];

    nextCache.insert = (...args: Parameters<typeof prevInsert>) => {
      const serialized = args[1];
      if (nextCache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };

    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    return {
      cache: nextCache,
      flush,
    };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }

    let styles = "";
    for (const name of names) {
      const style = cache.inserted[name];
      if (typeof style === "string") {
        styles += style;
      }
    }

    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
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

/** 現在時刻に基づいて --chakra-colors-bg CSS変数および body の背景を動的に更新するコンポーネント */
function TimeBgColorApplier() {
  const color = useTimeBasedBgColor();

  useLayoutEffect(() => {
    document.documentElement.style.setProperty("--time-bg-gradient", color);
  }, [color]);

  return null;
}