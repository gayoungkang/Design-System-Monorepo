import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { useState } from "react"
import InfiniteTable from "./InfiniteTable"
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

describe("InfiniteTable", () => {
  it("헤더와 데이터가 렌더링된다", () => {
    render(
      <InfiniteTable<Row>
        tableKey="users"
        columnConfig={columns}
        data={baseData}
        query={{ page: 1, rowsPerPage: 20, keyword: "" }}
        onQueryChange={() => {}}
      />,
    )

    expect(screen.getByText("ID")).toBeInTheDocument()
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
  })

  it("데이터가 없으면 emptyRowText를 렌더링한다", () => {
    render(
      <InfiniteTable<Row>
        tableKey="empty"
        columnConfig={columns}
        data={[]}
        query={{ page: 1, rowsPerPage: 20, keyword: "" }}
        emptyRowText="데이터 없음"
        onQueryChange={() => {}}
      />,
    )

    expect(screen.getByText("데이터 없음")).toBeInTheDocument()
  })

  it("toolbar 검색 입력 시 keyword가 변경된다", () => {
    const TestComponent = () => {
      const [query, setQuery] = useState<ServerTableQuery>({
        page: 1,
        rowsPerPage: 20,
        keyword: "",
      })

      return (
        <>
          <div data-testid="keyword">{String(query.keyword ?? "")}</div>
          <InfiniteTable<Row>
            tableKey="search"
            columnConfig={columns}
            data={baseData}
            query={query}
            toolbar={{ searchEnabled: true }}
            onQueryChange={setQuery}
          />
        </>
      )
    }

    render(<TestComponent />)

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Ali" },
    })

    expect(screen.getByTestId("keyword")).toHaveTextContent("Ali")
  })

  it("onRowClick이 전달되면 행 클릭 시 호출된다", () => {
    let clickedRowId = 0

    render(
      <InfiniteTable<Row>
        tableKey="row-click"
        columnConfig={columns}
        data={baseData}
        query={{ page: 1, rowsPerPage: 20, keyword: "" }}
        onRowClick={(row) => {
          clickedRowId = row.id
        }}
        onQueryChange={() => {}}
      />,
    )

    fireEvent.click(screen.getByText("Alice"))

    expect(clickedRowId).toBe(1)
  })

  it("loading과 hasMore가 true이면 progressbar가 렌더링된다", () => {
    render(
      <InfiniteTable<Row>
        tableKey="loading"
        columnConfig={columns}
        data={baseData}
        query={{ page: 1, rowsPerPage: 20, keyword: "" }}
        hasMore
        loading
        onQueryChange={() => {}}
      />,
    )

    expect(screen.getByRole("progressbar")).toBeInTheDocument()
  })

  it("totalCount가 없으면 data.length 기준 total rows를 표시한다", () => {
    render(
      <InfiniteTable<Row>
        tableKey="total"
        columnConfig={columns}
        data={baseData}
        query={{ page: 1, rowsPerPage: 20, keyword: "" }}
        onQueryChange={() => {}}
      />,
    )

    expect(screen.getByText("2")).toBeInTheDocument()
  })

  it("disabled면 검색 변경이 차단된다", () => {
    const TestComponent = () => {
      const [query, setQuery] = useState<ServerTableQuery>({
        page: 1,
        rowsPerPage: 20,
        keyword: "",
      })

      return (
        <>
          <div data-testid="keyword">{String(query.keyword ?? "")}</div>
          <InfiniteTable<Row>
            tableKey="disabled-search"
            columnConfig={columns}
            data={baseData}
            query={query}
            toolbar={{ searchEnabled: true }}
            disabled
            onQueryChange={setQuery}
          />
        </>
      )
    }

    render(<TestComponent />)

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Blocked" },
    })

    expect(screen.getByTestId("keyword")).toHaveTextContent("")
  })
})
