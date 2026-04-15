import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import Rating from "./Rating"

const meta: Meta<typeof Rating> = {
  title: "Feedback/Rating",
  component: Rating,
}

export default meta

export const Playground: StoryObj<typeof Rating> = {
  render: () => {
    const [value, setValue] = useState<number | null>(0)

    return <Rating value={value} onChange={setValue} max={5} />
  },
}

export const Variants: StoryObj<typeof Rating> = {
  render: () => (
    <>
      <Rating defaultValue={2} />
      <Rating readOnly defaultValue={4} />
      <Rating disabled defaultValue={3} />
    </>
  ),
}
