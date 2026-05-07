import { Box, Button, Flex, Typography, theme } from "@acme/ui"

type MarketHeaderProps = {
  resultCount: number
  activeFilterCount: number
  onOpenFilters: () => void
}

const MarketHeader = ({ resultCount, activeFilterCount, onOpenFilters }: MarketHeaderProps) => (
  <Box
    as="header"
    sx={{
      display: "grid",
      gap: "12px",
      paddingTop: "4px",
    }}
  >
    <Flex justify="space-between" align="flex-start" gap="12px" wrap="wrap">
      <Box sx={{ display: "grid", gap: "4px" }}>
        <Typography as="h2" variant="h1" text="Market" color={theme.colors.text.primary} />
        <Typography
          as="p"
          variant="b2Regular"
          text="이미지와 지표를 중심으로 상품을 빠르게 탐색하는 사용자용 경험입니다."
          color={theme.colors.text.secondary}
        />
      </Box>
      <Button
        text={activeFilterCount ? `Filters ${activeFilterCount}` : "Filters"}
        variant="outlined"
        color="normal"
        onClick={onOpenFilters}
      />
    </Flex>

    <Typography
      variant="b3Regular"
      text={`${resultCount.toLocaleString()} products available for discovery`}
      color={theme.colors.text.tertiary}
    />
  </Box>
)

export default MarketHeader
