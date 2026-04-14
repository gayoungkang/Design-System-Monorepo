import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import Progress from "./Progress"

const meta: Meta<typeof Progress> = {
  title: "Feedback/Progress",
  component: Progress,
}

export default meta

export const Playground: StoryObj<typeof Progress> = {
  render: () => {
    const [value, setValue] = useState(40)

    return (
      <div style={{ width: 300 }}>
        <button onClick={() => setValue((v) => Math.min(100, v + 10))}>increase</button>

        <Progress type="bar" variant="determinate" value={value} label="bar" />
      </div>
    )
  },
}

export const Variants: StoryObj<typeof Progress> = {
  render: () => (
    <div style={{ display: "flex", gap: 40 }}>
      <Progress type="bar" variant="indeterminate" />
      <Progress type="bar" variant="determinate" value={60} />
      <Progress type="circular" variant="indeterminate" />
      <Progress type="circular" variant="determinate" value={70} />
    </div>
  ),
}
