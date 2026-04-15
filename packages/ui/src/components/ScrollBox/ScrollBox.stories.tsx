import type { Meta, StoryObj } from "@storybook/react"
import ScrollBox from "./ScrollBox"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import { Typography } from "@acme/ui"

const meta: Meta<typeof ScrollBox> = {
  title: "Layout/ScrollBox",
  component: ScrollBox,
  args: {
    width: "100%",
    height: 240,
    minWidth: "initial",
    minHeight: "initial",
    maxWidth: "100%",
    maxHeight: "none",
    overflow: "auto",
  },
  argTypes: {
    children: { control: false },
  },
}

export default meta

type Story = StoryObj<typeof ScrollBox>

const VerticalContent = () => (
  <Flex direction="column" gap="8px" p="8px">
    {Array.from({ length: 20 }).map((_, index) => (
      <Box
        key={index}
        p="12px"
        sx={{
          border: "1px solid",
          borderColor: "border.default",
          borderRadius: "4px",
          backgroundColor: "background.default",
        }}
      >
        <Typography text={`Row ${index + 1}`} variant="b2Regular" />
      </Box>
    ))}
  </Flex>
)

const HorizontalContent = () => (
  <Flex gap="8px" p="8px" sx={{ width: "max-content" }}>
    {Array.from({ length: 12 }).map((_, index) => (
      <Box
        key={index}
        width="140px"
        height="120px"
        p="12px"
        sx={{
          border: "1px solid",
          borderColor: "border.default",
          borderRadius: "4px",
          backgroundColor: "background.default",
          flexShrink: 0,
        }}
      >
        <Typography text={`Card ${index + 1}`} variant="b2Regular" />
      </Box>
    ))}
  </Flex>
)

export const Playground: Story = {
  render: (args) => (
    <ScrollBox {...args}>
      <VerticalContent />
    </ScrollBox>
  ),
}

export const VerticalScroll: Story = {
  render: () => (
    <ScrollBox height={220} overflowY="auto" overflowX="hidden">
      <VerticalContent />
    </ScrollBox>
  ),
}

export const HorizontalScroll: Story = {
  render: () => (
    <ScrollBox width={420} height={160} overflowX="auto" overflowY="hidden">
      <HorizontalContent />
    </ScrollBox>
  ),
}

export const SizeConstraints: Story = {
  render: () => (
    <ScrollBox
      width={320}
      height={200}
      minWidth={240}
      minHeight={120}
      maxWidth={360}
      maxHeight={220}
      overflow="auto"
    >
      <VerticalContent />
    </ScrollBox>
  ),
}

export const NestedLayoutUsage: Story = {
  render: () => (
    <Box
      width="520px"
      height="280px"
      sx={{
        border: "1px solid",
        borderColor: "border.default",
        borderRadius: "6px",
        overflow: "hidden",
      }}
    >
      <Flex direction="column" height="100%">
        <Box
          p="12px"
          sx={{
            borderBottom: "1px solid",
            borderColor: "border.default",
            flexShrink: 0,
          }}
        >
          <Typography text="Header" variant="b1Regular" />
        </Box>

        <ScrollBox height="100%" overflowY="auto" overflowX="hidden">
          <VerticalContent />
        </ScrollBox>
      </Flex>
    </Box>
  ),
}
