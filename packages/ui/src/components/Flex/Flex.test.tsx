import { createRef } from "react"
import { screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import type React from "react"
import Flex from "./Flex"
import { renderWithProviders } from "../../test"

const renderFlex = (ui: React.ReactElement) => {
  return renderWithProviders(ui)
}

describe("Flex", () => {
  test("children를 렌더링한다", () => {
    renderFlex(
      <Flex>
        <span>Item A</span>
        <span>Item B</span>
      </Flex>,
    )

    expect(screen.getByText("Item A")).toBeInTheDocument()
    expect(screen.getByText("Item B")).toBeInTheDocument()
  })

  test("기본 flex 스타일이 적용된다", () => {
    const { container } = renderFlex(<Flex>Content</Flex>)

    const element = container.firstElementChild as HTMLElement

    expect(element).toHaveStyle("display: flex")
    expect(element).toHaveStyle("height: max-content")
    expect(element).toHaveStyle("flex-direction: row")
    expect(element).toHaveStyle("justify-content: flex-start")
    expect(element).toHaveStyle("align-items: stretch")
    expect(element).toHaveStyle("flex-wrap: nowrap")
    expect(element).toHaveStyle("gap: 0px")
  })

  test("direction, justify, align, wrap, gap props가 적용된다", () => {
    const { container } = renderFlex(
      <Flex direction="column" justify="space-between" align="center" wrap="wrap" gap={12}>
        Content
      </Flex>,
    )

    const element = container.firstElementChild as HTMLElement

    expect(element).toHaveStyle("flex-direction: column")
    expect(element).toHaveStyle("justify-content: space-between")
    expect(element).toHaveStyle("align-items: center")
    expect(element).toHaveStyle("flex-wrap: wrap")
    expect(element).toHaveStyle("gap: 12px")
  })

  test("gap이 문자열이면 그대로 적용된다", () => {
    const { container } = renderFlex(<Flex gap="1rem">Content</Flex>)

    const element = container.firstElementChild as HTMLElement

    expect(element).toHaveStyle("gap: 1rem")
  })

  test("as prop으로 태그를 변경할 수 있다", () => {
    const { container } = renderFlex(<Flex as="section">Section Content</Flex>)

    const element = container.firstElementChild

    expect(element?.tagName).toBe("SECTION")
    expect(screen.getByText("Section Content")).toBeInTheDocument()
  })

  test("extraProps가 적용된다", () => {
    renderFlex(
      <Flex extraProps={{ "data-testid": "flex-box", "aria-label": "flex container" }}>
        Content
      </Flex>,
    )

    const element = screen.getByTestId("flex-box")

    expect(element).toHaveAttribute("aria-label", "flex container")
  })

  test("일반 DOM props도 전달된다", () => {
    renderFlex(
      <Flex id="flex-id" role="group" data-testid="flex-dom-props">
        Content
      </Flex>,
    )

    const element = screen.getByTestId("flex-dom-props")

    expect(element).toHaveAttribute("id", "flex-id")
    expect(element).toHaveAttribute("role", "group")
  })

  test("BaseMixinProps 스타일이 적용된다", () => {
    renderFlex(
      <Flex data-testid="flex-styled" width="240px" p="16px" m="8px">
        Content
      </Flex>,
    )

    const element = screen.getByTestId("flex-styled")

    expect(element).toHaveStyle("width: 240px")
    expect(element).toHaveStyle("padding: 16px")
    expect(element).toHaveStyle("margin: 8px")
  })

  test("ref가 루트 DOM에 연결된다", () => {
    const ref = createRef<HTMLDivElement>()

    renderFlex(<Flex ref={ref}>Ref Content</Flex>)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current?.textContent).toBe("Ref Content")
  })
})
