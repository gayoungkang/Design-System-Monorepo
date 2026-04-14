import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import RadioGroup from "./RadioGroup"

const meta: Meta<typeof RadioGroup> = {
  title: "Input/RadioGroup",
  component: RadioGroup,
}

export default meta

export const Playground: StoryObj<typeof RadioGroup> = {
  render: () => {
    const [value, setValue] = useState("A")

    return (
      <RadioGroup
        value={value}
        onChange={setValue}
        data={[
          { text: "Option A", value: "A" },
          { text: "Option B", value: "B" },
        ]}
      />
    )
  },
}

export const Variants: StoryObj<typeof RadioGroup> = {
  render: () => (
    <>
      <RadioGroup
        value="A"
        data={[
          { text: "A", value: "A" },
          { text: "B", value: "B" },
        ]}
      />

      <RadioGroup
        direction="vertical"
        value="A"
        data={[
          { text: "A", value: "A" },
          { text: "B", value: "B" },
        ]}
      />
    </>
  ),
}
