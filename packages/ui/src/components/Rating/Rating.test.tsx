import type { ReactElement } from "react"
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, it, vi } from "vitest"
import { renderWithProviders } from "../../test"
import Rating from "./Rating"

const renderRating = (ui: ReactElement) => renderWithProviders(ui)

describe("Rating", () => {
  it("click changes value", () => {
    let val = 0

    renderRating(<Rating onChange={(v) => (val = v ?? 0)} />)

    const slider = screen.getByRole("slider")

    vi.spyOn(slider, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 120,
      bottom: 24,
      width: 120,
      height: 24,
      toJSON: () => ({}),
    })

    fireEvent.click(slider, { clientX: 100 })

    expect(val).toBeGreaterThan(0)
  })

  it("hover triggers active", () => {
    let val = 0

    renderRating(<Rating onChangeActive={(v) => (val = v ?? 0)} />)

    const slider = screen.getByRole("slider")

    vi.spyOn(slider, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 120,
      bottom: 24,
      width: 120,
      height: 24,
      toJSON: () => ({}),
    })

    fireEvent.mouseMove(slider, { clientX: 100 })

    expect(val).toBeGreaterThan(0)
  })
})
