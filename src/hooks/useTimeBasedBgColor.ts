"use client";

import { useEffect, useState } from "react";
import { getInterpolatedColor } from "@/utils/timeBgColor";

/**
 * 現在時刻に基づいて補完した背景色を返すフック。
 * 1分ごとに更新される。
 */
export function useTimeBasedBgColor(): string {
  const [color, setColor] = useState<string>(() =>
    getInterpolatedColor(new Date()),
  );

  useEffect(() => {
    const update = () => setColor(getInterpolatedColor(new Date()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return color;
}
