import { describe, expect, it, vi } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import { act } from "react"
import "@testing-library/jest-dom"
import { renderWithProviders } from "../../../test"
import TableSearch from "./TableSearch"

describe("TableSearch", () => {
  it("입력 변경 후에도 검색창을 열어두고 focus를 유지한다", () => {
    const handleSearchChange = vi.fn()

    renderWithProviders(
      <TableSearch searchValue="" onSearchChange={handleSearchChange} searchPlaceholder="검색" />,
    )

    fireEvent.click(screen.getByRole("button", { name: "검색" }))

    const input = screen.getByRole("textbox") as HTMLInputElement
    act(() => {
      input.focus()
    })

    fireEvent.change(input, { target: { value: "zzzz" } })

    expect(handleSearchChange).toHaveBeenCalledWith("zzzz")
    expect(screen.getByRole("textbox")).toBeInTheDocument()
    expect(input).toHaveFocus()
  })
})
