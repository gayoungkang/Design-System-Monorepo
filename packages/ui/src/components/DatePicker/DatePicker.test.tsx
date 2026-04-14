import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"
import { ThemeProvider } from "styled-components"
import dayjs from "dayjs"
import DatePicker from "./DatePicker"
import { theme } from "../../tokens/theme"

const renderDatePicker = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
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

  test("input 클릭 시 popper가 열린다", async () => {
    const user = userEvent.setup()

    renderDatePicker(<DatePicker />)

    const input = screen.getByRole("textbox")

    await user.click(input)

    expect(screen.getByLabelText("date-picker")).toBeInTheDocument()
  })

  test("disabled면 popper가 열리지 않는다", async () => {
    const user = userEvent.setup()

    renderDatePicker(<DatePicker disabled />)

    const input = screen.getByRole("textbox")

    await user.click(input)

    expect(screen.queryByLabelText("date-picker")).not.toBeInTheDocument()
  })

  test("clearable=true면 clear 동작이 수행된다", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderDatePicker(<DatePicker value={dayjs("2024-03-01")} onChange={onChange} clearable />)

    const clearButton = screen.getByRole("button")
    await user.click(clearButton)

    expect(onChange).toHaveBeenCalledWith(null)
  })

  test("숫자 입력 시 자동 포맷 적용된다", async () => {
    const user = userEvent.setup()

    renderDatePicker(<DatePicker />)

    const input = screen.getByRole("textbox")

    await user.type(input, "20240301")

    expect(input).toHaveValue("2024-03-01")
  })

  test("유효하지 않은 날짜 입력 시 onChange 호출되지 않는다", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderDatePicker(<DatePicker onChange={onChange} />)

    const input = screen.getByRole("textbox")

    await user.type(input, "99999999")

    expect(onChange).not.toHaveBeenCalled()
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

  test("cancel 버튼 클릭 시 상태가 복원된다", async () => {
    const user = userEvent.setup()

    renderDatePicker(
      <DatePicker mode="Range" rangeValue={[dayjs("2024-01-01"), dayjs("2024-01-10")]} />,
    )

    const input = screen.getByRole("textbox")
    await user.click(input)

    const cancelButton = screen.getByTestId("datepicker-range-cancel")
    await user.click(cancelButton)

    expect(screen.queryByLabelText("date-picker")).not.toBeInTheDocument()
  })
})
