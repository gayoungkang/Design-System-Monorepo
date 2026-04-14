import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"
import { ThemeProvider } from "styled-components"
import Drawer from "./Drawer"
import { theme } from "../../tokens/theme"

const renderDrawer = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe("Drawer", () => {
  test("open=true이면 Drawer가 렌더링된다", () => {
    renderDrawer(<Drawer open>Content</Drawer>)

    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  test("overlay=true + open=true이면 backdrop이 렌더링된다", () => {
    renderDrawer(
      <Drawer open overlay>
        Content
      </Drawer>,
    )

    const backdrop = document.querySelector("div[style]")

    expect(backdrop).toBeTruthy()
  })

  test("backdrop 클릭 시 onClose가 호출된다", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    renderDrawer(
      <Drawer open overlay onClose={onClose}>
        Content
      </Drawer>,
    )

    const backdrop = document.querySelector("div")

    if (backdrop) {
      await user.click(backdrop)
    }

    expect(onClose).toHaveBeenCalled()
  })

  test("placement=right이면 right 위치 스타일이 적용된다", () => {
    renderDrawer(
      <Drawer open placement="right">
        Content
      </Drawer>,
    )

    const drawer = screen.getByText("Content").parentElement as HTMLElement

    expect(drawer).toHaveStyle({
      right: "0px",
      top: "0px",
    })
  })

  test("placement=top이면 top 위치 스타일이 적용된다", () => {
    renderDrawer(
      <Drawer open placement="top">
        Content
      </Drawer>,
    )

    const drawer = screen.getByText("Content").parentElement as HTMLElement

    expect(drawer).toHaveStyle({
      top: "0px",
      left: "0px",
    })
  })

  test("closeBehavior=collapsed이면 닫혀도 DOM은 유지된다", () => {
    renderDrawer(
      <Drawer open={false} closeBehavior="collapsed">
        Content
      </Drawer>,
    )

    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  test("closeBehavior=hidden + overlay이면 닫히면 언마운트된다", () => {
    renderDrawer(
      <Drawer open={false} overlay closeBehavior="hidden">
        Content
      </Drawer>,
    )

    expect(screen.queryByText("Content")).not.toBeInTheDocument()
  })

  test("width가 적용된다 (left/right)", () => {
    renderDrawer(
      <Drawer open placement="left" width={320}>
        Content
      </Drawer>,
    )

    const drawer = screen.getByText("Content").parentElement as HTMLElement

    expect(drawer).toHaveStyle({
      width: "320px",
    })
  })

  test("height가 적용된다 (top/bottom)", () => {
    renderDrawer(
      <Drawer open placement="top" height={200}>
        Content
      </Drawer>,
    )

    const drawer = screen.getByText("Content").parentElement as HTMLElement

    expect(drawer).toHaveStyle({
      height: "200px",
    })
  })

  test("collapsed 상태에서 size가 줄어든다", () => {
    renderDrawer(
      <Drawer open={false} closeBehavior="collapsed" placement="left" collapsedSize={60}>
        Content
      </Drawer>,
    )

    const drawer = screen.getByText("Content").parentElement as HTMLElement

    expect(drawer).toHaveStyle({
      width: "60px",
    })
  })
})
