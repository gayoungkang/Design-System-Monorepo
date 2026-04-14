import type { Meta, StoryObj } from "@storybook/react"
import { useRef, useState } from "react"
import Popper from "./Popper"

const meta: Meta<typeof Popper> = {
  title: "Overlay/Popper",
  component: Popper,
}

export default meta

export const Playground: StoryObj<typeof Popper> = {
  render: () => {
    const ref = useRef<HTMLButtonElement>(null)
    const [open, setOpen] = useState(false)

    return (
      <div style={{ padding: 100 }}>
        <button ref={ref} onClick={() => setOpen((v) => !v)}>
          toggle
        </button>

        <Popper open={open} anchorRef={ref} placement="bottom" onClose={() => setOpen(false)}>
          <div style={{ padding: 16 }}>content</div>
        </Popper>
      </div>
    )
  },
}
