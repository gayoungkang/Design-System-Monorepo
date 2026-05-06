import type { Meta, StoryObj } from "@storybook/react"
import ImageList from "./ImageList"
import ImageListItem from "../ImageListItem/ImageListItem"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import { Typography } from "../Typography/Typography"
import { theme } from "../../tokens/theme"

const imageItems = [
  { id: 1, title: "Camera kit", src: "https://picsum.photos/id/1060/480/360", height: 180 },
  { id: 2, title: "Desk setup", src: "https://picsum.photos/id/180/480/520", height: 240 },
  { id: 3, title: "Travel pack", src: "https://picsum.photos/id/1011/480/360", height: 180 },
  { id: 4, title: "Audio gear", src: "https://picsum.photos/id/1080/480/540", height: 250 },
  { id: 5, title: "Home object", src: "https://picsum.photos/id/1040/480/360", height: 180 },
  { id: 6, title: "Outdoor set", src: "https://picsum.photos/id/1039/480/520", height: 230 },
]

const meta: Meta<typeof ImageList> = {
  title: "Layout/ImageList",
  component: ImageList,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    cols: { control: "number" },
    gap: { control: "number" },
    variant: { control: "radio", options: ["standard", "masonry"] },
    ariaLabel: { control: "text" },
    children: { control: false },
  },
  args: {
    cols: 3,
    gap: 12,
    variant: "standard",
    ariaLabel: "Product image list",
  },
}

export default meta
type Story = StoryObj<typeof ImageList>

const ProductCard = ({ title, src, height }: { title: string; src: string; height: number }) => (
  <ImageListItem>
    <img src={src} alt={title} style={{ height, objectFit: "cover" }} />
    <Box p="10px">
      <Typography variant="b2Medium" text={title} />
    </Box>
  </ImageListItem>
)

export const Playground: Story = {
  render: (args) => (
    <Box width="860px">
      <ImageList {...args}>
        {imageItems.map((item) => (
          <ProductCard key={item.id} title={item.title} src={item.src} height={item.height} />
        ))}
      </ImageList>
    </Box>
  ),
}

export const Standard: Story = {
  render: () => (
    <Box width="860px">
      <ImageList cols={3} gap={12} ariaLabel="Standard products">
        {imageItems.slice(0, 3).map((item) => (
          <ProductCard key={item.id} title={item.title} src={item.src} height={180} />
        ))}
      </ImageList>
    </Box>
  ),
}

export const Masonry: Story = {
  render: () => (
    <Box width="860px">
      <ImageList cols={3} gap={12} variant="masonry" ariaLabel="Masonry products">
        {imageItems.map((item) => (
          <ProductCard key={item.id} title={item.title} src={item.src} height={item.height} />
        ))}
      </ImageList>
    </Box>
  ),
}

export const Responsive: Story = {
  render: () => (
    <Box width="100%" sx={{ maxWidth: "960px" }}>
      <ImageList cols={{ base: 1, tablet: 2, desktop: 4 }} gap={12} ariaLabel="Responsive products">
        {imageItems.map((item) => (
          <ProductCard key={item.id} title={item.title} src={item.src} height={180} />
        ))}
      </ImageList>
    </Box>
  ),
}

export const WithProductCards: Story = {
  render: () => (
    <Flex direction="column" gap={12} width="860px">
      <Typography variant="h3" text="Image cards for market browsing" />
      <ImageList cols={3} gap={12} ariaLabel="Market product cards">
        {imageItems.map((item) => (
          <ImageListItem key={item.id} interactive ariaLabel={`Open ${item.title}`}>
            <Box sx={{ position: "relative" }}>
              <img src={item.src} alt={item.title} style={{ height: 190, objectFit: "cover" }} />
              <Box
                p="10px"
                sx={{
                  position: "absolute",
                  right: "8px",
                  bottom: "8px",
                  left: "8px",
                  borderRadius: theme.borderRadius[6],
                  background: theme.colors.grayscale.white,
                }}
              >
                <Typography variant="b2Medium" text={item.title} />
              </Box>
            </Box>
          </ImageListItem>
        ))}
      </ImageList>
    </Flex>
  ),
}
