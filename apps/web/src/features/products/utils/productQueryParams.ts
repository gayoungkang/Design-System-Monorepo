import type { ServerTableQuery, SortDirection } from "@acme/ui"
import type {
  ProductSortValue,
  ProductTableRow,
} from "../../../entities/product/model/product.types"
import { PRODUCT_SORT_OPTIONS } from "../../../entities/product/model/productUtils"

export const DEFAULT_PAGE = 1
export const DEFAULT_ROWS_PER_PAGE = 10
export const INFINITE_BATCH_SIZE = 12

export type ViewMode = "table" | "infinite"

export const normalizePositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return Math.floor(parsed)
}

export const normalizeSortValue = (value: string | null): ProductSortValue => {
  if (PRODUCT_SORT_OPTIONS.some((option) => option.value === value))
    return value as ProductSortValue
  return "relevance"
}

export const normalizeViewMode = (value: string | null): ViewMode =>
  value === "infinite" ? "infinite" : "table"

export const toServerSort = (sort: ProductSortValue): ServerTableQuery["sort"] => {
  switch (sort) {
    case "title-asc":
      return { key: "title", direction: "ASC" }
    case "title-desc":
      return { key: "title", direction: "DESC" }
    case "price-asc":
      return { key: "price", direction: "ASC" }
    case "price-desc":
      return { key: "price", direction: "DESC" }
    case "rating-asc":
      return { key: "rating", direction: "ASC" }
    case "rating-desc":
      return { key: "rating", direction: "DESC" }
    case "stock-asc":
      return { key: "stock", direction: "ASC" }
    case "stock-desc":
      return { key: "stock", direction: "DESC" }
    case "relevance":
      return undefined
  }
}

export const fromServerSort = (
  sort: ServerTableQuery["sort"],
  fallback: ProductSortValue,
): ProductSortValue => {
  if (!sort) return fallback
  if (sort.key === "title") return sort.direction === "ASC" ? "title-asc" : "title-desc"
  if (sort.key === "price") return sort.direction === "ASC" ? "price-asc" : "price-desc"
  if (sort.key === "rating") return sort.direction === "ASC" ? "rating-asc" : "rating-desc"
  if (sort.key === "stock") return sort.direction === "ASC" ? "stock-asc" : "stock-desc"
  return fallback
}

export const toProductSortValue = (
  key: keyof ProductTableRow,
  direction: SortDirection,
): ProductSortValue => {
  if (key === "title") return direction === "ASC" ? "title-asc" : "title-desc"
  if (key === "price") return direction === "ASC" ? "price-asc" : "price-desc"
  if (key === "rating") return direction === "ASC" ? "rating-asc" : "rating-desc"
  if (key === "stock") return direction === "ASC" ? "stock-asc" : "stock-desc"
  return "relevance"
}
