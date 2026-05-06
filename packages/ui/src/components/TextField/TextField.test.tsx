import type { ReactElement } from "react"
import { useState } from "react"
import { describe, it, expect } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { renderWithProviders } from "../../test"
import TextField from "./TextField"

const renderTextField = (ui: ReactElement) => renderWithProviders(ui)

describe("TextField", () => {
  it("label과 placeholder를 렌더링한다", () => {
    renderTextField(<TextField label="Name" placeholder="input here" />)

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

    renderTextField(<TestComponent />)

    expect(screen.getByDisplayValue("hello")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "change" }))

    expect(screen.getByDisplayValue("changed")).toBeInTheDocument()
  })

  it("onlyNumber가 true면 숫자만 유지한다", () => {
    renderTextField(<TextField onlyNumber />)

    const input = screen.getByRole("textbox") as HTMLInputElement
    fireEvent.change(input, { target: { value: "ab12c3" } })

    expect(input.value).toBe("123")
  })

  it("onlyNumber 정규화 값을 onChange 이벤트에서도 전달한다", () => {
    let changedValue = ""

    renderTextField(
      <TextField onlyNumber onChange={(event) => (changedValue = event.target.value)} />,
    )

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "a1b2" } })

    expect(changedValue).toBe("12")
  })

  it("maxLength를 초과하면 잘라낸다", () => {
    renderTextField(<TextField maxLength={5} />)

    const input = screen.getByRole("textbox") as HTMLInputElement
    fireEvent.change(input, { target: { value: "123456789" } })

    expect(input.value).toBe("12345")
  })

  it("search 타입에서 Enter 입력 시 onSearch와 onSearchEnter를 호출한다", () => {
    let searchValue = ""
    let searchEnterValue = ""

    renderTextField(
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

    const input = screen.getByRole("searchbox")
    fireEvent.keyDown(input, { key: "Enter" })

    expect(searchValue).toBe("hello")
    expect(searchEnterValue).toBe("hello")
  })

  it("clear 버튼 클릭 시 내부 값이 초기화되고 onClear를 호출한다", () => {
    let cleared = false

    renderTextField(
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

  it("controlled clear 클릭 시 빈 문자열을 onChange로 전달하고 focus를 유지한다", () => {
    const TestComponent = () => {
      const [value, setValue] = useState("abc")

      return (
        <TextField
          label="Search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      )
    }

    renderTextField(<TestComponent />)

    const input = screen.getByRole("textbox", { name: "Search" }) as HTMLInputElement
    fireEvent.focus(input)
    fireEvent.click(screen.getByRole("button", { name: "입력값 지우기" }))

    expect(input.value).toBe("")
    expect(input).toHaveFocus()
  })

  it("password 타입에서 토글 버튼 클릭 시 input type이 변경된다", () => {
    renderTextField(<TextField type="password" value="secret" />)

    const input = screen.getByDisplayValue("secret") as HTMLInputElement
    expect(input.type).toBe("password")

    const button = screen.getByRole("button")
    fireEvent.click(button)

    expect((screen.getByDisplayValue("secret") as HTMLInputElement).type).toBe("text")
  })

  it("multiline이면 textarea를 렌더링한다", () => {
    renderTextField(<TextField multiline value="multi" />)

    expect(screen.getByDisplayValue("multi").tagName.toLowerCase()).toBe("textarea")
  })

  it("error가 true면 helperText를 렌더링한다", () => {
    renderTextField(<TextField error helperText="error message" />)

    expect(screen.getByText("error message")).toBeInTheDocument()
  })

  it("label과 helperText를 접근성 속성으로 연결한다", () => {
    renderTextField(<TextField label="Name" error helperText="error message" />)

    const input = screen.getByRole("textbox", { name: "Name" })
    const describedBy = input.getAttribute("aria-describedby")

    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy ?? "")).toHaveTextContent("error message")
  })

  it("readOnly이면 clear 버튼이 노출되지 않는다", () => {
    renderTextField(<TextField value="abc" readOnly />)

    const input = screen.getByRole("textbox")
    fireEvent.focus(input)

    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})
