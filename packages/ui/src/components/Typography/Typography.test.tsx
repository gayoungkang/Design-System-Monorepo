import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Typography } from "./Typography"

describe("Typography", () => {
  it("text를 렌더링한다", () => {
    render(<Typography text="Hello Typography" />)

    expect(screen.getByText("Hello Typography")).toBeInTheDocument()
  })

  it("줄바꿈 문자열을 br로 렌더링한다", () => {
    const { container } = render(<Typography text={"Line 1\nLine 2\nLine 3"} />)

    expect(container.querySelectorAll("br")).toHaveLength(2)
    expect(screen.getByText("Line 1")).toBeInTheDocument()
    expect(screen.getByText("Line 2")).toBeInTheDocument()
    expect(screen.getByText("Line 3")).toBeInTheDocument()
  })

  it("as props로 태그를 변경한다", () => {
    render(<Typography text="Heading" as="h2" />)

    expect(screen.getByText("Heading").tagName.toLowerCase()).toBe("h2")
  })

  it("ellipsis가 적용되면 스타일이 반영된다", () => {
    render(<Typography text="Ellipsis Text" ellipsis />)

    const element = screen.getByText("Ellipsis Text")
    expect(element).toHaveStyle({
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    })
  })

  it("underline과 italic 스타일이 반영된다", () => {
    render(<Typography text="Styled Text" underline italic />)

    const element = screen.getByText("Styled Text")
    expect(element).toHaveStyle({
      textDecoration: "underline",
      fontStyle: "italic",
    })
  })

  it("align이 반영된다", () => {
    render(<Typography text="Aligned Text" align="center" />)

    expect(screen.getByText("Aligned Text")).toHaveStyle({
      textAlign: "center",
    })
  })

  it("color가 반영된다", () => {
    render(<Typography text="Colored Text" color="rgb(255, 0, 0)" />)

    expect(screen.getByText("Colored Text")).toHaveStyle({
      color: "rgb(255, 0, 0)",
    })
  })
})
