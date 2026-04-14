import type { Meta, StoryObj } from "@storybook/react"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import Link from "./Link"
import Icon from "../Icon/Icon"

const meta: Meta<typeof Link> = {
  title: "Navigation/Link",
  component: Link,
  args: {
    children: "상세보기",
    href: "/detail",
    underline: "always",
    disabled: false,
  },
  argTypes: {
    children: {
      control: "text",
    },
    href: {
      control: "text",
    },
    underline: {
      control: "radio",
      options: ["none", "hover", "always"],
    },
    color: {
      control: "color",
    },
    hoverColor: {
      control: "color",
    },
    disabled: {
      control: "boolean",
    },
  },
}

export default meta

type Story = StoryObj<typeof Link>

export const Playground: Story = {
  render: (args) => {
    return <Link {...args} />
  },
}

export const AllCases: Story = {
  render: () => {
    return (
      <Flex direction="column" gap={20}>
        <Box>
          <Link href="/detail">기본 링크</Link>
        </Box>

        <Box>
          <Link href="/detail" underline="hover">
            Hover Underline
          </Link>
        </Box>

        <Box>
          <Link href="/detail" underline="none">
            Underline 없음
          </Link>
        </Box>

        <Box>
          <Link href="/detail" color="#111827" hoverColor="#2563eb">
            커스텀 컬러 링크
          </Link>
        </Box>

        <Box>
          <Link href="/detail" disabled>
            비활성 링크
          </Link>
        </Box>

        <Box>
          <Link href="/detail">
            <Flex align="center" gap={6}>
              <Icon name="StatusInfo" size={16} />
              <span>커스텀 노드 링크</span>
            </Flex>
          </Link>
        </Box>

        <Box width="140px">
          <Link
            href="/detail"
            typographyProps={{
              ellipsis: true,
              as: "span",
            }}
          >
            아주 긴 링크 텍스트가 잘리는지 확인합니다
          </Link>
        </Box>
      </Flex>
    )
  },
}
