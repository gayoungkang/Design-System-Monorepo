import type { ReactElement } from "react"
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, it } from "vitest"
import { renderWithProviders } from "../../test"
import Slider from "./Slider"

const renderSlider = (ui: ReactElement) => renderWithProviders(ui)

describe("Slider", () => {
  it("renders", () => {
    const { container } = renderSlider(<Slider value={30} />)
    expect(container).toBeInTheDocument()
  })

  it("keyboard interaction works", () => {
    let val = 30

    renderSlider(<Slider value={val} onChange={(v) => (val = v as number)} />)

    const thumb = screen.getByRole("slider")
    fireEvent.keyDown(thumb, { key: "ArrowRight" })

    expect(val).toBeGreaterThan(30)
  })
})
