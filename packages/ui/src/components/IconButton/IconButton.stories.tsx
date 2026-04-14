import type { Meta, StoryObj } from "@storybook/react"
import IconButton from "./IconButton"
import Flex from "../Flex/Flex"

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  args: {
    icon: "CloseLine",
    variant: "contained",
  },
}

export default meta
type Story = StoryObj<typeof IconButton>

export const Playground: Story = {
  render: (args) => {
    return <IconButton {...args} toolTip="닫기" />
  },
}

export const AllCases: Story = {
  render: () => {
    return (
      <Flex gap={16}>
        <IconButton icon="CloseLine" />
        <IconButton icon="CloseLine" variant="outlined" />
        <IconButton icon="CloseLine" variant="text" />
        <IconButton icon="CloseLine" disabled />
        <IconButton icon="CloseLine" toolTip="닫기" />
      </Flex>
    )
  },
}
