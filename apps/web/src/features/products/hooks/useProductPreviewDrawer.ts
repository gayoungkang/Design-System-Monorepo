import { useState } from "react"
import type { ProductTableRow } from "../../../entities/product/model/product.types"

export const useProductPreviewDrawer = () => {
  const [previewProduct, setPreviewProduct] = useState<ProductTableRow | null>(null)

  return {
    previewProduct,
    openPreview: setPreviewProduct,
    closePreview: () => setPreviewProduct(null),
  }
}
