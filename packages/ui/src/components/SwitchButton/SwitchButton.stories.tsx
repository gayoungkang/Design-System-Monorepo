import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import SwitchButton from "./SwitchButton"
import Flex from "../Flex/Flex"

const meta: Meta<typeof SwitchButton> = {
  title: "Inputs/SwitchButton",
  component: SwitchButton,
  args: {
    checked: false,
    disabled: false,
    size: "M",
    color: "primary",
    label: "알림",
    labelPlacement: "right",
  },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    size: {
      control: "select",
      options: ["S", "M", "L"],
    },
    color: {
      control: "text",
    },
    label: {
      control: "text",
    },
    labelPlacment: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    labelPlacement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    onChange: { action: "changed" },
    typographyProps: { control: false },
  },
}

export default meta

type Story = StoryObj<typeof SwitchButton>

export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState<boolean>(Boolean(args.checked))

    return (
      <SwitchButton
        {...args}
        checked={checked}
        onChange={(nextChecked) => {
          setChecked(nextChecked)
          args.onChange?.(nextChecked)
        }}
      />
    )
  },
}

export const Sizes: Story = {
  render: () => {
    const [small, setSmall] = useState(false)
    const [medium, setMedium] = useState(true)
    const [large, setLarge] = useState(false)

    return (
      <Flex direction="column" gap={16}>
        <SwitchButton checked={small} onChange={setSmall} size="S" label="Small" />
        <SwitchButton checked={medium} onChange={setMedium} size="M" label="Medium" />
        <SwitchButton checked={large} onChange={setLarge} size="L" label="Large" />
      </Flex>
    )
  },
}

export const Colors: Story = {
  render: () => {
    const [primary, setPrimary] = useState(true)
    const [secondary, setSecondary] = useState(true)
    const [normal, setNormal] = useState(true)
    const [custom, setCustom] = useState(true)

    return (
      <Flex direction="column" gap={16}>
        <SwitchButton checked={primary} onChange={setPrimary} color="primary" label="Primary" />
        <SwitchButton
          checked={secondary}
          onChange={setSecondary}
          color="secondary"
          label="Secondary"
        />
        <SwitchButton checked={normal} onChange={setNormal} color="normal" label="Normal" />
        <SwitchButton checked={custom} onChange={setCustom} color="#7c3aed" label="Custom" />
      </Flex>
    )
  },
}

export const LabelPlacements: Story = {
  render: () => {
    const [top, setTop] = useState(false)
    const [bottom, setBottom] = useState(true)
    const [left, setLeft] = useState(false)
    const [right, setRight] = useState(true)

    return (
      <Flex direction="column" gap={20}>
        <SwitchButton checked={top} onChange={setTop} label="Top" labelPlacement="top" />
        <SwitchButton
          checked={bottom}
          onChange={setBottom}
          label="Bottom"
          labelPlacement="bottom"
        />
        <SwitchButton checked={left} onChange={setLeft} label="Left" labelPlacement="left" />
        <SwitchButton checked={right} onChange={setRight} label="Right" labelPlacement="right" />
      </Flex>
    )
  },
}

export const Disabled: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(true)

    return (
      <Flex direction="column" gap={16}>
        <SwitchButton checked={enabled} onChange={setEnabled} label="Enabled" />
        <SwitchButton checked={false} onChange={() => {}} disabled label="Disabled Off" />
        <SwitchButton checked onChange={() => {}} disabled label="Disabled On" />
      </Flex>
    )
  },
}

export const AllCases: Story = {
  render: () => {
    const [case1, setCase1] = useState(false)
    const [case2, setCase2] = useState(true)
    const [case3, setCase3] = useState(false)
    const [case4, setCase4] = useState(true)

    return (
      <Flex direction="column" gap={24}>
        <Flex gap={24} wrap="wrap">
          <SwitchButton checked={case1} onChange={setCase1} size="S" label="S / right" />
          <SwitchButton
            checked={case2}
            onChange={setCase2}
            size="M"
            color="secondary"
            label="M / left"
            labelPlacement="left"
          />
          <SwitchButton
            checked={case3}
            onChange={setCase3}
            size="L"
            color="#0ea5e9"
            label="L / top"
            labelPlacement="top"
          />
          <SwitchButton
            checked={case4}
            onChange={setCase4}
            size="M"
            color="normal"
            label="M / bottom"
            labelPlacement="bottom"
          />
        </Flex>

        <Flex gap={24} wrap="wrap">
          <SwitchButton checked={false} onChange={() => {}} disabled label="Disabled Off" />
          <SwitchButton checked onChange={() => {}} disabled label="Disabled On" />
        </Flex>
      </Flex>
    )
  },
}
