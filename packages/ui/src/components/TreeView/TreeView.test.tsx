import type { ReactElement } from "react"
import { describe, it, expect } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { renderWithProviders } from "../../test"
import TreeView, { type TreeNodeType } from "./TreeView"

const items: TreeNodeType[] = [
  {
    id: "1",
    label: "Root",
    children: [
      { id: "1-1", label: "Child 1" },
      { id: "1-2", label: "Child 2" },
    ],
  },
]

const renderTreeView = (ui: ReactElement) => renderWithProviders(ui)

describe("TreeView", () => {
  it("노드가 렌더링된다", () => {
    renderTreeView(<TreeView items={items} />)

    expect(screen.getByText("Root")).toBeInTheDocument()
  })

  it("확장 클릭 시 children이 보인다", () => {
    renderTreeView(<TreeView items={items} />)

    const expandButtons = screen.getAllByRole("button", { name: "expand" })
    fireEvent.click(expandButtons[0])

    expect(screen.getByText("Child 1")).toBeInTheDocument()
    expect(screen.getByText("Child 2")).toBeInTheDocument()
  })

  it("선택 시 onSelect 호출된다", () => {
    let selected = ""

    renderTreeView(
      <TreeView
        items={items}
        onSelect={(id) => {
          selected = id
        }}
      />,
    )

    fireEvent.click(screen.getByText("Root"))

    expect(selected).toBe("1")
  })

  it("disabled 노드는 선택되지 않는다", () => {
    let selected = ""

    renderTreeView(
      <TreeView
        items={[{ id: "1", label: "A", disabled: true }]}
        onSelect={(id) => {
          selected = id
        }}
      />,
    )

    fireEvent.click(screen.getByText("A"))

    expect(selected).toBe("")
  })

  it("ArrowDown으로 다음 노드로 이동한다", () => {
    renderTreeView(<TreeView items={items} />)

    const root = screen.getByRole("tree")

    fireEvent.focus(root)
    fireEvent.keyDown(root, { key: "ArrowDown" })

    expect(screen.getByRole("treeitem", { name: /Root/i })).toHaveFocus()
  })

  it("Enter로 선택된다", () => {
    let selected = ""

    renderTreeView(
      <TreeView
        items={items}
        onSelect={(id) => {
          selected = id
        }}
      />,
    )

    const root = screen.getByRole("tree")

    fireEvent.focus(root)
    fireEvent.keyDown(root, { key: "Enter" })

    expect(selected).toBe("1")
  })

  it("Expand all 버튼이 동작한다", () => {
    renderTreeView(<TreeView items={items} />)

    fireEvent.click(screen.getAllByRole("button", { name: "Expand all" })[0])

    expect(screen.getByText("Child 1")).toBeInTheDocument()
  })

  it("Collapse all 버튼이 동작한다", () => {
    renderTreeView(<TreeView items={items} />)

    fireEvent.click(screen.getAllByRole("button", { name: "Expand all" })[0])
    fireEvent.click(screen.getAllByRole("button", { name: "Collapse all" })[0])

    expect(screen.queryByText("Child 1")).not.toBeInTheDocument()
  })
})
