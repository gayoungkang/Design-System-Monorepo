import type { ReactNode } from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { ThemeProvider } from "styled-components"
import Label from "./Label"
import { theme } from "@acme/ui"

const renderWithTheme = (ui: ReactNode) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe("Label", () => {
  it("텍스트를 렌더링한다", () => {
    renderWithTheme(<Label text="이름" />)

    expect(screen.getByText("이름")).toBeInTheDocument()
  })

  it("required가 false면 별표를 렌더링하지 않는다", () => {
    renderWithTheme(<Label text="이름" required={false} />)

    expect(screen.queryByText("*")).not.toBeInTheDocument()
  })

  it("required가 true이고 placement가 right면 오른쪽 별표를 렌더링한다", () => {
    const { container } = renderWithTheme(<Label text="이름" required placement="right" />)

    const texts = Array.from(container.textContent ?? "")
    expect(texts.join("")).toContain("이름*")
  })

  it("required가 true이고 placement가 left면 왼쪽 별표를 렌더링한다", () => {
    const { container } = renderWithTheme(<Label text="이름" required placement="left" />)

    const texts = Array.from(container.textContent ?? "")
    expect(texts.join("")).toContain("*이름")
  })

  it("textAlign이 right면 justify-content가 flex-end다", () => {
    const { container } = renderWithTheme(<Label text="이름" textAlign="right" />)

    const root = container.firstChild
    expect(root).toHaveStyle({ justifyContent: "flex-end" })
  })

  it("textAlign이 left면 justify-content가 flex-start다", () => {
    const { container } = renderWithTheme(<Label text="이름" textAlign="left" />)

    const root = container.firstChild
    expect(root).toHaveStyle({ justifyContent: "flex-start" })
  })

  it("typographyProps를 전달할 수 있다", () => {
    renderWithTheme(<Label text="이름" typographyProps={{ as: "label" }} />)

    expect(screen.getByText("이름").tagName.toLowerCase()).toBe("label")
  })
})
