import type { Meta, StoryObj } from "@storybook/react"
import { useEffect } from "react"
import AlertModal from "./AlertModal"
import { useAlertStore } from "../../stores/useAlertStore"
import Button from "../Button/Button"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import { Typography } from "../Typography/Typography"

const meta: Meta<typeof AlertModal> = {
  title: "Components/AlertModal",
  component: AlertModal,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof AlertModal>

const DemoController = () => {
  const setAlert = useAlertStore((s: any) => s.setAlert)

  return (
    <Flex direction="column" gap="12px" align="center">
      <Button
        text="Open Alert"
        onClick={() =>
          setAlert({
            open: true,
            type: "alert",
            title: "Alert",
            message: "This is alert message",
          })
        }
      />

      <Button
        text="Open Confirm"
        variant="outlined"
        onClick={() =>
          setAlert({
            open: true,
            type: "confirm",
            title: "Confirm",
            message: "Are you sure?",
          })
        }
      />
    </Flex>
  )
}

export const Playground: Story = {
  render: () => {
    return (
      <Box width="400px">
        <DemoController />
        <AlertModal />
      </Box>
    )
  },
}

export const AllCases: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    const setAlert = useAlertStore((s: any) => s.setAlert)

    useEffect(() => {
      setAlert({
        open: true,
        type: "alert",
        title: "Welcome",
        message: "This is default alert example",
      })
    }, [])

    return (
      <Box p="24px" width="600px">
        <Typography variant="h3" text="AlertModal Cases" mb="16px" />

        <Flex direction="column" gap="12px">
          <Button
            text="Alert (단일 버튼)"
            onClick={() =>
              setAlert({
                open: true,
                type: "alert",
                title: "Alert",
                message: "단일 확인 버튼만 있는 모달입니다.",
              })
            }
          />

          <Button
            text="Confirm (2버튼)"
            variant="outlined"
            onClick={() =>
              setAlert({
                open: true,
                type: "confirm",
                title: "Confirm",
                message: "확인 / 취소 버튼이 있는 모달입니다.",
              })
            }
          />

          <Button
            text="With Callback"
            variant="text"
            onClick={() =>
              setAlert({
                open: true,
                type: "confirm",
                title: "Callback",
                message: "콘솔을 확인하세요.",
                onConfirm: () => console.log("confirmed"),
                onCancel: () => console.log("canceled"),
              })
            }
          />
        </Flex>

        <AlertModal />
      </Box>
    )
  },
}
