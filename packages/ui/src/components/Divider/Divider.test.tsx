import { screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import type { ReactElement } from "react"
import Divider from "./Divider"
import { theme } from "../../tokens/theme"
import { renderWithProviders } from "../../test"

const renderDivider = (ui: ReactElement) => {
  return renderWithProviders(ui)
}

describe("Divider", () => {
  test("기본값으로 horizontal separator를 렌더링한다", () => {
    renderDivider(<Divider />)

    const divider = screen.getByRole("separator")

    expect(divider).toBeInTheDocument()
    expect(divider).toHaveAttribute("aria-orientation", "horizontal")
    expect(divider).toHaveStyle("width: 100%")
    expect(divider).toHaveStyle("height: 1px")
    expect(divider).toHaveStyle(`background-color: ${theme.colors.border.thick}`)
  })

  test("direction=vertical이면 세로 구분선을 렌더링한다", () => {
    renderDivider(<Divider direction="vertical" />)

    const divider = screen.getByRole("separator")

    expect(divider).toHaveAttribute("aria-orientation", "vertical")
    expect(divider).toHaveStyle("width: 1px")
  })

  test("thickness가 적용된다", () => {
    renderDivider(<Divider thickness="4px" />)

    const divider = screen.getByRole("separator")

    expect(divider).toHaveStyle("height: 4px")
  })

  test("color prop이 theme 기본값보다 우선 적용된다", () => {
    renderDivider(<Divider color="rgb(255, 0, 0)" />)

    const divider = screen.getByRole("separator")

    expect(divider).toHaveStyle("background-color: rgb(255, 0, 0)")
  })

  test("vertical + height 지정 시 전달한 height가 우선 적용된다", () => {
    renderDivider(<Divider direction="vertical" height="24px" />)

    const divider = screen.getByRole("separator")

    expect(divider).toHaveStyle("width: 1px")
    expect(divider).toHaveStyle("height: 24px")
  })

  test("vertical + flexItem=true면 높이가 100%로 적용된다", () => {
    renderDivider(<Divider direction="vertical" flexItem />)

    const divider = screen.getByRole("separator")

    expect(divider).toHaveStyle("width: 1px")
    expect(divider).toHaveStyle("height: 100%")
    expect(divider).toHaveStyle("align-self: stretch")
  })

  test("BaseMixinProps 스타일이 적용된다", () => {
    renderDivider(<Divider data-testid="divider" mt="8px" mb="12px" />)

    const divider = screen.getByTestId("divider")
    const styles = window.getComputedStyle(divider)

    expect(styles.marginTop).toBe("8px")
    expect(styles.marginBottom).toBe("12px")
  })
})
