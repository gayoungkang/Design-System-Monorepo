import { useEffect, useState } from "react"
import type {
  ProductFilterState,
  ProductSortValue,
} from "../../../entities/product/model/product.types"
import { INFINITE_BATCH_SIZE, type ViewMode } from "../utils/productQueryParams"
import { DEFAULT_VISIBLE_COLUMN_KEYS } from "../utils/productTableColumns"
import type { ProductListFilterState } from "./useProductScrollRestore"
import { writeStoredFilters } from "./useProductScrollRestore"

type ProductQueryPatch = {
  q?: string
  sort?: ProductSortValue
  page?: number
  rows?: number
  view?: ViewMode
}

type ProductToolbarStateParams = {
  committedKeyword: string
  querySort: ProductSortValue
  restoredFilterState: ProductListFilterState | null
  updateParams: (next: ProductQueryPatch) => void
}

const EMPTY_PRODUCT_FILTERS: ProductFilterState = {}

export const useProductToolbarState = ({
  committedKeyword,
  querySort,
  restoredFilterState,
  updateParams,
}: ProductToolbarStateParams) => {
  const [tableSearchValue, setTableSearchValue] = useState(
    restoredFilterState?.tableSearchValue ?? "",
  )
  const [appliedFilters, setAppliedFilters] = useState<ProductFilterState>(
    restoredFilterState?.appliedFilters ?? EMPTY_PRODUCT_FILTERS,
  )
  const [draftFilters, setDraftFilters] = useState<ProductFilterState>(
    restoredFilterState?.draftFilters ?? EMPTY_PRODUCT_FILTERS,
  )
  const [draftSort, setDraftSort] = useState<ProductSortValue>(
    restoredFilterState?.draftSort ?? querySort,
  )
  const [filterOpen, setFilterOpen] = useState(false)
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(DEFAULT_VISIBLE_COLUMN_KEYS)
  const [infiniteLimit, setInfiniteLimit] = useState(INFINITE_BATCH_SIZE)

  useEffect(() => {
    setInfiniteLimit(INFINITE_BATCH_SIZE)
  }, [committedKeyword, querySort])

  useEffect(() => {
    setDraftSort(querySort)
  }, [querySort])

  useEffect(() => {
    writeStoredFilters({
      appliedFilters,
      draftFilters,
      tableSearchValue,
      draftSort,
      savedAt: Date.now(),
    })
  }, [appliedFilters, draftFilters, draftSort, tableSearchValue])

  const applyFilters = () => {
    setAppliedFilters(draftFilters)
    updateParams({ sort: draftSort, page: 1 })
  }

  const resetFilters = () => {
    setDraftFilters(EMPTY_PRODUCT_FILTERS)
    setAppliedFilters(EMPTY_PRODUCT_FILTERS)
    setDraftSort("relevance")
    updateParams({ sort: "relevance", page: 1 })
  }

  const handleToolbarSearchChange = (value: string) => {
    setTableSearchValue(value)
    setInfiniteLimit(INFINITE_BATCH_SIZE)
    updateParams({ page: 1 })
  }

  return {
    tableSearchValue,
    setTableSearchValue,
    appliedFilters,
    draftFilters,
    setDraftFilters,
    draftSort,
    setDraftSort,
    filterOpen,
    setFilterOpen,
    visibleColumnKeys,
    setVisibleColumnKeys,
    infiniteLimit,
    setInfiniteLimit,
    applyFilters,
    resetFilters,
    handleToolbarSearchChange,
  }
}
