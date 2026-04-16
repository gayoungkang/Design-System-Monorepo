import type { Meta, StoryObj } from "@storybook/react"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import Label from "./Label"

const meta: Meta<typeof Label> = {
  title: "Data Display/Label",
  component: Label,
  args: {
    text: "이름",
    textAlign: "left",
    placement: "right",
    required: false,
  },
  argTypes: {
    text: {
      control: "text",
    },
    textAlign: {
      control: "radio",
      options: ["left", "right"],
    },
    placement: {
      control: "radio",
      options: ["left", "right"],
    },
    required: {
      control: "boolean",
    },
  },
}

export default meta

type Story = StoryObj<typeof Label>

export const Playground: Story = {
  render: (args) => {
    return (
      <Box width="240px">
        <Label {...args} />
      </Box>
    )
  },
}

export const AllCases: Story = {
  render: () => {
    return (
      <Flex direction="column" gap={20}>
        <Box width="240px">
          <Label text="기본 라벨" />
        </Box>

        <Box width="240px">
          <Label text="필수 라벨" required />
        </Box>

        <Box width="240px">
          <Label text="왼쪽 별표" required placement="left" />
        </Box>

        <Box width="240px">
          <Label text="오른쪽 정렬" textAlign="right" />
        </Box>

        <Box width="240px">
          <Label
            text="타이포그래피 커스텀"
            required
            typographyProps={{ ellipsis: true, as: "label" }}
          />
        </Box>
      </Flex>
    )
  },
}
