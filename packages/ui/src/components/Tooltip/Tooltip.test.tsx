import type { ReactElement } from "react"
import { describe, it, expect } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { renderWithProviders } from "../../test"
import Tooltip from "./Tooltip"

const renderTooltip = (ui: ReactElement) => renderWithProviders(ui)

describe("Tooltip", () => {
  it("children를 렌더링한다", () => {
    renderTooltip(
      <Tooltip content="tooltip text">
        <button>trigger</button>
      </Tooltip>,
    )

    expect(screen.getByText("trigger")).toBeInTheDocument()
  })

  it("hover 시 tooltip이 열린다", () => {
    renderTooltip(
      <Tooltip content="tooltip text">
        <button>trigger</button>
      </Tooltip>,
    )

    const trigger = screen.getByText("trigger")

    fireEvent.mouseEnter(trigger)

    expect(screen.getByRole("tooltip")).toHaveTextContent("tooltip text")
  })

  it("mouse leave 시 tooltip이 닫힌다", () => {
    renderTooltip(
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
    renderTooltip(
      <Tooltip content="tooltip text">
        <button>trigger</button>
      </Tooltip>,
    )

    const trigger = screen.getByText("trigger")

    fireEvent.focus(trigger)

    expect(screen.getByRole("tooltip")).toHaveTextContent("tooltip text")
  })

  it("blur 시 tooltip이 닫힌다", () => {
    renderTooltip(
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
    renderTooltip(
      <Tooltip content="">
        <button>trigger</button>
      </Tooltip>,
    )

    const trigger = screen.getByText("trigger")

    fireEvent.mouseEnter(trigger)

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("열린 tooltip과 trigger를 aria-describedby로 연결한다", () => {
    renderTooltip(
      <Tooltip content="tooltip text">
        <button>trigger</button>
      </Tooltip>,
    )

    const triggerWrapper = screen.getByText("trigger").parentElement
    expect(triggerWrapper).toBeInTheDocument()

    if (!triggerWrapper) return

    fireEvent.focus(triggerWrapper)

    const tooltip = screen.getByRole("tooltip")
    expect(triggerWrapper).toHaveAttribute("aria-describedby", tooltip.id)
  })

  it("Escape 키로 tooltip을 닫는다", () => {
    renderTooltip(
      <Tooltip content="tooltip text">
        <button>trigger</button>
      </Tooltip>,
    )

    const triggerWrapper = screen.getByText("trigger").parentElement
    expect(triggerWrapper).toBeInTheDocument()

    if (!triggerWrapper) return

    fireEvent.focus(triggerWrapper)
    expect(screen.getByRole("tooltip")).toBeInTheDocument()

    fireEvent.keyDown(triggerWrapper, { key: "Escape" })

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })
})
