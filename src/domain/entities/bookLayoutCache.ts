export type StoredChunkBoundary = {
  chunkId: number;
  startPage: number;
  contentStartPage?: number;
  endPage: number;
  blockStart: number;
  blockEnd: number;
};

export type StoredBookLayout = {
  id: string;
  workId: string;
  layoutKey: string;
  contentHash: string;
  totalPages: number;
  totalChunks: number;
  chunkBoundaries: StoredChunkBoundary[];
  updatedAt: number;
  isComplete: boolean;
};
