import "@testing-library/jest-dom/vitest"

class ResizeObserverMock implements ResizeObserver {
  observe = () => {}
  unobserve = () => {}
  disconnect = () => {}
}

globalThis.ResizeObserver = ResizeObserverMock

Object.defineProperty(window, "scrollTo", {
  value: () => {},
  writable: true,
})
