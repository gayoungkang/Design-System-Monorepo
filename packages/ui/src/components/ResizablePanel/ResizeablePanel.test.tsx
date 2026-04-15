import { render, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import ResizablePanel from "./ResizablePanel"

describe("ResizablePanel", () => {
  it("calls onResize on drag", () => {
    let size = 0

    const { container } = render(
      <ResizablePanel onResize={(s) => (size = s)}>content</ResizablePanel>,
    )

    const resizer = container.querySelector("div[role='separator']")!

    fireEvent.pointerDown(resizer)
    fireEvent.pointerMove(window, { clientX: 200 })

    expect(size).toBeGreaterThan(0)
  })
})
