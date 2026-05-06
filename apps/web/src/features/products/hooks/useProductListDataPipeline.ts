import { useMemo } from "react"
import type { Product, ProductFilterState, ProductSortValue } from "../../../entities/product/model/product.types"
import {
  countActiveProductFilters,
  createProductCategories,
  createProductSummary,
  filterProductsByFacets,
  filterProductsByQuery,
  paginateProducts,
  sortProducts,
  toProductTableFilters,
  toProductTableRow,
} from "../../../entities/product/model/productUtils"

type ProductListDataPipelineParams = {
  catalogProducts: Product[]
  committedKeyword: string
  tableSearchValue: string
  appliedFilters: ProductFilterState
  querySort: ProductSortValue
  queryPage: number
  queryRows: number
  infiniteLimit: number
}

export const useProductListDataPipeline = ({
  catalogProducts,
  committedKeyword,
  tableSearchValue,
  appliedFilters,
  querySort,
  queryPage,
  queryRows,
  infiniteLimit,
}: ProductListDataPipelineParams) => {
  const searchFilteredProducts = useMemo(
    () => filterProductsByQuery(catalogProducts, committedKeyword),
    [catalogProducts, committedKeyword],
  )
  const tableSearchFilteredProducts = useMemo(
    () => filterProductsByQuery(searchFilteredProducts, tableSearchValue),
    [searchFilteredProducts, tableSearchValue],
  )
  const filteredProducts = useMemo(
    () => filterProductsByFacets(tableSearchFilteredProducts, appliedFilters),
    [appliedFilters, tableSearchFilteredProducts],
  )
  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, querySort),
    [filteredProducts, querySort],
  )
  const summary = useMemo(() => createProductSummary(sortedProducts), [sortedProducts])
  const pageCount = Math.max(1, Math.ceil(sortedProducts.length / queryRows))
  const tableRows = useMemo(
    () => paginateProducts(sortedProducts, queryPage, queryRows).map(toProductTableRow),
    [queryPage, queryRows, sortedProducts],
  )
  const infiniteRows = useMemo(
    () => sortedProducts.slice(0, infiniteLimit).map(toProductTableRow),
    [infiniteLimit, sortedProducts],
  )
  const categoryOptions = useMemo(
    () => [
      { value: "all", label: "전체 섹터" },
      ...createProductCategories(catalogProducts).map((category) => ({
        value: category,
        label: category,
      })),
    ],
    [catalogProducts],
  )
  const activeFilterCount = useMemo(
    () => countActiveProductFilters(appliedFilters),
    [appliedFilters],
  )
  const tableFilters = useMemo(() => toProductTableFilters(appliedFilters), [appliedFilters])
  const hasMore = infiniteRows.length < sortedProducts.length
  const exportRows = useMemo(() => sortedProducts.map(toProductTableRow), [sortedProducts])

  return {
    sortedProducts,
    summary,
    pageCount,
    tableRows,
    infiniteRows,
    categoryOptions,
    activeFilterCount,
    tableFilters,
    hasMore,
    exportRows,
  }
}
