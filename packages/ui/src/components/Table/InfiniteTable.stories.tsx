import type { Meta, StoryObj } from "@storybook/react"
import { useMemo, useState } from "react"
import InfiniteTable from "./InfiniteTable"
import type { ColumnProps, ServerTableQuery } from "./@Types/table"

type Row = {
  id: number
  name: string
  team: string
}

const allRows: Row[] = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  team: ["Frontend", "Backend", "Design"][index % 3],
}))

const columnConfig: ColumnProps<Row>[] = [
  { key: "id", title: "ID", width: 100 },
  { key: "name", title: "Name", width: 220 },
  { key: "team", title: "Team", width: 180 },
]

const filterRows = (rows: Row[], keyword: string) => {
  const normalizedKeyword = keyword.trim().toLowerCase()

  if (!normalizedKeyword) return rows

  return rows.filter(
    (row) =>
      String(row.id).includes(normalizedKeyword) ||
      row.name.toLowerCase().includes(normalizedKeyword) ||
      row.team.toLowerCase().includes(normalizedKeyword),
  )
}

const meta: Meta<typeof InfiniteTable<Row>> = {
  title: "Data Display/InfiniteTable",
  component: InfiniteTable<Row>,
}

export default meta

type Story = StoryObj<typeof InfiniteTable<Row>>

export const Playground: Story = {
  render: () => {
    const [query, setQuery] = useState<ServerTableQuery>({
      page: 1,
      rowsPerPage: 20,
      keyword: "",
    })
    const [visibleCount, setVisibleCount] = useState(20)

    const filteredRows = useMemo(
      () => filterRows(allRows, String(query.keyword ?? "")),
      [query.keyword],
    )

    const visibleRows = filteredRows.slice(0, visibleCount)

    return (
      <InfiniteTable<Row>
        tableKey="playground"
        columnConfig={columnConfig}
        data={visibleRows}
        query={query}
        totalCount={filteredRows.length}
        hasMore={visibleCount < filteredRows.length}
        loadMore={() => {
          setVisibleCount((prev) => Math.min(prev + 20, filteredRows.length))
        }}
        toolbar={{
          title: "Users",
          searchEnabled: true,
        }}
        onQueryChange={(next) => {
          setQuery(next)
          if (String(next.keyword ?? "") !== String(query.keyword ?? "")) {
            setVisibleCount(20)
          }
        }}
      />
    )
  },
}

export const Loading: Story = {
  render: () => (
    <InfiniteTable<Row>
      tableKey="loading"
      columnConfig={columnConfig}
      data={allRows.slice(0, 20)}
      query={{ page: 1, rowsPerPage: 20, keyword: "" }}
      hasMore
      loading
      onQueryChange={() => {}}
    />
  ),
}

export const EmptyState: Story = {
  render: () => (
    <InfiniteTable<Row>
      tableKey="empty"
      columnConfig={columnConfig}
      data={[]}
      query={{ page: 1, rowsPerPage: 20, keyword: "" }}
      emptyRowText="검색 결과가 없습니다."
      onQueryChange={() => {}}
    />
  ),
}

export const WithToolbar: Story = {
  render: () => {
    const [query, setQuery] = useState<ServerTableQuery>({
      page: 1,
      rowsPerPage: 20,
      keyword: "",
    })

    const filteredRows = useMemo(
      () => filterRows(allRows, String(query.keyword ?? "")),
      [query.keyword],
    )

    return (
      <InfiniteTable<Row>
        tableKey="toolbar"
        columnConfig={columnConfig}
        data={filteredRows.slice(0, 20)}
        query={query}
        totalCount={filteredRows.length}
        toolbar={{
          title: "Toolbar Users",
          searchEnabled: true,
        }}
        onQueryChange={setQuery}
      />
    )
  },
}

export const Virtualized: Story = {
  render: () => (
    <InfiniteTable<Row>
      tableKey="virtualized"
      columnConfig={columnConfig}
      data={allRows}
      query={{ page: 1, rowsPerPage: 100, keyword: "" }}
      height={320}
      virtualized={{
        enabled: true,
        rowHeight: 32,
        overscan: 6,
      }}
      onQueryChange={() => {}}
    />
  ),
}

export const Disabled: Story = {
  render: () => (
    <InfiniteTable<Row>
      tableKey="disabled"
      columnConfig={columnConfig}
      data={allRows.slice(0, 20)}
      query={{ page: 1, rowsPerPage: 20, keyword: "" }}
      toolbar={{
        title: "Disabled Users",
        searchEnabled: true,
      }}
      disabled
      onQueryChange={() => {}}
    />
  ),
}

export const AllCases: Story = {
  render: () => {
    const [query, setQuery] = useState<ServerTableQuery>({
      page: 1,
      rowsPerPage: 20,
      keyword: "",
    })
    const [visibleCount, setVisibleCount] = useState(20)

    const filteredRows = useMemo(
      () => filterRows(allRows, String(query.keyword ?? "")),
      [query.keyword],
    )

    const rows = filteredRows.slice(0, visibleCount)

    return (
      <InfiniteTable<Row>
        tableKey="all-cases"
        columnConfig={columnConfig}
        data={rows}
        query={query}
        totalCount={filteredRows.length}
        hasMore={visibleCount < filteredRows.length}
        loadMore={() => {
          setVisibleCount((prev) => Math.min(prev + 20, filteredRows.length))
        }}
        toolbar={{
          title: "All Cases",
          searchEnabled: true,
        }}
        virtualized={{
          enabled: true,
          rowHeight: 32,
          overscan: 6,
        }}
        onQueryChange={(next) => {
          setQuery(next)
          if (String(next.keyword ?? "") !== String(query.keyword ?? "")) {
            setVisibleCount(20)
          }
        }}
      />
    )
  },
}
