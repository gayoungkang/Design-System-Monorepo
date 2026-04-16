import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import FloatingButton from "./FloatingButton"

const meta: Meta<typeof FloatingButton> = {
  title: "Inputs/FloatingButton",
  component: FloatingButton,
  args: {
    icon: "Add",
    size: "M",
    color: "primary",
    placement: "top",
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["S", "M", "L"],
    },
    placement: {
      control: "radio",
      options: ["top", "bottom", "left", "right"],
    },
    color: {
      control: "text",
    },
  },
}

export default meta
type Story = StoryObj<typeof FloatingButton>

export const Playground: Story = {
  render: (args) => {
    const [count, setCount] = useState(0)

    return (
      <div>
        <FloatingButton
          {...args}
          item={[
            {
              icon: "ClipboardLine",
              label: "Clipboard",
              onClick: () => setCount((p) => p + 1),
            },
            {
              icon: "CloseLine",
              label: "Delete",
            },
          ]}
        />

        <div>clicked: {count}</div>
      </div>
    )
  },
}

export const AllCases: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", gap: 40 }}>
        <FloatingButton icon="Add" size="S" />
        <FloatingButton icon="Add" size="M" />
        <FloatingButton icon="Add" size="L" />

        <FloatingButton
          icon="Add"
          label="Create"
          item={[
            { icon: "ClipboardLine", label: "Clipboard" },
            { icon: "CloseLine", label: "Delete" },
          ]}
        />

        <FloatingButton
          icon="Add"
          placement="left"
          item={[{ icon: "ClipboardLine", label: "Clipboard" }]}
        />

        <FloatingButton icon="Add" disabled />
      </div>
    )
  },
}
