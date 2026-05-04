import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import Avatar from "./Avatar"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import { Typography } from "../Typography/Typography"
import { theme } from "../../tokens/theme"

const meta: Meta<typeof Avatar> = {
  title: "Data Display/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    src: { control: "text" },
    alt: { control: "text" },
    name: { control: "text" },
    size: { control: "radio", options: ["S", "M", "L"] },
    bgColor: { control: "color" },
    fgColor: { control: "color" },
  },
  args: {
    name: "Jane Doe",
    size: "M",
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Playground: Story = {
  render: (args) => {
    const [useBrokenImage, setUseBrokenImage] = useState(false)

    return (
      <Flex direction="column" gap="12px" align="center">
        <Avatar
          {...args}
          src={useBrokenImage ? "/broken-avatar-image.png" : args.src}
          alt={args.alt ?? "avatar"}
        />

        <Flex gap="8px">
          <Button
            text={useBrokenImage ? "Use Original Src" : "Use Broken Src"}
            variant="outlined"
            color="normal"
            onClick={() => setUseBrokenImage((prev) => !prev)}
          />
        </Flex>

        <Typography
          variant="b3Regular"
          text={useBrokenImage ? "현재 broken src 상태" : "현재 전달된 src 상태"}
          color="text.secondary"
        />
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
      <Box p="24px" width="900px">
        <Typography variant="h3" text="Avatar Cases" mb="16px" />

        <Flex direction="column" gap="20px">
          <Box>
            <Typography variant="b1Bold" text="Initials" mb="8px" />
            <Flex gap="12px" align="center">
              <Avatar name="Jane Doe" size="S" />
              <Avatar name="Jane Doe" size="M" />
              <Avatar name="Jane Doe" size="L" />
              <Avatar name="John" size="M" />
              <Avatar name="   " size="M" />
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Custom Colors" mb="8px" />
            <Flex gap="12px" align="center">
              <Avatar name="Primary" bgColor={theme.colors.primary[400]} fgColor={theme.colors.grayscale.white} />
              <Avatar name="Dark" bgColor={theme.colors.text.primary} fgColor={theme.colors.grayscale.white} />
              <Avatar name="Mint" bgColor={theme.colors.success[400]} fgColor={theme.colors.grayscale.white} />
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Image / Fallback" mb="8px" />
            <Flex gap="12px" align="center">
              <Avatar
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&fit=crop"
                alt="profile"
                name="Jane Doe"
                size="L"
              />
              <Avatar src="/broken-avatar-image.png" name="Broken Image" size="L" />
            </Flex>
          </Box>
        </Flex>
      </Box>
    )
  },
}

export const InteractiveGallery: Story = {
  render: () => {
    const [size, setSize] = useState<"S" | "M" | "L">("M")
    const [name, setName] = useState("Design System")
    const [useImage, setUseImage] = useState(false)

    const imageSrc =
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&fit=crop"

    return (
      <Flex direction="column" gap="16px" align="center">
        <Avatar
          name={name}
          size={size}
          src={useImage ? imageSrc : undefined}
          alt={name}
          bgColor={theme.colors.primary[500]}
          fgColor={theme.colors.grayscale.white}
        />

        <Flex gap="8px">
          <Button
            text="S"
            variant={size === "S" ? "contained" : "outlined"}
            onClick={() => setSize("S")}
          />
          <Button
            text="M"
            variant={size === "M" ? "contained" : "outlined"}
            onClick={() => setSize("M")}
          />
          <Button
            text="L"
            variant={size === "L" ? "contained" : "outlined"}
            onClick={() => setSize("L")}
          />
        </Flex>

        <Flex gap="8px">
          <Button
            text="Name: Design System"
            variant="outlined"
            color="normal"
            onClick={() => setName("Design System")}
          />
          <Button
            text="Name: Jane Doe"
            variant="outlined"
            color="normal"
            onClick={() => setName("Jane Doe")}
          />
          <Button
            text="Name: Guest"
            variant="outlined"
            color="normal"
            onClick={() => setName("Guest")}
          />
        </Flex>

        <Button
          text={useImage ? "Use Initials" : "Use Image"}
          variant="text"
          color="primary"
          onClick={() => setUseImage((prev) => !prev)}
        />
      </Flex>
    )
  },
}
