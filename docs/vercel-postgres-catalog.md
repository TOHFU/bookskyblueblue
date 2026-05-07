# 作品カタログをVercel Database(Neon Postgres)で運用する

## 最適なDB

本プロジェクトの `src/data/catalog/list_person_all_extended.json` は、
- 参照中心
- レコード数が多い
- 将来的に検索条件追加の可能性が高い

という性質のため、**Vercel Databaseとして提供される Neon Postgres** を利用する。

理由:
- JSON Blob保管より検索・更新・整合性管理に強い
- 主キー制約と upsert による安全な更新が可能
- Next.js App Routerのサーバー実装と相性が良い

## 事前準備

1. Vercelプロジェクトで Neon(Postgres) を有効化する
2. ローカルに環境変数を反映する

```bash
vercel env pull .env.local
```

3. `POSTGRES_URL` が設定されていることを確認する

補足:
- `catalog:sync` は `.env.local` を自動で読み込みます
- そのため通常は `vercel env pull .env.local` 実行後にそのまま `npm run catalog:sync` で動作します

## 初期投入/更新手順

JSONからDBへ同期するスクリプトを用意しています。

```bash
npm run catalog:sync
```

実行中は `sync progress: 500/xxxxx` のように進捗が表示されます。
レコード件数が多いため、初回同期には時間がかかります。

`POSTGRES_URL または DATABASE_URL を設定してください` と表示される場合は、
以下を実行してから再度同期してください。

```bash
vercel env pull .env.local
npm run catalog:sync
```

不要レコードもDBから削除してJSONと完全一致させる場合は:

```bash
npm run catalog:sync -- --prune
```

## 実装済みのアプリ側変更

- サーバー側のカタログ取得: Neon Postgres 参照
- クライアント側のカタログ取得: `/api/catalog` API経由
- 作品詳細メタデータAPIを追加:
  - `GET /api/catalog`
  - `GET /api/catalog/:identifier`

これにより、巨大JSONをクライアントバンドルに含めずに運用できます。
