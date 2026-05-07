import { Box, Flex, ImageListItem, Typography, theme } from "@acme/ui"
import type { Product } from "../../../entities/product/model/product.types"
import { formatCurrency } from "../../../entities/product/model/productUtils"

type MarketProductCardProps = {
  product: Product
  onOpen: (product: Product) => void
}

const MarketProductCard = ({ product, onOpen }: MarketProductCardProps) => (
  <ImageListItem
    interactive
    ariaLabel={`Open ${product.title}`}
    onClick={() => onOpen(product)}
    sx={{
      background: theme.colors.grayscale.white,
    }}
  >
    <Box sx={{ position: "relative" }}>
      <img
        src={product.thumbnail}
        alt={product.title}
        style={{
          width: "100%",
          aspectRatio: "4 / 5",
          objectFit: "cover",
          background: theme.colors.background.default,
        }}
      />
      <Box
        p="8px"
        sx={{
          position: "absolute",
          right: "8px",
          bottom: "8px",
          borderRadius: theme.borderRadius[6],
          background: theme.colors.grayscale.white,
          border: `1px solid ${theme.colors.border.default}`,
        }}
      >
        <Typography variant="b3Medium" text={formatCurrency(product.price)} color={theme.colors.text.primary} />
      </Box>
    </Box>
    <Box p="12px" sx={{ display: "grid", gap: "6px" }}>
      <Typography variant="b1Bold" text={product.title} color={theme.colors.text.primary} />
      <Flex justify="space-between" align="center" gap="8px">
        <Typography variant="b3Regular" text={product.category} color={theme.colors.text.secondary} />
        <Typography variant="b3Medium" text={`Rating ${product.rating.toFixed(1)}`} color={theme.colors.primary[400]} />
      </Flex>
    </Box>
  </ImageListItem>
)

export default MarketProductCard
