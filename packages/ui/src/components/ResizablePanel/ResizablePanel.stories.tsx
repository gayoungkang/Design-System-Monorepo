import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import ResizablePanel from "./ResizablePanel"

const meta: Meta<typeof ResizablePanel> = {
  title: "Layout/ResizablePanel",
  component: ResizablePanel,
}

export default meta

export const Playground: StoryObj<typeof ResizablePanel> = {
  render: () => {
    const [size, setSize] = useState(300)

    return (
      <ResizablePanel size={size} onResize={setSize}>
        content
      </ResizablePanel>
    )
  },
}
