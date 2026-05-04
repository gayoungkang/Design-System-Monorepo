import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import Badge from "./Badge"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import Avatar from "../Avatar/Avatar"
import Icon from "../Icon/Icon"
import { Typography } from "../Typography/Typography"
import { theme } from "../../tokens/theme"

const meta: Meta<typeof Badge> = {
  title: "Data Display/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    content: { control: "text" },
    max: { control: "number" },
    showZero: { control: "boolean" },
    invisible: { control: "boolean" },
    status: { control: "radio", options: ["success", "info", "warning", "error"] },
    overlap: { control: "radio", options: ["rectangular", "circular"] },
    placement: {
      control: "radio",
      options: ["top-right", "top-left", "bottom-right", "bottom-left"],
    },
    children: { control: false },
  },
  args: {
    content: 3,
    max: 99,
    showZero: false,
    invisible: false,
    status: "error",
    overlap: "rectangular",
    placement: "top-right",
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Playground: Story = {
  render: (args) => {
    const normalizedContent =
      args.content === "" || args.content === undefined ? undefined : args.content

    return (
      <Flex direction="column" gap="12px" align="center">
        <Badge {...args} content={normalizedContent}>
          <Button text="Notifications" variant="outlined" color="normal" />
        </Badge>

        <Typography
          variant="b3Regular"
          text={`content: ${String(normalizedContent)} / invisible: ${String(args.invisible)} / showZero: ${String(args.showZero)}`}
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
    return (
      <Box p="24px" width="980px">
        <Typography variant="h3" text="Badge Cases" mb="16px" />

        <Flex direction="column" gap="24px">
          <Box>
            <Typography variant="b1Bold" text="Status Variants" mb="8px" />
            <Flex gap="20px" align="center" wrap="wrap">
              <Badge content={3} status="error">
                <Button text="Error" />
              </Badge>

              <Badge content={3} status="warning">
                <Button text="Warning" />
              </Badge>

              <Badge content={3} status="info">
                <Button text="Info" />
              </Badge>

              <Badge content={3} status="success">
                <Button text="Success" />
              </Badge>
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Placement" mb="8px" />
            <Flex gap="32px" align="center" wrap="wrap">
              <Badge content={7} placement="top-right">
                <Avatar name="TR" size="L" />
              </Badge>

              <Badge content={7} placement="top-left">
                <Avatar name="TL" size="L" />
              </Badge>

              <Badge content={7} placement="bottom-right">
                <Avatar name="BR" size="L" />
              </Badge>

              <Badge content={7} placement="bottom-left">
                <Avatar name="BL" size="L" />
              </Badge>
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Overlap" mb="8px" />
            <Flex gap="32px" align="center" wrap="wrap">
              <Badge content={12} overlap="rectangular">
                <Button text="Rectangular" variant="outlined" color="normal" />
              </Badge>

              <Badge content={12} overlap="circular">
                <Avatar name="JD" size="L" />
              </Badge>
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Display Rules" mb="8px" />
            <Flex gap="20px" align="center" wrap="wrap">
              <Badge content={120} max={99}>
                <Button text="99+" variant="outlined" color="normal" />
              </Badge>

              <Badge content={0}>
                <Button text="Zero Hidden" variant="outlined" color="normal" />
              </Badge>

              <Badge content={0} showZero>
                <Button text="Zero Visible" variant="outlined" color="normal" />
              </Badge>

              <Badge content="NEW" status="info">
                <Button text="String" variant="outlined" color="normal" />
              </Badge>

              <Badge content={8} invisible>
                <Button text="Invisible" variant="outlined" color="normal" />
              </Badge>
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="With Icon" mb="8px" />
            <Flex gap="20px" align="center" wrap="wrap">
              <Badge content={5} overlap="circular">
                <Box
                  p="8px"
                  sx={{ border: `1px solid ${theme.colors.border.default}`, borderRadius: "8px" }}
                >
                  <Icon name="BookmarkFill" size={20} />
                </Box>
              </Badge>
            </Flex>
          </Box>
        </Flex>
      </Box>
    )
  },
}

export const InteractiveCounter: Story = {
  render: () => {
    const [count, setCount] = useState(0)
    const [invisible, setInvisible] = useState(false)
    const [showZero, setShowZero] = useState(false)

    return (
      <Flex direction="column" gap="16px" align="center">
        <Badge
          content={count}
          showZero={showZero}
          invisible={invisible}
          status={count > 9 ? "warning" : "error"}
          overlap="rectangular"
        >
          <Button text="Inbox" />
        </Badge>

        <Typography
          variant="b2Regular"
          text={`count: ${count} / invisible: ${String(invisible)} / showZero: ${String(showZero)}`}
          color="text.secondary"
        />

        <Flex gap="8px" wrap="wrap" justify="center">
          <Button
            text="+1"
            variant="outlined"
            color="primary"
            onClick={() => setCount((prev) => prev + 1)}
          />
          <Button
            text="-1"
            variant="outlined"
            color="normal"
            onClick={() => setCount((prev) => Math.max(0, prev - 1))}
          />
          <Button
            text={showZero ? "Hide Zero" : "Show Zero"}
            variant="text"
            color="primary"
            onClick={() => setShowZero((prev) => !prev)}
          />
          <Button
            text={invisible ? "Show Badge" : "Hide Badge"}
            variant="text"
            color="secondary"
            onClick={() => setInvisible((prev) => !prev)}
          />
          <Button
            text="Reset"
            variant="outlined"
            color="secondary"
            onClick={() => {
              setCount(0)
              setInvisible(false)
              setShowZero(false)
            }}
          />
        </Flex>
      </Flex>
    )
  },
}
