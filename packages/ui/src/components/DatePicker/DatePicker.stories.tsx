import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import dayjs from "dayjs"
import DatePicker from "./DatePicker"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import Button from "../Button/Button"
import { Typography } from "../Typography/Typography"

const meta: Meta<typeof DatePicker> = {
  title: "Inputs/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    mode: { control: "radio", options: ["Single", "Range"] },
    dateType: { control: "radio", options: ["Date", "Time", "Month", "DateTime", "Year"] },
    size: { control: "radio", options: ["S", "M", "L"] },
    disabled: { control: "boolean" },
    clearable: { control: "boolean" },
  },
  args: {
    mode: "Single",
    dateType: "Date",
    size: "M",
    disabled: false,
    clearable: true,
  },
}

export default meta
type Story = StoryObj<typeof DatePicker>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState<dayjs.Dayjs | null>(null)
    const [range, setRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null])

    return (
      <Flex direction="column" gap="16px">
        {args.mode === "Single" ? (
          <DatePicker {...args} value={value} onChange={setValue} />
        ) : (
          <DatePicker
            {...args}
            rangeValue={range}
            onRangeChange={(from, to) => setRange([from, to])}
          />
        )}

        <Typography
          variant="b3Regular"
          text={
            args.mode === "Single"
              ? `value: ${value?.format("YYYY-MM-DD") ?? "null"}`
              : `range: ${range[0]?.format("YYYY-MM-DD") ?? "null"} ~ ${
                  range[1]?.format("YYYY-MM-DD") ?? "null"
                }`
          }
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
      <Box p="24px" width="1000px">
        <Typography variant="h3" text="DatePicker Cases" mb="16px" />

        <Flex direction="column" gap="24px">
          <Box>
            <Typography variant="b1Bold" text="Single Modes" mb="8px" />
            <Flex gap="12px" wrap="wrap">
              <DatePicker dateType="Date" />
              <DatePicker dateType="Time" />
              <DatePicker dateType="Month" />
              <DatePicker dateType="Year" />
              <DatePicker dateType="DateTime" />
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="Range Mode" mb="8px" />
            <Flex gap="12px">
              <DatePicker mode="Range" />
              <DatePicker mode="Range" panels={2} />
            </Flex>
          </Box>

          <Box>
            <Typography variant="b1Bold" text="States" mb="8px" />
            <Flex gap="12px">
              <DatePicker disabled />
              <DatePicker error helperText="error message" />
              <DatePicker clearable />
            </Flex>
          </Box>
        </Flex>
      </Box>
    )
  },
}

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<dayjs.Dayjs | null>(dayjs())
    const [range, setRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([
      dayjs().subtract(3, "day"),
      dayjs(),
    ])

    return (
      <Flex direction="column" gap="16px">
        <DatePicker value={value} onChange={setValue} clearable />

        <DatePicker
          mode="Range"
          panels={2}
          rangeValue={range}
          onRangeChange={(from, to) => setRange([from, to])}
        />

        <Button
          text="Reset"
          onClick={() => {
            setValue(dayjs())
            setRange([dayjs().subtract(3, "day"), dayjs()])
          }}
        />

        <Typography variant="b3Regular" text={`value: ${value?.format("YYYY-MM-DD") ?? "null"}`} />

        <Typography
          variant="b3Regular"
          text={`range: ${range[0]?.format("YYYY-MM-DD")} ~ ${range[1]?.format("YYYY-MM-DD")}`}
        />
      </Flex>
    )
  },
}
