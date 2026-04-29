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

// MSW server のセットアップ
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
