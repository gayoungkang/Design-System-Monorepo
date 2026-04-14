import type { ReactNode } from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { ThemeProvider } from "styled-components"
import Paper from "./Paper"
import { theme } from "../../tokens/theme"

const renderWithTheme = (ui: ReactNode) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe("Paper", () => {
  it("children을 렌더링한다", () => {
    renderWithTheme(<Paper>내용</Paper>)

    expect(screen.getByText("내용")).toBeInTheDocument()
  })

  it("기본 padding을 적용한다", () => {
    const { container } = renderWithTheme(<Paper>내용</Paper>)

    expect(container.firstChild).toHaveStyle({ padding: "16px" })
  })

  it("string radius를 그대로 적용한다", () => {
    const { container } = renderWithTheme(<Paper radius="20px">내용</Paper>)

    expect(container.firstChild).toHaveStyle({ borderRadius: "20px" })
  })

  it("theme borderRadius key/number radius를 해석한다", () => {
    const { container } = renderWithTheme(<Paper radius={4}>내용</Paper>)

    expect(container.firstChild).toHaveStyle({
      borderRadius: theme.borderRadius[4],
    })
  })

  it("elevation을 box-shadow로 적용한다", () => {
    const { container } = renderWithTheme(<Paper elevation={2}>내용</Paper>)

    expect(container.firstChild).toHaveStyle({
      boxShadow: theme.shadows.elevation[2],
    })
  })

  it("elevation이 음수면 0으로 보정한다", () => {
    const { container } = renderWithTheme(<Paper elevation={-3}>내용</Paper>)

    expect(container.firstChild).toHaveStyle({
      boxShadow: theme.shadows.elevation[0],
    })
  })

  it("elevation이 최대 인덱스를 초과하면 마지막 shadow로 보정한다", () => {
    const { container } = renderWithTheme(<Paper elevation={999}>내용</Paper>)

    expect(container.firstChild).toHaveStyle({
      boxShadow: theme.shadows.elevation[theme.shadows.elevation.length - 1],
    })
  })
})
