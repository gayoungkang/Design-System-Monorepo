import type { Meta, StoryObj } from "@storybook/react"
import Skeleton from "./Skeleton"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"

const meta: Meta<typeof Skeleton> = {
  title: "Feedback/Skeleton",
  component: Skeleton,
}

export default meta

export const Playground: StoryObj<typeof Skeleton> = {
  args: {
    variant: "text",
    width: "100%",
  },
}

export const Variants: StoryObj<typeof Skeleton> = {
  render: () => (
    <Flex direction="column" gap="12px">
      <Skeleton variant="text" width="200px" />
      <Skeleton variant="rectangular" width="200px" height="100px" />
      <Skeleton variant="rounded" width="200px" height="100px" />
      <Skeleton variant="circular" width={60} height={60} />
    </Flex>
  ),
}

export const WithChildren: StoryObj<typeof Skeleton> = {
  render: () => (
    <Box width="200px">
      <Skeleton>
        <Box height="100px" />
      </Skeleton>
    </Box>
  ),
}
