import type { ReactElement } from "react"
import { describe, it, expect, beforeEach } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { renderWithProviders } from "../../test"
import SnackBar from "./SnackBar"
import { useSnackBarStore } from "../../stores/useSnackBarStore"

const renderSnackBar = (ui: ReactElement) => renderWithProviders(ui)

describe("SnackBar", () => {
  beforeEach(() => {
    const current = useSnackBarStore.getState()

    useSnackBarStore.setState({
      ...current,
      snackbars: [],
    })
  })

  it("메시지를 렌더링한다", () => {
    renderSnackBar(<SnackBar id="1" message="테스트 메시지" />)

    expect(screen.getByText("테스트 메시지")).toBeInTheDocument()
  })

  it("SnackBar.List가 store의 snackbar를 렌더링한다", () => {
    const current = useSnackBarStore.getState()

    useSnackBarStore.setState({
      ...current,
      snackbars: [
        {
          id: "1",
          message: "첫 번째 메시지",
          placement: "top-end",
        },
        {
          id: "2",
          message: "두 번째 메시지",
          placement: "bottom-start",
        },
      ],
    })

    renderSnackBar(<SnackBar.List />)

    expect(screen.getByText("첫 번째 메시지")).toBeInTheDocument()
    expect(screen.getByText("두 번째 메시지")).toBeInTheDocument()
  })

  it("닫기 버튼 클릭 시 store에서 제거된다", () => {
    const current = useSnackBarStore.getState()

    useSnackBarStore.setState({
      ...current,
      snackbars: [
        {
          id: "1",
          message: "닫기 테스트",
          placement: "top-end",
        },
      ],
      closeSnackbar: (id: string) =>
        useSnackBarStore.setState((state) => ({
          snackbars: state.snackbars.filter((item) => item.id !== id),
        })),
    })

    renderSnackBar(<SnackBar.List />)

    fireEvent.click(screen.getByRole("button"))

    expect(screen.queryByText("닫기 테스트")).not.toBeInTheDocument()
  })
})
