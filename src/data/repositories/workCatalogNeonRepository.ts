import "server-only";
import { neon } from "@neondatabase/serverless";
import { workSchema, type Work } from "@/domain/entities/work";
import type { WorkCatalogRepository } from "@/domain/repositories/workCatalogRepository";

type WorkCatalogRow = {
  id: string | null;
  title: string | null;
  subtitle: string | null;
  original_title: string | null;
  author: string | null;
  first_published_year: string | null;
  writing_style: string | null;
  publisher: string | null;
  source_book_name: string | null;
  html_file_url: string | null;
  html_file_charset: string | null;
};

function getDatabaseUrl(): string {
  const connection = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!connection) {
    throw new Error("POSTGRES_URL または DATABASE_URL が設定されていません");
  }

  return connection;
}

function toWork(row: WorkCatalogRow): Work | null {
  const parsed = workSchema.safeParse({
    id: row.id ?? undefined,
    title: row.title ?? undefined,
    subtitle: row.subtitle ?? undefined,
    originalTitle: row.original_title ?? undefined,
    author: row.author ?? undefined,
    firstPublishedYear: row.first_published_year ?? undefined,
    writingStyle: row.writing_style ?? undefined,
    publisher: row.publisher ?? undefined,
    sourceBookName: row.source_book_name ?? undefined,
    htmlFileUrl: row.html_file_url ?? undefined,
    htmlFileCharset: row.html_file_charset ?? undefined,
  });

  return parsed.success ? parsed.data : null;
}

export class NeonWorkCatalogRepository implements WorkCatalogRepository {
  private readonly sql = neon(getDatabaseUrl());

  async findAll(): Promise<Work[]> {
    const rows = (await this.sql`
      SELECT
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
        html_file_charset
      FROM work_catalog
      ORDER BY id ASC
    `) as WorkCatalogRow[];

    return rows
      .map((row) => toWork(row))
      .filter((value): value is Work => value !== null);
  }

  async findById(identifier: string): Promise<Work | null> {
    const rows = (await this.sql`
      SELECT
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
        html_file_charset
      FROM work_catalog
      WHERE id = ${identifier}
      LIMIT 1
    `) as WorkCatalogRow[];

    if (rows.length === 0) {
      return null;
    }

    return toWork(rows[0]);
  }
}