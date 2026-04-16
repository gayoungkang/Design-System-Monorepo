import type { Meta, StoryObj } from "@storybook/react"
import Icon from "./Icon"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import { Typography } from "../Typography/Typography"

const meta: Meta<typeof Icon> = {
  title: "Inputs/Icon",
  component: Icon,
  args: {
    name: "StatusInfo",
    size: 24,
    paint: "auto",
  },
  argTypes: {
    name: {
      control: "text",
    },
    size: {
      control: "text",
    },
    color: {
      control: "color",
    },
    strokeWidth: {
      control: { type: "number", min: 0, step: 0.5 },
    },
    paint: {
      control: "radio",
      options: ["auto", "fill", "stroke", "both"],
    },
    ariaLabel: {
      control: "text",
    },
  },
}

export default meta

type Story = StoryObj<typeof Icon>

export const Playground: Story = {
  render: (args) => {
    return <Icon {...args} />
  },
}

export const AllCases: Story = {
  render: () => {
    return (
      <Flex direction="column" gap={24}>
        <Box>
          <Typography text="Sizes" sx={{ marginBottom: "8px" }} />
          <Flex gap={16} align="center">
            <Icon name="StatusInfo" size={16} />
            <Icon name="StatusInfo" size={24} />
            <Icon name="StatusInfo" size={32} />
            <Icon name="StatusInfo" size="2.5rem" />
          </Flex>
        </Box>

        <Box>
          <Typography text="Colors" sx={{ marginBottom: "8px" }} />
          <Flex gap={16} align="center">
            <Icon name="StatusInfo" color="#111827" />
            <Icon name="StatusSuccess" color="#16a34a" />
            <Icon name="StatusError" color="#dc2626" />
            <Icon name="StatusDefault" color="#6b7280" />
          </Flex>
        </Box>

        <Box>
          <Typography text="Dates" sx={{ marginBottom: "8px" }} />
          <Flex gap={16} align="center">
            <Icon name="Date" paint="auto" />
            <Icon name="Date" paint="fill" />
            <Icon name="Date" paint="stroke" strokeWidth={1.5} />
            <Icon name="Date" paint="both" strokeWidth={1.5} />
          </Flex>
        </Box>

        <Box>
          <Typography text="Accessibility" sx={{ marginBottom: "8px" }} />
          <Flex gap={16} align="center">
            <Icon name="StatusInfo" ariaLabel="정보 아이콘" />
            <Icon name="StatusSuccess" ariaLabel="성공 아이콘" />
            <Icon name="StatusError" />
          </Flex>
        </Box>
      </Flex>
    )
  },
}
