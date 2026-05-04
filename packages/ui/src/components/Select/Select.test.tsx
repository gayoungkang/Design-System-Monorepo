import type { ReactElement } from "react"
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, it, vi } from "vitest"
import { renderWithProviders } from "../../test"
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

const renderSelect = (ui: ReactElement) => renderWithProviders(ui)

describe("Select", () => {
  it("renders placeholder when no value exists", () => {
    renderSelect(<Select<string> label="과일" options={fruitOptions} placeholder="선택해 주세요" />)

    expect(screen.getByText("선택해 주세요")).toBeInTheDocument()
  })

  it("opens listbox by keyboard", () => {
    renderSelect(<Select<string> label="과일" options={fruitOptions} />)

    const combobox = screen.getByRole("combobox")
    fireEvent.keyDown(combobox, { key: "Enter" })

    expect(screen.getByRole("listbox")).toBeInTheDocument()
    expect(screen.getAllByRole("option")).toHaveLength(fruitOptions.length)
  })

  it("keyboard 이동 시 aria-activedescendant를 현재 option에 연결한다", () => {
    renderSelect(<Select<string> label="과일" options={fruitOptions} />)

    const combobox = screen.getByRole("combobox")
    fireEvent.keyDown(combobox, { key: "Enter" })
    fireEvent.keyDown(combobox, { key: "ArrowDown" })

    const activeOptionId = combobox.getAttribute("aria-activedescendant")

    expect(activeOptionId).toBeTruthy()
    expect(document.getElementById(activeOptionId ?? "")).toHaveTextContent("바나나")
  })

  it("keyboard로 active option을 선택하고 Escape로 listbox를 닫는다", () => {
    const handleChange = vi.fn()

    renderSelect(<Select<string> label="과일" options={fruitOptions} onChange={handleChange} />)

    const combobox = screen.getByRole("combobox")
    fireEvent.keyDown(combobox, { key: "Enter" })
    fireEvent.keyDown(combobox, { key: "ArrowDown" })
    fireEvent.keyDown(combobox, { key: "Enter" })

    expect(handleChange).toHaveBeenCalledWith("banana")
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()

    fireEvent.keyDown(combobox, { key: "Enter" })
    expect(screen.getByRole("listbox")).toBeInTheDocument()

    fireEvent.keyDown(combobox, { key: "Escape" })
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    expect(combobox).toHaveAttribute("aria-expanded", "false")
  })

  it("selects single option", () => {
    const handleChange = vi.fn()

    renderSelect(<Select<string> label="과일" options={fruitOptions} onChange={handleChange} />)

    const combobox = screen.getByRole("combobox")
    fireEvent.mouseDown(combobox, { detail: 1 })
    fireEvent.click(screen.getByText("바나나"))

    expect(handleChange).toHaveBeenCalledWith("banana")
  })

  it("selects multiple options", () => {
    const handleChange = vi.fn()

    renderSelect(
      <Select<string>
        multiple
        label="카테고리"
        options={categoryOptions}
        value={[]}
        onChange={handleChange}
      />,
    )

    const combobox = screen.getByRole("combobox")
    fireEvent.mouseDown(combobox, { detail: 1 })
    fireEvent.click(screen.getByText("디자인"))

    expect(handleChange).toHaveBeenCalledWith(["design"])
  })

  it("toggles all option in multiple mode", () => {
    const handleChange = vi.fn()

    renderSelect(
      <Select<string>
        multiple
        label="카테고리"
        options={categoryOptions}
        value={[]}
        onChange={handleChange}
      />,
    )

    const combobox = screen.getByRole("combobox")
    fireEvent.mouseDown(combobox, { detail: 1 })
    fireEvent.click(screen.getByText("전체"))

    expect(handleChange).toHaveBeenCalledWith(["design", "frontend", "backend"])
  })

  it("deletes chip in chip multiple mode", () => {
    const handleChange = vi.fn()

    renderSelect(
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
    renderSelect(<Select<string> label="과일" options={fruitOptions} disabled />)

    const combobox = screen.getByRole("combobox")
    fireEvent.mouseDown(combobox, { detail: 1 })

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
  })

  it("shows helper text when error exists", () => {
    renderSelect(
      <Select<string> label="과일" options={fruitOptions} error helperText="필수 항목입니다." />,
    )

    expect(screen.getByText("필수 항목입니다.")).toBeInTheDocument()
  })

  it("combobox에 label과 helperText 접근성 속성을 연결한다", () => {
    renderSelect(
      <Select<string> label="과일" options={fruitOptions} error helperText="필수 항목입니다." />,
    )

    const combobox = screen.getByRole("combobox", { name: "과일" })
    const describedBy = combobox.getAttribute("aria-describedby")

    expect(combobox).toHaveAttribute("aria-invalid", "true")
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy ?? "")).toHaveTextContent("필수 항목입니다.")
  })
})
