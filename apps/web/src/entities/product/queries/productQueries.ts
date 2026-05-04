import { queryOptions } from "@tanstack/react-query"
import { productApi } from "../api/productApi"
import type { ProductListParams } from "../model/product.types"

export const productQueryKeys = {
  all: ["products"] as const,
  catalog: () => [...productQueryKeys.all, "catalog"] as const,
  lists: () => [...productQueryKeys.all, "list"] as const,
  list: (params: ProductListParams) => [...productQueryKeys.lists(), params] as const,
  details: () => [...productQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...productQueryKeys.details(), id] as const,
}

export const productQueries = {
  list: (params: ProductListParams) =>
    queryOptions({
      queryKey: productQueryKeys.list(params),
      queryFn: () => productApi.list(params),
    }),

  catalog: () =>
    queryOptions({
      queryKey: productQueryKeys.catalog(),
      queryFn: () => productApi.catalog(),
      staleTime: 1000 * 60 * 5,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: productQueryKeys.detail(id),
      queryFn: () => productApi.detail(id),
      enabled: Number.isFinite(id) && id > 0,
    }),
}
