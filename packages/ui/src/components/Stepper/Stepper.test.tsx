import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import Stepper from "./Stepper"

const options = [
  { value: "a", label: "Step A" },
  { value: "b", label: "Step B" },
  { value: "c", label: "Step C" },
]

describe("Stepper", () => {
  it("step label이 렌더링된다", () => {
    render(<Stepper options={options} value={"a"} />)

    expect(screen.getByText("Step A")).toBeInTheDocument()
    expect(screen.getByText("Step B")).toBeInTheDocument()
    expect(screen.getByText("Step C")).toBeInTheDocument()
  })

  it("active step 이후는 linear일 때 클릭되지 않는다", () => {
    const onSelect = vi.fn()

    render(<Stepper options={options} value={"a"} onSelect={onSelect} />)

    fireEvent.click(screen.getByText("Step C"))

    expect(onSelect).not.toHaveBeenCalled()
  })

  it("linear=false이면 모든 step 클릭 가능", () => {
    const onSelect = vi.fn()

    render(<Stepper options={options} value={"a"} linear={false} onSelect={onSelect} />)

    fireEvent.click(screen.getByText("Step C"))

    expect(onSelect).toHaveBeenCalledWith("c", 2)
  })

  it("disabled step은 클릭되지 않는다", () => {
    const onSelect = vi.fn()

    const disabledOptions = [
      { value: "a", label: "A" },
      { value: "b", label: "B", disabled: true },
    ]

    render(<Stepper options={disabledOptions} value={"a"} onSelect={onSelect} />)

    fireEvent.click(screen.getByText("B"))

    expect(onSelect).not.toHaveBeenCalled()
  })

  it("onSelect가 올바른 value와 index를 전달한다", () => {
    const onSelect = vi.fn()

    render(<Stepper options={options} value={"a"} linear={false} onSelect={onSelect} />)

    fireEvent.click(screen.getByText("Step B"))

    expect(onSelect).toHaveBeenCalledWith("b", 1)
  })

  it("hidden step은 렌더링되지 않는다", () => {
    const hiddenOptions = [
      { value: "a", label: "A" },
      { value: "b", label: "B", hidden: true },
    ]

    render(<Stepper options={hiddenOptions} value={"a"} />)

    expect(screen.queryByText("B")).not.toBeInTheDocument()
  })
})
