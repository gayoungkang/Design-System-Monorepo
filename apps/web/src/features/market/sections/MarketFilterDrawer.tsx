import { Box, Button, Drawer, Flex, Select, Typography, theme } from "@acme/ui"
import type { SelectOptionType } from "@acme/ui"
import type { MarketFilterDraft } from "../hooks/useMarketState"

type MarketFilterDrawerProps = {
  open: boolean
  categories: string[]
  draftFilter: MarketFilterDraft
  onDraftChange: (next: MarketFilterDraft) => void
  onApply: () => void
  onReset: () => void
  onClose: () => void
}

const MarketFilterDrawer = ({
  open,
  categories,
  draftFilter,
  onDraftChange,
  onApply,
  onReset,
  onClose,
}: MarketFilterDrawerProps) => {
  const categoryOptions: SelectOptionType<string>[] = [
    { value: "all", label: "All categories" },
    ...categories.map((category) => ({ value: category, label: category })),
  ]

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="bottom"
      variant="fixed"
      height="320px"
      overlay
    >
      <Box
        p="20px"
        sx={{
          display: "grid",
          gap: "16px",
          height: "100%",
          background: theme.colors.grayscale.white,
        }}
      >
        <Flex justify="space-between" align="center" gap="12px">
          <Box>
            <Typography as="h3" variant="h2" text="Explore filters" color={theme.colors.text.primary} />
            <Typography
              variant="b2Regular"
              text="카테고리를 좁혀 이미지 탐색 흐름을 유지합니다."
              color={theme.colors.text.secondary}
            />
          </Box>
          <Button text="닫기" variant="text" color="normal" onClick={onClose} />
        </Flex>

        <Select<string>
          multiple={false}
          label="Category"
          value={draftFilter.category ?? "all"}
          options={categoryOptions}
          onChange={(value) => onDraftChange({ category: value && value !== "all" ? value : undefined })}
        />

        <Flex gap="8px" justify="flex-end" wrap="wrap">
          <Button text="Reset" variant="outlined" color="normal" onClick={onReset} />
          <Button text="Apply filters" onClick={onApply} />
        </Flex>
      </Box>
    </Drawer>
  )
}

export default MarketFilterDrawer
