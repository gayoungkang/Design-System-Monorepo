import { CheckBox, Flex, Select } from "@acme/ui"
import type {
  ProductFilterState,
  ProductSortValue,
} from "../../../entities/product/model/product.types"
import { PRODUCT_SORT_OPTIONS } from "../../../entities/product/model/productUtils"

type ProductToolbarSectionProps = {
  draftSort: ProductSortValue
  onDraftSortChange: (value: ProductSortValue) => void
  draftFilters: ProductFilterState
  onDraftFiltersChange: (updater: (prev: ProductFilterState) => ProductFilterState) => void
  categoryOptions: { value: string; label: string }[]
}

const ProductToolbarSection = ({
  draftSort,
  onDraftSortChange,
  draftFilters,
  onDraftFiltersChange,
  categoryOptions,
}: ProductToolbarSectionProps) => (
  <Flex gap="12px" align="end" wrap="wrap">
    <Select<ProductSortValue>
      label="정렬"
      size="S"
      width={200}
      value={draftSort}
      options={PRODUCT_SORT_OPTIONS}
      onChange={(value) => onDraftSortChange(value ?? "relevance")}
    />
    <Select<string>
      label="섹터"
      size="S"
      width={180}
      value={draftFilters.category ?? "all"}
      options={categoryOptions}
      onChange={(value) =>
        onDraftFiltersChange((prev) => ({
          ...prev,
          category: value && value !== "all" ? value : undefined,
        }))
      }
    />
    <Select<string>
      label="최소 평점"
      size="S"
      width={140}
      value={String(draftFilters.minRating ?? 0)}
      options={[
        { value: "0", label: "전체" },
        { value: "3", label: "3.0+" },
        { value: "4", label: "4.0+" },
        { value: "4.5", label: "4.5+" },
      ]}
      onChange={(value) =>
        onDraftFiltersChange((prev) => ({
          ...prev,
          minRating: Number(value ?? 0) || undefined,
        }))
      }
    />
    <CheckBox
      label="재고 있음"
      checked={Boolean(draftFilters.inStockOnly)}
      onChange={(checked) =>
        onDraftFiltersChange((prev) => ({ ...prev, inStockOnly: checked || undefined }))
      }
    />
  </Flex>
)

export default ProductToolbarSection
