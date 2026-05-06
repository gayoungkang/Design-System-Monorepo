import { Box, Button, Flex, Typography, styled, theme } from "@acme/ui"
import type { ColumnProps, SortDirection } from "@acme/ui"
import type {
  ProductSortValue,
  ProductTableRow,
} from "../../../entities/product/model/product.types"
import { formatCurrency } from "../../../entities/product/model/productUtils"

export const PRODUCT_COLUMN_META = [
  { key: "title", title: "종목/상품명", hideable: false },
  { key: "category", title: "섹터", hideable: true },
  { key: "price", title: "현재가", hideable: true },
  { key: "rating", title: "지표", hideable: true },
  { key: "stock", title: "거래 가능 수량", hideable: true },
  { key: "id", title: "작업", hideable: false },
] as const

export const DEFAULT_VISIBLE_COLUMN_KEYS = PRODUCT_COLUMN_META.filter(
  (column) => column.hideable,
).map((column) => column.key)

export const createProductTableColumns = (
  querySort: ProductSortValue,
  setPreviewProduct: (row: ProductTableRow) => void,
  navigateToProductDetail: (productId: number) => void,
  onSortChange: (key: keyof ProductTableRow, direction: SortDirection) => void,
): ColumnProps<ProductTableRow>[] => [
  {
    key: "title",
    title: "종목/상품명",
    width: 300,
    sort: true,
    sortDirection:
      querySort === "title-asc" ? "ASC" : querySort === "title-desc" ? "DESC" : undefined,
    onSortChange,
    render: (row) => (
      <ProductCell>
        <ProductThumb src={row.thumbnail} alt={`${row.title} thumbnail`} />
        <Box>
          <Typography variant="b2Medium" text={row.title} color={theme.colors.text.primary} />
          <Typography
            variant="b3Regular"
            text={row.brandLabel}
            color={theme.colors.text.tertiary}
          />
        </Box>
      </ProductCell>
    ),
  },
  { key: "category", title: "섹터", width: 150 },
  {
    key: "price",
    title: "현재가",
    width: 130,
    sort: true,
    sortDirection:
      querySort === "price-asc" ? "ASC" : querySort === "price-desc" ? "DESC" : undefined,
    onSortChange,
    textAlign: "right",
    render: (row) => formatCurrency(row.price),
  },
  {
    key: "rating",
    title: "지표",
    width: 110,
    sort: true,
    sortDirection:
      querySort === "rating-asc" ? "ASC" : querySort === "rating-desc" ? "DESC" : undefined,
    onSortChange,
    textAlign: "right",
    render: (row) => row.ratingLabel,
  },
  {
    key: "stock",
    title: "거래 가능 수량",
    width: 150,
    sort: true,
    sortDirection:
      querySort === "stock-asc" ? "ASC" : querySort === "stock-desc" ? "DESC" : undefined,
    onSortChange,
    textAlign: "right",
    render: (row) => row.stockLabel,
  },
  {
    key: "id",
    title: "Action",
    width: 190,
    render: (row) => (
      <Flex gap="6px" justify="flex-end">
        <Button
          text="미리보기"
          size="S"
          variant="outlined"
          color="normal"
          onClick={() => setPreviewProduct(row)}
        />
        <Button text="상세보기" size="S" onClick={() => navigateToProductDetail(row.id)} />
      </Flex>
    ),
  },
]

const ProductCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`

const ProductThumb = styled.img`
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius[6]};
  background: ${({ theme }) => theme.colors.background.default};
`
