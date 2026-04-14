import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import Drawer from "./Drawer"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import { Typography } from "../Typography/Typography"

const meta: Meta<typeof Drawer> = {
  title: "Components/Drawer",
  component: Drawer,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    placement: { control: "radio", options: ["left", "right", "top", "bottom"] },
    variant: { control: "radio", options: ["fixed", "absolute", "flex"] },
    closeBehavior: { control: "radio", options: ["hidden", "collapsed"] },
    overlay: { control: "boolean" },
    disableBackdrop: { control: "boolean" },
  },
  args: {
    placement: "left",
    variant: "fixed",
    closeBehavior: "hidden",
    overlay: true,
  },
}

export default meta
type Story = StoryObj<typeof Drawer>

export const Playground: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)

    return (
      <Box p="24px">
        <Button text="Open Drawer" onClick={() => setOpen(true)} />

        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <Box p="16px" width="240px">
            <Typography variant="b1Bold" text="Drawer Content" mb="8px" />
            <Button text="Close" onClick={() => setOpen(false)} />
          </Box>
        </Drawer>
      </Box>
    )
  },
}

export const AllCases: Story = {
  render: () => {
    const [left, setLeft] = useState(false)
    const [right, setRight] = useState(false)
    const [top, setTop] = useState(false)
    const [bottom, setBottom] = useState(false)

    return (
      <Box p="24px">
        <Typography variant="h3" text="Drawer Cases" mb="16px" />

        <Flex gap="12px" mb="16px">
          <Button text="Left" onClick={() => setLeft(true)} />
          <Button text="Right" onClick={() => setRight(true)} />
          <Button text="Top" onClick={() => setTop(true)} />
          <Button text="Bottom" onClick={() => setBottom(true)} />
        </Flex>

        <Drawer open={left} onClose={() => setLeft(false)} placement="left">
          <Box p="16px" width="240px">
            <Typography text="Left Drawer" />
          </Box>
        </Drawer>

        <Drawer open={right} onClose={() => setRight(false)} placement="right">
          <Box p="16px" width="240px">
            <Typography text="Right Drawer" />
          </Box>
        </Drawer>

        <Drawer open={top} onClose={() => setTop(false)} placement="top">
          <Box p="16px" height="120px">
            <Typography text="Top Drawer" />
          </Box>
        </Drawer>

        <Drawer open={bottom} onClose={() => setBottom(false)} placement="bottom">
          <Box p="16px" height="120px">
            <Typography text="Bottom Drawer" />
          </Box>
        </Drawer>
      </Box>
    )
  },
}

export const Collapsed: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Flex height="200px">
        <Drawer open={open} placement="left" closeBehavior="collapsed" collapsedSize={60}>
          <Box p="12px">
            <Typography text="Collapsed Drawer" />
          </Box>
        </Drawer>

        <Box p="16px">
          <Button text="Toggle" onClick={() => setOpen((v) => !v)} />
        </Box>
      </Flex>
    )
  },
}
