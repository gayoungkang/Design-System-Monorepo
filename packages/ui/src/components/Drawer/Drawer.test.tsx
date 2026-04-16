import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"
import type { ReactElement } from "react"
import Drawer from "./Drawer"
import { renderWithProviders } from "../../test"

const renderDrawer = (ui: ReactElement) => {
  return renderWithProviders(ui)
}

const getDrawerElement = () => {
  return document.body.lastElementChild as HTMLElement | null
}

const getBackdropElement = () => {
  const drawer = getDrawerElement()
  return drawer?.previousElementSibling as HTMLElement | null
}

describe("Drawer", () => {
  test("open=true이면 Drawer가 렌더링된다", () => {
    renderDrawer(<Drawer open>Content</Drawer>)

    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  test("overlay=true + open=true이면 Content가 렌더링된다", () => {
    renderDrawer(
      <Drawer open overlay>
        Content
      </Drawer>,
    )

    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  test("backdrop 클릭 시 onClose가 호출된다", () => {
    const onClose = vi.fn()

    renderDrawer(
      <Drawer open overlay onClose={onClose}>
        Content
      </Drawer>,
    )

    const backdrop = getBackdropElement()

    expect(backdrop).toBeInTheDocument()

    if (backdrop) {
      fireEvent.click(backdrop)
    }

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test("placement=right이면 Drawer가 렌더링된다", () => {
    renderDrawer(
      <Drawer open placement="right">
        Content
      </Drawer>,
    )

    const drawer = getDrawerElement()

    expect(drawer).toBeInTheDocument()
    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  test("placement=top이면 Drawer가 렌더링된다", () => {
    renderDrawer(
      <Drawer open placement="top">
        Content
      </Drawer>,
    )

    const drawer = getDrawerElement()

    expect(drawer).toBeInTheDocument()
    expect(screen.getByText("Content")).toBeInTheDocument()
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

    const drawer = getDrawerElement()

    expect(drawer).toBeInTheDocument()
    expect(drawer && window.getComputedStyle(drawer).width).toBe("320px")
  })

  test("height가 적용된다 (top/bottom)", () => {
    renderDrawer(
      <Drawer open placement="top" height={200}>
        Content
      </Drawer>,
    )

    const drawer = getDrawerElement()

    expect(drawer).toBeInTheDocument()
    expect(drawer && window.getComputedStyle(drawer).height).toBe("200px")
  })

  test("collapsed 상태에서 size가 줄어든다", () => {
    renderDrawer(
      <Drawer open={false} closeBehavior="collapsed" placement="left" collapsedSize={60}>
        Content
      </Drawer>,
    )

    const drawer = getDrawerElement()

    expect(drawer).toBeInTheDocument()
    expect(drawer && window.getComputedStyle(drawer).width).toBe("60px")
  })
})
