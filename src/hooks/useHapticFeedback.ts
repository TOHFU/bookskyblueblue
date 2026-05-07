"use client";

import { useCallback } from "react";

type UseHapticFeedbackOptions = {
  duration?: number;
  mobileOnly?: boolean;
};

/**
 * 触覚フィードバックを発火するためのフック。
 * デフォルトではモバイル環境かつ振動API対応時のみ発火する。
 */
export function useHapticFeedback(
  options: UseHapticFeedbackOptions = {}
): () => void {
  const { duration = 10, mobileOnly = true } = options;

  return useCallback(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }

    if (typeof navigator.vibrate !== "function") {
      return;
    }

    if (mobileOnly) {
      const supportsMatchMedia = typeof window.matchMedia === "function";
      const hasCoarsePointer = supportsMatchMedia
        ? window.matchMedia("(hover: none), (pointer: coarse)").matches
        : false;
      const isMobileDevice = navigator.maxTouchPoints > 0 || hasCoarsePointer;

      if (!isMobileDevice) {
        return;
      }
    }

    navigator.vibrate(duration);
  }, [duration, mobileOnly]);
}
