import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"
import { ThemeProvider } from "styled-components"
import Chip from "./Chip"
import { theme } from "../../tokens/theme"

const renderChip = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe("Chip", () => {
  test("label이 렌더링된다", () => {
    renderChip(<Chip label="Test Chip" />)

    expect(screen.getByText("Test Chip")).toBeInTheDocument()
  })

  test("onClick이 있으면 클릭 시 호출된다", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    renderChip(<Chip label="Clickable" onClick={onClick} />)

    await user.click(screen.getByText("Clickable"))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test("disabled면 클릭이 동작하지 않는다", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    renderChip(<Chip label="Disabled" onClick={onClick} disabled />)

    await user.click(screen.getByText("Disabled"))

    expect(onClick).not.toHaveBeenCalled()
  })

  test("startIcon과 endIcon이 렌더링된다", () => {
    renderChip(<Chip label="Icons" startIcon="ArrowRight" endIcon="ArrowRight" />)

    const icons = screen.getAllByTestId("icon")

    expect(icons.length).toBeGreaterThanOrEqual(2)
  })

  test("onDelete가 있으면 삭제 버튼이 렌더링된다", () => {
    renderChip(<Chip label="Delete" onDelete={vi.fn()} />)

    const buttons = screen.getAllByRole("button")

    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  test("삭제 버튼 클릭 시 onDelete만 호출되고 onClick은 호출되지 않는다", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onDelete = vi.fn()

    renderChip(<Chip label="Delete" onClick={onClick} onDelete={onDelete} />)

    const deleteButton = screen.getAllByRole("button")[0]

    await user.click(deleteButton)

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
  })

  test("variant=contained이면 background가 적용된다", () => {
    renderChip(<Chip label="Contained" variant="contained" color="rgb(1,2,3)" />)

    const chip = screen.getByText("Contained").parentElement as HTMLElement

    expect(chip).toHaveStyle({
      backgroundColor: "rgb(1,2,3)",
    })
  })

  test("variant=outlined이면 border가 적용된다", () => {
    renderChip(<Chip label="Outlined" variant="outlined" color="rgb(1,2,3)" />)

    const chip = screen.getByText("Outlined").parentElement as HTMLElement

    expect(chip).toHaveStyle({
      border: "1px solid rgb(1,2,3)",
    })
  })

  test("variant=text이면 배경과 border가 없다", () => {
    renderChip(<Chip label="Text" variant="text" />)

    const chip = screen.getByText("Text").parentElement as HTMLElement

    expect(chip).toHaveStyle({
      backgroundColor: "transparent",
      border: "none",
    })
  })

  test("size에 따라 padding이 변경된다", () => {
    const { container } = renderChip(<Chip label="Size" size="L" />)

    const chip = container.firstChild as HTMLElement

    expect(chip).toHaveStyle({
      padding: "8px 21px",
    })
  })
})
