import { Box, Flex, Typography, theme } from "@acme/ui"
import type { Product } from "../../../entities/product/model/product.types"
import { formatCurrency } from "../../../entities/product/model/productUtils"

type MarketHeroSectionProps = {
  featuredProduct?: Product
}

const MarketHeroSection = ({ featuredProduct }: MarketHeroSectionProps) => {
  if (!featuredProduct) return null

  return (
    <Box
      as="section"
      p="18px"
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 150px",
        gap: "16px",
        alignItems: "center",
        border: `1px solid ${theme.colors.border.default}`,
        borderRadius: theme.borderRadius[8],
        background: theme.colors.grayscale.white,
        "@media (max-width: 620px)": {
          gridTemplateColumns: "1fr",
        },
      }}
    >
      <Box sx={{ display: "grid", gap: "8px" }}>
        <Typography variant="b3Medium" text="Featured discovery" color={theme.colors.primary[400]} />
        <Typography as="h3" variant="h2" text={featuredProduct.title} color={theme.colors.text.primary} />
        <Typography
          variant="b2Regular"
          text={featuredProduct.description}
          color={theme.colors.text.secondary}
        />
        <Flex gap="10px" wrap="wrap">
          <Typography variant="b2Medium" text={formatCurrency(featuredProduct.price)} color={theme.colors.text.primary} />
          <Typography variant="b2Regular" text={`Rating ${featuredProduct.rating.toFixed(1)}`} color={theme.colors.text.secondary} />
        </Flex>
      </Box>
      <img
        src={featuredProduct.thumbnail}
        alt={`${featuredProduct.title} preview`}
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          objectFit: "cover",
          borderRadius: theme.borderRadius[8],
          background: theme.colors.background.default,
        }}
      />
    </Box>
  )
}

export default MarketHeroSection
