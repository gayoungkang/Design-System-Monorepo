import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import Button from "./Button"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import { Typography } from "../Typography/Typography"

const meta: Meta<typeof Button> = {
  title: "Inputs/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    text: { control: "text" },
    variant: { control: "radio", options: ["contained", "outlined", "text"] },
    color: { control: "radio", options: ["primary", "secondary", "normal"] },
    size: { control: "radio", options: ["S", "M", "L"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    startIcon: { control: "text" },
    endIcon: { control: "text" },
  },
  args: {
    text: "Button",
    variant: "contained",
    color: "primary",
    size: "M",
    disabled: false,
    loading: false,
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Playground: Story = {
  render: (args) => {
    return (
      <Flex direction="column" gap="12px" align="center">
        <Button {...args} />

        <Typography
          variant="b3Regular"
          text={`variant: ${args.variant} / color: ${args.color} / size: ${args.size}`}
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
      <Box p="24px" width="900px">
        <Typography variant="h3" text="Button Cases" mb="16px" />

        <Flex direction="column" gap="20px">
          <Box>
            <Typography variant="b1Bold" text="Variants" mb="8px" />
            <Flex gap="12px">
              <Button text="Contained" variant="contained" />
              <Button text="Outlined" variant="outlined" />
              <Button text="Text" variant="text" />
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Colors" mb="8px" />
            <Flex gap="12px">
              <Button text="Primary" color="primary" />
              <Button text="Secondary" color="secondary" />
              <Button text="Normal" color="normal" />
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Sizes" mb="8px" />
            <Flex gap="12px" align="center">
              <Button text="Small" size="S" />
              <Button text="Medium" size="M" />
              <Button text="Large" size="L" />
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="States" mb="8px" />
            <Flex gap="12px">
              <Button text="Disabled" disabled />
              <Button text="Loading" loading />
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Icons" mb="8px" />
            <Flex gap="12px">
              <Button text="Start Icon" startIcon="ArrowDown" />
              <Button text="End Icon" endIcon="ArrowDown" />
              <Button text="Both" startIcon="ArrowDown" endIcon="ArrowDown" />
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Download" mb="8px" />
            <Flex gap="12px">
              <Button text="Download File" fileUrl="/file.csv" fileName="file.csv" />
            </Flex>
          </Box>
        </Flex>
      </Box>
    )
  },
}

export const Interactive: Story = {
  render: () => {
    const [loading, setLoading] = useState(false)

    return (
      <Flex direction="column" gap="12px" align="center">
        <Button
          text={loading ? "Processing..." : "Click Me"}
          loading={loading}
          onClick={async () => {
            setLoading(true)
            await new Promise((res) => setTimeout(res, 1000))
            setLoading(false)
          }}
        />

        <Typography
          variant="b3Regular"
          text={loading ? "loading 상태" : "idle 상태"}
          color="text.secondary"
        />
      </Flex>
    )
  },
}
