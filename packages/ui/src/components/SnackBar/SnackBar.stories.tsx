import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import SnackBar from "./SnackBar"
import { useSnackBarStore } from "../../stores/useSnackBarStore"
import Button from "../Button/Button"
import Flex from "../Flex/Flex"

const meta: Meta<typeof SnackBar> = {
  title: "Feedback/SnackBar",
  component: SnackBar,
}

export default meta

type Story = StoryObj<typeof SnackBar>

/**
 * Playground
 */
export const Playground: Story = {
  render: () => {
    const { snackbars } = useSnackBarStore()
    const [count, setCount] = useState(0)

    const push = (status?: any) => {
      const id = String(Date.now())

      useSnackBarStore.setState({
        snackbars: [
          ...snackbars,
          {
            id,
            message: `메시지 ${count}`,
            status,
            autoHideDuration: 3000,
            placement: "top-end",
          },
        ],
      })

      setCount((prev) => prev + 1)
    }

    return (
      <Flex direction="column" gap={12}>
        <Flex gap={8}>
          <Button onClick={() => push("success")} text="Success" />
          <Button onClick={() => push("error")} text="Error" />
          <Button onClick={() => push("warning")} text="Warning" />
          <Button onClick={() => push("info")} text="Info" />
        </Flex>

        <SnackBar.List />
      </Flex>
    )
  },
}

/**
 * Variants
 */
export const Variants: Story = {
  render: () => {
    const { snackbars } = useSnackBarStore()

    const push = (status: any) => {
      const id = String(Date.now())

      useSnackBarStore.setState({
        snackbars: [
          ...snackbars,
          {
            id,
            message: status,
            status,
            autoHideDuration: 3000,
            placement: "top-end",
          },
        ],
      })
    }

    return (
      <Flex gap={8}>
        <Button onClick={() => push("success")} text="Success" />
        <Button onClick={() => push("error")} text="Error" />
        <Button onClick={() => push("warning")} text="Warning" />
        <Button onClick={() => push("info")} text="Info" />
        <SnackBar.List />
      </Flex>
    )
  },
}

/**
 * Placement
 */
export const Placement: Story = {
  render: () => {
    const placements = [
      "top",
      "bottom",
      "left",
      "right",
      "top-start",
      "top-end",
      "bottom-start",
      "bottom-end",
    ] as const

    const { snackbars } = useSnackBarStore()

    const push = (placement: any) => {
      const id = String(Date.now())

      useSnackBarStore.setState({
        snackbars: [
          ...snackbars,
          {
            id,
            message: placement,
            placement,
            autoHideDuration: 3000,
          },
        ],
      })
    }

    return (
      <Flex direction="column" gap={8}>
        <Flex wrap="wrap" gap={8}>
          {placements.map((p) => (
            <Button key={p} onClick={() => push(p)} text={p} />
          ))}
        </Flex>

        <SnackBar.List />
      </Flex>
    )
  },
}

/**
 * Persistent (autoHide 없음)
 */
export const Persistent: Story = {
  render: () => {
    const { snackbars } = useSnackBarStore()

    const push = () => {
      const id = String(Date.now())

      useSnackBarStore.setState({
        snackbars: [
          ...snackbars,
          {
            id,
            message: "자동 닫힘 없음",
            placement: "bottom-end",
          },
        ],
      })
    }

    return (
      <Flex gap={8}>
        <Button onClick={push} text="Push" />
        <SnackBar.List />
      </Flex>
    )
  },
}
