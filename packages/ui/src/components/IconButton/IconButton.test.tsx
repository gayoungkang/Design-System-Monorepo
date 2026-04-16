import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { ReactNode } from "react"
import { ThemeProvider } from "styled-components"
import IconButton from "./IconButton"
import { theme } from "@acme/ui"

const renderWithTheme = (ui: ReactNode) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe("IconButton", () => {
  it("클릭 이벤트 실행", () => {
    const onClick = vi.fn()

    renderWithTheme(<IconButton icon="CloseLine" onClick={onClick} />)

    fireEvent.click(screen.getByRole("button"))

    expect(onClick).toHaveBeenCalled()
  })

  it("disabled면 클릭되지 않음", () => {
    const onClick = vi.fn()

    renderWithTheme(<IconButton icon="CloseLine" disabled onClick={onClick} />)

    fireEvent.click(screen.getByRole("button"))

    expect(onClick).not.toHaveBeenCalled()
  })

  it("aria-label 적용", () => {
    renderWithTheme(<IconButton icon="CloseLine" ariaLabel="닫기 버튼" />)

    expect(screen.getByRole("button", { name: "닫기 버튼" })).toBeInTheDocument()
  })

  it("tooltip이 있을 때도 버튼은 존재", () => {
    renderWithTheme(<IconButton icon="CloseLine" toolTip="닫기" />)

    expect(screen.getByRole("button")).toBeInTheDocument()
  })
})
