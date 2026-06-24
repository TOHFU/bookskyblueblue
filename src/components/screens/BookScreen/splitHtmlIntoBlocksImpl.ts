/** DOMParser で HTML をトップレベルブロックに分割する（Worker / メインスレッド共通） */
export function splitHtmlIntoBlocksImpl(html: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div id="chunk-root">${html}</div>`, "text/html");
  const root = doc.getElementById("chunk-root");
  if (!root) {
    return [html];
  }

  const blocks: string[] = [];
  root.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        blocks.push(text);
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      blocks.push((node as Element).outerHTML);
    }
  });

  return blocks.length > 0 ? blocks : [html];
}
