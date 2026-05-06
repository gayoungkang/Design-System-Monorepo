import type { Meta, StoryObj } from "@storybook/react"
import ImageListItem from "./ImageListItem"
import ImageList from "../ImageList/ImageList"
import Box from "../Box/Box"
import { Typography } from "../Typography/Typography"
import { theme } from "../../tokens/theme"

const meta: Meta<typeof ImageListItem> = {
  title: "Layout/ImageListItem",
  component: ImageListItem,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    cols: { control: "number" },
    rows: { control: "number" },
    interactive: { control: "boolean" },
    rounded: { control: "boolean" },
    disabled: { control: "boolean" },
    ariaLabel: { control: "text" },
    children: { control: false },
    onClick: { control: false },
  },
  args: {
    cols: 1,
    rows: 1,
    interactive: false,
    rounded: true,
    disabled: false,
    ariaLabel: "Product card",
  },
}

export default meta
type Story = StoryObj<typeof ImageListItem>

const CardContent = ({ title = "Market item" }: { title?: string }) => (
  <>
    <img
      src="https://picsum.photos/id/1060/480/320"
      alt={title}
      style={{ height: 180, objectFit: "cover" }}
    />
    <Box p="10px">
      <Typography variant="b2Medium" text={title} />
    </Box>
  </>
)

export const Playground: Story = {
  render: (args) => (
    <Box width="280px">
      <ImageListItem {...args}>
        <CardContent />
      </ImageListItem>
    </Box>
  ),
}

export const Basic: Story = {
  render: () => (
    <Box width="280px">
      <ImageListItem>
        <CardContent title="Basic product card" />
      </ImageListItem>
    </Box>
  ),
}

export const Interactive: Story = {
  render: () => (
    <Box width="280px">
      <ImageListItem interactive ariaLabel="Open product card" onClick={() => undefined}>
        <CardContent title="Interactive product card" />
      </ImageListItem>
    </Box>
  ),
}

export const WithOverlay: Story = {
  render: () => (
    <Box width="320px">
      <ImageListItem interactive ariaLabel="Open overlay card">
        <Box sx={{ position: "relative" }}>
          <img
            src="https://picsum.photos/id/180/480/360"
            alt="Overlay product"
            style={{ height: 220, objectFit: "cover" }}
          />
          <Box
            p="10px"
            sx={{
              position: "absolute",
              right: "10px",
              bottom: "10px",
              left: "10px",
              borderRadius: theme.borderRadius[6],
              background: theme.colors.grayscale.white,
            }}
          >
            <Typography variant="b2Medium" text="Overlay content via children" />
            <Typography variant="b3Regular" text="Title and metadata can be composed freely." />
          </Box>
        </Box>
      </ImageListItem>
    </Box>
  ),
}

export const SpanItems: Story = {
  render: () => (
    <Box width="760px">
      <ImageList cols={3} gap={12} ariaLabel="Span item examples">
        <ImageListItem cols={2} ariaLabel="Featured item">
          <CardContent title="Featured wide card" />
        </ImageListItem>
        <ImageListItem>
          <CardContent title="Default card" />
        </ImageListItem>
        <ImageListItem>
          <CardContent title="Default card" />
        </ImageListItem>
        <ImageListItem>
          <CardContent title="Default card" />
        </ImageListItem>
      </ImageList>
    </Box>
  ),
}
