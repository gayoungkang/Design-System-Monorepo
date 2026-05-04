import type { ReactElement } from "react"
import { useState } from "react"
import { fireEvent, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { renderWithProviders } from "../../test"
import Modal from "./Modal"

vi.mock("../../stores/useModalStack", () => ({
  useModalStack: () => ({ isTop: true }),
}))

vi.mock("../../utils/canUseDOM", () => ({
  canUseDOM: () => true,
}))

const renderModal = (ui: ReactElement) => renderWithProviders(ui)

describe("Modal", () => {
  it("open이 false면 렌더링하지 않는다", () => {
    renderModal(
      <Modal open={false} title="모달">
        내용
      </Modal>,
    )

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("open이 true면 dialog를 렌더링한다", () => {
    renderModal(
      <Modal open title="모달">
        내용
      </Modal>,
    )

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("내용")).toBeInTheDocument()
  })

  it("title이 있으면 aria-labelledby를 연결한다", () => {
    renderModal(
      <Modal open title="확인 모달">
        내용
      </Modal>,
    )

    const dialog = screen.getByRole("dialog")
    const labelledby = dialog.getAttribute("aria-labelledby")

    expect(labelledby).toBeTruthy()
    expect(document.getElementById(labelledby ?? "")).toHaveTextContent("확인 모달")
  })

  it("children이 있으면 aria-describedby를 본문에 연결한다", () => {
    renderModal(
      <Modal open title="확인 모달">
        본문 설명
      </Modal>,
    )

    const dialog = screen.getByRole("dialog")
    const describedBy = dialog.getAttribute("aria-describedby")

    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy ?? "")).toHaveTextContent("본문 설명")
  })

  it("Escape 키 입력 시 onClose를 호출한다", () => {
    const onClose = vi.fn()

    renderModal(
      <Modal open title="모달" onClose={onClose}>
        내용
      </Modal>,
    )

    fireEvent.keyDown(document, { key: "Escape" })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("allowBackdrop이 true면 overlay 클릭으로 닫힌다", () => {
    const onClose = vi.fn()

    renderModal(
      <Modal open title="모달" allowBackdrop onClose={onClose}>
        내용
      </Modal>,
    )

    fireEvent.click(screen.getByRole("dialog").parentElement as HTMLElement)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("allowBackdrop이 false면 overlay 클릭으로 닫히지 않는다", () => {
    const onClose = vi.fn()

    renderModal(
      <Modal open title="모달" allowBackdrop={false} onClose={onClose}>
        내용
      </Modal>,
    )

    fireEvent.click(screen.getByRole("dialog").parentElement as HTMLElement)

    expect(onClose).not.toHaveBeenCalled()
  })

  it("기본 footer 버튼이 렌더링된다", () => {
    renderModal(
      <Modal open title="모달">
        내용
      </Modal>,
    )

    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument()
  })

  it("footerComponent가 있으면 기본 footer 대신 렌더링한다", () => {
    renderModal(
      <Modal open footerComponent={<button type="button">커스텀 푸터</button>}>
        내용
      </Modal>,
    )

    expect(screen.getByRole("button", { name: "커스텀 푸터" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "확인" })).not.toBeInTheDocument()
  })

  it("headerComponent가 있으면 기본 header 대신 렌더링한다", () => {
    renderModal(
      <Modal open headerComponent={<div>커스텀 헤더</div>}>
        내용
      </Modal>,
    )

    expect(screen.getByText("커스텀 헤더")).toBeInTheDocument()
  })

  it("body overflow를 open 시 hidden으로 잠근다", () => {
    renderModal(
      <Modal open title="모달">
        내용
      </Modal>,
    )

    expect(document.body.style.overflow).toBe("hidden")
  })

  it("중첩 modal 중 하나가 닫혀도 body scroll lock을 유지한다", () => {
    const Example = () => {
      const [secondaryOpen, setSecondaryOpen] = useState(true)

      return (
        <>
          <Modal open title="첫 번째">
            첫 번째 내용
          </Modal>
          <Modal open={secondaryOpen} title="두 번째" onClose={() => setSecondaryOpen(false)}>
            두 번째 내용
          </Modal>
        </>
      )
    }

    renderModal(<Example />)

    expect(document.body.style.overflow).toBe("hidden")

    fireEvent.keyDown(document, { key: "Escape" })

    expect(screen.getByText("첫 번째 내용")).toBeInTheDocument()
    expect(document.body.style.overflow).toBe("hidden")
  })

  it("닫힐 때 이전 포커스 요소로 focus를 돌려준다", async () => {
    const user = userEvent.setup()

    const Example = () => {
      const [open, setOpen] = useState(false)

      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            열기
          </button>
          <Modal open={open} title="모달" onClose={() => setOpen(false)}>
            내용
          </Modal>
        </>
      )
    }

    renderModal(<Example />)

    const trigger = screen.getByRole("button", { name: "열기" })
    await user.click(trigger)

    fireEvent.keyDown(document, { key: "Escape" })

    expect(trigger).toHaveFocus()
  })

  it("Tab 이동이 dialog 내부에서 순환된다", () => {
    renderModal(
      <Modal open title="모달">
        내용
      </Modal>,
    )

    const confirmButton = screen.getByRole("button", { name: "확인" })
    confirmButton.focus()

    fireEvent.keyDown(document, { key: "Tab" })

    expect(screen.getByRole("button", { name: "닫기" })).toHaveFocus()
  })
})
