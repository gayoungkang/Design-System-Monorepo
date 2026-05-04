import type {
  Product,
  ProductSortParams,
  ProductSortValue,
  ProductTableRow,
} from "./product.types"

export const PRODUCT_SORT_OPTIONS: { value: ProductSortValue; label: string }[] = [
  { value: "relevance", label: "기본 탐색순" },
  { value: "title-asc", label: "이름 오름차순" },
  { value: "price-asc", label: "현재가 낮은순" },
  { value: "price-desc", label: "현재가 높은순" },
  { value: "rating-desc", label: "지표 높은순" },
  { value: "stock-desc", label: "거래 가능 수량순" },
]

export const toProductSortParams = (value: ProductSortValue): ProductSortParams => {
  switch (value) {
    case "title-asc":
      return { sortBy: "title", order: "asc" }
    case "price-asc":
      return { sortBy: "price", order: "asc" }
    case "price-desc":
      return { sortBy: "price", order: "desc" }
    case "rating-desc":
      return { sortBy: "rating", order: "desc" }
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

export const filterProducts = (products: Product[], keyword: string) => {
  const normalizedKeyword = keyword.trim().toLowerCase()
  if (!normalizedKeyword) return products

  return products.filter((product) =>
    [product.title, product.category, product.brand ?? "", ...product.tags].some((value) =>
      value.toLowerCase().includes(normalizedKeyword),
    ),
  )
}

export const sortProducts = (products: Product[], sort: ProductSortValue) => {
  const nextProducts = [...products]

  switch (sort) {
    case "title-asc":
      return nextProducts.sort((a, b) => a.title.localeCompare(b.title))
    case "price-asc":
      return nextProducts.sort((a, b) => a.price - b.price)
    case "price-desc":
      return nextProducts.sort((a, b) => b.price - a.price)
    case "rating-desc":
      return nextProducts.sort((a, b) => b.rating - a.rating)
    case "stock-desc":
      return nextProducts.sort((a, b) => b.stock - a.stock)
    case "relevance":
      return nextProducts
  }
}

export const summarizeProducts = (products: Product[]) => {
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

export const createProductSuggestions = (products: Product[], keyword: string, limit = 6) => {
  const normalizedKeyword = keyword.trim().toLowerCase()
  if (!normalizedKeyword) return []

  const seen = new Set<string>()
  const suggestions: string[] = []

  for (const product of products) {
    const candidates = [product.title, product.category, product.brand ?? ""]
    for (const candidate of candidates) {
      const normalizedCandidate = candidate.trim()
      if (!normalizedCandidate) continue
      if (!normalizedCandidate.toLowerCase().includes(normalizedKeyword)) continue
      const key = normalizedCandidate.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      suggestions.push(normalizedCandidate)
      if (suggestions.length >= limit) return suggestions
    }
  }

  return suggestions
}

export const toRatingScore = (rating: number) => Math.round((Math.min(5, Math.max(0, rating)) / 5) * 100)

export const toStockScore = (stock: number) => Math.min(100, Math.max(0, stock))
