"use client";

import { useLayoutEffect, useRef, useState } from "react";

function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

export function useIntersectionFadeIn<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  // スクロールで画面内に入ってきた要素にのみフェードイン演出を適用するためのフラグ。
  // 初回マウント時点で既に画面内にある要素はアニメーションなしで即時に不透明表示する
  // （0.3s等のフェード時間中に「結果が薄く透けて見える」状態を作らないため）。
  const [shouldAnimate, setShouldAnimate] = useState(false);

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
          setShouldAnimate(true);
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
    shouldAnimate,
  };
}
