import type { Meta, StoryObj } from "@storybook/react"
import HelperText from "./HelperText"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"

const meta: Meta<typeof HelperText> = {
  title: "Form/HelperText",
  component: HelperText,
  args: {
    text: "안내 문구입니다.",
    status: "default",
  },
  argTypes: {
    text: {
      control: "text",
    },
    status: {
      control: "radio",
      options: ["default", "info", "success", "error"],
    },
  },
}

export default meta

type Story = StoryObj<typeof HelperText>

export const Playground: Story = {
  render: (args) => {
    return <HelperText {...args} />
  },
}

export const AllCases: Story = {
  render: () => {
    return (
      <Flex direction="column" gap={16}>
        <Box>
          <HelperText status="default" text="기본 안내 문구입니다." />
        </Box>

        <Box>
          <HelperText status="info" text="비밀번호는 영문, 숫자 조합으로 입력해 주세요." />
        </Box>

        <Box>
          <HelperText status="success" text="사용 가능한 아이디입니다." />
        </Box>

        <Box>
          <HelperText status="error" text="필수 입력 항목입니다." />
        </Box>

        <Box>
          <HelperText
            status="error"
            text={"비밀번호 형식이 올바르지 않습니다.\n영문, 숫자, 특수문자를 포함해 주세요."}
          />
        </Box>
      </Flex>
    )
  },
}
