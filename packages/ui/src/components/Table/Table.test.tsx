// Table.stories.tsx
import type { Meta, StoryObj } from "@storybook/react"
import { useMemo, useState } from "react"
import Table from "./Table"
import type { ColumnProps, ServerTableQuery } from "./@Types/table"

type TableRowData = {
  id: number
  name: string
  age: number
  team: string
}

const allRows: TableRowData[] = Array.from({ length: 120 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  age: 20 + (index % 15),
  team: ["Frontend", "Backend", "Design"][index % 3],
}))

const columnConfig: ColumnProps<TableRowData>[] = [
  {
    key: "id",
    title: "ID",
    width: 100,
  },
  {
    key: "name",
    title: "Name",
    width: 220,
  },
  {
    key: "age",
    title: "Age",
    width: 120,
  },
  {
    key: "team",
    title: "Team",
    width: 180,
  },
]

const meta: Meta<typeof Table<TableRowData>> = {
  title: "Data Display/Table",
  component: Table<TableRowData>,
}

export default meta

type Story = StoryObj<typeof Table<TableRowData>>

const filterRows = (rows: TableRowData[], keyword: string) => {
  const safeKeyword = keyword.trim().toLowerCase()
  if (!safeKeyword) return rows

  return rows.filter(
    (row) =>
      String(row.id).includes(safeKeyword) ||
      row.name.toLowerCase().includes(safeKeyword) ||
      row.team.toLowerCase().includes(safeKeyword),
  )
}

const sortRows = (rows: TableRowData[], query: ServerTableQuery) => {
  const sort = query.sort
  if (!sort?.key || !sort?.direction) return rows

  const next = [...rows]
  const direction = sort.direction === "DESC" ? -1 : 1

  next.sort((a, b) => {
    const aValue = a[sort.key as keyof TableRowData]
    const bValue = b[sort.key as keyof TableRowData]

    if (aValue === bValue) return 0
    return aValue > bValue ? direction : -direction
  })

  return next
}

export const Playground: Story = {
  render: () => {
    const [query, setQuery] = useState<ServerTableQuery>({
      page: 1,
      rowsPerPage: 10,
      keyword: "",
    })

    const visibleRows = useMemo(() => {
      const filtered = filterRows(allRows, String(query.keyword ?? ""))
      const sorted = sortRows(filtered, query)
      const start = (query.page - 1) * query.rowsPerPage
      const end = start + query.rowsPerPage
      return {
        total: sorted.length,
        rows: sorted.slice(start, end),
      }
    }, [query])

    return (
      <Table<TableRowData>
        tableKey="playground"
        columnConfig={columnConfig}
        data={visibleRows.rows}
        query={query}
        totalCount={visibleRows.total}
        pagination="Table"
        onQueryChange={setQuery}
      />
    )
  },
}

export const WithToolbar: Story = {
  render: () => {
    const [query, setQuery] = useState<ServerTableQuery>({
      page: 1,
      rowsPerPage: 10,
      keyword: "",
    })

    const visibleRows = useMemo(() => {
      const filtered = filterRows(allRows, String(query.keyword ?? ""))
      const start = (query.page - 1) * query.rowsPerPage
      const end = start + query.rowsPerPage

      return {
        total: filtered.length,
        rows: filtered.slice(start, end),
      }
    }, [query])

    return (
      <Table<TableRowData>
        tableKey="toolbar"
        columnConfig={columnConfig}
        data={visibleRows.rows}
        query={query}
        totalCount={visibleRows.total}
        pagination="Table"
        toolbar={{
          title: "Users",
          searchEnabled: true,
        }}
        onQueryChange={setQuery}
      />
    )
  },
}

export const EmptyState: Story = {
  render: () => {
    const [query, setQuery] = useState<ServerTableQuery>({
      page: 1,
      rowsPerPage: 10,
      keyword: "",
    })

    return (
      <Table<TableRowData>
        tableKey="empty"
        columnConfig={columnConfig}
        data={[]}
        query={query}
        totalCount={0}
        emptyRowText="검색 결과가 없습니다."
        pagination="Table"
        onQueryChange={setQuery}
      />
    )
  },
}

export const Virtualized: Story = {
  render: () => {
    const [query, setQuery] = useState<ServerTableQuery>({
      page: 1,
      rowsPerPage: 100,
      keyword: "",
    })

    const visibleRows = useMemo(() => {
      const filtered = filterRows(allRows, String(query.keyword ?? ""))
      return {
        total: filtered.length,
        rows: filtered,
      }
    }, [query])

    return (
      <Table<TableRowData>
        tableKey="virtualized"
        columnConfig={columnConfig}
        data={visibleRows.rows}
        query={query}
        totalCount={visibleRows.total}
        height={320}
        toolbar={{
          title: "Virtualized Users",
          searchEnabled: true,
        }}
        virtualized={{
          enabled: true,
          rowHeight: 32,
          overscan: 6,
        }}
        onQueryChange={setQuery}
      />
    )
  },
}

export const Disabled: Story = {
  render: () => {
    const [query, setQuery] = useState<ServerTableQuery>({
      page: 1,
      rowsPerPage: 10,
      keyword: "",
    })

    const visibleRows = useMemo(() => {
      const start = (query.page - 1) * query.rowsPerPage
      const end = start + query.rowsPerPage

      return {
        total: allRows.length,
        rows: allRows.slice(start, end),
      }
    }, [query])

    return (
      <Table<TableRowData>
        tableKey="disabled"
        columnConfig={columnConfig}
        data={visibleRows.rows}
        query={query}
        totalCount={visibleRows.total}
        pagination="Table"
        toolbar={{
          title: "Disabled Users",
          searchEnabled: true,
        }}
        disabled
        onQueryChange={setQuery}
      />
    )
  },
}

export const AllCases: Story = {
  render: () => {
    const [query, setQuery] = useState<ServerTableQuery>({
      page: 1,
      rowsPerPage: 25,
      keyword: "",
      sort: {
        key: "id",
        direction: "ASC",
      },
    })

    const columns = useMemo<ColumnProps<TableRowData>[]>(() => {
      return columnConfig.map((column) => {
        if (!["id", "name", "age"].includes(String(column.key))) return column

        return {
          ...column,
          sort: true,
          sortDirection: query.sort?.key === column.key ? query.sort.direction : undefined,
          onSortChange: (key, direction) => {
            setQuery((prev) => ({
              ...prev,
              page: 1,
              sort: {
                key: String(key),
                direction,
              },
            }))
          },
        }
      })
    }, [query.sort])

    const visibleRows = useMemo(() => {
      const filtered = filterRows(allRows, String(query.keyword ?? ""))
      const sorted = sortRows(filtered, query)
      const start = (query.page - 1) * query.rowsPerPage
      const end = start + query.rowsPerPage

      return {
        total: sorted.length,
        rows: sorted.slice(start, end),
      }
    }, [query])

    return (
      <Table<TableRowData>
        tableKey="all-cases"
        columnConfig={columns}
        data={visibleRows.rows}
        query={query}
        totalCount={visibleRows.total}
        pagination="Table"
        totalRows
        rowsPer
        sticky
        toolbar={{
          title: "All Cases",
          searchEnabled: true,
        }}
        onQueryChange={setQuery}
      />
    )
  },
}
