import type { ReactElement } from "react"
import { useMemo, useState } from "react"
import { describe, it, expect, vi } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { renderWithProviders } from "../../test"
import Table from "./Table"
import type { ColumnProps } from "./@Types/table"
import Select from "../Select/Select"

type Row = {
  id: number
  name: string
  group?: string
}

const columns: ColumnProps<Row>[] = [
  { key: "id", title: "ID", width: 100 },
  { key: "name", title: "Name", width: 200 },
]

const baseData: Row[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
]

const renderTable = (ui: ReactElement) => renderWithProviders(ui)

describe("Table", () => {
  it("헤더와 데이터가 렌더링된다", () => {
    renderTable(
      <Table<Row>
        tableKey="users"
        columnConfig={columns}
        data={baseData}
        query={{ page: 1, rowsPerPage: 10, keyword: "" }}
        totalCount={2}
        onQueryChange={() => {}}
      />,
    )

    expect(screen.getByText("ID")).toBeInTheDocument()
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
  })

  it("데이터가 없으면 emptyRowText를 렌더링한다", () => {
    renderTable(
      <Table<Row>
        tableKey="empty"
        columnConfig={columns}
        data={[]}
        query={{ page: 1, rowsPerPage: 10, keyword: "" }}
        totalCount={0}
        emptyRowText="데이터 없음"
        onQueryChange={() => {}}
      />,
    )

    expect(screen.getByText("데이터 없음")).toBeInTheDocument()
  })

  it("toolbar가 있는 빈 데이터에서도 toolbar와 empty row를 함께 렌더링한다", () => {
    renderTable(
      <Table<Row>
        tableKey="empty-with-toolbar"
        columnConfig={columns}
        data={[]}
        query={{ page: 1, rowsPerPage: 10, keyword: "no-result" }}
        totalCount={0}
        emptyRowText="검색 결과가 없습니다."
        onQueryChange={() => {}}
        toolbar={{
          title: "Users",
          searchEnabled: true,
          searchValue: "no-result",
        }}
      />,
    )

    expect(screen.getByText("Users")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "검색" })).toBeInTheDocument()
    expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument()
  })

  it("toolbar.onSearchChange가 있으면 외부 searchValue 제어를 우선 사용한다", () => {
    const onSearchChange = vi.fn()
    const onQueryChange = vi.fn()

    renderTable(
      <Table<Row>
        tableKey="toolbar-search"
        columnConfig={columns}
        data={baseData}
        query={{ page: 3, rowsPerPage: 10, keyword: "internal" }}
        totalCount={2}
        onQueryChange={onQueryChange}
        toolbar={{
          title: "Users",
          searchEnabled: true,
          searchValue: "external",
          onSearchChange,
        }}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "검색" }))
    const input = screen.getByRole("textbox") as HTMLInputElement

    expect(input.value).toBe("external")
    onQueryChange.mockClear()

    fireEvent.change(input, { target: { value: "next" } })

    expect(onSearchChange).toHaveBeenCalledWith("next")
    expect(onQueryChange).not.toHaveBeenCalled()
  })

  it("totalCount가 표시된다", () => {
    renderTable(
      <Table<Row>
        tableKey="total"
        columnConfig={columns}
        data={baseData}
        query={{ page: 1, rowsPerPage: 10, keyword: "" }}
        totalCount={2}
        onQueryChange={() => {}}
      />,
    )

    expect(screen.getByText("2")).toBeInTheDocument()
  })

  it("rowsPerPage 변경 시 page=1과 변경된 rowsPerPage를 onQueryChange로 전달한다", () => {
    const onQueryChange = vi.fn()

    renderTable(
      <Table<Row>
        tableKey="rows"
        columnConfig={columns}
        data={baseData}
        query={{ page: 2, rowsPerPage: 10, keyword: "" }}
        totalCount={50}
        rowsPerPageOptions={[10, 25]}
        onQueryChange={onQueryChange}
      />,
    )

    fireEvent.mouseDown(screen.getByRole("combobox"), { detail: 1 })
    fireEvent.click(screen.getByRole("option", { name: "25" }))

    expect(onQueryChange).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, rowsPerPage: 25 }),
    )
  })

  it("controlled rowsPerPage 변경 시 실제 표시 row slice가 변경된다", () => {
    const rows = Array.from({ length: 12 }, (_, index) => ({
      id: index + 1,
      name: `User ${index + 1}`,
    }))

    const TestComponent = () => {
      const [query, setQuery] = useState({ page: 1, rowsPerPage: 5, keyword: "" })
      const pageRows = useMemo(
        () => rows.slice((query.page - 1) * query.rowsPerPage, query.page * query.rowsPerPage),
        [query],
      )

      return (
        <Table<Row>
          tableKey="controlled-rows"
          columnConfig={columns}
          data={pageRows}
          query={query}
          totalCount={rows.length}
          rowsPerPageOptions={[5, 10]}
          onQueryChange={setQuery}
        />
      )
    }

    renderTable(<TestComponent />)

    expect(screen.getByText("User 5")).toBeInTheDocument()
    expect(screen.queryByText("User 6")).not.toBeInTheDocument()

    fireEvent.mouseDown(screen.getByRole("combobox"), { detail: 1 })
    fireEvent.mouseDown(screen.getByRole("option", { name: "10" }))

    expect(screen.getByText("User 10")).toBeInTheDocument()
  })

  it("toolbar filter Select draft를 적용하면 실제 Table data가 필터링된다", () => {
    const filterRows: Row[] = [
      { id: 1, name: "Alice", group: "A" },
      { id: 2, name: "Bob", group: "B" },
      { id: 3, name: "Cathy", group: "B" },
    ]
    const filterColumns: ColumnProps<Row>[] = [
      ...columns,
      { key: "group", title: "Group", width: 100 },
    ]

    const TestComponent = () => {
      const [draftGroup, setDraftGroup] = useState("all")
      const [appliedGroup, setAppliedGroup] = useState("all")
      const data = useMemo(
        () =>
          appliedGroup === "all"
            ? filterRows
            : filterRows.filter((row) => row.group === appliedGroup),
        [appliedGroup],
      )

      return (
        <Table<Row>
          tableKey="filter-rows"
          columnConfig={filterColumns}
          data={data}
          query={{ page: 1, rowsPerPage: 10, keyword: "" }}
          totalCount={data.length}
          onQueryChange={() => {}}
          toolbar={{
            title: "Users",
            searchEnabled: false,
            columnVisibilityEnabled: false,
            filterEnabled: true,
            filterOpen: true,
            filterSkeletonEnabled: false,
            filterActiveCount: appliedGroup === "all" ? 0 : 1,
            onFilterSearch: () => setAppliedGroup(draftGroup),
            onFilterReset: () => {
              setDraftGroup("all")
              setAppliedGroup("all")
            },
            filterContent: (
              <Select<string>
                label="그룹"
                size="S"
                value={draftGroup}
                options={[
                  { value: "all", label: "전체" },
                  { value: "A", label: "A" },
                  { value: "B", label: "B" },
                ]}
                onChange={(value) => setDraftGroup(value ?? "all")}
              />
            ),
          }}
        />
      )
    }

    renderTable(<TestComponent />)

    fireEvent.mouseDown(screen.getByRole("combobox", { name: "그룹" }), { detail: 1 })
    fireEvent.mouseDown(screen.getByRole("option", { name: "B" }))

    expect(screen.getByRole("combobox", { name: "그룹" })).toHaveTextContent("B")

    fireEvent.click(screen.getByRole("button", { name: "검색" }))

    expect(screen.queryByText("Alice")).not.toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
    expect(screen.getByText("Cathy")).toBeInTheDocument()
  })
})
