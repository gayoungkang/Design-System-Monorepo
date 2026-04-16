import type { Meta, StoryObj } from "@storybook/react"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import Paper from "./Paper"
import { Typography } from "../Typography/Typography"

const meta: Meta<typeof Paper> = {
  title: "Data Display/Paper",
  component: Paper,
  args: {
    elevation: 2,
    radius: 4,
  },
  argTypes: {
    elevation: {
      control: { type: "number", min: 0, step: 1 },
    },
    radius: {
      control: "text",
    },
  },
}

export default meta

type Story = StoryObj<typeof Paper>

export const Playground: Story = {
  render: (args) => {
    return (
      <Box width="320px">
        <Paper {...args}>
          <Typography variant="h2" text="Paper Title" />
          <Typography
            text="기본 Paper 컨테이너입니다."
            sx={{ display: "block", marginTop: "8px" }}
          />
        </Paper>
      </Box>
    )
  },
}

export const AllCases: Story = {
  render: () => {
    return (
      <Flex direction="column" gap={20} width="360px">
        <Paper elevation={0}>
          <Typography text="Elevation 0" variant="b1Bold" />
        </Paper>

        <Paper elevation={4}>
          <Typography text="Elevation 4" variant="b1Bold" />
        </Paper>

        <Paper elevation={12}>
          <Typography text="Elevation 12" variant="b1Bold" />
        </Paper>

        <Paper radius={8}>
          <Typography text="Radius Token 8" variant="b1Bold" />
        </Paper>

        <Paper radius="20px">
          <Typography text="Radius 20px" variant="b1Bold" />
        </Paper>

        <Paper p="24px" sx={{ backgroundColor: "background.secondary" }}>
          <Typography text="BaseMixin Override" variant="b1Bold" />
        </Paper>
      </Flex>
    )
  },
}
