import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type React from "react"
import { vi } from "vitest"
import Accordion from "./Accordion"
import { renderWithProviders } from "../../test"

const renderAccordion = (ui: React.ReactElement) => {
  return renderWithProviders(ui)
}

describe("Accordion", () => {
  test("기본값은 닫힌 상태이며 summary 클릭 시 펼쳐진다", async () => {
    const user = userEvent.setup()

    renderAccordion(<Accordion summary="제목">내용</Accordion>)

    expect(screen.queryByText("내용")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "제목" }))

    expect(screen.getByText("내용")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "제목" })).toHaveAttribute("aria-expanded", "true")
  })

  test("defaultExpanded가 true면 처음부터 펼쳐진다", () => {
    renderAccordion(
      <Accordion summary="초기 열림" defaultExpanded>
        기본 열림 내용
      </Accordion>,
    )

    expect(screen.getByText("기본 열림 내용")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "초기 열림" })).toHaveAttribute(
      "aria-expanded",
      "true",
    )
  })

  test("uncontrolled 모드에서 onChange와 함께 토글된다", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderAccordion(
      <Accordion summary="토글" onChange={onChange}>
        토글 내용
      </Accordion>,
    )

    const button = screen.getByRole("button", { name: "토글" })

    await user.click(button)
    expect(onChange).toHaveBeenNthCalledWith(1, true)
    expect(screen.getByText("토글 내용")).toBeInTheDocument()

    await user.click(button)
    expect(onChange).toHaveBeenNthCalledWith(2, false)
    expect(screen.queryByText("토글 내용")).not.toBeInTheDocument()
  })

  test("controlled 모드에서는 onChange만 호출하고 외부 상태가 바뀌기 전까지 UI는 유지된다", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    const { rerender } = renderAccordion(
      <Accordion summary="제어형" expanded={false} onChange={onChange}>
        제어형 내용
      </Accordion>,
    )

    const button = screen.getByRole("button", { name: "제어형" })

    await user.click(button)

    expect(onChange).toHaveBeenCalledWith(true)
    expect(screen.queryByText("제어형 내용")).not.toBeInTheDocument()
    expect(button).toHaveAttribute("aria-expanded", "false")

    rerender(
      <Accordion summary="제어형" expanded onChange={onChange}>
        제어형 내용
      </Accordion>,
    )

    expect(screen.getByText("제어형 내용")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "제어형" })).toHaveAttribute("aria-expanded", "true")
  })

  test("disabled면 클릭해도 열리지 않고 onChange도 호출되지 않는다", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderAccordion(
      <Accordion summary="비활성화" disabled onChange={onChange}>
        비활성화 내용
      </Accordion>,
    )

    const button = screen.getByRole("button", { name: "비활성화" })

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-disabled", "true")

    await user.click(button)

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.queryByText("비활성화 내용")).not.toBeInTheDocument()
    expect(button).toHaveAttribute("aria-expanded", "false")
  })

  test("summary가 ReactNode여도 접근성과 내용이 정상 동작한다", async () => {
    const user = userEvent.setup()

    renderAccordion(
      <Accordion
        summary={
          <div>
            <span>커스텀 헤더</span>
          </div>
        }
      >
        커스텀 내용
      </Accordion>,
    )

    const button = screen.getByRole("button", { name: "커스텀 헤더" })

    expect(button).toHaveAttribute("aria-expanded", "false")

    await user.click(button)

    expect(screen.getByText("커스텀 내용")).toBeInTheDocument()
    expect(button).toHaveAttribute("aria-expanded", "true")
  })
})
