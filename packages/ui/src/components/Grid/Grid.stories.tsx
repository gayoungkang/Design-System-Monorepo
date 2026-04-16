import type { Meta, StoryObj } from "@storybook/react"
import Grid from "./Grid"
import Box from "../Box/Box"
import { Typography } from "../Typography/Typography"

const Cell = ({ text }: { text: string }) => {
  return (
    <Box
      p={12}
      sx={{
        border: "1px solid",
        borderColor: "border.default",
        borderRadius: "8px",
        backgroundColor: "background.secondary",
      }}
    >
      <Typography text={text} />
    </Box>
  )
}

const meta: Meta<typeof Grid> = {
  title: "Foundation/Grid",
  component: Grid,
  args: {
    columns: "1fr 1fr",
    gap: 12,
    inline: false,
  },
  argTypes: {
    columns: {
      control: "text",
    },
    rows: {
      control: "text",
    },
    gap: {
      control: "text",
    },
    rowGap: {
      control: "text",
    },
    columnGap: {
      control: "text",
    },
    inline: {
      control: "boolean",
    },
  },
}

export default meta

type Story = StoryObj<typeof Grid>

export const Playground: Story = {
  render: (args) => {
    return (
      <Grid {...args}>
        <Cell text="Item 1" />
        <Cell text="Item 2" />
        <Cell text="Item 3" />
        <Cell text="Item 4" />
      </Grid>
    )
  },
}

export const AllCases: Story = {
  render: () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        <Box>
          <Typography text="Basic 2 Columns" sx={{ marginBottom: "8px" }} />
          <Grid columns="1fr 1fr" gap={12}>
            <Cell text="A" />
            <Cell text="B" />
            <Cell text="C" />
            <Cell text="D" />
          </Grid>
        </Box>

        <Box>
          <Typography text="Mixed Columns" sx={{ marginBottom: "8px" }} />
          <Grid columns="200px 1fr 1fr" gap={16}>
            <Cell text="Sidebar" />
            <Cell text="Content 1" />
            <Cell text="Content 2" />
          </Grid>
        </Box>

        <Box>
          <Typography text="Row / Column Gap" sx={{ marginBottom: "8px" }} />
          <Grid columns="repeat(3, minmax(0, 1fr))" rowGap={8} columnGap={24}>
            <Cell text="1" />
            <Cell text="2" />
            <Cell text="3" />
            <Cell text="4" />
            <Cell text="5" />
            <Cell text="6" />
          </Grid>
        </Box>

        <Box>
          <Typography text="Inline Grid" sx={{ marginBottom: "8px" }} />
          <Grid columns="auto auto auto" gap={8} inline>
            <Cell text="Chip 1" />
            <Cell text="Chip 2" />
            <Cell text="Chip 3" />
          </Grid>
        </Box>
      </Box>
    )
  },
}
