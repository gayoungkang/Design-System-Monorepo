import { useQuery } from "@tanstack/react-query"
import { productQueries } from "../../../entities/product/queries/productQueries"

export const useMarketProducts = () => {
  return useQuery(productQueries.catalog())
}
