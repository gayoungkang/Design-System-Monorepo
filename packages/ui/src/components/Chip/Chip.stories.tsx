import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import Chip from "./Chip"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import { Typography } from "../Typography/Typography"

const meta: Meta<typeof Chip> = {
  title: "Data Display/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    label: { control: "text" },
    variant: { control: "radio", options: ["contained", "outlined", "text"] },
    size: { control: "radio", options: ["S", "M", "L"] },
    disabled: { control: "boolean" },
    startIcon: { control: "text" },
    endIcon: { control: "text" },
  },
  args: {
    label: "Chip",
    variant: "contained",
    size: "M",
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof Chip>

export const Playground: Story = {
  render: (args) => {
    const [deleted, setDeleted] = useState(false)

    return (
      <Flex direction="column" gap="12px" align="center">
        {!deleted && <Chip {...args} onDelete={() => setDeleted(true)} />}

        <Button text="Reset" onClick={() => setDeleted(false)} />

        <Typography
          variant="b3Regular"
          text={deleted ? "Chip deleted" : "Chip active"}
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
        <Typography variant="h3" text="Chip Cases" mb="16px" />

        <Flex direction="column" gap="20px">
          <Box>
            <Typography variant="b1Bold" text="Variants" mb="8px" />
            <Flex gap="12px">
              <Chip label="Contained" variant="contained" />
              <Chip label="Outlined" variant="outlined" />
              <Chip label="Text" variant="text" />
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Sizes" mb="8px" />
            <Flex gap="12px">
              <Chip label="Small" size="S" />
              <Chip label="Medium" size="M" />
              <Chip label="Large" size="L" />
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Icons" mb="8px" />
            <Flex gap="12px">
              <Chip label="Start" startIcon="ArrowRight" />
              <Chip label="End" endIcon="ArrowRight" />
              <Chip label="Both" startIcon="ArrowRight" endIcon="ArrowRight" />
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="States" mb="8px" />
            <Flex gap="12px">
              <Chip label="Clickable" onClick={() => {}} />
              <Chip label="Disabled" disabled />
              <Chip label="Deletable" onDelete={() => {}} />
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Custom Color" mb="8px" />
            <Flex gap="12px">
              <Chip label="Custom" color="rgb(34,197,94)" />
              <Chip label="Outlined Custom" variant="outlined" color="rgb(59,130,246)" />
            </Flex>
          </Box>
        </Flex>
      </Box>
    )
  },
}

export const Interactive: Story = {
  render: () => {
    const [chips, setChips] = useState(["React", "TypeScript", "Design System"])

    const handleDelete = (target: string) => {
      setChips((prev) => prev.filter((c) => c !== target))
    }

    return (
      <Flex direction="column" gap="16px" align="center">
        <Flex gap="8px" wrap="wrap" justify="center">
          {chips.map((chip) => (
            <Chip key={chip} label={chip} onDelete={() => handleDelete(chip)} />
          ))}
        </Flex>

        <Button text="Reset" onClick={() => setChips(["React", "TypeScript", "Design System"])} />

        <Typography
          variant="b3Regular"
          text={`chips: ${chips.join(", ") || "none"}`}
          color="text.secondary"
        />
      </Flex>
    )
  },
}
