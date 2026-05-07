import { useNavigate } from "react-router-dom"
import { Box, theme } from "@acme/ui"
import { useMarketProducts } from "../hooks/useMarketProducts"
import { useMarketState } from "../hooks/useMarketState"
import MarketBottomNavigation from "../components/MarketBottomNavigation"
import MarketHeader from "../components/MarketHeader"
import MarketSearchBar from "../components/MarketSearchBar"
import MarketFilterDrawer from "../sections/MarketFilterDrawer"
import MarketHeroSection from "../sections/MarketHeroSection"
import MarketProductGridSection from "../sections/MarketProductGridSection"
import type { Product } from "../../../entities/product/model/product.types"

const MarketContainer = () => {
  const navigate = useNavigate()
  const marketQuery = useMarketProducts()
  const products = marketQuery.data?.products ?? []
  const marketState = useMarketState(products)
  const featuredProduct = marketState.visibleProducts[0] ?? products[0]

  const navigateToDetail = (product: Product) => {
    navigate(`/market/${product.id}`, { state: { from: "/market" } })
  }

  return (
    <Box
      sx={{
        display: "grid",
        gap: "18px",
        paddingBottom: "76px",
        "@media (min-width: 980px)": {
          paddingBottom: "24px",
        },
      }}
    >
      <MarketHeader
        resultCount={marketState.visibleProducts.length}
        activeFilterCount={marketState.activeFilterCount}
        onOpenFilters={marketState.openCategories}
      />

      <MarketSearchBar value={marketState.searchValue} onChange={marketState.setSearchValue} />

      <MarketHeroSection featuredProduct={featuredProduct} />

      <MarketProductGridSection
        products={marketState.visibleProducts}
        loading={marketQuery.isLoading}
        errorMessage={marketQuery.isError ? marketQuery.error.message : undefined}
        onRetry={() => void marketQuery.refetch()}
        onOpenProduct={navigateToDetail}
      />

      <MarketFilterDrawer
        open={marketState.filterOpen}
        categories={marketState.categories}
        draftFilter={marketState.draftFilter}
        onDraftChange={marketState.setDraftFilter}
        onApply={marketState.applyFilter}
        onReset={marketState.resetFilter}
        onClose={() => marketState.setFilterOpen(false)}
      />

      <Box
        sx={{
          "@media (min-width: 980px)": {
            display: "none",
          },
          "& nav": {
            borderColor: theme.colors.border.default,
          },
        }}
      >
        <MarketBottomNavigation
          value={marketState.navValue}
          onChange={(value) => {
            marketState.setNavValue(value)
            if (value === "search") marketState.openSearch()
            if (value === "categories") marketState.openCategories()
          }}
        />
      </Box>
    </Box>
  )
}

export default MarketContainer
