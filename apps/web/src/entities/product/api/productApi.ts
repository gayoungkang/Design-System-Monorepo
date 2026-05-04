import type { Product, ProductListParams, ProductListResponse } from "../model/product.types"

const DUMMY_JSON_BASE_URL = "https://dummyjson.com"

const requestJson = async <TResponse>(path: string): Promise<TResponse> => {
  const response = await fetch(`${DUMMY_JSON_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`DummyJSON request failed: ${response.status} ${response.statusText}`)
  }

  const payload: unknown = await response.json()
  return payload as TResponse
}

export const productApi = {
  list: ({ q, page, limit, sortBy, order }: ProductListParams) => {
    const normalizedPage = Math.max(1, page)
    const normalizedLimit = Math.max(1, limit)
    const skip = (normalizedPage - 1) * normalizedLimit
    const search = q?.trim() ?? ""
    const endpoint = search ? "/products/search" : "/products"
    const params = new URLSearchParams({
      limit: String(normalizedLimit),
      skip: String(skip),
    })

    if (search) params.set("q", search)
    if (sortBy) params.set("sortBy", sortBy)
    if (order) params.set("order", order)

    return requestJson<ProductListResponse>(`${endpoint}?${params.toString()}`)
  },

  catalog: () => requestJson<ProductListResponse>("/products?limit=200&skip=0"),

  detail: (id: number) => requestJson<Product>(`/products/${id}`),
}
