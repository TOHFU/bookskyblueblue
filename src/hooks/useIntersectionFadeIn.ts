"use client";

import { useLayoutEffect, useRef, useState } from "react";

function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

export function useIntersectionFadeIn<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // マウント直後から画面内にある要素は、IntersectionObserverの非同期通知を
  // 待たずに即時可視化する。これにより初回表示直後に結果が一瞬見えなくなる
  // 空白フレームを防ぐ（フェードインは画面外から入ってくる要素のみに適用）。
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    if (isInViewport(element)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return {
    ref,
    isVisible,
  };
}
