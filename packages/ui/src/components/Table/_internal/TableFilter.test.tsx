import { describe, expect, it, vi } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { renderWithProviders } from "../../../test"
import TableFilter from "./TableFilter"

describe("TableFilter", () => {
  it("검색 버튼 클릭 시 필터를 닫지 않고 onFilterSearch만 호출한다", () => {
    const handleFilterOpenChange = vi.fn()
    const handleFilterSearch = vi.fn()

    renderWithProviders(
      <TableFilter
        filterOpen
        onFilterOpenChange={handleFilterOpenChange}
        filterSkeletonEnabled={false}
        onFilterSearch={handleFilterSearch}
        filterContent={<div>필터 내용</div>}
        hideTrigger
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "검색" }))

    expect(handleFilterSearch).toHaveBeenCalledTimes(1)
    expect(handleFilterOpenChange).not.toHaveBeenCalledWith(false)
  })

  it("초기화 버튼 클릭 시 필터를 닫지 않고 onFilterReset만 호출한다", () => {
    const handleFilterOpenChange = vi.fn()
    const handleFilterReset = vi.fn()

    renderWithProviders(
      <TableFilter
        filterOpen
        onFilterOpenChange={handleFilterOpenChange}
        filterSkeletonEnabled={false}
        onFilterReset={handleFilterReset}
        filterContent={<div>필터 내용</div>}
        hideTrigger
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "초기화" }))

    expect(handleFilterReset).toHaveBeenCalledTimes(1)
    expect(handleFilterOpenChange).not.toHaveBeenCalledWith(false)
  })
})
