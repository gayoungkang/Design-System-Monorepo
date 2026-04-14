import type { ReactNode } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { ThemeProvider } from "styled-components"
import Pagination from "./Pagination"
import { theme } from "../../tokens/theme"

const renderWithTheme = (ui: ReactNode) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe("Pagination - Table", () => {
  it("table 타입의 표시 문구를 렌더링한다", () => {
    renderWithTheme(<Pagination type="Table" count={126} page={1} />)

    expect(screen.getByText("1–10 of 126")).toBeInTheDocument()
  })

  it("table 타입에서 next 클릭 시 onPageChange를 호출한다", () => {
    const onPageChange = vi.fn()

    renderWithTheme(<Pagination type="Table" count={126} page={1} onPageChange={onPageChange} />)

    fireEvent.click(screen.getAllByRole("button")[1])

    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it("labelDisplayedRows가 있으면 우선 사용한다", () => {
    renderWithTheme(
      <Pagination
        type="Table"
        count={30}
        page={2}
        labelDisplayedRows={(from, to, count) => `${from}-${to} / ${count}`}
      />,
    )

    expect(screen.getByText("11-20 / 30")).toBeInTheDocument()
  })
})

describe("Pagination - Basic", () => {
  it("basic 타입에서 페이지 버튼을 렌더링한다", () => {
    renderWithTheme(<Pagination type="Basic" page={3} pageCount={10} />)

    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("basic 타입에서 현재 페이지에 aria-current를 부여한다", () => {
    renderWithTheme(<Pagination type="Basic" page={3} pageCount={10} />)

    expect(screen.getByRole("button", { name: "3" })).toHaveAttribute("aria-current", "page")
  })

  it("basic 타입에서 페이지 클릭 시 onPageChange를 호출한다", () => {
    const onPageChange = vi.fn()

    renderWithTheme(<Pagination type="Basic" page={3} pageCount={10} onPageChange={onPageChange} />)

    fireEvent.click(screen.getByRole("button", { name: "4" }))

    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it("page를 범위 내로 clamp한다", () => {
    renderWithTheme(<Pagination type="Basic" page={999} pageCount={10} />)

    expect(screen.getByRole("button", { name: "10" })).toHaveAttribute("aria-current", "page")
  })

  it("ellipsis를 렌더링할 수 있다", () => {
    renderWithTheme(
      <Pagination type="Basic" page={10} pageCount={20} siblingCount={1} boundaryCount={1} />,
    )

    expect(screen.getAllByText("…").length).toBeGreaterThan(0)
  })

  it("showFirstLastButtons가 true면 first/last 버튼을 렌더링한다", () => {
    renderWithTheme(<Pagination type="Basic" page={3} pageCount={10} showFirstLastButtons />)

    expect(screen.getAllByRole("button").length).toBeGreaterThan(5)
  })

  it("disabled면 페이지 버튼이 비활성화된다", () => {
    renderWithTheme(<Pagination type="Basic" page={3} pageCount={10} disabled />)

    expect(screen.getByRole("button", { name: "3" })).toBeDisabled()
  })
})
