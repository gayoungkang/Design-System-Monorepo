import type { ReactElement } from "react"
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, it, vi } from "vitest"
import { renderWithProviders } from "../../test"
import Popper from "./Popper"

const renderPopper = (ui: ReactElement) => renderWithProviders(ui)

describe("Popper", () => {
  it("renders when open", () => {
    const anchor = document.createElement("div")
    document.body.appendChild(anchor)

    renderPopper(
      <Popper open anchorRef={{ current: anchor }}>
        <div>test</div>
      </Popper>,
    )

    expect(screen.getByText("test")).toBeInTheDocument()
    expect(screen.getByRole("dialog", { name: "popover" })).toBeInTheDocument()
  })

  it("closes on escape", () => {
    const onClose = vi.fn()
    const anchor = document.createElement("div")

    renderPopper(
      <Popper open anchorRef={{ current: anchor }} onClose={onClose}>
        <div>test</div>
      </Popper>,
    )

    fireEvent.keyDown(document, { key: "Escape" })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("closes on outside click", () => {
    const onClose = vi.fn()
    const anchor = document.createElement("div")

    renderPopper(
      <Popper open anchorRef={{ current: anchor }} onClose={onClose}>
        <div>test</div>
      </Popper>,
    )

    fireEvent.pointerDown(document.body)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("does not close when anchor is clicked", () => {
    const onClose = vi.fn()
    const anchor = document.createElement("button")
    anchor.type = "button"
    anchor.textContent = "anchor"
    document.body.appendChild(anchor)

    renderPopper(
      <Popper open anchorRef={{ current: anchor }} onClose={onClose}>
        <div>test</div>
      </Popper>,
    )

    fireEvent.pointerDown(anchor)

    expect(onClose).not.toHaveBeenCalled()
  })

  it("returns focus to anchor when closed by Escape", () => {
    const onClose = vi.fn()
    const anchor = document.createElement("button")
    anchor.type = "button"
    anchor.textContent = "anchor"
    document.body.appendChild(anchor)

    renderPopper(
      <Popper open anchorRef={{ current: anchor }} onClose={onClose}>
        <button type="button">inside</button>
      </Popper>,
    )

    screen.getByRole("button", { name: "inside" }).focus()
    fireEvent.keyDown(document, { key: "Escape" })

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(anchor).toHaveFocus()
  })
})
