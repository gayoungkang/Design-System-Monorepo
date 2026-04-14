import type { Meta, StoryObj } from "@storybook/react"
import Box from "./Box"
import type { BoxProps } from "./Box"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import { Typography } from "../Typography/Typography"

const meta: Meta<typeof Box> = {
  title: "Components/Box",
  component: Box,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    as: {
      control: "select",
      options: ["div", "section", "article", "main", "aside", "header", "footer"],
    },
    children: { control: "text" },
  },
  args: {
    as: "div",
    children: "Box Content",
    width: "240px",
    p: "16px",
    sx: {
      border: `1px solid`,
      borderColor: "border.default",
    },
  },
}

export default meta
type Story = StoryObj<typeof Box>

export const Playground: Story = {
  render: (args) => {
    return (
      <Box
        {...args}
        sx={{
          border: `1px solid`,
          borderColor: "border.default",
          backgroundColor: "background.default",
          ...((args.sx as BoxProps["sx"]) ?? {}),
        }}
      />
    )
  },
}

export const AllCases: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return (
      <Box p="24px" width="1000px">
        <Typography variant="h3" text="Box Cases" mb="16px" />

        <Flex direction="column" gap="20px">
          <Box>
            <Typography variant="b1Bold" text="Basic Layout" mb="8px" />
            <Flex gap="12px" wrap="wrap">
              <Box
                width="180px"
                p="16px"
                sx={{
                  border: `1px solid`,
                  borderColor: "border.default",
                  backgroundColor: "background.default",
                }}
              >
                Basic Box
              </Box>

              <Box
                as="section"
                width="180px"
                p="16px"
                sx={{
                  border: `1px solid`,
                  borderColor: "border.default",
                  backgroundColor: "grayscale.white",
                }}
              >
                Section Box
              </Box>

              <Box
                as="article"
                width="180px"
                p="16px"
                sx={{
                  border: `1px solid`,
                  borderColor: "border.default",
                  backgroundColor: "background.dark",
                }}
              >
                Article Box
              </Box>
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Spacing" mb="8px" />
            <Flex gap="12px" wrap="wrap" align="flex-start">
              <Box
                width="140px"
                p="8px"
                sx={{
                  border: `1px solid`,
                  borderColor: "border.default",
                  backgroundColor: "background.default",
                }}
              >
                p=8px
              </Box>

              <Box
                width="140px"
                p="16px"
                sx={{
                  border: `1px solid`,
                  borderColor: "border.default",
                  backgroundColor: "background.default",
                }}
              >
                p=16px
              </Box>

              <Box
                width="140px"
                px="20px"
                py="12px"
                sx={{
                  border: `1px solid`,
                  borderColor: "border.default",
                  backgroundColor: "background.default",
                }}
              >
                px=20 / py=12
              </Box>
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Composition" mb="8px" />
            <Box
              p="16px"
              width="520px"
              sx={{
                border: `1px solid`,
                borderColor: "border.default",
                backgroundColor: "grayscale.white",
              }}
            >
              <Flex direction="column" gap="12px">
                <Typography variant="b1Bold" text="Card Header" />
                <Typography
                  variant="b2Regular"
                  text="Box는 범용 레이아웃 래퍼로 내부 조합의 기반이 됩니다."
                  color="text.secondary"
                />
                <Flex gap="8px">
                  <Button text="Confirm" />
                  <Button text="Cancel" variant="outlined" color="normal" />
                </Flex>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Box>
    )
  },
}

export const SemanticElements: Story = {
  render: () => {
    return (
      <Flex direction="column" gap="12px" width="720px">
        <Box
          as="header"
          p="16px"
          sx={{
            border: `1px solid`,
            borderColor: "border.default",
            backgroundColor: "background.default",
          }}
        >
          <Typography variant="b1Bold" text="Header" />
        </Box>

        <Box
          as="main"
          p="16px"
          sx={{
            border: `1px solid`,
            borderColor: "border.default",
            backgroundColor: "grayscale.white",
          }}
        >
          <Typography variant="b2Regular" text="Main Content" />
        </Box>

        <Box
          as="footer"
          p="16px"
          sx={{
            border: `1px solid`,
            borderColor: "border.default",
            backgroundColor: "background.default",
          }}
        >
          <Typography variant="b3Regular" text="Footer" color="text.secondary" />
        </Box>
      </Flex>
    )
  },
}
