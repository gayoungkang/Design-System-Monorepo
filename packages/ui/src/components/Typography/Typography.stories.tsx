import type { Meta, StoryObj } from "@storybook/react"
import { Typography } from "./Typography"
import Flex from "../Flex/Flex"

const meta: Meta<typeof Typography> = {
  title: "Foundation/Typography",
  component: Typography,
  args: {
    text: "Typography sample text",
    variant: "b1Medium",
    as: "p",
    ellipsis: false,
    italic: false,
    underline: false,
    align: "left",
  },
  argTypes: {
    variant: {
      control: "select",
      options: Object.keys({
        h1: "",
        h2: "",
        h3: "",
        h4: "",
        h5: "",
        h6: "",
        b1Bold: "",
        b1Medium: "",
        b1Regular: "",
        b2Bold: "",
        b2Medium: "",
        b2Regular: "",
        b3Bold: "",
        b3Medium: "",
        b3Regular: "",
      }),
    },
    as: {
      control: "select",
      options: ["p", "span", "div", "h1", "h2", "h3", "h4", "h5", "h6"],
    },
    color: {
      control: "text",
    },
    italic: {
      control: "boolean",
    },
    ellipsis: {
      control: "boolean",
    },
    underline: {
      control: "boolean",
    },
    align: {
      control: "select",
      options: ["left", "center", "right", "justify"],
    },
  },
}

export default meta

type Story = StoryObj<typeof Typography>

export const Playground: Story = {
  render: (args) => {
    return <Typography {...args} />
  },
}

export const Variants: Story = {
  render: () => {
    return (
      <Flex direction="column" gap={12}>
        <Typography variant="h1" text="h1 Typography" />
        <Typography variant="h2" text="h2 Typography" />
        <Typography variant="h3" text="h3 Typography" />
        <Typography variant="b1Bold" text="b1Bold Typography" />
        <Typography variant="b1Medium" text="b1Medium Typography" />
        <Typography variant="b1Regular" text="b1Regular Typography" />
        <Typography variant="b2Medium" text="b2Medium Typography" />
        <Typography variant="b2Regular" text="b2Regular Typography" />
        <Typography variant="b3Medium" text="b3Medium Typography" />
        <Typography variant="b3Regular" text="b3Regular Typography" />
      </Flex>
    )
  },
}

export const Decorations: Story = {
  render: () => {
    return (
      <Flex direction="column" gap={12}>
        <Typography text="Normal text" />
        <Typography text="Italic text" italic />
        <Typography text="Underline text" underline />
        <Typography text="Italic underline text" italic underline />
        <Typography text="Colored text" color="#2563eb" />
      </Flex>
    )
  },
}

export const Alignments: Story = {
  render: () => {
    return (
      <Flex direction="column" gap={12} width="100%">
        <Typography text="Left aligned text" align="left" width="100%" />
        <Typography text="Center aligned text" align="center" width="100%" />
        <Typography text="Right aligned text" align="right" width="100%" />
        <Typography
          text="Justify aligned text example for typography component rendering."
          align="justify"
          width="240px"
        />
      </Flex>
    )
  },
}

export const Multiline: Story = {
  render: () => {
    return <Typography text={"First line\nSecond line\nThird line"} />
  },
}

export const Ellipsis: Story = {
  render: () => {
    return (
      <Typography
        text="This is a very long typography text that should be truncated with ellipsis when the width is constrained."
        ellipsis
        width="220px"
      />
    )
  },
}

export const AllCases: Story = {
  render: () => {
    return (
      <Flex direction="column" gap={16} width="100%">
        <Typography variant="h2" text="Heading Typography" />
        <Typography variant="b1Medium" text="Default body typography" />
        <Typography variant="b2Regular" text="Italic text example" italic />
        <Typography variant="b2Regular" text="Underline text example" underline />
        <Typography variant="b2Medium" text="Center aligned text" align="center" width="100%" />
        <Typography text={"Multiline\nTypography\nExample"} />
        <Typography
          text="This is a long typography sentence for ellipsis demonstration in the component story."
          ellipsis
          width="240px"
        />
      </Flex>
    )
  },
}
