import type { ReactElement } from "react"
import { useState } from "react"
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { renderWithProviders } from "../../test"
import Tabs from "./Tabs"
import type { TabOptionsType } from "./Tabs"

class ResizeObserverMock {
  observe() {}
  disconnect() {}
  unobserve() {}
}

beforeAll(() => {
  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: ResizeObserverMock,
  })

  Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
    writable: true,
    configurable: true,
    value: vi.fn(),
  })
})

afterAll(() => {
  // noop
})

const baseOptions: TabOptionsType[] = [
  { label: "Tab A", value: "a" },
  { label: "Tab B", value: "b" },
  { label: "Tab C", value: "c" },
]

const renderTabs = (ui: ReactElement) => renderWithProviders(ui)

describe("Tabs", () => {
  it("visible 옵션만 렌더링된다", () => {
    renderTabs(
      <Tabs
        options={[
          { label: "Tab A", value: "a" },
          { label: "Hidden", value: "hidden", hidden: true },
          { label: "Tab B", value: "b" },
        ]}
        value="a"
        size="M"
        onSelect={() => {}}
      />,
    )

    expect(screen.getByText("Tab A")).toBeInTheDocument()
    expect(screen.getByText("Tab B")).toBeInTheDocument()
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument()
  })

  it("클릭 시 onSelect가 호출된다", () => {
    const TestComponent = () => {
      const [value, setValue] = useState<string | null>("a")

      return (
        <>
          <div data-testid="value">{value ?? "null"}</div>
          <Tabs options={baseOptions} value={value} size="M" onSelect={setValue} />
        </>
      )
    }

    renderTabs(<TestComponent />)

    fireEvent.click(screen.getByRole("tab", { name: "Tab B" }))

    expect(screen.getByTestId("value")).toHaveTextContent("b")
  })

  it("disabled 탭은 클릭해도 선택되지 않는다", () => {
    const TestComponent = () => {
      const [value, setValue] = useState<string | null>("a")

      return (
        <>
          <div data-testid="value">{value ?? "null"}</div>
          <Tabs
            options={[
              { label: "Tab A", value: "a" },
              { label: "Tab B", value: "b", disabled: true },
            ]}
            value={value}
            size="M"
            onSelect={setValue}
          />
        </>
      )
    }

    renderTabs(<TestComponent />)

    fireEvent.click(screen.getByRole("tab", { name: "Tab B" }))

    expect(screen.getByTestId("value")).toHaveTextContent("a")
  })

  it("ArrowRight로 focus 이동 후 Enter로 선택할 수 있다", () => {
    const TestComponent = () => {
      const [value, setValue] = useState<string | null>("a")

      return (
        <>
          <div data-testid="value">{value ?? "null"}</div>
          <Tabs options={baseOptions} value={value} size="M" onSelect={setValue} />
        </>
      )
    }

    renderTabs(<TestComponent />)

    const tabList = screen.getByRole("tablist")
    fireEvent.keyDown(tabList, { key: "ArrowRight" })
    fireEvent.keyDown(tabList, { key: "Enter" })

    expect(screen.getByTestId("value")).toHaveTextContent("b")
  })

  it("Home과 End 키로 focus 이동이 가능하다", () => {
    renderTabs(<Tabs options={baseOptions} value="b" size="M" onSelect={() => {}} />)

    const tabList = screen.getByRole("tablist")

    fireEvent.keyDown(tabList, { key: "End" })
    expect(screen.getByRole("tab", { name: "Tab C" })).toHaveFocus()

    fireEvent.keyDown(tabList, { key: "Home" })
    expect(screen.getByRole("tab", { name: "Tab A" })).toHaveFocus()
  })

  it("Space로 현재 focus 탭을 선택한다", () => {
    const TestComponent = () => {
      const [value, setValue] = useState<string | null>("a")

      return (
        <>
          <div data-testid="value">{value ?? "null"}</div>
          <Tabs options={baseOptions} value={value} size="M" onSelect={setValue} />
        </>
      )
    }

    renderTabs(<TestComponent />)

    const tabList = screen.getByRole("tablist")
    fireEvent.keyDown(tabList, { key: "ArrowRight" })
    fireEvent.keyDown(tabList, { key: " " })

    expect(screen.getByTestId("value")).toHaveTextContent("b")
  })

  it("선택된 탭은 aria-selected=true를 가진다", () => {
    renderTabs(<Tabs options={baseOptions} value="b" size="M" onSelect={() => {}} />)

    expect(screen.getByRole("tab", { name: "Tab B" })).toHaveAttribute("aria-selected", "true")
    expect(screen.getByRole("tab", { name: "Tab A" })).toHaveAttribute("aria-selected", "false")
  })

  it("disabled 탭은 aria-disabled=true를 가진다", () => {
    renderTabs(
      <Tabs
        options={[
          { label: "Tab A", value: "a" },
          { label: "Tab B", value: "b", disabled: true },
        ]}
        value="a"
        size="M"
        onSelect={() => {}}
      />,
    )

    expect(screen.getByRole("tab", { name: "Tab B" })).toHaveAttribute("aria-disabled", "true")
  })
})
