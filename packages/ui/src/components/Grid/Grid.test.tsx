import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { ReactNode } from "react"
import { ThemeProvider } from "styled-components"
import Grid from "./Grid"
import { theme } from "../../tokens/theme"

const renderWithTheme = (ui: ReactNode) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe("Grid", () => {
  it("columns를 grid-template-columns로 적용한다", () => {
    renderWithTheme(
      <Grid columns="1fr 2fr" data-testid="grid">
        <div>item</div>
      </Grid>,
    )

    const grid = screen.getByTestId("grid")
    expect(grid).toHaveStyle("display: grid")
    expect(grid).toHaveStyle("grid-template-columns: 1fr 2fr")
  })

  it("gap 숫자값을 px로 변환한다", () => {
    renderWithTheme(
      <Grid columns="1fr 1fr" gap={12} data-testid="grid">
        <div>item</div>
      </Grid>,
    )

    expect(screen.getByTestId("grid")).toHaveStyle("gap: 12px")
  })

  it("gap 문자열값을 그대로 적용한다", () => {
    renderWithTheme(
      <Grid columns="1fr 1fr" gap="1rem" data-testid="grid">
        <div>item</div>
      </Grid>,
    )

    expect(screen.getByTestId("grid")).toHaveStyle("gap: 1rem")
  })

  it("rowGap과 columnGap을 각각 적용한다", () => {
    renderWithTheme(
      <Grid columns="repeat(2, 1fr)" rowGap={8} columnGap="24px" data-testid="grid">
        <div>item</div>
      </Grid>,
    )

    expect(screen.getByTestId("grid")).toHaveStyle("row-gap: 8px")
    expect(screen.getByTestId("grid")).toHaveStyle("column-gap: 24px")
  })

  it("inline이 true면 inline-grid로 렌더링한다", () => {
    renderWithTheme(
      <Grid columns="auto auto" inline data-testid="grid">
        <div>item</div>
      </Grid>,
    )

    expect(screen.getByTestId("grid")).toHaveStyle("display: inline-grid")
  })

  it("일반 div 속성을 전달한다", () => {
    renderWithTheme(
      <Grid columns="1fr" data-testid="grid" aria-label="layout-grid">
        <div>item</div>
      </Grid>,
    )

    const grid = screen.getByTestId("grid")
    expect(grid).toHaveAttribute("aria-label", "layout-grid")
  })

  it("children을 정상 렌더링한다", () => {
    renderWithTheme(
      <Grid columns="1fr 1fr">
        <div>first</div>
        <div>second</div>
      </Grid>,
    )

    expect(screen.getByText("first")).toBeInTheDocument()
    expect(screen.getByText("second")).toBeInTheDocument()
  })
})
