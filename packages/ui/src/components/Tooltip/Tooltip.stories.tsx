import type { Meta, StoryObj } from "@storybook/react"
import Tooltip from "./Tooltip"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"

const meta: Meta<typeof Tooltip> = {
  title: "Feedback/Tooltip",
  component: Tooltip,
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
  },
}

export default meta

type Story = StoryObj<typeof Tooltip>

export const Playground: Story = {
  render: (args) => {
    return (
      <Tooltip {...args}>
        <Button text="Hover me" />
      </Tooltip>
    )
  },
  args: {
    content: "Tooltip content",
    placement: "bottom",
  },
}

export const Placements: Story = {
  render: () => {
    return (
      <Flex gap={40} align="center" justify="center">
        <Tooltip content="Top" placement="top">
          <Button text="Top" />
        </Tooltip>

        <Tooltip content="Bottom" placement="bottom">
          <Button text="Bottom" />
        </Tooltip>

        <Tooltip content="Left" placement="left">
          <Button text="Left" />
        </Tooltip>

        <Tooltip content="Right" placement="right">
          <Button text="Right" />
        </Tooltip>
      </Flex>
    )
  },
}

export const LongText: Story = {
  render: () => {
    return (
      <Tooltip
        content="This is a very long tooltip content. It should wrap correctly and not overflow the container."
        maxWidth="200px"
      >
        <Button text="Long Tooltip" />
      </Tooltip>
    )
  },
}

export const DisabledContent: Story = {
  render: () => {
    return (
      <Tooltip content="">
        <Button text="No Tooltip" />
      </Tooltip>
    )
  },
}

export const AllCases: Story = {
  render: () => {
    return (
      <Flex direction="column" gap={24}>
        <Flex gap={20}>
          <Tooltip content="Top Tooltip" placement="top">
            <Button text="Top" />
          </Tooltip>

          <Tooltip content="Bottom Tooltip" placement="bottom">
            <Button text="Bottom" />
          </Tooltip>
        </Flex>

        <Flex gap={20}>
          <Tooltip content="Left Tooltip" placement="left">
            <Button text="Left" />
          </Tooltip>

          <Tooltip content="Right Tooltip" placement="right">
            <Button text="Right" />
          </Tooltip>
        </Flex>

        <Tooltip content="Multiline\nTooltip\nSupport" maxWidth="180px">
          <Button text="Multiline" />
        </Tooltip>
      </Flex>
    )
  },
}
