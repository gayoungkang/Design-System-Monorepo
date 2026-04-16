import type { ReactNode } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, it, vi } from "vitest"
import { ThemeProvider } from "styled-components"
import Link from "./Link"
import { theme } from "@acme/ui"

const renderWithTheme = (ui: ReactNode) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe("Link", () => {
  it("문자열 children을 렌더링한다", () => {
    renderWithTheme(<Link href="/detail">상세보기</Link>)

    expect(screen.getByText("상세보기")).toBeInTheDocument()
  })

  it("href를 전달한다", () => {
    renderWithTheme(<Link href="/detail">상세보기</Link>)

    expect(screen.getByRole("link")).toHaveAttribute("href", "/detail")
  })

  it("disabled면 href를 제거하고 aria-disabled를 적용한다", () => {
    renderWithTheme(
      <Link href="/detail" disabled>
        상세보기
      </Link>,
    )

    const link = screen.getByText("상세보기").closest("a")

    expect(link).not.toHaveAttribute("href")
    expect(link).toHaveAttribute("aria-disabled", "true")
    expect(link).toHaveAttribute("tabindex", "-1")
  })

  it("disabled면 onClick을 실행하지 않는다", () => {
    const onClick = vi.fn()

    renderWithTheme(
      <Link href="/detail" disabled onClick={onClick}>
        상세보기
      </Link>,
    )

    fireEvent.click(screen.getByText("상세보기"))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("활성 상태면 onClick을 실행한다", () => {
    const onClick = vi.fn()

    renderWithTheme(
      <Link href="/detail" onClick={onClick}>
        상세보기
      </Link>,
    )

    fireEvent.click(screen.getByText("상세보기"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("underline=always면 underline 스타일을 가진다", () => {
    renderWithTheme(
      <Link href="/detail" underline="always">
        상세보기
      </Link>,
    )

    const link = screen.getByText("상세보기").closest("a")
    expect(link).toHaveStyle("text-decoration: underline")
  })

  it("underline=none이면 underline 스타일을 가지지 않는다", () => {
    renderWithTheme(
      <Link href="/detail" underline="none">
        상세보기
      </Link>,
    )

    const link = screen.getByText("상세보기").closest("a")
    expect(link).toHaveStyle("text-decoration: none")
  })

  it("typographyProps를 전달할 수 있다", () => {
    renderWithTheme(
      <Link href="/detail" typographyProps={{ as: "label" }}>
        상세보기
      </Link>,
    )

    expect(screen.getByText("상세보기").tagName.toLowerCase()).toBe("label")
  })

  it("일반 anchor 속성을 전달할 수 있다", () => {
    renderWithTheme(
      <Link href="/detail" target="_blank" rel="noreferrer">
        상세보기
      </Link>,
    )

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noreferrer")
  })
})
