import { describe, it, expect } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import TextField from "./TextField"

describe("TextField", () => {
  it("label과 placeholder를 렌더링한다", () => {
    render(<TextField label="Name" placeholder="input here" />)

    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("input here")).toBeInTheDocument()
  })

  it("controlled value 변경이 반영된다", () => {
    const TestComponent = () => {
      const [value, setValue] = useState("hello")

      return (
        <>
          <button type="button" onClick={() => setValue("changed")}>
            change
          </button>
          <TextField value={value} />
        </>
      )
    }

    render(<TestComponent />)

    expect(screen.getByDisplayValue("hello")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "change" }))

    expect(screen.getByDisplayValue("changed")).toBeInTheDocument()
  })

  it("onlyNumber가 true면 숫자만 유지한다", () => {
    render(<TextField onlyNumber />)

    const input = screen.getByRole("textbox") as HTMLInputElement
    fireEvent.change(input, { target: { value: "ab12c3" } })

    expect(input.value).toBe("123")
  })

  it("maxLength를 초과하면 잘라낸다", () => {
    render(<TextField maxLength={5} />)

    const input = screen.getByRole("textbox") as HTMLInputElement
    fireEvent.change(input, { target: { value: "123456789" } })

    expect(input.value).toBe("12345")
  })

  it("search 타입에서 Enter 입력 시 onSearch와 onSearchEnter를 호출한다", () => {
    let searchValue = ""
    let searchEnterValue = ""

    render(
      <TextField
        type="search"
        value=" hello "
        onSearch={(value) => {
          searchValue = value
        }}
        onSearchEnter={(value) => {
          searchEnterValue = value
        }}
      />,
    )

    const input = screen.getByRole("textbox")
    fireEvent.keyDown(input, { key: "Enter" })

    expect(searchValue).toBe("hello")
    expect(searchEnterValue).toBe("hello")
  })

  it("clear 버튼 클릭 시 내부 값이 초기화되고 onClear를 호출한다", () => {
    let cleared = false

    render(
      <TextField
        value="abc"
        onClear={() => {
          cleared = true
        }}
      />,
    )

    const input = screen.getByRole("textbox")
    fireEvent.focus(input)

    const buttons = screen.getAllByRole("button")
    fireEvent.click(buttons[0])

    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("")
    expect(cleared).toBe(true)
  })

  it("password 타입에서 토글 버튼 클릭 시 input type이 변경된다", () => {
    render(<TextField type="password" value="secret" />)

    const input = screen.getByDisplayValue("secret") as HTMLInputElement
    expect(input.type).toBe("password")

    const button = screen.getByRole("button")
    fireEvent.click(button)

    expect((screen.getByDisplayValue("secret") as HTMLInputElement).type).toBe("text")
  })

  it("multiline이면 textarea를 렌더링한다", () => {
    render(<TextField multiline value="multi" />)

    expect(screen.getByDisplayValue("multi").tagName.toLowerCase()).toBe("textarea")
  })

  it("error가 true면 helperText를 렌더링한다", () => {
    render(<TextField error helperText="error message" />)

    expect(screen.getByText("error message")).toBeInTheDocument()
  })

  it("readOnly이면 clear 버튼이 노출되지 않는다", () => {
    render(<TextField value="abc" readOnly />)

    const input = screen.getByRole("textbox")
    fireEvent.focus(input)

    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})
