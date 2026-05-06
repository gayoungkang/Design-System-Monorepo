import { describe, expect, it, vi } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { renderWithProviders } from "../../../test"
import TableRowsPerPage from "./TableRowsPerPage"

describe("TableRowsPerPage", () => {
  it("Select option 선택 시 number rowsPerPage를 전달한다", () => {
    const handleRowsPerPageChange = vi.fn()

    renderWithProviders(
      <TableRowsPerPage
        rowsPerPage={10}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleRowsPerPageChange}
      />,
    )

    fireEvent.mouseDown(screen.getByRole("combobox"), { detail: 1 })
    fireEvent.mouseDown(screen.getByRole("option", { name: "25" }))

    expect(handleRowsPerPageChange).toHaveBeenCalledWith(25)
  })
})
