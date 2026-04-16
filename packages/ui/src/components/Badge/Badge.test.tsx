import { screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import type React from "react"
import Badge from "./Badge"
import { theme } from "../../tokens/theme"
import { renderWithProviders } from "../../test"

const renderBadge = (ui: React.ReactElement) => {
  return renderWithProviders(ui)
}

describe("Badge", () => {
  test("content가 있으면 배지가 렌더링된다", () => {
    renderBadge(
      <Badge content={3}>
        <button type="button">target</button>
      </Badge>,
    )

    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "target" })).toBeInTheDocument()
  })

  test("content가 undefined면 배지가 렌더링되지 않는다", () => {
    renderBadge(
      <Badge>
        <button type="button">target</button>
      </Badge>,
    )

    expect(screen.queryByText("0")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "target" })).toBeInTheDocument()
  })

  test("content가 0이고 showZero=false면 배지가 숨겨진다", () => {
    renderBadge(
      <Badge content={0}>
        <button type="button">target</button>
      </Badge>,
    )

    expect(screen.queryByText("0")).not.toBeInTheDocument()
  })

  test("content가 0이고 showZero=true면 배지가 표시된다", () => {
    renderBadge(
      <Badge content={0} showZero>
        <button type="button">target</button>
      </Badge>,
    )

    expect(screen.getByText("0")).toBeInTheDocument()
  })

  test("invisible=true면 배지가 숨겨진다", () => {
    renderBadge(
      <Badge content={7} invisible>
        <button type="button">target</button>
      </Badge>,
    )

    expect(screen.queryByText("7")).not.toBeInTheDocument()
  })

  test("숫자 content가 max를 초과하면 max+ 형태로 표시된다", () => {
    renderBadge(
      <Badge content={120} max={99}>
        <button type="button">target</button>
      </Badge>,
    )

    expect(screen.getByText("99+")).toBeInTheDocument()
  })

  test("문자열 content는 max와 무관하게 그대로 표시된다", () => {
    renderBadge(
      <Badge content="NEW" max={1}>
        <button type="button">target</button>
      </Badge>,
    )

    expect(screen.getByText("NEW")).toBeInTheDocument()
  })

  test("status에 따라 배경색이 적용된다", () => {
    renderBadge(
      <Badge content={1} status="success">
        <button type="button">target</button>
      </Badge>,
    )

    const badge = screen.getByText("1").parentElement as HTMLElement

    expect(badge).toHaveStyle(`background-color: ${theme.colors.success[500]}`)
  })

  test("placement에 따라 위치 스타일이 적용된다", () => {
    renderBadge(
      <Badge content={1} placement="bottom-left">
        <button type="button">target</button>
      </Badge>,
    )

    const badge = screen.getByText("1").parentElement as HTMLElement

    expect(badge).toHaveStyle("bottom: 0px")
    expect(badge).toHaveStyle("left: 0px")
    expect(badge).toHaveStyle("transform: translate(-50%, 50%)")
  })

  test("overlap=circular이면 원형 radius와 zero padding이 적용된다", () => {
    renderBadge(
      <Badge content={8} overlap="circular">
        <button type="button">target</button>
      </Badge>,
    )

    const badge = screen.getByText("8").parentElement as HTMLElement

    expect(badge).toHaveStyle("padding: 0px")
    expect(badge).toHaveStyle(`border-radius: ${theme.borderRadius[50]}`)
  })

  test("overlap=rectangular이면 직사각형 패딩이 적용된다", () => {
    renderBadge(
      <Badge content={8} overlap="rectangular">
        <button type="button">target</button>
      </Badge>,
    )

    const badge = screen.getByText("8").parentElement as HTMLElement

    expect(badge).toHaveStyle("padding: 0 6px")
    expect(badge).toHaveStyle(`border-radius: ${theme.borderRadius[8]}`)
  })
})
