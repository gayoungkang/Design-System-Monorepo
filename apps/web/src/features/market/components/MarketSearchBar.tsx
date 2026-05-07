import { Box, TextField, theme } from "@acme/ui"

type MarketSearchBarProps = {
  value: string
  onChange: (value: string) => void
}

const MarketSearchBar = ({ value, onChange }: MarketSearchBarProps) => (
  <Box
    as="section"
    sx={{
      position: "sticky",
      top: "76px",
      zIndex: theme.zIndex.sticky,
      padding: "10px 0",
      background: theme.colors.background.default,
    }}
  >
    <TextField
      type="search"
      label="Search products"
      labelProps={{ sx: { position: "absolute", width: "1px", height: "1px", overflow: "hidden" } }}
      value={value}
      placeholder="Search products, categories, brands"
      startIcon="SearchLine"
      clearable
      onChange={(event) => onChange(event.target.value)}
      onClear={() => onChange("")}
      onSearch={onChange}
    />
  </Box>
)

export default MarketSearchBar
