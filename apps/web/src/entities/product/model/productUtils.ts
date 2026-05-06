import type {
  Product,
  ProductFilterState,
  ProductSortParams,
  ProductSortValue,
  ProductTableRow,
} from "./product.types"

export const PRODUCT_SORT_OPTIONS: { value: ProductSortValue; label: string }[] = [
  { value: "relevance", label: "기본 탐색순" },
  { value: "title-asc", label: "이름 오름차순" },
  { value: "title-desc", label: "이름 내림차순" },
  { value: "price-asc", label: "현재가 낮은순" },
  { value: "price-desc", label: "현재가 높은순" },
  { value: "rating-asc", label: "지표 낮은순" },
  { value: "rating-desc", label: "지표 높은순" },
  { value: "stock-asc", label: "거래 가능 수량 낮은순" },
  { value: "stock-desc", label: "거래 가능 수량순" },
]

export const toProductSortParams = (value: ProductSortValue): ProductSortParams => {
  switch (value) {
    case "title-asc":
      return { sortBy: "title", order: "asc" }
    case "title-desc":
      return { sortBy: "title", order: "desc" }
    case "price-asc":
      return { sortBy: "price", order: "asc" }
    case "price-desc":
      return { sortBy: "price", order: "desc" }
    case "rating-asc":
      return { sortBy: "rating", order: "asc" }
    case "rating-desc":
      return { sortBy: "rating", order: "desc" }
    case "stock-asc":
      return { sortBy: "stock", order: "asc" }
    case "stock-desc":
      return { sortBy: "stock", order: "desc" }
    case "relevance":
      return {}
  }
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value)

export const toProductTableRow = (product: Product): ProductTableRow => ({
  ...product,
  brandLabel: product.brand ?? "No brand",
  priceLabel: formatCurrency(product.price),
  ratingLabel: product.rating.toFixed(1),
  stockLabel: product.stock.toLocaleString(),
})

export const filterProductsByQuery = (products: Product[], keyword: string) => {
  const normalizedKeyword = keyword.trim().toLowerCase()
  if (!normalizedKeyword) return products

  return products.filter((product) =>
    [product.title, product.category, product.brand ?? ""].some((value) =>
      value.toLowerCase().includes(normalizedKeyword),
    ),
  )
}

export const filterProductsByFacets = (products: Product[], filters: ProductFilterState) => {
  const category = filters.category?.trim().toLowerCase()
  const minRating = filters.minRating ?? 0
  const inStockOnly = Boolean(filters.inStockOnly)

  return products.filter((product) => {
    if (category && product.category.toLowerCase() !== category) return false
    if (minRating > 0 && product.rating < minRating) return false
    if (inStockOnly && product.stock <= 0) return false
    return true
  })
}

export const createProductCategories = (products: Product[]) =>
  Array.from(new Set(products.map((product) => product.category).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  )

export const countActiveProductFilters = (filters: ProductFilterState) => {
  let count = 0
  if (filters.category?.trim()) count += 1
  if ((filters.minRating ?? 0) > 0) count += 1
  if (filters.inStockOnly) count += 1
  return count
}

export const toProductTableFilters = (filters: ProductFilterState) => {
  const out: { key: string; operator?: string; value?: unknown }[] = []
  if (filters.category?.trim()) out.push({ key: "category", operator: "eq", value: filters.category })
  if ((filters.minRating ?? 0) > 0) out.push({ key: "rating", operator: "gte", value: filters.minRating })
  if (filters.inStockOnly) out.push({ key: "stock", operator: "gt", value: 0 })
  return out
}

export const sortProducts = (products: Product[], sort: ProductSortValue) => {
  const nextProducts = [...products]

  switch (sort) {
    case "title-asc":
      return nextProducts.sort((a, b) => a.title.localeCompare(b.title))
    case "title-desc":
      return nextProducts.sort((a, b) => b.title.localeCompare(a.title))
    case "price-asc":
      return nextProducts.sort((a, b) => a.price - b.price)
    case "price-desc":
      return nextProducts.sort((a, b) => b.price - a.price)
    case "rating-asc":
      return nextProducts.sort((a, b) => a.rating - b.rating)
    case "rating-desc":
      return nextProducts.sort((a, b) => b.rating - a.rating)
    case "stock-asc":
      return nextProducts.sort((a, b) => a.stock - b.stock)
    case "stock-desc":
      return nextProducts.sort((a, b) => b.stock - a.stock)
    case "relevance":
      return nextProducts
  }
}

export const createProductSummary = (products: Product[]) => {
  const count = products.length
  const totalPrice = products.reduce((sum, product) => sum + product.price, 0)
  const totalRating = products.reduce((sum, product) => sum + product.rating, 0)
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0)

  return {
    count,
    averagePrice: count ? totalPrice / count : 0,
    averageRating: count ? totalRating / count : 0,
    totalStock,
  }
}

export const paginateProducts = (products: Product[], page: number, rowsPerPage: number) => {
  const safePage = Math.max(1, Math.floor(page))
  const safeRowsPerPage = Math.max(1, Math.floor(rowsPerPage))
  const start = (safePage - 1) * safeRowsPerPage
  return products.slice(start, start + safeRowsPerPage)
}

export const filterProducts = filterProductsByQuery
export const summarizeProducts = createProductSummary

export const createProductSuggestions = (products: Product[], keyword: string, limit = 8) => {
  const normalizedKeyword = keyword.trim().toLowerCase()
  if (!normalizedKeyword) return []

  const seen = new Set<string>()
  const prefixMatches: string[] = []
  const containsMatches: string[] = []

  for (const product of products) {
    const candidates = [product.title, product.category, product.brand ?? ""]
    for (const candidate of candidates) {
      const normalizedCandidate = candidate.trim()
      if (!normalizedCandidate) continue
      const key = normalizedCandidate.toLowerCase()
      if (!key.includes(normalizedKeyword)) continue
      if (seen.has(key)) continue
      seen.add(key)

      if (key.startsWith(normalizedKeyword)) prefixMatches.push(normalizedCandidate)
      else containsMatches.push(normalizedCandidate)
    }
  }

  return [...prefixMatches, ...containsMatches].slice(0, limit)
}

export const toRatingScore = (rating: number) => Math.round((Math.min(5, Math.max(0, rating)) / 5) * 100)

export const toStockScore = (stock: number) => Math.min(100, Math.max(0, stock))
