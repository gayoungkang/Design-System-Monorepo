import type { ReactNode } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { ThemeProvider } from "styled-components"
import Modal from "./Modal"
import { theme } from "../../tokens/theme"

vi.mock("../../stores/useModalStack", () => ({
  useModalStack: () => ({ isTop: true }),
}))

vi.mock("../../utils/canUseDOM", () => ({
  canUseDOM: () => true,
}))

const renderWithTheme = (ui: ReactNode) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe("Modal", () => {
  it("open이 false면 렌더링하지 않는다", () => {
    renderWithTheme(
      <Modal open={false} title="모달">
        내용
      </Modal>,
    )

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("open이 true면 dialog를 렌더링한다", () => {
    renderWithTheme(
      <Modal open title="모달">
        내용
      </Modal>,
    )

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("내용")).toBeInTheDocument()
  })

  it("title이 있으면 aria-labelledby를 연결한다", () => {
    renderWithTheme(
      <Modal open title="확인 모달">
        내용
      </Modal>,
    )

    const dialog = screen.getByRole("dialog")
    const title = screen.getByText("확인 모달")

    expect(dialog).toHaveAttribute("aria-labelledby", title.getAttribute("id") ?? "")
  })

  it("Escape 키 입력 시 onClose를 호출한다", () => {
    const onClose = vi.fn()

    renderWithTheme(
      <Modal open title="모달" onClose={onClose}>
        내용
      </Modal>,
    )

    fireEvent.keyDown(document, { key: "Escape" })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("allowBackdrop이 true면 overlay 클릭으로 닫힌다", () => {
    const onClose = vi.fn()

    renderWithTheme(
      <Modal open title="모달" allowBackdrop onClose={onClose}>
        내용
      </Modal>,
    )

    fireEvent.click(screen.getByRole("dialog").parentElement as HTMLElement)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("allowBackdrop이 false면 overlay 클릭으로 닫히지 않는다", () => {
    const onClose = vi.fn()

    renderWithTheme(
      <Modal open title="모달" allowBackdrop={false} onClose={onClose}>
        내용
      </Modal>,
    )

    fireEvent.click(screen.getByRole("dialog").parentElement as HTMLElement)

    expect(onClose).not.toHaveBeenCalled()
  })

  it("기본 footer 버튼이 렌더링된다", () => {
    renderWithTheme(
      <Modal open title="모달">
        내용
      </Modal>,
    )

    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument()
  })

  it("footerComponent가 있으면 기본 footer 대신 렌더링한다", () => {
    renderWithTheme(
      <Modal open footerComponent={<button type="button">커스텀 푸터</button>}>
        내용
      </Modal>,
    )

    expect(screen.getByRole("button", { name: "커스텀 푸터" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "확인" })).not.toBeInTheDocument()
  })

  it("headerComponent가 있으면 기본 header 대신 렌더링한다", () => {
    renderWithTheme(
      <Modal open headerComponent={<div>커스텀 헤더</div>}>
        내용
      </Modal>,
    )

    expect(screen.getByText("커스텀 헤더")).toBeInTheDocument()
  })

  it("body overflow를 open 시 hidden으로 잠근다", () => {
    renderWithTheme(
      <Modal open title="모달">
        내용
      </Modal>,
    )

    expect(document.body.style.overflow).toBe("hidden")
  })
})
