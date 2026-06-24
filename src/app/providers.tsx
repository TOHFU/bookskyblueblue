"use client";

import { ChakraProvider } from "@chakra-ui/react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import type { ReactNode } from "react";
import { appSystem } from "@/styles/theme";
import { useTimeBasedBgColor } from "@/hooks/useTimeBasedBgColor";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [{ cache, flush }] = useState(() => {
    const nextCache = createCache({ key: "css" });
    nextCache.compat = true;

    const globalInserted: string[] = [];
    const componentInserted: string[] = [];

    const prevInsert = nextCache.insert.bind(nextCache);
    nextCache.insert = (...args: Parameters<typeof prevInsert>) => {
      const [selector, serialized] = args;
      const name = serialized.name;
      if (nextCache.inserted[name] === undefined) {
        if (selector === "") {
          globalInserted.push(name);
        } else {
          componentInserted.push(name);
        }
      }
      return prevInsert(...args);
    };

    const flush = () => ({
      globals: globalInserted.splice(0),
      components: componentInserted.splice(0),
    });

    return {
      cache: nextCache,
      flush,
    };
  });

  useServerInsertedHTML(() => {
    const { globals, components } = flush();
    const elements: ReactNode[] = [];

    for (const name of globals) {
      const style = cache.inserted[name];
      if (typeof style === "string") {
        elements.push(
          <style
            key={`${cache.key}-global-${name}`}
            data-emotion={`${cache.key}-global ${name}`}
            dangerouslySetInnerHTML={{ __html: style }}
          />
        );
      }
    }

    if (components.length > 0) {
      let styles = "";
      for (const name of components) {
        const style = cache.inserted[name];
        if (typeof style === "string") {
          styles += style;
        }
      }
      if (styles) {
        elements.push(
          <style
            key={cache.key}
            data-emotion={`${cache.key} ${components.join(" ")}`}
            dangerouslySetInnerHTML={{ __html: styles }}
          />
        );
      }
    }

    if (elements.length === 0) {
      return null;
    }

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

/** 現在時刻に基づいて --time-bg-gradient CSS変数を動的に更新する */
function TimeBgColorApplier() {
  const color = useTimeBasedBgColor();

  useLayoutEffect(() => {
    document.documentElement.style.setProperty("--time-bg-gradient", color);
  }, [color]);

  return null;
}
