export type Product = {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand?: string
  sku?: string
  weight?: number
  warrantyInformation?: string
  shippingInformation?: string
  availabilityStatus?: string
  returnPolicy?: string
  minimumOrderQuantity?: number
  thumbnail: string
  images: string[]
}

export type ProductListResponse = {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export type ProductSortValue =
  | "relevance"
  | "title-asc"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "stock-desc"

export type ProductSortParams = {
  sortBy?: "title" | "price" | "rating" | "stock"
  order?: "asc" | "desc"
}

export type ProductListParams = ProductSortParams & {
  q?: string
  page: number
  limit: number
}

export type ProductTableRow = Product &
  Record<string, unknown> & {
    brandLabel: string
    priceLabel: string
    ratingLabel: string
    stockLabel: string
  }
