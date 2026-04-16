import type { ReactElement } from "react"
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, it } from "vitest"
import { renderWithProviders } from "../../test"
import RadioGroup from "./RadioGroup"

const renderRadioGroup = (ui: ReactElement) => renderWithProviders(ui)

describe("RadioGroup", () => {
  it("selects value on click", () => {
    let selected = "A"

    renderRadioGroup(
      <RadioGroup
        value={selected}
        onChange={(v) => (selected = v)}
        data={[
          { text: "A", value: "A" },
          { text: "B", value: "B" },
        ]}
      />,
    )

    fireEvent.click(screen.getByText("B"))
    expect(selected).toBe("B")
  })

  it("radiogroup role이 렌더링된다", () => {
    let selected = "A"

    renderRadioGroup(
      <RadioGroup
        value={selected}
        onChange={(v) => (selected = v)}
        data={[
          { text: "A", value: "A" },
          { text: "B", value: "B" },
        ]}
      />,
    )

    expect(screen.getByRole("radiogroup")).toBeInTheDocument()
    expect(selected).toBe("A")
  })
})
