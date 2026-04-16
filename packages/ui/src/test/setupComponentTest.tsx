import type { ReactElement } from "react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import { renderWithProviders } from "./renderWithProviders"

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin: string = ""
  readonly thresholds: ReadonlyArray<number> = []

  constructor(
    private readonly callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.root = options?.root ?? null
    this.rootMargin = options?.rootMargin ?? ""
    this.thresholds = Array.isArray(options?.threshold)
      ? options.threshold
      : options?.threshold !== undefined
        ? [options.threshold]
        : []
  }

  disconnect = vi.fn()
  observe = vi.fn((target: Element) => {
    this.callback(
      [
        {
          isIntersecting: false,
          target,
          time: Date.now(),
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRatio: 0,
          intersectionRect: new DOMRectReadOnly(),
          rootBounds: null,
        },
      ],
      this,
    )
  })
  takeRecords = vi.fn(() => [])
  unobserve = vi.fn()
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = MockIntersectionObserver
}

export const setupComponentTest = (ui: ReactElement) => {
  return {
    user: userEvent.setup(),
    ...renderWithProviders(ui),
  }
}
