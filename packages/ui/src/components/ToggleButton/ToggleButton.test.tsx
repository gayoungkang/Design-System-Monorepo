import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import ToggleButton from "./ToggleButton"
import type { ToggleButtonItem } from "./ToggleButton"

type Value = "a" | "b" | "c"

const buttons: ToggleButtonItem<Value>[] = [
  { label: "A", value: "a" },
  { label: "B", value: "b" },
  { label: "C", value: "c" },
]

describe("ToggleButton", () => {
  it("버튼들이 렌더링된다", () => {
    render(<ToggleButton buttons={buttons} selectedValue="a" onClick={() => {}} />)

    expect(screen.getByText("A")).toBeInTheDocument()
    expect(screen.getByText("B")).toBeInTheDocument()
    expect(screen.getByText("C")).toBeInTheDocument()
  })

  it("선택된 값이 aria-pressed=true를 가진다", () => {
    render(<ToggleButton buttons={buttons} selectedValue="b" onClick={() => {}} />)

    expect(screen.getByRole("button", { name: "B" })).toHaveAttribute("aria-pressed", "true")
  })

  it("클릭 시 onClick이 호출된다", () => {
    let selected: Value = "a"

    render(
      <ToggleButton
        buttons={buttons}
        selectedValue={selected}
        onClick={(v) => {
          selected = v
        }}
      />,
    )

    fireEvent.click(screen.getByText("C"))

    expect(selected).toBe("c")
  })

  it("disabled 버튼은 클릭되지 않는다", () => {
    let selected: Value = "a"

    render(
      <ToggleButton
        buttons={[
          { label: "A", value: "a" },
          { label: "B", value: "b", disabled: true },
        ]}
        selectedValue={selected}
        onClick={(v) => {
          selected = v
        }}
      />,
    )

    fireEvent.click(screen.getByText("B"))

    expect(selected).toBe("a")
  })

  it("group disabled이면 모든 버튼이 disabled된다", () => {
    render(<ToggleButton buttons={buttons} selectedValue="a" disabled onClick={() => {}} />)

    const allButtons = screen.getAllByRole("button")
    allButtons.forEach((btn) => {
      expect(btn).toBeDisabled()
    })
  })
})
