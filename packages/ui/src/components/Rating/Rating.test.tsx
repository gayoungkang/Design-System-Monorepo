import { render, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Rating from "./Rating"

describe("Rating", () => {
  it("click changes value", () => {
    let val = 0

    const { container } = render(<Rating onChange={(v) => (val = v ?? 0)} />)

    const items = container.querySelectorAll("div > div")
    fireEvent.click(items[2])

    expect(val).toBe(3)
  })

  it("hover triggers active", () => {
    let val = 0

    const { container } = render(<Rating onChangeActive={(v) => (val = v ?? 0)} />)

    const items = container.querySelectorAll("div > div")
    fireEvent.mouseEnter(items[1])

    expect(val).toBe(2)
  })
})
