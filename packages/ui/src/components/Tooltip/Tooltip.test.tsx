import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import Tooltip from "./Tooltip"

describe("Tooltip", () => {
  it("children를 렌더링한다", () => {
    render(
      <Tooltip content="tooltip text">
        <button>trigger</button>
      </Tooltip>,
    )

    expect(screen.getByText("trigger")).toBeInTheDocument()
  })

  it("hover 시 tooltip이 열린다", () => {
    render(
      <Tooltip content="tooltip text">
        <button>trigger</button>
      </Tooltip>,
    )

    const trigger = screen.getByText("trigger")

    fireEvent.mouseEnter(trigger)

    expect(screen.getByText("tooltip text")).toBeInTheDocument()
  })

  it("mouse leave 시 tooltip이 닫힌다", () => {
    render(
      <Tooltip content="tooltip text">
        <button>trigger</button>
      </Tooltip>,
    )

    const trigger = screen.getByText("trigger")

    fireEvent.mouseEnter(trigger)
    expect(screen.getByText("tooltip text")).toBeInTheDocument()

    fireEvent.mouseLeave(trigger)
    expect(screen.queryByText("tooltip text")).not.toBeInTheDocument()
  })

  it("focus 시 tooltip이 열린다", () => {
    render(
      <Tooltip content="tooltip text">
        <button>trigger</button>
      </Tooltip>,
    )

    const trigger = screen.getByText("trigger")

    fireEvent.focus(trigger)

    expect(screen.getByText("tooltip text")).toBeInTheDocument()
  })

  it("blur 시 tooltip이 닫힌다", () => {
    render(
      <Tooltip content="tooltip text">
        <button>trigger</button>
      </Tooltip>,
    )

    const trigger = screen.getByText("trigger")

    fireEvent.focus(trigger)
    expect(screen.getByText("tooltip text")).toBeInTheDocument()

    fireEvent.blur(trigger)
    expect(screen.queryByText("tooltip text")).not.toBeInTheDocument()
  })

  it("content가 없으면 열리지 않는다", () => {
    render(
      <Tooltip content="">
        <button>trigger</button>
      </Tooltip>,
    )

    const trigger = screen.getByText("trigger")

    fireEvent.mouseEnter(trigger)

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })
})
