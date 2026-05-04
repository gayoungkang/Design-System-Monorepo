import { fireEvent, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"
import type { ReactElement } from "react"
import { useState } from "react"
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

  test("overlay drawer는 dialog role을 가지고 Escape로 닫기를 요청한다", () => {
    const onClose = vi.fn()

    renderDrawer(
      <Drawer open overlay onClose={onClose}>
        Content
      </Drawer>,
    )

    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true")

    fireEvent.keyDown(document, { key: "Escape" })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test("open 시 drawer 내부의 첫 interactive element로 focus가 이동한다", async () => {
    renderDrawer(
      <Drawer open overlay>
        <button type="button">첫 액션</button>
      </Drawer>,
    )

    await new Promise((resolve) => requestAnimationFrame(resolve))

    expect(screen.getByRole("button", { name: "첫 액션" })).toHaveFocus()
  })

  test("overlay drawer가 열리면 body scroll을 잠근다", () => {
    renderDrawer(
      <Drawer open overlay>
        Content
      </Drawer>,
    )

    expect(document.body.style.overflow).toBe("hidden")
  })

  test("닫힐 때 trigger로 focus를 돌려준다", async () => {
    const user = userEvent.setup()

    const Example = () => {
      const [open, setOpen] = useState(false)

      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            열기
          </button>
          <Drawer open={open} overlay onClose={() => setOpen(false)}>
            <button type="button">닫기 대상</button>
          </Drawer>
        </>
      )
    }

    renderDrawer(<Example />)

    const trigger = screen.getByRole("button", { name: "열기" })
    await user.click(trigger)

    fireEvent.keyDown(document, { key: "Escape" })

    expect(trigger).toHaveFocus()
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
