import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import BottomNavigation, { type BottomNavigationValue } from "./BottomNavigation"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import Icon from "../Icon/Icon"
import { Typography } from "../Typography/Typography"
import { theme } from "../../tokens/theme"

const navigationItems = [
  { value: "home", label: "Home", icon: <Icon name="Folder" size={20} /> },
  { value: "search", label: "Search", icon: <Icon name="SearchLine" size={20} /> },
  {
    value: "saved",
    label: "Saved",
    icon: <Icon name="BookmarkLine" size={20} />,
    activeIcon: <Icon name="BookmarkFill" size={20} />,
  },
  { value: "alerts", label: "Alerts", icon: <Icon name="AlertTriangle" size={20} /> },
] satisfies {
  value: BottomNavigationValue
  label: string
  icon: JSX.Element
  activeIcon?: JSX.Element
  disabled?: boolean
}[]

const meta: Meta<typeof BottomNavigation> = {
  title: "Navigation/BottomNavigation",
  component: BottomNavigation,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    value: { control: "text" },
    showLabels: { control: "boolean" },
    disabled: { control: "boolean" },
    fixed: { control: "boolean" },
    ariaLabel: { control: "text" },
    items: { control: false },
    onChange: { control: false },
  },
  args: {
    value: "home",
    items: navigationItems,
    showLabels: true,
    disabled: false,
    fixed: false,
    ariaLabel: "Market navigation",
  },
}

export default meta
type Story = StoryObj<typeof BottomNavigation>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState<BottomNavigationValue>(args.value ?? "home")

    return (
      <Box width="390px">
        <BottomNavigation {...args} value={value} onChange={setValue} />
      </Box>
    )
  },
}

export const ShowLabels: Story = {
  render: () => (
    <Box width="390px">
      <BottomNavigation value="home" items={navigationItems} showLabels />
    </Box>
  ),
}

export const WithoutLabels: Story = {
  render: () => (
    <Box width="390px">
      <BottomNavigation value="search" items={navigationItems} showLabels={false} />
    </Box>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Box width="390px">
      <BottomNavigation
        value="home"
        disabled
        items={[
          ...navigationItems.slice(0, 2),
          { ...navigationItems[2], disabled: true },
          navigationItems[3],
        ]}
      />
    </Box>
  ),
}

export const FixedMobilePreview: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <Box
      width="390px"
      height="640px"
      p="20px"
      sx={{
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${theme.colors.border.default}`,
        background: theme.colors.background.default,
      }}
    >
      <Typography variant="h3" text="Market mobile preview" mb="8px" />
      <Typography
        variant="b2Regular"
        text="The fixed variant is intended for the bottom edge of a mobile browsing screen."
        color={theme.colors.text.secondary}
      />
      <BottomNavigation value="home" items={navigationItems} fixed />
    </Box>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<BottomNavigationValue>("home")

    return (
      <Flex direction="column" gap={12} width="390px">
        <BottomNavigation value={value} items={navigationItems} onChange={setValue} />
        <Typography
          variant="b2Regular"
          text={`Selected: ${String(value)}`}
          color={theme.colors.text.secondary}
        />
      </Flex>
    )
  },
}
