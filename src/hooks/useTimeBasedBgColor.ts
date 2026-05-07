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
{ "hour": 0, "l": 0.715, "c": 0.04, "h": 260.0 },
  { "hour": 1, "l": 0.715, "c": 0.04, "h": 262.5 },
  { "hour": 2, "l": 0.715, "c": 0.04, "h": 265.0 },
  { "hour": 3, "l": 0.715, "c": 0.05, "h": 270.0 },
  { "hour": 4, "l": 0.72, "c": 0.06, "h": 280.0 },
  { "hour": 5, "l": 0.75, "c": 0.12, "h": 340.0 },
  { "hour": 6, "l": 0.82, "c": 0.15, "h": 75.0 },
  { "hour": 7, "l": 0.85, "c": 0.11, "h": 210.0 },
  { "hour": 8, "l": 0.84, "c": 0.12, "h": 220.0 },
  { "hour": 9, "l": 0.82, "c": 0.13, "h": 225.0 },
  { "hour": 10, "l": 0.78, "c": 0.14, "h": 230.0 },
  { "hour": 11, "l": 0.74, "c": 0.15, "h": 235.0 },
  { "hour": 12, "l": 0.715, "c": 0.1576, "h": 239.25 },
  { "hour": 13, "l": 0.75, "c": 0.14, "h": 238.0 },
  { "hour": 14, "l": 0.80, "c": 0.125, "h": 235.0 },
  { "hour": 15, "l": 0.85, "c": 0.11, "h": 160.0 },
  { "hour": 16, "l": 0.82, "c": 0.14, "h": 85.0 },
  { "hour": 17, "l": 0.78, "c": 0.18, "h": 45.0 },
  { "hour": 18, "l": 0.75, "c": 0.19, "h": 25.0 },
  { "hour": 19, "l": 0.73, "c": 0.13, "h": 285.0 },
  { "hour": 20, "l": 0.72, "c": 0.08, "h": 275.0 },
  { "hour": 21, "l": 0.715, "c": 0.06, "h": 265.0 },
  { "hour": 22, "l": 0.715, "c": 0.05, "h": 263.0 },
  { "hour": 23, "l": 0.715, "c": 0.04, "h": 262.0 }
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
