import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import Select, { SelectOptionType } from "./Select"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"

const fruitOptions: SelectOptionType<string>[] = [
  { value: "apple", label: "사과" },
  { value: "banana", label: "바나나" },
  { value: "grape", label: "포도" },
  { value: "orange", label: "오렌지" },
]

const categoryOptions: SelectOptionType<string>[] = [
  { value: "all", label: "전체", isAllOption: true },
  { value: "design", label: "디자인", chipColor: "normal" },
  { value: "frontend", label: "프론트엔드", chipColor: "primary" },
  { value: "backend", label: "백엔드", chipColor: "secondary" },
]

const meta: Meta<typeof Select> = {
  title: "Form/Select",
  component: Select,
  args: {
    variant: "outlined",
    label: "카테고리",
    options: fruitOptions,
    placeholder: "선택",
    size: "M",
    disabled: false,
    readOnly: false,
    error: false,
    isLoading: false,
    multipleType: "default",
    labelPlacement: "top",
  },
  argTypes: {
    onChange: { action: "change" },
    onBlur: { action: "blur" },
    onFocus: { action: "focus" },
  },
}

export default meta

type Story = StoryObj<typeof Select>

export const SingleSelect: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>()

    return (
      <Box width="320px">
        <Select<string>
          multiple={false}
          label="과일"
          options={fruitOptions}
          value={value}
          onChange={setValue}
          placeholder="과일 선택"
        />
      </Box>
    )
  },
}

export const MultipleDefault: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(["frontend"])

    return (
      <Box width="360px">
        <Select<string>
          multiple
          label="직무"
          options={categoryOptions}
          value={value}
          onChange={setValue}
          multipleType="default"
          placeholder="직무 선택"
        />
      </Box>
    )
  },
}

export const MultipleChip: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(["frontend", "backend"])

    return (
      <Box width="420px">
        <Select<string>
          multiple
          label="기술 스택"
          options={categoryOptions}
          value={value}
          onChange={setValue}
          multipleType="chip"
          placeholder="기술 선택"
        />
      </Box>
    )
  },
}

export const States: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>("banana")
    const [multiValue, setMultiValue] = useState<string[]>(["design"])

    return (
      <Flex direction="column" gap="16px" width="420px">
        <Select<string>
          multiple={false}
          label="Loading"
          options={fruitOptions}
          value={value}
          onChange={setValue}
          isLoading
        />

        <Select<string>
          multiple={false}
          label="Disabled"
          options={fruitOptions}
          value={value}
          onChange={setValue}
          disabled
        />

        <Select<string>
          multiple={false}
          label="ReadOnly"
          options={fruitOptions}
          value={value}
          onChange={setValue}
          readOnly
        />

        <Select<string>
          multiple={false}
          label="Error"
          options={fruitOptions}
          value={value}
          onChange={setValue}
          error
          helperText="필수 선택 항목입니다."
        />

        <Select<string>
          multiple
          label="Multiple Error"
          options={categoryOptions}
          value={multiValue}
          onChange={setMultiValue}
          multipleType="chip"
          error
          helperText="하나 이상 선택해 주세요."
        />
      </Flex>
    )
  },
}

export const LabelPlacementCases: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>("orange")

    return (
      <Flex direction="column" gap="20px" width="360px">
        <Select<string>
          multiple={false}
          label="Top"
          labelPlacement="top"
          options={fruitOptions}
          value={value}
          onChange={setValue}
        />

        <Select<string>
          multiple={false}
          label="Bottom"
          labelPlacement="bottom"
          options={fruitOptions}
          value={value}
          onChange={setValue}
        />

        <Select<string>
          multiple={false}
          label="Left"
          labelPlacement="left"
          options={fruitOptions}
          value={value}
          onChange={setValue}
        />

        <Select<string>
          multiple={false}
          label="Right"
          labelPlacement="right"
          options={fruitOptions}
          value={value}
          onChange={setValue}
        />
      </Flex>
    )
  },
}

export const Variants: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>("grape")

    return (
      <Flex direction="column" gap="16px" width="360px">
        <Select<string>
          multiple={false}
          label="Outlined"
          variant="outlined"
          options={fruitOptions}
          value={value}
          onChange={setValue}
        />

        <Select<string>
          multiple={false}
          label="Filled"
          variant="filled"
          options={fruitOptions}
          value={value}
          onChange={setValue}
        />

        <Select<string>
          multiple={false}
          label="Standard"
          variant="standard"
          options={fruitOptions}
          value={value}
          onChange={setValue}
        />
      </Flex>
    )
  },
}
