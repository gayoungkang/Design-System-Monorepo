import type { Meta, StoryObj } from "@storybook/react"
import React, { useMemo, useState } from "react"
import dayjs from "dayjs"
import DatePicker from "./DatePicker"
import type { DatePickerProps, DateType, DatePickerMode } from "./DatePicker"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import Button from "../Button/Button"
import { Typography } from "../Typography/Typography"
import Divider from "../Divider/Divider"

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: { type: "radio" }, options: ["S", "M", "L"] },
    mode: { control: { type: "radio" }, options: ["Single", "Range"] },
    panels: { control: { type: "radio" }, options: [1, 2] },
    dateType: {
      control: { type: "radio" },
      options: ["Date", "Time", "Month", "DateTime", "Year"],
    },

    label: { control: { type: "text" } },
    required: { control: { type: "boolean" } },
    readOnly: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    error: { control: { type: "boolean" } },
    helperText: { control: { type: "text" } },
    placeholder: { control: { type: "text" } },
    clearable: { control: { type: "boolean" } },

    timeIntervals: { control: { type: "number", min: 1, step: 1 } },

    placement: {
      control: { type: "radio" },
      options: [
        "top-start",
        "top",
        "top-end",
        "right-start",
        "right",
        "right-end",
        "bottom-start",
        "bottom",
        "bottom-end",
        "left-start",
        "left",
        "left-end",
      ],
    },
    labelPlacement: { control: { type: "radio" }, options: ["top", "bottom", "left", "right"] },

    hiddenPresetButtons: { control: { type: "boolean" } },

    minDate: { control: false },
    maxDate: { control: false },
    minTime: { control: false },
    maxTime: { control: false },

    value: { control: false },
    onChange: { control: false },

    rangeValue: { control: false },
    onRangeChange: { control: false },

    labelProps: { control: false },
    presetNode: { control: false },
    cancelNode: { control: false },
    confirmNode: { control: false },

    onBlur: { control: false },
    sx: { control: false },
    p: { control: false },
    px: { control: false },
    py: { control: false },
    m: { control: false },
    mx: { control: false },
    my: { control: false },
    width: { control: false },
    height: { control: false },
    bgColor: { control: false },
  },
}
export default meta

type Story = StoryObj<typeof DatePicker>

const getDefaultSingle = (dateType: DateType) => {
  if (dateType === "Year") return dayjs().startOf("year")
  if (dateType === "Month") return dayjs().startOf("month")
  if (dateType === "Time") return dayjs().hour(9).minute(0).second(0).millisecond(0)
  if (dateType === "DateTime")
    return dayjs().startOf("day").hour(9).minute(0).second(0).millisecond(0)
  return dayjs().startOf("day")
}

const getDefaultRange = (dateType: DateType) => {
  if (dateType === "Year")
    return [dayjs().subtract(1, "year").startOf("year"), dayjs().startOf("year")] as const
  if (dateType === "Month")
    return [dayjs().subtract(1, "month").startOf("month"), dayjs().startOf("month")] as const
  if (dateType === "Time")
    return [
      dayjs().hour(9).minute(0).second(0).millisecond(0),
      dayjs().hour(18).minute(0).second(0).millisecond(0),
    ] as const
  if (dateType === "DateTime")
    return [
      dayjs().startOf("day").hour(9).minute(0).second(0).millisecond(0),
      dayjs().startOf("day").hour(18).minute(0).second(0).millisecond(0),
    ] as const
  return [dayjs().subtract(7, "day").startOf("day"), dayjs().startOf("day")] as const
}

const buildPresetNode = (
  args: DatePickerProps,
  setRange: (a: dayjs.Dayjs | null, b: dayjs.Dayjs | null) => void,
) => {
  const isRange = (args.mode ?? "Single") === "Range"
  if (!isRange) return null

  const dateType = args.dateType ?? "Date"

  const presets: Array<{ key: string; label: string; get: () => [dayjs.Dayjs, dayjs.Dayjs] }> = [
    {
      key: "today",
      label: "오늘",
      get: () => {
        const a = dateType === "DateTime" ? dayjs().startOf("day") : dayjs()
        const b = dateType === "DateTime" ? dayjs().startOf("day") : dayjs()
        return [a, b]
      },
    },
    {
      key: "7d",
      label: "최근 7일",
      get: () => {
        const [a, b] = getDefaultRange(dateType)
        return [a, b]
      },
    },
    {
      key: "thisMonth",
      label: "이번 달",
      get: () => {
        const a = dayjs().startOf("month")
        const b = dayjs().endOf("month").startOf("day")
        return [a, b]
      },
    },
    {
      key: "reset",
      label: "리셋",
      get: () => [null as any, null as any],
    },
  ]

  return (
    <Flex direction="column" gap={8} width="100%">
      <Typography text="Preset (외부 제어)" variant="b2Regular" />
      <Flex gap={8} wrap="wrap">
        {presets.map((p) => (
          <Button
            key={p.key}
            size="S"
            variant="outlined"
            color="normal"
            text={p.label}
            onClick={() => {
              if (p.key === "reset") setRange(null, null)
              else {
                const [a, b] = p.get()
                setRange(a, b)
              }
            }}
          />
        ))}
      </Flex>
    </Flex>
  )
}

const buildActionNode = (label: string) => {
  return (
    <Flex
      width="100%"
      justify="center"
      align="center"
      gap={6}
      p={10}
      sx={{ border: "1px solid #DCDEE5", borderRadius: "8px" }}
    >
      <Typography text={label} variant="b2Regular" />
    </Flex>
  )
}

export const Playground: Story = {
  args: {
    size: "M",
    mode: "Single",
    panels: 2,
    dateType: "Date",
    label: "DatePicker",
    required: false,
    readOnly: false,
    disabled: false,
    error: false,
    helperText: "",
    placeholder: "",
    clearable: true,
    timeIntervals: 5,
    placement: "bottom-start",
    labelPlacement: "top",
    hiddenPresetButtons: false,
  },
  render: (args) => {
    const dateType = (args.dateType ?? "Date") as DateType
    const mode = (args.mode ?? "Single") as DatePickerMode

    const [single, setSingle] = useState<dayjs.Dayjs | null>(() => getDefaultSingle(dateType))
    const [range, setRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>(() => {
      const [a, b] = getDefaultRange(dateType)
      return [a, b]
    })

    const presetNode = useMemo(() => {
      return buildPresetNode(args as DatePickerProps, (a, b) => setRange([a, b]))
    }, [args, dateType])

    const minDate = useMemo(() => dayjs().subtract(3, "year").startOf("day"), [])
    const maxDate = useMemo(() => dayjs().add(3, "year").endOf("day"), [])

    const minTime = useMemo(() => dayjs().hour(8).minute(0).second(0).millisecond(0), [])
    const maxTime = useMemo(() => dayjs().hour(20).minute(0).second(0).millisecond(0), [])

    return (
      <Flex direction="column" gap={16} width={520}>
        <DatePicker
          {...(args as DatePickerProps)}
          minDate={minDate}
          maxDate={maxDate}
          minTime={minTime}
          maxTime={maxTime}
          presetNode={presetNode}
          cancelNode={buildActionNode("Cancel (custom node)")}
          confirmNode={buildActionNode("Confirm (custom node)")}
          value={mode === "Single" ? single : undefined}
          onChange={(v) => setSingle(v)}
          rangeValue={mode === "Range" ? range : undefined}
          onRangeChange={(a, b) => setRange([a, b])}
        />

        <Box
          sx={{ width: "100%", border: "1px solid #E8E9EE", borderRadius: "10px", padding: "12px" }}
        >
          <Flex direction="column" gap={6}>
            <Typography text="State" variant="b2Regular" />
            <Divider />
            <Typography
              text={
                mode === "Single"
                  ? `value: ${single ? single.format(dateType === "Time" ? "HH:mm" : dateType === "DateTime" ? "YYYY-MM-DD HH:mm" : dateType === "Month" ? "YYYY-MM" : dateType === "Year" ? "YYYY" : "YYYY-MM-DD") : "null"}`
                  : `range: ${range[0] ? range[0].format(dateType === "Time" ? "HH:mm" : dateType === "DateTime" ? "YYYY-MM-DD HH:mm" : dateType === "Month" ? "YYYY-MM" : dateType === "Year" ? "YYYY" : "YYYY-MM-DD") : "null"} - ${range[1] ? range[1].format(dateType === "Time" ? "HH:mm" : dateType === "DateTime" ? "YYYY-MM-DD HH:mm" : dateType === "Month" ? "YYYY-MM" : dateType === "Year" ? "YYYY" : "YYYY-MM-DD") : "null"}`
              }
              variant="b3Regular"
            />
          </Flex>
        </Box>

        <Flex gap={8} wrap="wrap">
          <Button
            size="S"
            variant="outlined"
            color="normal"
            text="Clear"
            onClick={() => {
              setSingle(null)
              setRange([null, null])
            }}
          />
          <Button
            size="S"
            variant="outlined"
            color="normal"
            text="Set Default"
            onClick={() => {
              setSingle(getDefaultSingle(dateType))
              const [a, b] = getDefaultRange(dateType)
              setRange([a, b])
            }}
          />
        </Flex>
      </Flex>
    )
  },
}

export const AllCases: Story = {
  args: {
    size: "M",
    label: "DatePicker",
    clearable: true,
    placement: "bottom-start",
    labelPlacement: "top",
    hiddenPresetButtons: false,
    timeIntervals: 5,
  },
  render: (args) => {
    const [singleDate, setSingleDate] = useState<dayjs.Dayjs | null>(() => getDefaultSingle("Date"))
    const [singleMonth, setSingleMonth] = useState<dayjs.Dayjs | null>(() =>
      getDefaultSingle("Month"),
    )
    const [singleYear, setSingleYear] = useState<dayjs.Dayjs | null>(() => getDefaultSingle("Year"))
    const [singleTime, setSingleTime] = useState<dayjs.Dayjs | null>(() => getDefaultSingle("Time"))
    const [singleDateTime, setSingleDateTime] = useState<dayjs.Dayjs | null>(() =>
      getDefaultSingle("DateTime"),
    )

    const [rangeDate, setRangeDate] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>(() => {
      const [a, b] = getDefaultRange("Date")
      return [a, b]
    })
    const [rangeMonth, setRangeMonth] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>(() => {
      const [a, b] = getDefaultRange("Month")
      return [a, b]
    })
    const [rangeYear, setRangeYear] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>(() => {
      const [a, b] = getDefaultRange("Year")
      return [a, b]
    })
    const [rangeTime, setRangeTime] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>(() => {
      const [a, b] = getDefaultRange("Time")
      return [a, b]
    })
    const [rangeDateTime, setRangeDateTime] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>(
      () => {
        const [a, b] = getDefaultRange("DateTime")
        return [a, b]
      },
    )

    const minDate = useMemo(() => dayjs().subtract(3, "year").startOf("day"), [])
    const maxDate = useMemo(() => dayjs().add(3, "year").endOf("day"), [])
    const minTime = useMemo(() => dayjs().hour(8).minute(0).second(0).millisecond(0), [])
    const maxTime = useMemo(() => dayjs().hour(20).minute(0).second(0).millisecond(0), [])

    const makePreset = (
      dateType: DateType,
      setRange: (v: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => void,
    ) =>
      buildPresetNode(
        { ...(args as DatePickerProps), mode: "Range", dateType } as DatePickerProps,
        (a, b) => setRange([a, b]),
      )

    return (
      <Flex direction="column" gap={24} width={980}>
        <Flex direction="column" gap={10}>
          <Typography text="Single" variant="h3" />
          <Flex gap={16} wrap="wrap" align="flex-start">
            <DatePicker
              {...(args as DatePickerProps)}
              mode="Single"
              dateType="Date"
              label="Date"
              minDate={minDate}
              maxDate={maxDate}
              value={singleDate}
              onChange={setSingleDate}
            />
            <DatePicker
              {...(args as DatePickerProps)}
              mode="Single"
              dateType="Month"
              label="Month"
              minDate={minDate}
              maxDate={maxDate}
              value={singleMonth}
              onChange={setSingleMonth}
            />
            <DatePicker
              {...(args as DatePickerProps)}
              mode="Single"
              dateType="Year"
              label="Year"
              minDate={minDate}
              maxDate={maxDate}
              value={singleYear}
              onChange={setSingleYear}
            />
            <DatePicker
              {...(args as DatePickerProps)}
              mode="Single"
              dateType="Time"
              label="Time"
              minTime={minTime}
              maxTime={maxTime}
              value={singleTime}
              onChange={setSingleTime}
            />
            <DatePicker
              {...(args as DatePickerProps)}
              mode="Single"
              dateType="DateTime"
              label="DateTime"
              minDate={minDate}
              maxDate={maxDate}
              minTime={minTime}
              maxTime={maxTime}
              value={singleDateTime}
              onChange={setSingleDateTime}
            />
          </Flex>
        </Flex>

        <Divider />

        <Flex direction="column" gap={10}>
          <Typography text="Range (auto close on complete selection)" variant="h3" />
          <Flex gap={16} wrap="wrap" align="flex-start">
            <DatePicker
              {...(args as DatePickerProps)}
              mode="Range"
              panels={2}
              dateType="Date"
              label="Date Range (2 panels)"
              minDate={minDate}
              maxDate={maxDate}
              presetNode={makePreset("Date", setRangeDate)}
              cancelNode={buildActionNode("Cancel")}
              confirmNode={buildActionNode("Confirm")}
              rangeValue={rangeDate}
              onRangeChange={(a, b) => setRangeDate([a, b])}
            />
            <DatePicker
              {...(args as DatePickerProps)}
              mode="Range"
              panels={2}
              dateType="Month"
              label="Month Range"
              minDate={minDate}
              maxDate={maxDate}
              presetNode={makePreset("Month", setRangeMonth)}
              cancelNode={buildActionNode("Cancel")}
              confirmNode={buildActionNode("Confirm")}
              rangeValue={rangeMonth}
              onRangeChange={(a, b) => setRangeMonth([a, b])}
            />
            <DatePicker
              {...(args as DatePickerProps)}
              mode="Range"
              panels={1}
              dateType="Year"
              label="Year Range (1 panel)"
              minDate={minDate}
              maxDate={maxDate}
              presetNode={makePreset("Year", setRangeYear)}
              cancelNode={buildActionNode("Cancel")}
              confirmNode={buildActionNode("Confirm")}
              rangeValue={rangeYear}
              onRangeChange={(a, b) => setRangeYear([a, b])}
            />
            <DatePicker
              {...(args as DatePickerProps)}
              mode="Range"
              panels={1}
              dateType="Time"
              label="Time Range"
              minTime={minTime}
              maxTime={maxTime}
              presetNode={makePreset("Time", setRangeTime)}
              cancelNode={buildActionNode("Cancel")}
              confirmNode={buildActionNode("Confirm")}
              rangeValue={rangeTime}
              onRangeChange={(a, b) => setRangeTime([a, b])}
            />
            <DatePicker
              {...(args as DatePickerProps)}
              mode="Range"
              panels={2}
              dateType="DateTime"
              label="DateTime Range (keeps open for time)"
              minDate={minDate}
              maxDate={maxDate}
              minTime={minTime}
              maxTime={maxTime}
              presetNode={makePreset("DateTime", setRangeDateTime)}
              cancelNode={buildActionNode("Cancel")}
              confirmNode={buildActionNode("Confirm")}
              rangeValue={rangeDateTime}
              onRangeChange={(a, b) => setRangeDateTime([a, b])}
            />
          </Flex>
        </Flex>

        <Divider />

        <Flex direction="column" gap={10}>
          <Typography text="States" variant="h3" />
          <Flex gap={16} wrap="wrap" align="flex-start">
            <DatePicker
              {...(args as DatePickerProps)}
              mode="Single"
              dateType="Date"
              label="Disabled"
              disabled
              value={singleDate}
              onChange={setSingleDate}
            />
            <DatePicker
              {...(args as DatePickerProps)}
              mode="Single"
              dateType="Date"
              label="ReadOnly"
              readOnly
              value={singleDate}
              onChange={setSingleDate}
            />
            <DatePicker
              {...(args as DatePickerProps)}
              mode="Single"
              dateType="Date"
              label="Error"
              error
              helperText="helper text"
              value={singleDate}
              onChange={setSingleDate}
            />
            <DatePicker
              {...(args as DatePickerProps)}
              mode="Range"
              dateType="Date"
              label="Range Error"
              error
              helperText="helper text"
              presetNode={makePreset("Date", setRangeDate)}
              cancelNode={buildActionNode("Cancel")}
              confirmNode={buildActionNode("Confirm")}
              rangeValue={rangeDate}
              onRangeChange={(a, b) => setRangeDate([a, b])}
            />
          </Flex>
        </Flex>
      </Flex>
    )
  },
}
