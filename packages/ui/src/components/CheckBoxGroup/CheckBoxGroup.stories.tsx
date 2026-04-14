import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import CheckBoxGroup, { CheckBox } from "./CheckBoxGroup"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import { Typography } from "../Typography/Typography"

const meta: Meta<typeof CheckBoxGroup> = {
  title: "Components/CheckBox",
  component: CheckBoxGroup,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof CheckBoxGroup>

export const Playground: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([])

    return (
      <Flex direction="column" gap="12px" align="center">
        <CheckBoxGroup
          data={[
            { text: "Option A", value: "a" },
            { text: "Option B", value: "b" },
          ]}
          value={value}
          onChange={setValue}
        />

        <Typography
          variant="b3Regular"
          text={`selected: ${value.join(", ") || "none"}`}
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
    const [value, setValue] = useState<string[]>(["a"])

    return (
      <Box p="24px" width="900px">
        <Typography variant="h3" text="CheckBox Cases" mb="16px" />

        <Flex direction="column" gap="24px">
          <Box>
            <Typography variant="b1Bold" text="Single" mb="8px" />
            <Flex gap="12px">
              <CheckBox label="Default" />
              <CheckBox label="Checked" checked />
              <CheckBox label="Indeterminate" indeterminate />
              <CheckBox label="Disabled" disabled />
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Group" mb="8px" />
            <CheckBoxGroup
              data={[
                { text: "A", value: "a" },
                { text: "B", value: "b" },
                { text: "C", value: "c" },
              ]}
              value={value}
              onChange={setValue}
            />
          </Box>

          <Box>
            <Typography variant="b1Bold" text="All Check" mb="8px" />
            <CheckBoxGroup
              allCheck
              data={[
                { text: "A", value: "a" },
                { text: "B", value: "b" },
                { text: "C", value: "c" },
              ]}
              value={value}
              onChange={setValue}
            />
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Vertical" mb="8px" />
            <CheckBoxGroup
              direction="vertical"
              data={[
                { text: "A", value: "a" },
                { text: "B", value: "b" },
                { text: "C", value: "c" },
              ]}
              value={value}
              onChange={setValue}
            />
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Error / HelperText" mb="8px" />
            <CheckBoxGroup
              data={[
                { text: "A", value: "a" },
                { text: "B", value: "b" },
              ]}
              error
              helperText="필수 선택 항목입니다."
            />
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Sizes" mb="8px" />
            <Flex gap="20px">
              <CheckBoxGroup size="S" data={[{ text: "S", value: "s" }]} />
              <CheckBoxGroup size="M" data={[{ text: "M", value: "m" }]} />
              <CheckBoxGroup size="L" data={[{ text: "L", value: "l" }]} />
            </Flex>
          </Box>
        </Flex>
      </Box>
    )
  },
}

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([])

    return (
      <Flex direction="column" gap="16px" align="center">
        <CheckBoxGroup
          allCheck
          data={[
            { text: "React", value: "react" },
            { text: "Vue", value: "vue" },
            { text: "Angular", value: "angular" },
          ]}
          value={value}
          onChange={setValue}
        />

        <Button text="Reset" variant="outlined" onClick={() => setValue([])} />

        <Typography
          variant="b3Regular"
          text={`selected: ${value.join(", ") || "none"}`}
          color="text.secondary"
        />
      </Flex>
    )
  },
}
