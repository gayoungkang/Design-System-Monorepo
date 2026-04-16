import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import ToggleButton from "./ToggleButton"
import Flex from "../Flex/Flex"

const buttons = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
  { label: "Option C", value: "c" },
]
import type { ToggleButtonItem } from "./ToggleButton"

type ViewValue = "ArrowRight" | "ArrowUp" | "ArrowDown"

const iconButtons = [
  { label: "ArrowRight", value: "ArrowRight", startIcon: "ArrowRight" },
  { label: "ArrowUp", value: "ArrowUp", startIcon: "ArrowUp" },
  { label: "ArrowDown", value: "ArrowDown", startIcon: "ArrowDown" },
] satisfies ToggleButtonItem<ViewValue>[]

const meta: Meta<typeof ToggleButton> = {
  title: "Inputs/ToggleButton",
  component: ToggleButton,
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    size: {
      control: "select",
      options: ["S", "M", "L"],
    },
    disabled: {
      control: "boolean",
    },
    onClick: { action: "click" },
  },
}

export default meta

type Story = StoryObj<typeof ToggleButton>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState("a")

    return (
      <ToggleButton
        {...args}
        buttons={buttons}
        selectedValue={value}
        onClick={(v) => {
          setValue(v)
          args.onClick?.(v)
        }}
      />
    )
  },
}

export const Sizes: Story = {
  render: () => {
    const [s, setS] = useState("a")
    const [m, setM] = useState("a")
    const [l, setL] = useState("a")

    return (
      <Flex direction="column" gap={16}>
        <ToggleButton size="S" buttons={buttons} selectedValue={s} onClick={setS} />
        <ToggleButton size="M" buttons={buttons} selectedValue={m} onClick={setM} />
        <ToggleButton size="L" buttons={buttons} selectedValue={l} onClick={setL} />
      </Flex>
    )
  },
}

export const Vertical: Story = {
  render: () => {
    const [value, setValue] = useState("a")

    return (
      <ToggleButton
        orientation="vertical"
        buttons={buttons}
        selectedValue={value}
        onClick={setValue}
      />
    )
  },
}

export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState("list")

    return <ToggleButton buttons={iconButtons} selectedValue={value} onClick={setValue} />
  },
}

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = useState("a")

    return <ToggleButton buttons={buttons} selectedValue={value} disabled onClick={setValue} />
  },
}

export const PartialDisabled: Story = {
  render: () => {
    const [value, setValue] = useState("a")

    return (
      <ToggleButton
        buttons={[
          { label: "A", value: "a" },
          { label: "B", value: "b", disabled: true },
          { label: "C", value: "c" },
        ]}
        selectedValue={value}
        onClick={setValue}
      />
    )
  },
}

export const AllCases: Story = {
  render: () => {
    const [valueA, setValueA] = useState("a")
    const [valueB, setValueB] = useState("list")

    return (
      <Flex direction="column" gap={20}>
        <ToggleButton label="Basic" buttons={buttons} selectedValue={valueA} onClick={setValueA} />

        <ToggleButton
          label="With Icons"
          buttons={iconButtons}
          selectedValue={valueB}
          onClick={setValueB}
        />

        <ToggleButton
          label="Disabled"
          buttons={buttons}
          selectedValue="a"
          disabled
          onClick={() => {}}
        />
      </Flex>
    )
  },
}
