"use client";

import { useEffect, useState } from "react";

type ColorStop = {
  /** 時刻（0〜24時） */
  hour: number;
  l: number;
  c: number;
  h: number;
};

/** 時刻ごとの背景色テーブル（24時間サイクル） */
const COLOR_STOPS: ColorStop[] = [
  { hour: 0, l: 0.715, c: 0.01, h: 250 },
  { hour: 2, l: 0.715, c: 0.03, h: 240 },
  { hour: 4, l: 0.715, c: 0.08, h: 200 },
  { hour: 6, l: 0.715, c: 0.12, h: 145 },
  { hour: 8, l: 0.715, c: 0.14, h: 110 },
  { hour: 10, l: 0.715, c: 0.15, h: 80 },
  { hour: 12, l: 0.715, c: 0.1576, h: 239.25 },
  { hour: 14, l: 0.715, c: 0.13, h: 280 },
  { hour: 16, l: 0.715, c: 0.16, h: 50 },
  { hour: 18, l: 0.715, c: 0.14, h: 25 },
  { hour: 20, l: 0.715, c: 0.08, h: 320 },
  { hour: 22, l: 0.715, c: 0.04, h: 280 },
];

/** 線形補完 */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** 色相を最短経路で補完（0〜360の円環） */
function lerpHue(h1: number, h2: number, t: number): number {
  let delta = h2 - h1;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return ((h1 + delta * t) % 360 + 360) % 360;
}

/** 現在時刻から補完した oklch カラー文字列を計算 */
function getInterpolatedColor(date: Date): string {
  const totalHours = date.getHours() + date.getMinutes() / 60;
  const n = COLOR_STOPS.length;

  // 現在時刻を挟む2つのストップを探す
  let i1 = n - 1;
  for (let i = 0; i < n; i++) {
    if (COLOR_STOPS[i].hour <= totalHours) i1 = i;
  }
  const i2 = (i1 + 1) % n;

  const stop1 = COLOR_STOPS[i1];
  const stop2 = COLOR_STOPS[i2];

  // 翌日0時をまたぐ場合は24時間足して正規化
  const h2 = stop2.hour < stop1.hour ? stop2.hour + 24 : stop2.hour;
  const span = h2 - stop1.hour;
  const t = span > 0 ? (totalHours - stop1.hour) / span : 0;

  const l = lerp(stop1.l, stop2.l, t);
  const c = lerp(stop1.c, stop2.c, t);
  const h = lerpHue(stop1.h, stop2.h, t);

  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)})`;
}

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
