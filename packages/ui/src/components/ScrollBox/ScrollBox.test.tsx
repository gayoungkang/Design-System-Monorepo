import type { ReactElement } from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { renderWithProviders } from "../../test"
import ScrollBox from "./ScrollBox"

const renderScrollBox = (ui: ReactElement) => renderWithProviders(ui)

describe("ScrollBox", () => {
  it("renders children", () => {
    renderScrollBox(
      <ScrollBox>
        <div>content</div>
      </ScrollBox>,
    )

    expect(screen.getByText("content")).toBeInTheDocument()
  })

  it("applies default overflow", () => {
    const { container } = renderScrollBox(
      <ScrollBox>
        <div>content</div>
      </ScrollBox>,
    )

    const root = container.firstChild as HTMLElement
    expect(root).toHaveStyle("overflow: auto")
    expect(root).toHaveStyle("overflow-x: auto")
    expect(root).toHaveStyle("overflow-y: auto")
  })

  it("applies overflow axis overrides", () => {
    const { container } = renderScrollBox(
      <ScrollBox overflow="hidden" overflowX="auto" overflowY="scroll">
        <div>content</div>
      </ScrollBox>,
    )

    const root = container.firstChild as HTMLElement
    expect(root).toHaveStyle("overflow: hidden")
    expect(root).toHaveStyle("overflow-x: auto")
    expect(root).toHaveStyle("overflow-y: scroll")
  })

  it("applies width, height and size constraints", () => {
    const { container } = renderScrollBox(
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
    expect(root).toHaveStyle("width: 320px")
    expect(root).toHaveStyle("height: 180px")
    expect(root).toHaveStyle("min-width: 200px")
    expect(root).toHaveStyle("min-height: 120px")
    expect(root).toHaveStyle("max-width: 480px")
    expect(root).toHaveStyle("max-height: 240px")
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
