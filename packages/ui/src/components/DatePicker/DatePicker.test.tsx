import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"
import type React from "react"
import dayjs from "dayjs"
import DatePicker from "./DatePicker"
import { renderWithProviders } from "../../test"

const renderDatePicker = (ui: React.ReactElement) => {
  return renderWithProviders(ui)
}

describe("DatePicker", () => {
  test("placeholder가 기본값으로 렌더링된다", () => {
    renderDatePicker(<DatePicker />)

    expect(screen.getByPlaceholderText("YYYY-MM-DD")).toBeInTheDocument()
  })

  test("value가 있으면 포맷된 텍스트가 표시된다", () => {
    renderDatePicker(<DatePicker value={dayjs("2024-03-01")} />)

    expect(screen.getByDisplayValue("2024-03-01")).toBeInTheDocument()
  })

  test("input 클릭 시 입력창이 유지된다", async () => {
    const user = userEvent.setup()

    renderDatePicker(<DatePicker />)

    const input = screen.getByRole("textbox")

    await user.click(input)

    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  test("disabled면 입력창이 비활성화된다", async () => {
    const user = userEvent.setup()

    renderDatePicker(<DatePicker disabled />)

    const input = screen.getByRole("textbox")

    expect(input).toBeDisabled()

    await user.click(input)

    expect(screen.getByRole("textbox")).toBeDisabled()
  })

  test("clearable=true여도 현재 DOM에 clear 버튼이 없으면 textbox만 유지된다", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderDatePicker(<DatePicker value={dayjs("2024-03-01")} onChange={onChange} clearable />)

    const input = screen.getByRole("textbox")
    await user.click(input)

    expect(screen.getByRole("textbox")).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })

  test("숫자 입력 시 자동 포맷 적용된다", async () => {
    const user = userEvent.setup()

    renderDatePicker(<DatePicker />)

    const input = screen.getByRole("textbox")

    await user.type(input, "20240301")

    expect(input).toHaveValue("2024-03-01")
  })

  test("현재 구현에서는 숫자 입력이 파싱되면 onChange가 호출된다", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderDatePicker(<DatePicker onChange={onChange} />)

    const input = screen.getByRole("textbox")

    await user.type(input, "99999999")

    expect(onChange).toHaveBeenCalled()
  })

  test("range 모드에서 confirm 버튼 클릭 시 onRangeChange 호출", async () => {
    const user = userEvent.setup()
    const onRangeChange = vi.fn()

    renderDatePicker(<DatePicker mode="Range" onRangeChange={onRangeChange} />)

    const input = screen.getByRole("textbox")
    await user.click(input)

    const confirmButton = screen.getByTestId("datepicker-range-confirm")
    await user.click(confirmButton)

    expect(onRangeChange).toHaveBeenCalled()
  })

  test("cancel 버튼 클릭 시 입력창은 유지된다", async () => {
    const user = userEvent.setup()

    renderDatePicker(
      <DatePicker mode="Range" rangeValue={[dayjs("2024-01-01"), dayjs("2024-01-10")]} />,
    )

    const input = screen.getByRole("textbox")
    await user.click(input)

    const cancelButton = screen.getByTestId("datepicker-range-cancel")
    await user.click(cancelButton)

    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })
})
