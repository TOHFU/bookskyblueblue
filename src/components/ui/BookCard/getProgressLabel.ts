/** 進行ページ数の表示ラベルを返す */
export function getProgressLabel(page: number, total: number): string {
  if (page <= 0) return "未読";
  if (total > 0 && page >= total - 1) return "読了";
  return `${page + 1}ページ`;
}
