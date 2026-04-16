import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import Breadcrumbs from "./Breadcrumbs"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import Icon from "../Icon/Icon"
import { Typography } from "../Typography/Typography"

const meta: Meta<typeof Breadcrumbs> = {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    separator: { control: false },
    maxItems: { control: "number" },
    items: { control: false },
  },
  args: {
    maxItems: 0,
  },
}

export default meta
type Story = StoryObj<typeof Breadcrumbs>

export const Playground: Story = {
  render: (args) => {
    const [clicked, setClicked] = useState("")

    const items = [
      {
        label: "Home",
        href: "/",
        onClick: () => setClicked("Home"),
      },
      {
        label: "Category",
        href: "/category",
        onClick: () => setClicked("Category"),
      },
      {
        label: "Detail",
      },
    ]

    return (
      <Flex direction="column" gap="12px" align="center">
        <Breadcrumbs {...args} items={items} />

        <Typography
          variant="b3Regular"
          text={clicked ? `last clicked: ${clicked}` : "클릭된 breadcrumb 없음"}
          color="text.secondary"
        />
      </Flex>
    )
  },
}

export const AllCases: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    const [clicked, setClicked] = useState("")

    return (
      <Box p="24px" width="980px">
        <Typography variant="h3" text="Breadcrumbs Cases" mb="16px" />

        <Flex direction="column" gap="24px">
          <Box>
            <Typography variant="b1Bold" text="Basic" mb="8px" />
            <Breadcrumbs
              items={[
                { label: "Home", href: "/", onClick: () => setClicked("Home") },
                { label: "Category", href: "/category", onClick: () => setClicked("Category") },
                { label: "Detail" },
              ]}
            />
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Non-clickable Middle Item" mb="8px" />
            <Breadcrumbs
              items={[
                { label: "Home", href: "/", onClick: () => setClicked("Home") },
                { label: "Archive" },
                { label: "Detail" },
              ]}
            />
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Collapsed with maxItems" mb="8px" />
            <Breadcrumbs
              maxItems={3}
              items={[
                { label: "Home", href: "/", onClick: () => setClicked("Home") },
                { label: "Products", href: "/products", onClick: () => setClicked("Products") },
                {
                  label: "Electronics",
                  href: "/electronics",
                  onClick: () => setClicked("Electronics"),
                },
                { label: "Laptops", href: "/laptops", onClick: () => setClicked("Laptops") },
                { label: "Gaming Laptop" },
              ]}
            />
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Custom Separator" mb="8px" />
            <Breadcrumbs
              separator={<Icon name="ArrowRight" size={14} />}
              items={[
                { label: "Home", href: "/", onClick: () => setClicked("Home") },
                { label: "Library", href: "/library", onClick: () => setClicked("Library") },
                { label: "Book" },
              ]}
            />
          </Box>

          <Typography
            variant="b2Regular"
            text={clicked ? `last clicked: ${clicked}` : "클릭된 breadcrumb 없음"}
            color="text.secondary"
          />
        </Flex>
      </Box>
    )
  },
}

export const InteractiveNavigation: Story = {
  render: () => {
    const [depth, setDepth] = useState(3)

    const items = [
      { label: "Home", href: "/" },
      { label: "Workspace", href: "/workspace" },
      { label: "Design System", href: "/design-system" },
      { label: "Components", href: "/components" },
      { label: "Breadcrumbs" },
    ].slice(0, depth)

    return (
      <Flex direction="column" gap="16px" align="center">
        <Breadcrumbs items={items} maxItems={4} />

        <Flex gap="8px">
          <Button
            text="- Depth"
            variant="outlined"
            color="normal"
            onClick={() => setDepth((prev) => Math.max(2, prev - 1))}
          />
          <Button
            text="+ Depth"
            variant="outlined"
            color="primary"
            onClick={() => setDepth((prev) => Math.min(5, prev + 1))}
          />
        </Flex>

        <Typography variant="b3Regular" text={`current depth: ${depth}`} color="text.secondary" />
      </Flex>
    )
  },
}
