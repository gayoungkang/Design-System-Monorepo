import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
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

describe("TreeView", () => {
  it("노드가 렌더링된다", () => {
    render(<TreeView items={items} />)

    expect(screen.getByText("Root")).toBeInTheDocument()
  })

  it("확장 클릭 시 children이 보인다", () => {
    render(<TreeView items={items} />)

    const expandBtn = screen.getByRole("button")
    fireEvent.click(expandBtn)

    expect(screen.getByText("Child 1")).toBeInTheDocument()
    expect(screen.getByText("Child 2")).toBeInTheDocument()
  })

  it("선택 시 onSelect 호출된다", () => {
    let selected = ""

    render(
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

    render(
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
    render(<TreeView items={items} />)

    const root = screen.getByRole("tree")

    fireEvent.focus(root)
    fireEvent.keyDown(root, { key: "ArrowDown" })

    expect(screen.getByText("Root")).toHaveFocus()
  })

  it("Enter로 선택된다", () => {
    let selected = ""

    render(
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
    render(<TreeView items={items} />)

    fireEvent.click(screen.getByText("Expand all"))

    expect(screen.getByText("Child 1")).toBeInTheDocument()
  })

  it("Collapse all 버튼이 동작한다", () => {
    render(<TreeView items={items} />)

    fireEvent.click(screen.getByText("Expand all"))
    fireEvent.click(screen.getByText("Collapse all"))

    expect(screen.queryByText("Child 1")).not.toBeVisible()
  })
})
