import type { ReactElement } from "react"
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, it, vi } from "vitest"
import { renderWithProviders } from "../../test"
import ResizablePanel from "./ResizablePanel"

const renderPanel = (ui: ReactElement) => renderWithProviders(ui)

describe("ResizablePanel", () => {
  it("children을 렌더링한다", () => {
    renderPanel(
      <ResizablePanel>
        <div>내용</div>
      </ResizablePanel>,
    )

    expect(screen.getByText("내용")).toBeInTheDocument()
  })

  it("초기 size를 적용한다", () => {
    renderPanel(
      <ResizablePanel initialSize={300}>
        <div>내용</div>
      </ResizablePanel>,
    )

    const panel = screen.getByRole("separator")

    expect(panel).toHaveStyle("width: 300px")
  })

  it("controlled size를 적용한다", () => {
    renderPanel(
      <ResizablePanel size={400}>
        <div>내용</div>
      </ResizablePanel>,
    )

    const panel = screen.getByRole("separator")

    expect(panel).toHaveStyle("width: 400px")
  })

  it("onResize를 호출한다", () => {
    const onResize = vi.fn()

    renderPanel(
      <ResizablePanel onResize={onResize}>
        <div>내용</div>
      </ResizablePanel>,
    )

    const panel = screen.getByRole("separator")
    const resizer = panel.lastElementChild as HTMLElement

    vi.spyOn(panel, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 300,
      bottom: 100,
      width: 300,
      height: 100,
      toJSON: () => ({}),
    })

    fireEvent.pointerDown(resizer, { button: 0, clientX: 300 })
    fireEvent.pointerMove(window, { clientX: 500 })
    fireEvent.pointerUp(window)

    expect(onResize).toHaveBeenCalled()
  })

  it("min/max 범위로 clamp한다", () => {
    const onResize = vi.fn()

    renderPanel(
      <ResizablePanel minSize={100} maxSize={200} onResize={onResize}>
        <div>내용</div>
      </ResizablePanel>,
    )

    const panel = screen.getByRole("separator")
    const resizer = panel.lastElementChild as HTMLElement

    vi.spyOn(panel, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 300,
      bottom: 100,
      width: 300,
      height: 100,
      toJSON: () => ({}),
    })

    fireEvent.pointerDown(resizer, { button: 0, clientX: 300 })
    fireEvent.pointerMove(window, { clientX: 1000 })
    fireEvent.pointerUp(window)

    expect(onResize).toHaveBeenCalledWith(200)
  })
})
