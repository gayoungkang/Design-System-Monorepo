import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import Menu from "./Menu"

const meta: Meta<typeof Menu> = {
  title: "Navigation/Menu",
  component: Menu,
  args: {
    text: "설정",
    size: "M",
    selected: false,
    disabled: false,
  },
  argTypes: {
    text: { control: "text" },
    size: { control: "radio", options: ["S", "M", "L"] },
    startIcon: { control: "text" },
    endIcon: { control: "text" },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
  },
}

export default meta

type Story = StoryObj<typeof Menu>

export const Playground: Story = {
  render: (args) => {
    const [selected, setSelected] = useState(Boolean(args.selected))

    return (
      <Box width="240px">
        <Menu
          {...args}
          selected={selected}
          onClick={() => setSelected((prev) => !prev)}
          startIcon="Filter"
          endIcon="ArrowRight"
        />
      </Box>
    )
  },
}

export const AllCases: Story = {
  render: () => {
    return (
      <Flex direction="column" gap={12} width="280px">
        <Menu text="기본 메뉴" />
        <Menu text="시작 아이콘" startIcon="Filter" />
        <Menu text="끝 아이콘" endIcon="ArrowRight" />
        <Menu text="양쪽 아이콘" startIcon="Filter" endIcon="ArrowRight" />
        <Menu text="선택됨" selected />
        <Menu text="비활성" disabled />
        <Menu text="작은 메뉴" size="S" startIcon="Filter" />
        <Menu text="큰 메뉴" size="L" startIcon="Filter" endIcon="ArrowRight" />
      </Flex>
    )
  },
}
