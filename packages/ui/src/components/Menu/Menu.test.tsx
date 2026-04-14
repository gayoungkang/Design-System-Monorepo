import type { ReactNode } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { ThemeProvider } from "styled-components"
import Menu from "./Menu"
import { theme } from "@acme/ui"

const renderWithTheme = (ui: ReactNode) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe("Menu", () => {
  it("텍스트를 렌더링한다", () => {
    renderWithTheme(<Menu text="설정" />)

    expect(screen.getByRole("button", { name: "설정" })).toBeInTheDocument()
  })

  it("클릭 시 onClick을 호출한다", () => {
    const onClick = vi.fn()

    renderWithTheme(<Menu text="설정" onClick={onClick} />)

    fireEvent.click(screen.getByRole("button", { name: "설정" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("disabled 상태면 onClick을 호출하지 않는다", () => {
    const onClick = vi.fn()

    renderWithTheme(<Menu text="설정" disabled onClick={onClick} />)

    fireEvent.click(screen.getByRole("button", { name: "설정" }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("클릭 시 상위 전파를 차단한다", () => {
    const parentClick = vi.fn()
    const menuClick = vi.fn()

    renderWithTheme(
      <div onClick={parentClick}>
        <Menu text="설정" onClick={menuClick} />
      </div>,
    )

    fireEvent.click(screen.getByRole("button", { name: "설정" }))

    expect(menuClick).toHaveBeenCalledTimes(1)
    expect(parentClick).not.toHaveBeenCalled()
  })

  it("selected 상태면 체크 아이콘이 추가 렌더링된다", () => {
    const { container } = renderWithTheme(<Menu text="설정" selected />)

    expect(container.querySelectorAll("svg").length).toBeGreaterThan(0)
  })

  it("size prop에 따라 렌더링된다", () => {
    renderWithTheme(<Menu text="작은 메뉴" size="S" />)
    expect(screen.getByRole("button", { name: "작은 메뉴" })).toBeInTheDocument()
  })

  it("startIcon과 endIcon을 함께 렌더링할 수 있다", () => {
    const { container } = renderWithTheme(
      <Menu text="아이콘 메뉴" startIcon="Filter" endIcon="ArrowRight" />,
    )

    expect(screen.getByRole("button", { name: "아이콘 메뉴" })).toBeInTheDocument()
    expect(container.querySelectorAll("svg").length).toBeGreaterThan(1)
  })
})
