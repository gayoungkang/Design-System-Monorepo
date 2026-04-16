import type { ReactElement } from "react"
import { describe, it, expect } from "vitest"
import { screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { renderWithProviders } from "../../test"
import Table from "./Table"
import type { ColumnProps, ServerTableQuery } from "./@Types/table"

type Row = {
  id: number
  name: string
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
})
