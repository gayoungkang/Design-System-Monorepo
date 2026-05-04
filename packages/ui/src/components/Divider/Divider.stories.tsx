import type { Meta, StoryObj } from "@storybook/react"
import Divider from "./Divider"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import { Typography } from "../Typography/Typography"
import { theme } from "../../tokens/theme"

const meta: Meta<typeof Divider> = {
  title: "Foundation/Divider",
  component: Divider,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    direction: { control: "radio", options: ["horizontal", "vertical"] },
    thickness: { control: "text" },
    color: { control: "color" },
    flexItem: { control: "boolean" },
  },
  args: {
    direction: "horizontal",
    thickness: "1px",
    flexItem: false,
  },
}

export default meta
type Story = StoryObj<typeof Divider>

export const Playground: Story = {
  render: (args) => {
    const isVertical = args.direction === "vertical"

    return isVertical ? (
      <Flex align="stretch" gap="16px" height="80px">
        <Box p="8px">
          <Typography variant="b2Regular" text="Left" />
        </Box>

        <Divider {...args} />

        <Box p="8px">
          <Typography variant="b2Regular" text="Right" />
        </Box>
      </Flex>
    ) : (
      <Box width="360px">
        <Typography variant="b2Regular" text="Top Content" mb="12px" />
        <Divider {...args} />
        <Typography variant="b2Regular" text="Bottom Content" mt="12px" />
      </Box>
    )
  },
}

export const AllCases: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return (
      <Box p="24px" width="900px">
        <Typography variant="h3" text="Divider Cases" mb="16px" />

        <Flex direction="column" gap="24px">
          <Box>
            <Typography variant="b1Bold" text="Horizontal" mb="8px" />
            <Box width="480px">
              <Typography variant="b2Regular" text="Section A" mb="8px" />
              <Divider />
              <Typography variant="b2Regular" text="Section B" mt="8px" />
            </Box>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Thickness / Color" mb="8px" />
            <Box width="480px">
              <Divider thickness="2px" mb="8px" />
              <Divider thickness="4px" color={theme.colors.primary[400]} mb="8px" />
              <Divider thickness="6px" color={theme.colors.error[400]} />
            </Box>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Vertical" mb="8px" />
            <Flex gap="16px" height="80px" align="stretch">
              <Box p="8px" sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="b2Regular" text="Item A" />
              </Box>

              <Divider direction="vertical" />

              <Box p="8px" sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="b2Regular" text="Item B" />
              </Box>

              <Divider direction="vertical" height="24px" />

              <Box p="8px" sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="b2Regular" text="Item C" />
              </Box>

              <Divider direction="vertical" flexItem />

              <Box p="8px" sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="b2Regular" text="Item D" />
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
    )
  },
}

export const LayoutExamples: Story = {
  render: () => {
    return (
      <Flex direction="column" gap="20px" width="520px">
        <Box>
          <Typography variant="b1Bold" text="Card Header" mb="8px" />
          <Divider />
          <Typography
            variant="b2Regular"
            text="카드 콘텐츠를 논리적인 구획으로 나눌 때 사용합니다."
            mt="8px"
          />
        </Box>

        <Flex gap="12px" align="stretch" height="72px">
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="b2Regular" text="Left Pane" />
          </Box>

          <Divider direction="vertical" flexItem />

          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="b2Regular" text="Right Pane" />
          </Box>
        </Flex>
      </Flex>
    )
  },
}
