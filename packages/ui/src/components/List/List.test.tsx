import type { ReactElement } from "react"
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, it, vi } from "vitest"
import List, { ListItem } from "./List"
import { renderWithProviders } from "../../test"

const renderList = (ui: ReactElement) => {
  return renderWithProviders(ui)
}

describe("List", () => {
  it("title을 렌더링한다", () => {
    renderList(<List title="설정" items={[{ label: "프로필" }]} />)

    expect(screen.getByText("설정")).toBeInTheDocument()
    expect(screen.getByText("프로필")).toBeInTheDocument()
  })

  it("separator 기본값에 따라 Divider를 렌더링한다", () => {
    const { container } = renderList(<List items={[{ label: "항목 1" }, { label: "항목 2" }]} />)

    expect(container.querySelectorAll("hr").length).toBe(1)
  })

  it("item.separator가 false면 개별 구분선을 렌더링하지 않는다", () => {
    const { container } = renderList(
      <List separator items={[{ label: "항목 1", separator: false }, { label: "항목 2" }]} />,
    )

    expect(container.querySelectorAll("hr").length).toBe(0)
  })

  it("simple checkbox config를 렌더링한다", () => {
    renderList(
      <List
        items={[
          {
            label: "약관",
            startItem: [
              {
                type: "CheckBox",
                props: {
                  checked: true,
                  label: "동의",
                  onChange: vi.fn(),
                },
              },
            ],
          },
        ]}
      />,
    )

    expect(screen.getByText("약관")).toBeInTheDocument()
    expect(screen.getByText("동의")).toBeInTheDocument()
  })
})

describe("ListItem", () => {
  it("onClick이 있으면 button으로 렌더링된다", () => {
    renderList(<ListItem label="클릭 항목" onClick={vi.fn()} />)

    expect(screen.getByRole("button", { name: "클릭 항목" })).toBeInTheDocument()
  })

  it("disabled면 클릭되지 않는다", () => {
    const onClick = vi.fn()

    renderList(<ListItem label="비활성 항목" disabled onClick={onClick} />)

    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("클릭 가능한 항목은 클릭 이벤트를 실행한다", () => {
    const onClick = vi.fn()

    renderList(<ListItem label="클릭 항목" onClick={onClick} />)

    fireEvent.click(screen.getByRole("button", { name: "클릭 항목" }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("selected 상태를 aria-pressed로 반영한다", () => {
    renderList(<ListItem label="선택 항목" selected onClick={vi.fn()} />)

    expect(screen.getByRole("button", { name: "선택 항목" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })
})
