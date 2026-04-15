import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import Stepper from "./Stepper"

const meta: Meta<typeof Stepper> = {
  title: "Navigation/Stepper",
  component: Stepper,
}

export default meta

type Story = StoryObj<typeof Stepper>

/**
 * Playground
 */
export const Playground: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>("a")

    return (
      <Stepper
        options={[
          { value: "a", label: "Step A" },
          { value: "b", label: "Step B" },
          { value: "c", label: "Step C" },
        ]}
        value={value}
        onSelect={(v) => setValue(v)}
      />
    )
  },
}

/**
 * Variants (상태)
 */
export const Variants: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>("b")

    return (
      <Stepper
        options={[
          { value: "a", label: "Completed", completed: true },
          { value: "b", label: "Active" },
          { value: "c", label: "Error", error: true },
          { value: "d", label: "Disabled", disabled: true },
        ]}
        value={value}
        onSelect={(v) => setValue(v)}
      />
    )
  },
}

/**
 * Vertical
 */
export const Vertical: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>("a")

    return (
      <Stepper
        orientation="vertical"
        options={[
          { value: "a", label: "Step A" },
          { value: "b", label: "Step B" },
          { value: "c", label: "Step C" },
        ]}
        value={value}
        onSelect={(v) => setValue(v)}
      />
    )
  },
}

/**
 * Non Linear
 */
export const NonLinear: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>("a")

    return (
      <Stepper
        linear={false}
        options={[
          { value: "a", label: "Step A" },
          { value: "b", label: "Step B" },
          { value: "c", label: "Step C" },
        ]}
        value={value}
        onSelect={(v) => setValue(v)}
      />
    )
  },
}

/**
 * Custom Icon / Content
 */
export const CustomContent: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>("a")

    return (
      <Stepper
        linear={false}
        options={[
          { value: "a", children: "HomeFill", label: "Home" },
          { value: "b", children: "UserLine", label: "User" },
          { value: "c", children: <span>✓</span>, label: "Done" },
        ]}
        value={value}
        onSelect={(v) => setValue(v)}
      />
    )
  },
}
