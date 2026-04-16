import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"
import type React from "react"
import CheckBoxGroup, { CheckBox } from "./CheckBoxGroup"
import { renderWithProviders } from "../../test"

const renderCheckBox = (ui: React.ReactElement) => {
  return renderWithProviders(ui)
}

describe("CheckBox (Single)", () => {
  test("checked 상태에 따라 체크된다", () => {
    renderCheckBox(<CheckBox checked label="Single" />)

    const input = screen.getByRole("checkbox")

    expect(input).toBeChecked()
  })

  test("onChange가 boolean으로 호출된다", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderCheckBox(<CheckBox checked={false} onChange={onChange} label="Single" />)

    const input = screen.getByRole("checkbox")

    await user.click(input)

    expect(onChange).toHaveBeenCalledWith(true)
  })

  test("indeterminate 상태가 적용된다", () => {
    renderCheckBox(<CheckBox checked={false} indeterminate label="Single" />)

    const input = screen.getByRole("checkbox") as HTMLInputElement

    expect(input.indeterminate).toBe(true)
  })

  test("disabled면 클릭되지 않는다", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderCheckBox(<CheckBox disabled onChange={onChange} label="Single" />)

    const input = screen.getByRole("checkbox")

    await user.click(input)

    expect(onChange).not.toHaveBeenCalled()
  })
})

describe("CheckBoxGroup", () => {
  const data = [
    { text: "A", value: "a" },
    { text: "B", value: "b" },
    { text: "C", value: "c" },
  ]

  test("data 기반으로 체크박스를 렌더링한다", () => {
    renderCheckBox(<CheckBoxGroup data={data} />)

    expect(screen.getAllByRole("checkbox")).toHaveLength(3)
  })

  test("value에 포함된 값은 체크된다", () => {
    renderCheckBox(<CheckBoxGroup data={data} value={["a", "c"]} />)

    const inputs = screen.getAllByRole("checkbox") as HTMLInputElement[]

    expect(inputs[0]).toBeChecked()
    expect(inputs[2]).toBeChecked()
  })

  test("체크 시 onChange로 값 배열이 업데이트된다", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderCheckBox(<CheckBoxGroup data={data} value={[]} onChange={onChange} />)

    const inputs = screen.getAllByRole("checkbox")

    await user.click(inputs[0])

    expect(onChange).toHaveBeenCalledWith(["a"])
  })

  test("체크 해제 시 value에서 제거된다", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderCheckBox(<CheckBoxGroup data={data} value={["a"]} onChange={onChange} />)

    const inputs = screen.getAllByRole("checkbox")

    await user.click(inputs[0])

    expect(onChange).toHaveBeenCalledWith([])
  })

  test("allCheck=true면 전체 선택 체크박스가 렌더링된다", () => {
    renderCheckBox(<CheckBoxGroup data={data} allCheck />)

    expect(screen.getAllByRole("checkbox")).toHaveLength(4)
  })

  test("전체 선택 클릭 시 모든 값이 선택된다", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderCheckBox(<CheckBoxGroup data={data} value={[]} onChange={onChange} allCheck />)

    const inputs = screen.getAllByRole("checkbox")

    await user.click(inputs[0])

    expect(onChange).toHaveBeenCalledWith(["a", "b", "c"])
  })

  test("일부 선택 상태에서 전체 선택은 indeterminate가 된다", () => {
    renderCheckBox(<CheckBoxGroup data={data} value={["a"]} allCheck />)

    const inputs = screen.getAllByRole("checkbox") as HTMLInputElement[]

    expect(inputs[0].indeterminate).toBe(true)
  })

  test("disabled면 모든 체크박스가 비활성화된다", () => {
    renderCheckBox(<CheckBoxGroup data={data} disabled />)

    const inputs = screen.getAllByRole("checkbox")

    inputs.forEach((input) => {
      expect(input).toBeDisabled()
    })
  })
})
