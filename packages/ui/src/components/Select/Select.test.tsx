import { fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, it, vi } from "vitest"
import Select from "./Select"

const fruitOptions = [
  { value: "apple", label: "사과" },
  { value: "banana", label: "바나나" },
  { value: "grape", label: "포도" },
]

const categoryOptions = [
  { value: "all", label: "전체", isAllOption: true },
  { value: "design", label: "디자인" },
  { value: "frontend", label: "프론트엔드" },
  { value: "backend", label: "백엔드" },
]

describe("Select", () => {
  it("renders placeholder when no value exists", () => {
    render(<Select<string> label="과일" options={fruitOptions} placeholder="선택해 주세요" />)

    expect(screen.getByText("선택해 주세요")).toBeInTheDocument()
  })

  it("opens listbox by keyboard", () => {
    render(<Select<string> label="과일" options={fruitOptions} />)

    const combobox = screen.getByRole("combobox")
    fireEvent.keyDown(combobox, { key: "Enter" })

    expect(screen.getByRole("listbox")).toBeInTheDocument()
  })

  it("selects single option", () => {
    const handleChange = vi.fn()

    render(<Select<string> label="과일" options={fruitOptions} onChange={handleChange} />)

    const combobox = screen.getByRole("combobox")
    fireEvent.mouseDown(combobox)
    fireEvent.click(screen.getByText("바나나"))

    expect(handleChange).toHaveBeenCalledWith("banana")
  })

  it("selects multiple options", () => {
    const handleChange = vi.fn()

    render(
      <Select<string>
        multiple
        label="카테고리"
        options={categoryOptions}
        value={[]}
        onChange={handleChange}
      />,
    )

    const combobox = screen.getByRole("combobox")
    fireEvent.mouseDown(combobox)
    fireEvent.click(screen.getByText("디자인"))

    expect(handleChange).toHaveBeenCalledWith(["design"])
  })

  it("toggles all option in multiple mode", () => {
    const handleChange = vi.fn()

    render(
      <Select<string>
        multiple
        label="카테고리"
        options={categoryOptions}
        value={[]}
        onChange={handleChange}
      />,
    )

    const combobox = screen.getByRole("combobox")
    fireEvent.mouseDown(combobox)
    fireEvent.click(screen.getByText("전체"))

    expect(handleChange).toHaveBeenCalledWith(["design", "frontend", "backend"])
  })

  it("deletes chip in chip multiple mode", () => {
    const handleChange = vi.fn()

    render(
      <Select<string>
        multiple
        label="카테고리"
        options={categoryOptions}
        value={["design", "frontend"]}
        onChange={handleChange}
        multipleType="chip"
      />,
    )

    const deleteButtons = screen.getAllByRole("button")
    fireEvent.click(deleteButtons[1])

    expect(handleChange).toHaveBeenCalled()
  })

  it("does not open when disabled", () => {
    render(<Select<string> label="과일" options={fruitOptions} disabled />)

    const combobox = screen.getByRole("combobox")
    fireEvent.mouseDown(combobox)

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
  })

  it("shows helper text when error exists", () => {
    render(
      <Select<string> label="과일" options={fruitOptions} error helperText="필수 항목입니다." />,
    )

    expect(screen.getByText("필수 항목입니다.")).toBeInTheDocument()
  })
})
