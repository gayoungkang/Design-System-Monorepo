import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import Slider from "./Slider"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"

const meta: Meta<typeof Slider> = {
  title: "Inputs/Slider",
  component: Slider,
  args: {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    track: "normal",
    label: "Slider",
    iconSize: 16,
  },
  argTypes: {
    onChange: { action: "change" },
    onChangeEnd: { action: "changeEnd" },
  },
}

export default meta

type Story = StoryObj<typeof Slider>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState<number>(30)

    return (
      <Box width="360px">
        <Slider
          {...args}
          value={value}
          onChange={(next) => {
            if (Array.isArray(next)) return
            setValue(next)
          }}
          onChangeEnd={(next) => {
            if (Array.isArray(next)) return
            setValue(next)
          }}
        />
      </Box>
    )
  },
}

export const Single: Story = {
  render: () => {
    const [value, setValue] = useState<number>(40)

    return (
      <Box width="360px">
        <Slider
          label="Single Slider"
          value={value}
          onChange={(next) => {
            if (Array.isArray(next)) return
            setValue(next)
          }}
          onChangeEnd={(next) => {
            if (Array.isArray(next)) return
            setValue(next)
          }}
        />
      </Box>
    )
  },
}

export const Range: Story = {
  render: () => {
    const [value, setValue] = useState<[number, number]>([20, 80])

    return (
      <Box width="360px">
        <Slider
          label="Range Slider"
          value={value}
          onChange={(next) => {
            if (!Array.isArray(next)) return
            setValue(next as [number, number])
          }}
          onChangeEnd={(next) => {
            if (!Array.isArray(next)) return
            setValue(next as [number, number])
          }}
        />
      </Box>
    )
  },
}

export const Variants: Story = {
  render: () => {
    const [normalValue, setNormalValue] = useState<number>(30)
    const [insetValue, setInsetValue] = useState<number>(55)
    const [noneValue, setNoneValue] = useState<number>(70)

    return (
      <Flex direction="column" gap="20px" width="360px">
        <Slider
          label="Normal Track"
          value={normalValue}
          track="normal"
          onChange={(next) => {
            if (Array.isArray(next)) return
            setNormalValue(next)
          }}
          onChangeEnd={(next) => {
            if (Array.isArray(next)) return
            setNormalValue(next)
          }}
        />

        <Slider
          label="Inset Track"
          value={insetValue}
          track="inset"
          onChange={(next) => {
            if (Array.isArray(next)) return
            setInsetValue(next)
          }}
          onChangeEnd={(next) => {
            if (Array.isArray(next)) return
            setInsetValue(next)
          }}
        />

        <Slider
          label="No Track"
          value={noneValue}
          track="none"
          onChange={(next) => {
            if (Array.isArray(next)) return
            setNoneValue(next)
          }}
          onChangeEnd={(next) => {
            if (Array.isArray(next)) return
            setNoneValue(next)
          }}
        />
      </Flex>
    )
  },
}

export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState<number>(50)

    return (
      <Box width="360px">
        <Slider
          label="Volume"
          value={value}
          startIcon="VolumeDown"
          endIcon="VolumeUp"
          iconSize={18}
          onChange={(next) => {
            if (Array.isArray(next)) return
            setValue(next)
          }}
          onChangeEnd={(next) => {
            if (Array.isArray(next)) return
            setValue(next)
          }}
        />
      </Box>
    )
  },
}

export const States: Story = {
  render: () => {
    const [value, setValue] = useState<number>(35)
    const [rangeValue, setRangeValue] = useState<[number, number]>([25, 75])

    return (
      <Flex direction="column" gap="20px" width="360px">
        <Slider
          label="Default"
          value={value}
          onChange={(next) => {
            if (Array.isArray(next)) return
            setValue(next)
          }}
          onChangeEnd={(next) => {
            if (Array.isArray(next)) return
            setValue(next)
          }}
        />

        <Slider label="Disabled" value={60} disabled />

        <Slider
          label="Disabled Range"
          value={rangeValue}
          disabled
          onChange={(next) => {
            if (!Array.isArray(next)) return
            setRangeValue(next as [number, number])
          }}
          onChangeEnd={(next) => {
            if (!Array.isArray(next)) return
            setRangeValue(next as [number, number])
          }}
        />
      </Flex>
    )
  },
}

export const StepCases: Story = {
  render: () => {
    const [value, setValue] = useState<number>(20)
    const [rangeValue, setRangeValue] = useState<[number, number]>([10, 50])

    return (
      <Flex direction="column" gap="20px" width="360px">
        <Slider
          label="Step 10"
          min={0}
          max={100}
          step={10}
          value={value}
          onChange={(next) => {
            if (Array.isArray(next)) return
            setValue(next)
          }}
          onChangeEnd={(next) => {
            if (Array.isArray(next)) return
            setValue(next)
          }}
        />

        <Slider
          label="Range Step 5"
          min={0}
          max={100}
          step={5}
          value={rangeValue}
          onChange={(next) => {
            if (!Array.isArray(next)) return
            setRangeValue(next as [number, number])
          }}
          onChangeEnd={(next) => {
            if (!Array.isArray(next)) return
            setRangeValue(next as [number, number])
          }}
        />
      </Flex>
    )
  },
}
