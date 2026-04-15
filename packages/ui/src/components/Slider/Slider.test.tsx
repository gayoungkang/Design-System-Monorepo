import { render, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Slider from "./Slider"

describe("Slider", () => {
  it("renders", () => {
    const { container } = render(<Slider value={30} />)
    expect(container).toBeTruthy()
  })

  it("keyboard interaction works", () => {
    let val = 30

    const { getByRole } = render(<Slider value={val} onChange={(v) => (val = v as number)} />)

    const thumb = getByRole("slider")
    fireEvent.keyDown(thumb, { key: "ArrowRight" })

    expect(val).toBeGreaterThan(30)
  })
})
