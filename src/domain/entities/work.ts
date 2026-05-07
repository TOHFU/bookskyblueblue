import { z } from "zod";

export const bookmarkSchema = z.object({
  page: z.number().int().nonnegative(),
  excerpt: z.string(),
});

export const workSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  originalTitle: z.string().optional(),
  author: z.string().optional(),
  firstPublishedYear: z.string().optional(),
  writingStyle: z.string().optional(),
  publisher: z.string().optional(),
  sourceBookName: z.string().optional(),
  htmlFileUrl: z.string().optional(),
  htmlFileCharset: z.string().optional(),
  content: z.string().optional(),
  _readingPage: z.number().int().nonnegative().optional(),
  _totalPages: z.number().int().nonnegative().optional(),
  _bookmarks: z.array(bookmarkSchema).optional(),
});

export type Bookmark = z.infer<typeof bookmarkSchema>;
export type Work = z.infer<typeof workSchema>;
