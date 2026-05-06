import { useCallback, useEffect, useRef } from "react"
import type { RefObject } from "react"
import type { Location } from "react-router-dom"
import type {
  ProductFilterState,
  ProductSortValue,
} from "../../../entities/product/model/product.types"
import { PRODUCT_SORT_OPTIONS } from "../../../entities/product/model/productUtils"
import type { ViewMode } from "../utils/productQueryParams"

const LIST_SCROLL_STORAGE_KEY = "products:list-scroll"
const LIST_FILTER_STORAGE_KEY = "products:list-filters"
const SCROLL_RESTORE_MAX_AGE_MS = 1000 * 60 * 30

type ProductListScrollState = {
  pathname: string
  search: string
  tableBodyScrollTop: number
  windowScrollY: number
  selectedProductId?: number
  savedAt: number
}

export type ProductListFilterState = {
  appliedFilters: ProductFilterState
  draftFilters: ProductFilterState
  tableSearchValue: string
  draftSort: ProductSortValue
  savedAt: number
}

type ProductScrollRestoreParams = {
  tableSectionRef: RefObject<HTMLElement | null>
  location: Location
  isInitialLoading: boolean
  isError: boolean
  queryView: ViewMode
  rowCount: number
  getFilterState: () => Omit<ProductListFilterState, "savedAt">
}

export const readStoredFilters = (): ProductListFilterState | null => {
  if (typeof window === "undefined") return null

  try {
    const raw = window.sessionStorage.getItem(LIST_FILTER_STORAGE_KEY)
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    if (!isProductListFilterState(value)) return null
    if (Date.now() - value.savedAt > SCROLL_RESTORE_MAX_AGE_MS) return null
    return value
  } catch {
    return null
  }
}

export const writeStoredFilters = (value: ProductListFilterState) => {
  if (typeof window === "undefined") return
  window.sessionStorage.setItem(LIST_FILTER_STORAGE_KEY, JSON.stringify(value))
}

export const useProductScrollRestore = ({
  tableSectionRef,
  location,
  isInitialLoading,
  isError,
  queryView,
  rowCount,
  getFilterState,
}: ProductScrollRestoreParams) => {
  const restoredScrollRef = useRef(false)
  const scrollSaveFrameRef = useRef<number | null>(null)

  const getTableBodyScrollElement = useCallback(() => {
    const root = tableSectionRef.current
    if (!root) return null

    return (
      Array.from(root.querySelectorAll<HTMLElement>("div")).find((element) => {
        const style = window.getComputedStyle(element)
        const isScrollable = style.overflowY === "auto" || style.overflowY === "scroll"
        return isScrollable && element.scrollHeight > element.clientHeight
      }) ?? null
    )
  }, [tableSectionRef])

  const saveListState = useCallback(
    (selectedProductId?: number) => {
      if (typeof window === "undefined") return

      const tableBody = getTableBodyScrollElement()
      const savedAt = Date.now()
      const scrollState: ProductListScrollState = {
        pathname: location.pathname,
        search: location.search,
        tableBodyScrollTop: tableBody?.scrollTop ?? 0,
        windowScrollY: window.scrollY,
        selectedProductId,
        savedAt,
      }
      const filterState: ProductListFilterState = {
        ...getFilterState(),
        savedAt,
      }

      window.sessionStorage.setItem(LIST_SCROLL_STORAGE_KEY, JSON.stringify(scrollState))
      window.sessionStorage.setItem(LIST_FILTER_STORAGE_KEY, JSON.stringify(filterState))
    },
    [getFilterState, getTableBodyScrollElement, location.pathname, location.search],
  )

  useEffect(() => {
    if (restoredScrollRef.current) return
    if (isInitialLoading || isError) return

    const stored = readStoredScroll()
    if (!stored) return
    if (stored.pathname !== location.pathname || stored.search !== location.search) return
    if (Date.now() - stored.savedAt > SCROLL_RESTORE_MAX_AGE_MS) return

    restoredScrollRef.current = true
    let secondFrame: number | null = null
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        const tableBody = getTableBodyScrollElement()
        if (tableBody) tableBody.scrollTop = stored.tableBodyScrollTop
        window.scrollTo({ top: stored.windowScrollY })
      })
    })

    return () => {
      window.cancelAnimationFrame(firstFrame)
      if (secondFrame !== null) window.cancelAnimationFrame(secondFrame)
    }
  }, [getTableBodyScrollElement, isError, isInitialLoading, location.pathname, location.search, rowCount])

  useEffect(() => {
    const tableBody = getTableBodyScrollElement()
    if (!tableBody) return

    const handleScroll = () => {
      if (scrollSaveFrameRef.current !== null) return
      scrollSaveFrameRef.current = window.requestAnimationFrame(() => {
        scrollSaveFrameRef.current = null
        saveListState()
      })
    }

    tableBody.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      tableBody.removeEventListener("scroll", handleScroll)
      if (scrollSaveFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollSaveFrameRef.current)
        scrollSaveFrameRef.current = null
      }
    }
  }, [getTableBodyScrollElement, queryView, rowCount, saveListState])

  return { saveListState }
}

const readStoredScroll = (): ProductListScrollState | null => {
  if (typeof window === "undefined") return null

  try {
    const raw = window.sessionStorage.getItem(LIST_SCROLL_STORAGE_KEY)
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    if (!isProductListScrollState(value)) return null
    return value
  } catch {
    return null
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const isProductSortValue = (value: unknown): value is ProductSortValue =>
  typeof value === "string" && PRODUCT_SORT_OPTIONS.some((option) => option.value === value)

const isProductFilterState = (value: unknown): value is ProductFilterState => {
  if (!isRecord(value)) return false
  const category = value.category
  const minRating = value.minRating
  const inStockOnly = value.inStockOnly

  return (
    (category === undefined || typeof category === "string") &&
    (minRating === undefined || typeof minRating === "number") &&
    (inStockOnly === undefined || typeof inStockOnly === "boolean")
  )
}

const isProductListScrollState = (value: unknown): value is ProductListScrollState => {
  if (!isRecord(value)) return false

  return (
    typeof value.pathname === "string" &&
    typeof value.search === "string" &&
    typeof value.tableBodyScrollTop === "number" &&
    typeof value.windowScrollY === "number" &&
    (value.selectedProductId === undefined || typeof value.selectedProductId === "number") &&
    typeof value.savedAt === "number"
  )
}

const isProductListFilterState = (value: unknown): value is ProductListFilterState => {
  if (!isRecord(value)) return false

  return (
    isProductFilterState(value.appliedFilters) &&
    isProductFilterState(value.draftFilters) &&
    typeof value.tableSearchValue === "string" &&
    isProductSortValue(value.draftSort) &&
    typeof value.savedAt === "number"
  )
}
