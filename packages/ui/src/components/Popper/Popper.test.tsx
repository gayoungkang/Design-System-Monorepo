import { render, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Popper from "./Popper"

describe("Popper", () => {
  it("renders when open", () => {
    const anchor = document.createElement("div")
    document.body.appendChild(anchor)

    const { getByText } = render(
      <Popper open anchorRef={{ current: anchor }}>
        <div>test</div>
      </Popper>,
    )

    expect(getByText("test")).toBeTruthy()
  })

  it("closes on escape", () => {
    let closed = false

    const anchor = document.createElement("div")

    render(
      <Popper open anchorRef={{ current: anchor }} onClose={() => (closed = true)}>
        <div>test</div>
      </Popper>,
    )

    fireEvent.keyDown(document, { key: "Escape" })
    expect(closed).toBe(true)
  })

  it("closes on outside click", () => {
    let closed = false

    const anchor = document.createElement("div")

    render(
      <Popper open anchorRef={{ current: anchor }} onClose={() => (closed = true)}>
        <div>test</div>
      </Popper>,
    )

    fireEvent.pointerDown(document.body)
    expect(closed).toBe(true)
  })
})
