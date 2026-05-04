import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import Tabs, { type TabOptionsType } from "./Tabs"
import Flex from "../Flex/Flex"

const baseOptions: TabOptionsType[] = [
  { label: "Overview", value: "overview" },
  { label: "Members", value: "members" },
  { label: "Settings", value: "settings" },
]

const manyOptions: TabOptionsType[] = [
  { label: "Overview", value: "overview" },
  { label: "Members", value: "members" },
  { label: "Settings", value: "settings" },
  { label: "Activity", value: "activity" },
  { label: "Billing", value: "billing" },
  { label: "Logs", value: "logs" },
  { label: "Security", value: "security" },
  { label: "Integrations", value: "integrations" },
]

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
  args: {
    value: "overview",
    size: "M",
    color: "primary",
    scrollbarVisible: true,
    scrollButtonsVisible: false,
  },
  argTypes: {
    options: { control: false },
    value: { control: "text" },
    size: {
      control: "select",
      options: ["S", "M", "L"],
    },
    color: { control: "text" },
    onSelect: { action: "select" },
    scrollbarVisible: { control: "boolean" },
    scrollButtonsVisible: { control: "boolean" },
  },
}

export default meta

type Story = StoryObj<typeof Tabs>

export const Playground: Story = {
  args: {
    options: baseOptions,
  },
  render: (args) => {
    const [value, setValue] = useState<string | null>(String(args.value))

    return (
      <Tabs
        {...args}
        value={value}
        onSelect={(nextValue) => {
          setValue(nextValue)
          args.onSelect?.(nextValue)
        }}
      />
    )
  },
}

export const Sizes: Story = {
  render: () => {
    const [small, setSmall] = useState<string | null>("overview")
    const [medium, setMedium] = useState<string | null>("members")
    const [large, setLarge] = useState<string | null>("settings")

    return (
      <Flex direction="column" gap={20}>
        <Tabs options={baseOptions} value={small} size="S" onSelect={setSmall} />
        <Tabs options={baseOptions} value={medium} size="M" onSelect={setMedium} />
        <Tabs options={baseOptions} value={large} size="L" onSelect={setLarge} />
      </Flex>
    )
  },
}

export const Colors: Story = {
  render: () => {
    const [primary, setPrimary] = useState<string | null>("overview")
    const [secondary, setSecondary] = useState<string | null>("overview")
    const [normal, setNormal] = useState<string | null>("overview")
    const [custom, setCustom] = useState<string | null>("overview")

    return (
      <Flex direction="column" gap={20}>
        <Tabs
          options={baseOptions}
          value={primary}
          size="M"
          color="primary"
          onSelect={setPrimary}
        />
        <Tabs
          options={baseOptions}
          value={secondary}
          size="M"
          color="secondary"
          onSelect={setSecondary}
        />
        <Tabs options={baseOptions} value={normal} size="M" color="normal" onSelect={setNormal} />
        <Tabs options={baseOptions} value={custom} size="M" color="secondary" onSelect={setCustom} />
      </Flex>
    )
  },
}

export const WithDisabledAndHidden: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>("overview")

    return (
      <Tabs
        options={[
          { label: "Overview", value: "overview" },
          { label: "Members", value: "members", disabled: true },
          { label: "Hidden", value: "hidden", hidden: true },
          { label: "Settings", value: "settings" },
        ]}
        value={value}
        size="M"
        onSelect={setValue}
      />
    )
  },
}

export const Scrollable: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>("overview")

    return (
      <div style={{ width: 360 }}>
        <Tabs
          options={manyOptions}
          value={value}
          size="M"
          onSelect={setValue}
          scrollbarVisible={false}
          scrollButtonsVisible
        />
      </div>
    )
  },
}

export const AllCases: Story = {
  render: () => {
    const [valueA, setValueA] = useState<string | null>("overview")
    const [valueB, setValueB] = useState<string | null>("members")
    const [valueC, setValueC] = useState<string | null>("activity")

    return (
      <Flex direction="column" gap={24}>
        <Tabs options={baseOptions} value={valueA} size="S" onSelect={setValueA} />

        <Tabs
          options={[
            { label: "Overview", value: "overview" },
            { label: "Members", value: "members", disabled: true },
            { label: "Settings", value: "settings" },
          ]}
          value={valueB}
          size="M"
          color="secondary"
          onSelect={setValueB}
        />

        <div style={{ width: 420 }}>
          <Tabs
            options={manyOptions}
            value={valueC}
            size="L"
            color="primary"
            scrollbarVisible={false}
            scrollButtonsVisible
            onSelect={setValueC}
          />
        </div>
      </Flex>
    )
  },
}
