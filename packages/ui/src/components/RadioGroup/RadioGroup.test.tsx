import { render, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import RadioGroup from "./RadioGroup"

describe("RadioGroup", () => {
  it("selects value on click", () => {
    let selected = "A"

    const { getByText } = render(
      <RadioGroup
        value={selected}
        onChange={(v) => (selected = v)}
        data={[
          { text: "A", value: "A" },
          { text: "B", value: "B" },
        ]}
      />,
    )

    fireEvent.click(getByText("B"))
    expect(selected).toBe("B")
  })

  it("keyboard navigation works", () => {
    let selected = "A"

    const { getByRole } = render(
      <RadioGroup
        value={selected}
        onChange={(v) => (selected = v)}
        data={[
          { text: "A", value: "A" },
          { text: "B", value: "B" },
        ]}
      />,
    )

    fireEvent.keyDown(getByRole("radiogroup"), { key: "ArrowRight" })
    expect(selected).toBe("B")
  })
})
