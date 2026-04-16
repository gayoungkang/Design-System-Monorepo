import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import Accordion from "./Accordion"
import type { AccordionProps } from "./Accordion"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import { Typography } from "../Typography/Typography"

const meta: Meta<typeof Accordion> = {
  title: "Layout/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    expanded: { control: false },
    defaultExpanded: { control: "boolean" },
    disabled: { control: "boolean" },
    onChange: { action: "onChange" },
    summary: { control: "text" },
    children: { control: "text" },
  },
  args: {
    defaultExpanded: false,
    disabled: false,
    summary: "Accordion Summary",
    children: "Accordion Details Content",
  },
}

export default meta
type Story = StoryObj<typeof Accordion>

export const Playground: Story = {
  render: (args) => {
    return (
      <Box width="520px">
        <Accordion {...args} />
      </Box>
    )
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [expanded, setExpanded] = useState(false)

    return (
      <Box width="520px">
        <Flex direction="column" gap="12px">
          <Flex align="center" gap="8px">
            <Button
              text={expanded ? "Close from outside" : "Open from outside"}
              variant="outlined"
              color="normal"
              onClick={() => setExpanded((prev) => !prev)}
            />
            <Typography
              variant="b2Regular"
              text={`expanded: ${expanded ? "true" : "false"}`}
              color="text.secondary"
            />
          </Flex>

          <Accordion
            {...args}
            expanded={expanded}
            onChange={(next) => {
              args.onChange?.(next)
              setExpanded(next)
            }}
            summary="Controlled Accordion"
          >
            Controlled details content
          </Accordion>
        </Flex>
      </Box>
    )
  },
}

export const AllCases: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    const [controlledOpen, setControlledOpen] = useState(true)

    return (
      <Box p="24px" width="900px">
        <Typography variant="h3" text="Accordion Cases" mb="16px" />

        <Flex direction="column" gap="12px">
          <Accordion summary="Default Closed">기본 닫힘 상태입니다.</Accordion>

          <Accordion summary="Default Expanded" defaultExpanded>
            기본 열림 상태입니다.
          </Accordion>

          <Accordion summary="Disabled" disabled>
            disabled 상태에서는 열리지 않습니다.
          </Accordion>

          <Accordion
            summary={
              <Flex align="center" gap="8px">
                <Typography variant="b1Bold" text="Custom Summary Node" />
                <Typography variant="b3Regular" text="ReactNode header" color="text.secondary" />
              </Flex>
            }
          >
            summary가 ReactNode인 케이스입니다.
          </Accordion>

          <Accordion
            expanded={controlledOpen}
            onChange={setControlledOpen}
            summary="Controlled State"
          >
            외부 state로 제어되는 아코디언입니다.
          </Accordion>

          <Flex align="center" gap="8px">
            <Button
              text={controlledOpen ? "Set Closed" : "Set Open"}
              variant="outlined"
              color="primary"
              onClick={() => setControlledOpen((prev) => !prev)}
            />
            <Typography
              variant="b2Regular"
              text={`controlledOpen: ${controlledOpen ? "true" : "false"}`}
              color="text.secondary"
            />
          </Flex>
        </Flex>
      </Box>
    )
  },
}

export const FAQGroup: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    const items: Pick<AccordionProps, "summary" | "children">[] = [
      {
        summary: "디자인 시스템은 어디에서 개발하나요?",
        children: "UI 컴포넌트는 packages/ui에서만 개발하고 앱에서는 소비만 합니다.",
      },
      {
        summary: "앱에서 deep import를 해도 되나요?",
        children: "아니요. public entry인 @acme/ui만 사용하고 deep import는 금지합니다.",
      },
      {
        summary: "스토리북은 언제 추가하나요?",
        children: "신규 컴포넌트 또는 기능 변경 시 Playground와 상태별 스토리를 함께 관리합니다.",
      },
    ]

    return (
      <Box p="24px" width="760px">
        <Typography variant="h3" text="FAQ Group" mb="16px" />

        <Flex direction="column" gap="10px">
          {items.map((item, index) => (
            <Accordion key={`${String(item.summary)}_${index}`} summary={item.summary}>
              {item.children}
            </Accordion>
          ))}
        </Flex>
      </Box>
    )
  },
}
