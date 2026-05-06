import { useMemo } from "react"
import type {
  ColumnProps,
  ServerTableQuery,
  SortDirection,
  TableToolBarProps,
  TableToolbarProps,
} from "@acme/ui"
import type {
  ProductFilterState,
  ProductSortValue,
  ProductTableRow,
} from "../../../entities/product/model/product.types"
import {
  fromServerSort,
  toProductSortValue,
  toServerSort,
  type ViewMode,
} from "../utils/productQueryParams"
import {
  DEFAULT_VISIBLE_COLUMN_KEYS,
  PRODUCT_COLUMN_META,
  createProductTableColumns,
} from "../utils/productTableColumns"
import { exportProductRowsToCsv, type ProductExportType } from "../utils/productExport"
import ProductToolbarSection from "../sections/ProductToolbarSection"

type ProductQueryPatch = {
  q?: string
  sort?: ProductSortValue
  page?: number
  rows?: number
  view?: ViewMode
}

type ProductTableConfigParams = {
  queryPage: number
  queryRows: number
  querySort: ProductSortValue
  tableSearchValue: string
  setTableSearchValue: (value: string) => void
  tableFilters: ServerTableQuery["filters"]
  visibleColumnKeys: string[]
  setVisibleColumnKeys: (keys: string[]) => void
  exportRows: ProductTableRow[]
  activeFilterCount: number
  filterOpen: boolean
  setFilterOpen: (open: boolean) => void
  draftSort: ProductSortValue
  setDraftSort: (value: ProductSortValue) => void
  draftFilters: ProductFilterState
  setDraftFilters: (updater: (prev: ProductFilterState) => ProductFilterState) => void
  categoryOptions: { value: string; label: string }[]
  applyFilters: () => void
  resetFilters: () => void
  handleToolbarSearchChange: (value: string) => void
  openPreview: (row: ProductTableRow) => void
  navigateToProductDetail: (productId: number) => void
  updateParams: (next: ProductQueryPatch) => void
}

export const useProductTableConfig = ({
  queryPage,
  queryRows,
  querySort,
  tableSearchValue,
  setTableSearchValue,
  tableFilters,
  visibleColumnKeys,
  setVisibleColumnKeys,
  exportRows,
  activeFilterCount,
  filterOpen,
  setFilterOpen,
  draftSort,
  setDraftSort,
  draftFilters,
  setDraftFilters,
  categoryOptions,
  applyFilters,
  resetFilters,
  handleToolbarSearchChange,
  openPreview,
  navigateToProductDetail,
  updateParams,
}: ProductTableConfigParams) => {
  function updateSortFromHeader(key: keyof ProductTableRow, direction: SortDirection) {
    const nextSort = toProductSortValue(key, direction)
    updateParams({ sort: nextSort, page: 1 })
  }

  const columns = useMemo<ColumnProps<ProductTableRow>[]>(
    () =>
      createProductTableColumns(
        querySort,
        openPreview,
        navigateToProductDetail,
        updateSortFromHeader,
      ),
    [navigateToProductDetail, openPreview, querySort],
  )
  const visibleColumnSet = useMemo(() => new Set(visibleColumnKeys), [visibleColumnKeys])
  const visibleColumns = useMemo(
    () =>
      columns.filter((column) => {
        const meta = PRODUCT_COLUMN_META.find((item) => item.key === String(column.key))
        if (meta?.hideable === false) return true
        return visibleColumnSet.has(String(column.key))
      }),
    [columns, visibleColumnSet],
  )

  const tableQuery: ServerTableQuery = useMemo(
    () => ({
      page: queryPage,
      rowsPerPage: queryRows,
      keyword: tableSearchValue,
      sort: toServerSort(querySort),
      filters: tableFilters,
    }),
    [queryPage, queryRows, querySort, tableFilters, tableSearchValue],
  )

  const handleQueryChange = (next: ServerTableQuery) => {
    setTableSearchValue(next.keyword)
    updateParams({
      page: next.rowsPerPage !== queryRows ? 1 : next.page,
      rows: next.rowsPerPage,
      sort: fromServerSort(next.sort, querySort),
    })
  }

  const handleExport = (type: ProductExportType) => {
    if (type !== "csv") return
    exportProductRowsToCsv(exportRows, visibleColumns)
  }

  const toolbarBase = {
    title: "마켓 목록",
    searchEnabled: true,
    searchValue: tableSearchValue,
    searchPlaceholder: "테이블 검색",
    onSearchChange: handleToolbarSearchChange,
    columnVisibilityEnabled: true,
    columns: PRODUCT_COLUMN_META.map((column) => ({ ...column })),
    visibleColumnKeys,
    defaultVisibleColumnKeys: DEFAULT_VISIBLE_COLUMN_KEYS,
    onVisibleColumnKeysChange: setVisibleColumnKeys,
    columnsSkeletonEnabled: false,
    exportEnabled: true,
    exportItems: [{ type: "csv" as const, label: "CSV 다운로드" }],
    onExport: (type: string) => {
      if (type === "csv") handleExport("csv")
    },
    filterEnabled: true,
    filterActiveCount: activeFilterCount + (querySort === "relevance" ? 0 : 1),
    filterOpen,
    onFilterOpenChange: setFilterOpen,
    filterDrawerVariant: "flex" as const,
    filterDrawerPlacement: "top" as const,
    filterDrawerHeight: 190,
    filterSkeletonEnabled: false,
    onFilterSearch: applyFilters,
    onFilterReset: resetFilters,
    filterContent: (
      <ProductToolbarSection
        draftSort={draftSort}
        onDraftSortChange={setDraftSort}
        draftFilters={draftFilters}
        onDraftFiltersChange={setDraftFilters}
        categoryOptions={categoryOptions}
      />
    ),
  }
  const tableToolbar: TableToolbarProps<ProductExportType> = {
    ...toolbarBase,
    exportEnabled: true,
    exportItems: [{ type: "csv", label: "CSV 다운로드" }],
    onExport: (type) => {
      if (type === "csv") handleExport("csv")
    },
  }
  const infiniteToolbar: TableToolBarProps = {
    ...toolbarBase,
    exportEnabled: true,
    exportItems: [{ type: "csv", label: "CSV 다운로드" }],
    onExport: (type) => {
      if (type === "csv") handleExport("csv")
    },
  }

  return {
    visibleColumns,
    tableQuery,
    tableToolbar,
    infiniteToolbar,
    handleQueryChange,
    handleExport,
  }
}
