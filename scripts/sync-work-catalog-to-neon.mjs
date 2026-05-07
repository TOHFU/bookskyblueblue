import { readFile } from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import nextEnvPkg from "@next/env";

const sourcePath = path.join(
  process.cwd(),
  "src/data/catalog/list_person_all_extended.json",
);
const shouldPrune = process.argv.includes("--prune");

// Next.jsと同じルールで .env* を読み込む
const { loadEnvConfig } = nextEnvPkg;
loadEnvConfig(process.cwd());

function getConnectionString() {
  const value = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!value) {
    throw new Error(
      "POSTGRES_URL または DATABASE_URL を設定してください。例: vercel env pull .env.local"
    );
  }
  return value;
}

function readString(source, keys) {
  if (!source || typeof source !== "object") {
    return undefined;
  }

  for (const key of keys) {
    const value = Reflect.get(source, key);
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return undefined;
}

function normalizeRecord(source) {
  const lastName = readString(source, ["last_name", "author", "著者名"]);
  const firstName = readString(source, ["first_name"]);
  const author = lastName && firstName ? `${lastName} ${firstName}` : lastName ?? firstName;
  const id = readString(source, ["work_id", "id", "作品ID"]);

  if (!id) {
    return null;
  }

  return {
    id,
    title: readString(source, ["title", "作品名"]),
    subtitle: readString(source, ["subtitle", "サブタイトル"]),
    originalTitle: readString(source, ["original_title", "originalTitle", "オリジナルタイトル"]),
    author,
    firstPublishedYear: readString(source, ["source_first_edition_year", "firstPublishedYear", "底本初版発行年"]),
    writingStyle: readString(source, ["orthography_type", "writingStyle", "文字遣い種別"]),
    publisher: readString(source, ["source_publisher", "publisher", "底本親本出版社"]),
    sourceBookName: readString(source, ["source_book_name", "sourceBookName", "底本名"]),
    htmlFileUrl: readString(source, ["html_file_url"]),
    htmlFileCharset: readString(source, ["html_file_charset"]),
  };
}

async function main() {
  const sql = neon(getConnectionString());

  const raw = await readFile(sourcePath, "utf-8");
  const source = JSON.parse(raw);
  const records = Array.isArray(source)
    ? source.map((item) => normalizeRecord(item)).filter((item) => item !== null)
    : [];
  const total = records.length;

  await sql`
    CREATE TABLE IF NOT EXISTS work_catalog (
      id TEXT PRIMARY KEY,
      title TEXT,
      subtitle TEXT,
      original_title TEXT,
      author TEXT,
      first_published_year TEXT,
      writing_style TEXT,
      publisher TEXT,
      source_book_name TEXT,
      html_file_url TEXT,
      html_file_charset TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  let processed = 0;
  for (const record of records) {
    await sql`
      INSERT INTO work_catalog (
        id,
        title,
        subtitle,
        original_title,
        author,
        first_published_year,
        writing_style,
        publisher,
        source_book_name,
        html_file_url,
        html_file_charset,
        updated_at
      ) VALUES (
        ${record.id},
        ${record.title ?? null},
        ${record.subtitle ?? null},
        ${record.originalTitle ?? null},
        ${record.author ?? null},
        ${record.firstPublishedYear ?? null},
        ${record.writingStyle ?? null},
        ${record.publisher ?? null},
        ${record.sourceBookName ?? null},
        ${record.htmlFileUrl ?? null},
        ${record.htmlFileCharset ?? null},
        NOW()
      )
      ON CONFLICT (id)
      DO UPDATE SET
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        original_title = EXCLUDED.original_title,
        author = EXCLUDED.author,
        first_published_year = EXCLUDED.first_published_year,
        writing_style = EXCLUDED.writing_style,
        publisher = EXCLUDED.publisher,
        source_book_name = EXCLUDED.source_book_name,
        html_file_url = EXCLUDED.html_file_url,
        html_file_charset = EXCLUDED.html_file_charset,
        updated_at = NOW()
    `;

    processed += 1;
    if (processed % 500 === 0 || processed === total) {
      console.log(`sync progress: ${processed}/${total}`);
    }
  }

  if (shouldPrune && records.length > 0) {
    const ids = records.map((record) => record.id);
    await sql`
      DELETE FROM work_catalog
      WHERE id <> ALL(${ids})
    `;
  }

  console.log(`synced: ${records.length} records`);
  if (shouldPrune) {
    console.log("prune: enabled");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});