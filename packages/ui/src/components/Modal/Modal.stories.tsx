import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import Modal from "./Modal"
import Box from "../Box/Box"
import Button from "../Button/Button"
import Flex from "../Flex/Flex"
import { Typography } from "../Typography/Typography"

const meta: Meta<typeof Modal> = {
  title: "Feedback/Modal",
  component: Modal,
  args: {
    open: true,
    title: "기본 모달",
    width: "420px",
    allowBackdrop: false,
    confirmText: "확인",
    closeText: "취소",
  },
  argTypes: {
    open: { control: "boolean" },
    title: { control: "text" },
    width: { control: "text" },
    allowBackdrop: { control: "boolean" },
    confirmText: { control: "text" },
    closeText: { control: "text" },
  },
}

export default meta

type Story = StoryObj<typeof Modal>

export const Playground: Story = {
  render: (args) => {
    const [open, setOpen] = useState(Boolean(args.open))

    return (
      <Box>
        <Button text="모달 열기" onClick={() => setOpen(true)} />
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        >
          <Typography text="모달 본문입니다." />
        </Modal>
      </Box>
    )
  },
}

export const AllCases: Story = {
  render: () => {
    const [basicOpen, setBasicOpen] = useState(false)
    const [customOpen, setCustomOpen] = useState(false)
    const [backdropOpen, setBackdropOpen] = useState(false)

    return (
      <Flex direction="column" gap={12}>
        <Flex gap={8}>
          <Button text="기본 모달" onClick={() => setBasicOpen(true)} />
          <Button text="커스텀 헤더/푸터" onClick={() => setCustomOpen(true)} />
          <Button text="백드롭 닫기 허용" onClick={() => setBackdropOpen(true)} />
        </Flex>

        <Modal
          open={basicOpen}
          title="기본 모달"
          onClose={() => setBasicOpen(false)}
          onConfirm={() => setBasicOpen(false)}
        >
          <Typography text="기본 헤더/푸터를 사용하는 모달입니다." />
        </Modal>

        <Modal
          open={customOpen}
          onClose={() => setCustomOpen(false)}
          headerComponent={
            <Box p="16px 20px">
              <Typography variant="h2" text="커스텀 헤더" />
            </Box>
          }
          footerComponent={
            <Flex justify="flex-end" gap="8px" p="12px 16px">
              <Button
                color="normal"
                variant="text"
                text="닫기"
                onClick={() => setCustomOpen(false)}
              />
              <Button text="확인" onClick={() => setCustomOpen(false)} />
            </Flex>
          }
        >
          <Typography text="커스텀 헤더와 푸터를 사용하는 모달입니다." />
        </Modal>

        <Modal
          open={backdropOpen}
          title="백드롭 닫기"
          allowBackdrop
          onClose={() => setBackdropOpen(false)}
          onConfirm={() => setBackdropOpen(false)}
        >
          <Typography text="바깥 영역을 클릭하면 닫힙니다." />
        </Modal>
      </Flex>
    )
  },
}
