import type { ReactNode } from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { ThemeProvider } from "styled-components"
import Icon from "./Icon"
import { theme } from "@acme/ui"

const renderWithTheme = (ui: ReactNode) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe("Icon", () => {
  it("기본 아이콘을 렌더링한다", () => {
    const { container } = renderWithTheme(<Icon name="StatusInfo" />)

    const svg = container.querySelector("svg")
    const use = container.querySelector("use")

    expect(svg).toBeInTheDocument()
    expect(use).toBeInTheDocument()
  })

  it("number size를 px로 변환한다", () => {
    const { container } = renderWithTheme(<Icon name="StatusInfo" size={16} />)

    const svg = container.querySelector("svg")

    expect(svg).toHaveAttribute("width", "16px")
    expect(svg).toHaveAttribute("height", "16px")
  })

  it("string size를 그대로 적용한다", () => {
    const { container } = renderWithTheme(<Icon name="StatusInfo" size="2rem" />)

    const svg = container.querySelector("svg")

    expect(svg).toHaveAttribute("width", "2rem")
    expect(svg).toHaveAttribute("height", "2rem")
  })

  it("color를 currentColor 기반으로 스타일에 반영한다", () => {
    const { container } = renderWithTheme(
      <Icon name="StatusInfo" color={theme.colors.error[500]} />,
    )

    const svg = container.querySelector("svg")

    expect(svg).toHaveStyle({ color: theme.colors.error[500] })
  })

  it("paint=auto이면 fill만 적용한다", () => {
    const { container } = renderWithTheme(<Icon name="StatusInfo" paint="auto" />)

    const use = container.querySelector("use")

    expect(use).toHaveAttribute("fill", "currentColor")
    expect(use).not.toHaveAttribute("stroke")
  })

  it("paint=fill이면 fill만 적용한다", () => {
    const { container } = renderWithTheme(<Icon name="StatusInfo" paint="fill" />)

    const use = container.querySelector("use")

    expect(use).toHaveAttribute("fill", "currentColor")
    expect(use).not.toHaveAttribute("stroke")
  })

  it("paint=stroke이면 stroke만 적용한다", () => {
    const { container } = renderWithTheme(
      <Icon name="StatusInfo" paint="stroke" strokeWidth={1.5} />,
    )

    const use = container.querySelector("use")

    expect(use).toHaveAttribute("fill", "none")
    expect(use).toHaveAttribute("stroke", "currentColor")
    expect(use).toHaveAttribute("stroke-width", "1.5")
    expect(use).toHaveAttribute("vector-effect", "non-scaling-stroke")
  })

  it("paint=both이면 fill과 stroke를 함께 적용한다", () => {
    const { container } = renderWithTheme(<Icon name="StatusInfo" paint="both" strokeWidth={2} />)

    const use = container.querySelector("use")

    expect(use).toHaveAttribute("fill", "currentColor")
    expect(use).toHaveAttribute("stroke", "currentColor")
    expect(use).toHaveAttribute("stroke-width", "2")
  })

  it("ariaLabel이 있으면 role=img와 aria-label을 가진다", () => {
    renderWithTheme(<Icon name="StatusInfo" ariaLabel="정보 아이콘" />)

    const icon = screen.getByRole("img", { name: "정보 아이콘" })
    expect(icon).toBeInTheDocument()
  })

  it("ariaLabel이 없으면 aria-hidden=true를 가진다", () => {
    const { container } = renderWithTheme(<Icon name="StatusInfo" />)

    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("aria-hidden", "true")
  })

  it("sprite symbol href를 올바르게 참조한다", () => {
    const { container } = renderWithTheme(<Icon name="StatusInfo" />)

    const use = container.querySelector("use")

    expect(use).toHaveAttribute("href", "#icon-StatusInfo")
    expect(use).toHaveAttribute("xlink:href", "#icon-StatusInfo")
  })
})
