import type { ReactElement } from "react"
import { describe, it, expect } from "vitest"
import { screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { renderWithProviders } from "../../test"
import { Typography } from "./Typography"

const renderTypography = (ui: ReactElement) => renderWithProviders(ui)

describe("Typography", () => {
  it("text를 렌더링한다", () => {
    renderTypography(<Typography text="Hello Typography" />)

    expect(screen.getByText("Hello Typography")).toBeInTheDocument()
  })

  it("줄바꿈 문자열을 br로 렌더링한다", () => {
    const { container } = renderTypography(<Typography text={"Line 1\nLine 2\nLine 3"} />)

    expect(container.querySelectorAll("br")).toHaveLength(2)

    const element = container.querySelector("p") as HTMLElement

    expect(element.textContent).toContain("Line 1")
    expect(element.textContent).toContain("Line 2")
    expect(element.textContent).toContain("Line 3")
  })

  it("as props로 태그를 변경한다", () => {
    renderTypography(<Typography text="Heading" as="h2" />)

    expect(screen.getByText("Heading").tagName.toLowerCase()).toBe("h2")
  })

  it("ellipsis가 적용되면 스타일이 반영된다", () => {
    renderTypography(<Typography text="Ellipsis Text" ellipsis />)

    const element = screen.getByText("Ellipsis Text")
    expect(element).toHaveStyle("white-space: nowrap")
    expect(element).toHaveStyle("overflow: hidden")
    expect(element).toHaveStyle("text-overflow: ellipsis")
  })

  it("underline과 italic 스타일이 반영된다", () => {
    renderTypography(<Typography text="Styled Text" underline italic />)

    const element = screen.getByText("Styled Text")
    expect(element).toHaveStyle("text-decoration: underline")
    expect(element).toHaveStyle("font-style: italic")
  })

  it("align이 반영된다", () => {
    renderTypography(<Typography text="Aligned Text" align="center" />)

    expect(screen.getByText("Aligned Text")).toHaveStyle("text-align: center")
  })

  it("color가 반영된다", () => {
    renderTypography(<Typography text="Colored Text" color="rgb(255, 0, 0)" />)

    expect(screen.getByText("Colored Text")).toHaveStyle("color: rgb(255, 0, 0)")
  })
})
