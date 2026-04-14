import type { Meta, StoryObj } from "@storybook/react"
import Flex from "./Flex"
import Box from "../Box/Box"
import Button from "../Button/Button"
import { Typography } from "../Typography/Typography"

const meta: Meta<typeof Flex> = {
  title: "Components/Flex",
  component: Flex,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    as: {
      control: "select",
      options: ["div", "section", "article", "main"],
    },
    direction: {
      control: "radio",
      options: ["row", "column", "row-reverse", "column-reverse"],
    },
    justify: {
      control: "select",
      options: [
        "flex-start",
        "center",
        "flex-end",
        "space-between",
        "space-around",
        "space-evenly",
      ],
    },
    align: {
      control: "select",
      options: ["stretch", "flex-start", "center", "flex-end", "baseline"],
    },
    wrap: {
      control: "radio",
      options: ["nowrap", "wrap", "wrap-reverse"],
    },
    gap: { control: "text" },
    children: { control: false },
    extraProps: { control: false },
    isActive: { control: false },
  },
  args: {
    as: "div",
    direction: "row",
    justify: "flex-start",
    align: "center",
    wrap: "nowrap",
    gap: "12px",
  },
}

export default meta
type Story = StoryObj<typeof Flex>

export const Playground: Story = {
  render: (args) => {
    return (
      <Flex {...args}>
        <Box
          p="12px"
          sx={{
            minWidth: "80px",
            border: "1px solid",
            borderColor: "border.default",
            backgroundColor: "background.default",
            textAlign: "center",
          }}
        >
          Item 1
        </Box>
        <Box
          p="12px"
          sx={{
            minWidth: "80px",
            border: "1px solid",
            borderColor: "border.default",
            backgroundColor: "grayscale.white",
            textAlign: "center",
          }}
        >
          Item 2
        </Box>
        <Box
          p="12px"
          sx={{
            minWidth: "80px",
            border: "1px solid",
            borderColor: "border.default",
            backgroundColor: "background.dark",
            textAlign: "center",
          }}
        >
          Item 3
        </Box>
      </Flex>
    )
  },
}

export const AllCases: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return (
      <Box p="24px" width="960px">
        <Typography variant="h3" text="Flex Cases" mb="16px" />

        <Flex direction="column" gap="24px">
          <Box>
            <Typography variant="b1Bold" text="Direction" mb="8px" />
            <Flex gap="20px" wrap="wrap">
              <Flex
                direction="row"
                gap="8px"
                p="12px"
                sx={{ border: "1px solid", borderColor: "border.default" }}
              >
                <Button text="A" />
                <Button text="B" />
                <Button text="C" />
              </Flex>

              <Flex
                direction="column"
                gap="8px"
                p="12px"
                sx={{ border: "1px solid", borderColor: "border.default" }}
              >
                <Button text="A" />
                <Button text="B" />
                <Button text="C" />
              </Flex>
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Justify / Align" mb="8px" />
            <Flex
              justify="space-between"
              align="center"
              height="120px"
              p="12px"
              sx={{ border: "1px solid", borderColor: "border.default" }}
            >
              <Box p="12px" sx={{ border: "1px solid", borderColor: "border.default" }}>
                Left
              </Box>
              <Box p="12px" sx={{ border: "1px solid", borderColor: "border.default" }}>
                Center
              </Box>
              <Box p="12px" sx={{ border: "1px solid", borderColor: "border.default" }}>
                Right
              </Box>
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Wrap" mb="8px" />
            <Flex
              wrap="wrap"
              gap="8px"
              width="360px"
              p="12px"
              sx={{ border: "1px solid", borderColor: "border.default" }}
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <Box
                  key={index}
                  p="12px"
                  sx={{
                    width: "90px",
                    border: "1px solid",
                    borderColor: "border.default",
                    textAlign: "center",
                  }}
                >
                  Item {index + 1}
                </Box>
              ))}
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Composition" mb="8px" />
            <Flex
              direction="column"
              gap="12px"
              p="16px"
              width="520px"
              sx={{ border: "1px solid", borderColor: "border.default" }}
            >
              <Typography variant="b1Bold" text="Header" />
              <Typography
                variant="b2Regular"
                text="Flex는 컴포넌트 조합과 레이아웃 분배에 사용하는 베이스 래퍼입니다."
                color="text.secondary"
              />
              <Flex gap="8px" justify="flex-end">
                <Button text="Cancel" variant="outlined" color="normal" />
                <Button text="Confirm" />
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Box>
    )
  },
}

export const SemanticElements: Story = {
  render: () => {
    return (
      <Flex
        as="section"
        direction="column"
        gap="12px"
        width="640px"
        p="16px"
        sx={{ border: "1px solid", borderColor: "border.default" }}
      >
        <Typography variant="h3" text="Semantic Flex Section" />
        <Flex as="article" gap="12px" p="12px" sx={{ backgroundColor: "background.default" }}>
          <Box p="12px" sx={{ border: "1px solid", borderColor: "border.default" }}>
            Article A
          </Box>
          <Box p="12px" sx={{ border: "1px solid", borderColor: "border.default" }}>
            Article B
          </Box>
        </Flex>
      </Flex>
    )
  },
}
