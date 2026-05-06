import { useSearchParams } from "react-router-dom"
import type { ProductSortValue } from "../../../entities/product/model/product.types"
import {
  DEFAULT_PAGE,
  DEFAULT_ROWS_PER_PAGE,
  type ViewMode,
  normalizePositiveInt,
  normalizeSortValue,
  normalizeViewMode,
} from "../utils/productQueryParams"

type ProductListQueryPatch = {
  q?: string
  sort?: ProductSortValue
  page?: number
  rows?: number
  view?: ViewMode
}

export const useProductListQueryState = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const committedKeyword = searchParams.get("q") ?? ""
  const querySort = normalizeSortValue(searchParams.get("sort"))
  const queryPage = normalizePositiveInt(searchParams.get("page"), DEFAULT_PAGE)
  const queryRows = normalizePositiveInt(searchParams.get("rows"), DEFAULT_ROWS_PER_PAGE)
  const queryView = normalizeViewMode(searchParams.get("view"))

  const updateQueryParams = (next: ProductListQueryPatch) => {
    const params = new URLSearchParams(searchParams)
    const nextKeyword = next.q ?? committedKeyword
    const nextSort = next.sort ?? querySort
    const nextPage = next.page ?? queryPage
    const nextRows = next.rows ?? queryRows
    const nextView = next.view ?? queryView

    if (nextKeyword.trim()) params.set("q", nextKeyword.trim())
    else params.delete("q")

    if (nextSort === "relevance") params.delete("sort")
    else params.set("sort", nextSort)

    if (nextPage > DEFAULT_PAGE) params.set("page", String(nextPage))
    else params.delete("page")

    if (nextRows !== DEFAULT_ROWS_PER_PAGE) params.set("rows", String(nextRows))
    else params.delete("rows")

    if (nextView === "table") params.delete("view")
    else params.set("view", nextView)

    setSearchParams(params)
  }

  return {
    committedKeyword,
    querySort,
    queryPage,
    queryRows,
    queryView,
    updateQueryParams,
  }
}
