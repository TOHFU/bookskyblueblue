## 📋 人間中心設計（HCD）プロセス改善レポート

### 1. 利用状況の把握（Before）
- TOP の `loadTopWorks` が全文 HTML 付きの `getAll` 後に進捗を N+1 取得していた

### 2. ユーザー要求事項
1. **R1**: TOP 一覧は本文なしのメタデータで描画できること
2. **R2**: 進捗が作品レコードに含まれる場合、追加 IDB 取得をしないこと

### 3. 設計による解決策（実装内容）
- `loadTopWorksUseCase` で `content` を除外
- `_readingPage` / `_totalPages` がある場合は `getReadingProgress` をスキップ

### 4. 設計の評価結果（After）
- 単体テストで本文除外と進捗スキップを確認 → **合格**
