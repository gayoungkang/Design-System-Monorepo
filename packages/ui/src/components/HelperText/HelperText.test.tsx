import type { ReactNode } from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, it } from "vitest"
import { ThemeProvider } from "styled-components"
import HelperText from "./HelperText"
import { theme } from "@acme/ui"

const renderWithTheme = (ui: ReactNode) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe("HelperText", () => {
  it("텍스트를 렌더링한다", () => {
    renderWithTheme(<HelperText status="default" text="기본 안내 문구입니다." />)

    expect(screen.getByText("기본 안내 문구입니다.")).toBeInTheDocument()
  })

  it("role=status를 가진다", () => {
    renderWithTheme(<HelperText status="info" text="안내 문구입니다." />)

    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("error 상태는 aria-live=assertive를 가진다", () => {
    renderWithTheme(<HelperText status="error" text="에러 문구입니다." />)

    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "assertive")
  })

  it("error 이외 상태는 aria-live=polite를 가진다", () => {
    renderWithTheme(<HelperText status="success" text="성공 문구입니다." />)

    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite")
  })

  it("줄바꿈이 포함된 텍스트를 렌더링한다", () => {
    renderWithTheme(<HelperText status="error" text={"첫 번째 줄입니다.\n두 번째 줄입니다."} />)

    expect(screen.getByText(/첫 번째 줄입니다\./)).toBeInTheDocument()
    expect(screen.getByText(/두 번째 줄입니다\./)).toBeInTheDocument()
  })

  it("아이콘이 렌더링된다", () => {
    const { container } = renderWithTheme(<HelperText status="default" text="아이콘 확인" />)

    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("BaseMixin 외 일반 속성을 전달할 수 있다", () => {
    renderWithTheme(<HelperText status="info" text="속성 전달 확인" data-testid="helper-text" />)

    expect(screen.getByTestId("helper-text")).toBeInTheDocument()
  })
})
