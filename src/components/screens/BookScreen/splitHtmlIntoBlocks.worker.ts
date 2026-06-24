import { splitHtmlIntoBlocksImpl } from "./splitHtmlIntoBlocksImpl";

type WorkerRequest = {
  id: number;
  html: string;
};

type WorkerResponse =
  | { id: number; blocks: string[] }
  | { id: number; error: string };

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { id, html } = event.data;

  try {
    const blocks = splitHtmlIntoBlocksImpl(html);
    const response: WorkerResponse = { id, blocks };
    self.postMessage(response);
  } catch (error) {
    const response: WorkerResponse = {
      id,
      error: error instanceof Error ? error.message : "split failed",
    };
    self.postMessage(response);
  }
};
