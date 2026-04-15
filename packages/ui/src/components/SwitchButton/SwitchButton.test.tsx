import { describe, it, expect } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import SwitchButton from "./SwitchButton"

describe("SwitchButton", () => {
  it("label이 렌더링된다", () => {
    render(<SwitchButton checked={false} onChange={() => {}} label="알림" />)

    expect(screen.getByText("알림")).toBeInTheDocument()
  })

  it("클릭 시 onChange로 다음 checked 값이 전달된다", () => {
    const TestComponent = () => {
      const [checked, setChecked] = useState(false)

      return (
        <>
          <div data-testid="checked-state">{String(checked)}</div>
          <SwitchButton checked={checked} onChange={setChecked} label="토글" />
        </>
      )
    }

    render(<TestComponent />)

    fireEvent.click(screen.getByRole("switch"))

    expect(screen.getByTestId("checked-state")).toHaveTextContent("true")
  })

  it("Enter 키 입력 시 토글된다", () => {
    const TestComponent = () => {
      const [checked, setChecked] = useState(false)

      return (
        <>
          <div data-testid="checked-state">{String(checked)}</div>
          <SwitchButton checked={checked} onChange={setChecked} label="키보드 토글" />
        </>
      )
    }

    render(<TestComponent />)

    fireEvent.keyDown(screen.getByRole("switch"), { key: "Enter" })

    expect(screen.getByTestId("checked-state")).toHaveTextContent("true")
  })

  it("Space 키 입력 시 토글된다", () => {
    const TestComponent = () => {
      const [checked, setChecked] = useState(false)

      return (
        <>
          <div data-testid="checked-state">{String(checked)}</div>
          <SwitchButton checked={checked} onChange={setChecked} label="키보드 토글" />
        </>
      )
    }

    render(<TestComponent />)

    fireEvent.keyDown(screen.getByRole("switch"), { key: " " })

    expect(screen.getByTestId("checked-state")).toHaveTextContent("true")
  })

  it("disabled면 클릭해도 상태가 바뀌지 않는다", () => {
    const TestComponent = () => {
      const [checked, setChecked] = useState(false)

      return (
        <>
          <div data-testid="checked-state">{String(checked)}</div>
          <SwitchButton checked={checked} onChange={setChecked} disabled label="비활성" />
        </>
      )
    }

    render(<TestComponent />)

    fireEvent.click(screen.getByRole("switch"))

    expect(screen.getByTestId("checked-state")).toHaveTextContent("false")
  })

  it("disabled면 키보드 입력으로도 상태가 바뀌지 않는다", () => {
    const TestComponent = () => {
      const [checked, setChecked] = useState(false)

      return (
        <>
          <div data-testid="checked-state">{String(checked)}</div>
          <SwitchButton checked={checked} onChange={setChecked} disabled label="비활성" />
        </>
      )
    }

    render(<TestComponent />)

    fireEvent.keyDown(screen.getByRole("switch"), { key: "Enter" })

    expect(screen.getByTestId("checked-state")).toHaveTextContent("false")
  })

  it("labelPlacement가 labelPlacment보다 우선 적용된다", () => {
    render(
      <SwitchButton
        checked
        onChange={() => {}}
        label="배치"
        labelPlacment="left"
        labelPlacement="right"
      />,
    )

    const switchElement = screen.getByRole("switch")
    const labelElement = screen.getByText("배치")

    expect(labelElement.compareDocumentPosition(switchElement)).toBe(
      Node.DOCUMENT_POSITION_PRECEDING,
    )
  })

  it("aria-checked가 checked 값에 맞게 반영된다", () => {
    const { rerender } = render(<SwitchButton checked={false} onChange={() => {}} label="aria" />)

    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false")

    rerender(<SwitchButton checked onChange={() => {}} label="aria" />)

    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true")
  })
})
