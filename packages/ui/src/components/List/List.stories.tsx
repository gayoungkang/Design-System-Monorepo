import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import List from "./List"
import Box from "../Box/Box"

const meta: Meta<typeof List> = {
  title: "Data Display/List",
  component: List,
  args: {
    dense: false,
    disablePadding: false,
    separator: true,
    title: "설정",
  },
  argTypes: {
    dense: { control: "boolean" },
    disablePadding: { control: "boolean" },
    separator: { control: "boolean" },
    title: { control: "text" },
  },
}

export default meta

type Story = StoryObj<typeof List>

export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true)
    const [enabled, setEnabled] = useState(true)

    return (
      <Box width="360px">
        <List
          {...args}
          items={[
            {
              label: "프로필",
              startItem: [{ type: "Avatar", props: { alt: "User Avatar" } }],
              endItem: [{ type: "Icon", props: { name: "ArrowRight" } }],
            },
            {
              label: "알림",
              endItem: [
                {
                  type: "Switch",
                  props: {
                    checked: enabled,
                    label: "",
                    onChange: () => setEnabled((prev) => !prev),
                  },
                },
              ],
            },
            {
              label: "약관 동의",
              startItem: [
                {
                  type: "CheckBox",
                  props: {
                    checked,
                    label: "동의",
                    onChange: setChecked,
                  },
                },
              ],
            },
          ]}
        />
      </Box>
    )
  },
}

export const AllCases: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    const [enabled, setEnabled] = useState(true)

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <Box width="360px">
          <List
            title="기본 리스트"
            items={[
              {
                label: "프로필",
                startItem: [{ type: "Avatar", props: { alt: "Avatar" } }],
                endItem: [{ type: "Icon", props: { name: "ArrowRight" } }],
              },
              {
                label: "즐겨찾기",
                startItem: [{ type: "Icon", props: { name: "BookmarkLine" } }],
                selected: true,
              },
            ]}
          />
        </Box>

        <Box width="360px">
          <List
            title="액션 포함"
            items={[
              {
                label: "닫기",
                endItem: [
                  {
                    type: "IconButton",
                    props: {
                      icon: "CloseLine",
                      ariaLabel: "닫기",
                    },
                  },
                ],
              },
              {
                label: "알림",
                endItem: [
                  {
                    type: "Switch",
                    props: {
                      checked: enabled,
                      label: "",
                      onChange: () => setEnabled((prev) => !prev),
                    },
                  },
                ],
              },
            ]}
          />
        </Box>

        <Box width="360px">
          <List
            title="체크박스 포함"
            items={[
              {
                label: "약관",
                startItem: [
                  {
                    type: "CheckBox",
                    props: {
                      checked,
                      label: "동의",
                      onChange: setChecked,
                    },
                  },
                ],
              },
              {
                label: "비활성 항목",
                disabled: true,
                startItem: [{ type: "Icon", props: { name: "EyeOff" } }],
              },
            ]}
          />
        </Box>
      </Box>
    )
  },
}
