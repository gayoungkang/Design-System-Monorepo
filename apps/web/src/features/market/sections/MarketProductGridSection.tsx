import { Box, Button, ImageList, Skeleton, Typography, theme } from "@acme/ui"
import type { Product } from "../../../entities/product/model/product.types"
import MarketProductCard from "../components/MarketProductCard"

type MarketProductGridSectionProps = {
  products: Product[]
  loading: boolean
  errorMessage?: string
  onRetry: () => void
  onOpenProduct: (product: Product) => void
}

const MarketProductGridSection = ({
  products,
  loading,
  errorMessage,
  onRetry,
  onOpenProduct,
}: MarketProductGridSectionProps) => {
  if (loading) {
    return (
      <Box as="section" aria-label="Loading market products">
        <ImageList cols={{ base: 1, tablet: 2, desktop: 4 }} gap={14} variant="masonry">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} variant="rounded" height={index % 3 === 0 ? "280px" : "220px"} />
          ))}
        </ImageList>
      </Box>
    )
  }

  if (errorMessage) {
    return (
      <StatePanel role="alert">
        <Typography variant="h3" text="상품을 불러오지 못했습니다." color={theme.colors.error[500]} />
        <Typography variant="b2Regular" text={errorMessage} color={theme.colors.text.secondary} />
        <Button text="다시 시도" onClick={onRetry} />
      </StatePanel>
    )
  }

  if (products.length === 0) {
    return (
      <StatePanel>
        <Typography variant="h3" text="검색 결과가 없습니다." color={theme.colors.text.primary} />
        <Typography
          variant="b2Regular"
          text="검색어를 줄이거나 필터를 초기화해 더 많은 이미지를 탐색해보세요."
          color={theme.colors.text.secondary}
        />
      </StatePanel>
    )
  }

  return (
    <Box as="section" aria-label="Market product grid">
      <ImageList
        cols={{ base: 1, tablet: 2, desktop: 4 }}
        gap={14}
        variant="masonry"
        ariaLabel="Market products"
      >
        {products.map((product) => (
          <MarketProductCard key={product.id} product={product} onOpen={onOpenProduct} />
        ))}
      </ImageList>
    </Box>
  )
}

const StatePanel = ({ children, ...props }: Parameters<typeof Box>[0]) => (
  <Box
    as="section"
    p="24px"
    sx={{
      display: "grid",
      gap: "10px",
      justifyItems: "start",
      border: `1px solid ${theme.colors.border.default}`,
      borderRadius: theme.borderRadius[8],
      background: theme.colors.grayscale.white,
    }}
    {...props}
  >
    {children}
  </Box>
)

export default MarketProductGridSection
