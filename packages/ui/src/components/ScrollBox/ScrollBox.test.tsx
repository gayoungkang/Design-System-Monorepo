import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, it } from "vitest"
import ScrollBox from "./ScrollBox"

describe("ScrollBox", () => {
  it("renders children", () => {
    render(
      <ScrollBox>
        <div>content</div>
      </ScrollBox>,
    )

    expect(screen.getByText("content")).toBeInTheDocument()
  })

  it("applies default overflow", () => {
    const { container } = render(
      <ScrollBox>
        <div>content</div>
      </ScrollBox>,
    )

    const root = container.firstChild as HTMLElement
    expect(root).toHaveStyle({ overflow: "auto" })
    expect(root).toHaveStyle({ overflowX: "auto" })
    expect(root).toHaveStyle({ overflowY: "auto" })
  })

  it("applies overflow axis overrides", () => {
    const { container } = render(
      <ScrollBox overflow="hidden" overflowX="auto" overflowY="scroll">
        <div>content</div>
      </ScrollBox>,
    )

    const root = container.firstChild as HTMLElement
    expect(root).toHaveStyle({ overflow: "hidden" })
    expect(root).toHaveStyle({ overflowX: "auto" })
    expect(root).toHaveStyle({ overflowY: "scroll" })
  })

  it("applies width, height and size constraints", () => {
    const { container } = render(
      <ScrollBox
        width={320}
        height={180}
        minWidth={200}
        minHeight={120}
        maxWidth={480}
        maxHeight={240}
      >
        <div>content</div>
      </ScrollBox>,
    )

    const root = container.firstChild as HTMLElement
    expect(root).toHaveStyle({ width: "320px" })
    expect(root).toHaveStyle({ height: "180px" })
    expect(root).toHaveStyle({ minWidth: "200px" })
    expect(root).toHaveStyle({ minHeight: "120px" })
    expect(root).toHaveStyle({ maxWidth: "480px" })
    expect(root).toHaveStyle({ maxHeight: "240px" })
  })

  it("forwards ref to root element", () => {
    let element: HTMLDivElement | null = null

    render(
      <ScrollBox
        ref={(node) => {
          element = node
        }}
      >
        <div>content</div>
      </ScrollBox>,
    )

    expect(element).toBeInstanceOf(HTMLDivElement)
  })
})
