import type { ReactElement } from "react"
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, it, vi } from "vitest"
import { renderWithProviders } from "../../test"
import FloatingButton from "./FloatingButton"

const renderFloatingButton = (ui: ReactElement) => renderWithProviders(ui)

describe("FloatingButton", () => {
  it("단일 버튼 클릭 시 onClick 호출", () => {
    const onClick = vi.fn()

    renderFloatingButton(<FloatingButton icon="Add" onClick={onClick} />)

    fireEvent.click(screen.getByRole("button"))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("submenu 토글 동작", () => {
    renderFloatingButton(
      <FloatingButton icon="Add" item={[{ icon: "ClipboardLine", label: "Clipboard" }]} />,
    )

    const buttons = screen.getAllByRole("button")
    const toggleButton = buttons[buttons.length - 1]

    fireEvent.click(toggleButton)

    expect(screen.getByText("Clipboard")).toBeInTheDocument()
    expect(screen.getByText("Clipboard").closest("button")).toHaveAttribute("aria-hidden", "false")
  })

  it("submenu item 클릭 시 onClick 호출", () => {
    const onClick = vi.fn()

    renderFloatingButton(
      <FloatingButton icon="Add" item={[{ icon: "ClipboardLine", label: "Clipboard", onClick }]} />,
    )

    const buttons = screen.getAllByRole("button")
    const toggleButton = buttons[buttons.length - 1]

    fireEvent.click(toggleButton)
    fireEvent.click(screen.getByText("Clipboard"))

    expect(onClick).toHaveBeenCalled()
  })

  it("외부 클릭 시 submenu가 닫힌다", () => {
    renderFloatingButton(
      <div>
        <FloatingButton icon="Add" item={[{ icon: "ClipboardLine", label: "Clipboard" }]} />
        <button data-testid="outside">outside</button>
      </div>,
    )

    const buttons = screen.getAllByRole("button")
    const toggleButton = buttons.find((button) => button.getAttribute("data-testid") !== "outside")

    fireEvent.click(toggleButton as HTMLButtonElement)
    fireEvent.mouseDown(screen.getByTestId("outside"))

    expect(screen.getByText("Clipboard")).toBeInTheDocument()
    expect(screen.getByText("Clipboard").closest("button")).toHaveAttribute("aria-hidden", "true")
  })

  it("ESC 키 입력 시 submenu가 닫힌다", () => {
    renderFloatingButton(
      <FloatingButton icon="Add" item={[{ icon: "ClipboardLine", label: "Clipboard" }]} />,
    )

    const buttons = screen.getAllByRole("button")
    const toggleButton = buttons[buttons.length - 1]

    fireEvent.click(toggleButton)
    fireEvent.keyDown(document, { key: "Escape" })

    expect(screen.getByText("Clipboard")).toBeInTheDocument()
    expect(screen.getByText("Clipboard").closest("button")).toHaveAttribute("aria-hidden", "true")
  })

  it("disabled 상태에서 동작하지 않음", () => {
    const onClick = vi.fn()

    renderFloatingButton(<FloatingButton icon="Add" disabled onClick={onClick} />)

    fireEvent.click(screen.getByRole("button"))

    expect(onClick).not.toHaveBeenCalled()
  })
})
