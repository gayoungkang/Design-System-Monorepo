import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import TextField from "./TextField"
import Flex from "../Flex/Flex"

const meta: Meta<typeof TextField> = {
  title: "Inputs/TextField",
  component: TextField,
  args: {
    variant: "outlined",
    size: "M",
    placeholder: "Type here",
    disabled: false,
    error: false,
    readOnly: false,
    multiline: false,
    clearable: true,
    autoFocus: false,
    labelPlacement: "top",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["outlined", "filled", "standard"],
    },
    size: {
      control: "select",
      options: ["S", "M", "L"],
    },
    type: {
      control: "select",
      options: ["text", "search", "password", "number"],
    },
    labelPlacement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    onChange: { action: "change" },
    onClear: { action: "clear" },
    onSearch: { action: "search" },
    onSearchEnter: { action: "searchEnter" },
    onFocus: { action: "focus" },
    onBlur: { action: "blur" },
    onKeyDown: { action: "keydown" },
    onKeyUp: { action: "keyup" },
  },
}

export default meta

type Story = StoryObj<typeof TextField>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState("")

    return (
      <TextField
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          args.onChange?.(e)
        }}
        onClear={() => {
          setValue("")
          args.onClear?.()
        }}
      />
    )
  },
}

export const Variants: Story = {
  render: () => {
    const [outlined, setOutlined] = useState("")
    const [filled, setFilled] = useState("")
    const [standard, setStandard] = useState("")

    return (
      <Flex direction="column" gap={16}>
        <TextField
          label="Outlined"
          variant="outlined"
          value={outlined}
          onChange={(e) => setOutlined(e.target.value)}
        />
        <TextField
          label="Filled"
          variant="filled"
          value={filled}
          onChange={(e) => setFilled(e.target.value)}
        />
        <TextField
          label="Standard"
          variant="standard"
          value={standard}
          onChange={(e) => setStandard(e.target.value)}
        />
      </Flex>
    )
  },
}

export const Sizes: Story = {
  render: () => {
    const [small, setSmall] = useState("")
    const [medium, setMedium] = useState("")
    const [large, setLarge] = useState("")

    return (
      <Flex direction="column" gap={16}>
        <TextField
          label="Small"
          size="S"
          value={small}
          onChange={(e) => setSmall(e.target.value)}
        />
        <TextField
          label="Medium"
          size="M"
          value={medium}
          onChange={(e) => setMedium(e.target.value)}
        />
        <TextField
          label="Large"
          size="L"
          value={large}
          onChange={(e) => setLarge(e.target.value)}
        />
      </Flex>
    )
  },
}

export const Search: Story = {
  render: () => {
    const [value, setValue] = useState("")

    return (
      <TextField
        label="Search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSearch={(searchValue) => {
          setValue(searchValue)
        }}
        onSearchEnter={() => {}}
      />
    )
  },
}

export const Password: Story = {
  render: () => {
    const [value, setValue] = useState("secret")

    return (
      <TextField
        label="Password"
        type="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    )
  },
}

export const Multiline: Story = {
  render: () => {
    const [value, setValue] = useState("multiline text")

    return (
      <TextField
        label="Description"
        multiline
        rows={5}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    )
  },
}

export const States: Story = {
  render: () => {
    const readonlyValue = "readonly"
    const [normal, setNormal] = useState("editable")
    const [errorValue, setErrorValue] = useState("wrong value")
    const [disabledValue] = useState("disabled")

    return (
      <Flex direction="column" gap={16}>
        <TextField label="Normal" value={normal} onChange={(e) => setNormal(e.target.value)} />
        <TextField
          label="Error"
          value={errorValue}
          onChange={(e) => setErrorValue(e.target.value)}
          error
          helperText="This field is invalid"
        />
        <TextField label="ReadOnly" value={readonlyValue} readOnly />
        <TextField label="Disabled" value={disabledValue} disabled />
      </Flex>
    )
  },
}

export const LabelPlacements: Story = {
  render: () => {
    const [top, setTop] = useState("")
    const [bottom, setBottom] = useState("")
    const [left, setLeft] = useState("")
    const [right, setRight] = useState("")

    return (
      <Flex direction="column" gap={16}>
        <TextField
          label="Top Label"
          labelPlacement="top"
          value={top}
          onChange={(e) => setTop(e.target.value)}
        />
        <TextField
          label="Bottom Label"
          labelPlacement="bottom"
          value={bottom}
          onChange={(e) => setBottom(e.target.value)}
        />
        <TextField
          label="Left Label"
          labelPlacement="left"
          value={left}
          onChange={(e) => setLeft(e.target.value)}
        />
        <TextField
          label="Right Label"
          labelPlacement="right"
          value={right}
          onChange={(e) => setRight(e.target.value)}
        />
      </Flex>
    )
  },
}

export const AllCases: Story = {
  render: () => {
    const [name, setName] = useState("")
    const [search, setSearch] = useState("")
    const [password, setPassword] = useState("password")
    const [message, setMessage] = useState("Hello")
    const [numberValue, setNumberValue] = useState("123")

    return (
      <Flex direction="column" gap={20}>
        <TextField
          label="Name"
          value={name}
          startIcon="Folder"
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => setSearch(value)}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          label="Message"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <TextField
          label="Only Number"
          value={numberValue}
          onlyNumber
          maxLength={6}
          onChange={(e) => setNumberValue(e.target.value)}
        />

        <TextField
          label="Error Case"
          value="invalid"
          error
          helperText="This field is invalid"
          readOnly
        />
      </Flex>
    )
  },
}
