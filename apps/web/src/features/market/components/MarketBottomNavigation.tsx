import { BottomNavigation } from "@acme/ui"
import type { MarketNavValue } from "../hooks/useMarketState"

type MarketBottomNavigationProps = {
  value: MarketNavValue
  onChange: (value: MarketNavValue) => void
}

const items = [
  { value: "discover", label: "Discover" },
  { value: "search", label: "Search" },
  { value: "categories", label: "Categories" },
  { value: "saved", label: "Saved" },
] satisfies {
  value: MarketNavValue
  label: string
}[]

const MarketBottomNavigation = ({ value, onChange }: MarketBottomNavigationProps) => (
  <BottomNavigation
    value={value}
    items={items}
    showLabels
    fixed
    ariaLabel="Market bottom navigation"
    onChange={onChange}
  />
)

export default MarketBottomNavigation
