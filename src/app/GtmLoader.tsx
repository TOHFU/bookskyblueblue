"use client";

import { useEffect } from "react";

type GtmLoaderProps = {
  gtmId: string;
  dataLayerName?: string;
};

export function GtmLoader({ gtmId, dataLayerName = "dataLayer" }: GtmLoaderProps) {
  useEffect(() => {
    const scriptId = `gtm-script-${gtmId}`;
    if (document.getElementById(scriptId)) {
      return;
    }

    const win = window as unknown as Record<string, unknown>;
    const currentLayer = win[dataLayerName];
    const layer = Array.isArray(currentLayer) ? currentLayer : [];
    layer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    win[dataLayerName] = layer;

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    const dl = dataLayerName !== "dataLayer" ? `&l=${dataLayerName}` : "";
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}${dl}`;
    document.head.appendChild(script);
  }, [dataLayerName, gtmId]);

  return null;
}
