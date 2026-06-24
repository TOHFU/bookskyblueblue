import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { server } from "./tests/mocks/server";

// jsdomで未実装のブラウザAPIをスタブ化
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  root = null;
  rootMargin = "";
  thresholds: number[] = [];
  takeRecords = vi.fn(() => []);
  constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}
}
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor(_callback: ResizeObserverCallback) {}
}
global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

const mockCache = {
  add: vi.fn().mockResolvedValue(undefined),
  match: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  keys: vi.fn(),
};

global.caches = {
  open: vi.fn(async () => mockCache),
  delete: vi.fn(),
  has: vi.fn(),
  keys: vi.fn(),
  match: vi.fn(),
} as unknown as CacheStorage;

// MSW server のセットアップ
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
