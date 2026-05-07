import { useMemo, useState } from "react"
import type { Product } from "../../../entities/product/model/product.types"
import {
  createProductCategories,
  filterProductsByFacets,
  filterProductsByQuery,
  sortProducts,
} from "../../../entities/product/model/productUtils"

export type MarketNavValue = "discover" | "search" | "categories" | "saved"

export type MarketFilterDraft = {
  category?: string
}

export const useMarketState = (products: Product[]) => {
  const [navValue, setNavValue] = useState<MarketNavValue>("discover")
  const [searchValue, setSearchValue] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [draftFilter, setDraftFilter] = useState<MarketFilterDraft>({})
  const [appliedFilter, setAppliedFilter] = useState<MarketFilterDraft>({})

  const categories = useMemo(() => createProductCategories(products), [products])

  const visibleProducts = useMemo(() => {
    const searched = filterProductsByQuery(products, searchValue)
    const filtered = filterProductsByFacets(searched, { category: appliedFilter.category })
    return sortProducts(filtered, "rating-desc")
  }, [appliedFilter.category, products, searchValue])

  const applyFilter = () => {
    setAppliedFilter(draftFilter)
    setFilterOpen(false)
  }

  const resetFilter = () => {
    setDraftFilter({})
    setAppliedFilter({})
  }

  const openSearch = () => {
    setNavValue("search")
    window.requestAnimationFrame(() => {
      document
        .querySelector<HTMLInputElement>('input[placeholder="Search products, categories, brands"]')
        ?.focus()
    })
  }

  const openCategories = () => {
    setNavValue("categories")
    setFilterOpen(true)
  }

  const activeFilterCount = appliedFilter.category ? 1 : 0

  return {
    navValue,
    setNavValue,
    searchValue,
    setSearchValue,
    filterOpen,
    setFilterOpen,
    draftFilter,
    setDraftFilter,
    appliedFilter,
    categories,
    visibleProducts,
    activeFilterCount,
    applyFilter,
    resetFilter,
    openSearch,
    openCategories,
  }
}
