import { describe, it, expect, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import SnackBar from "./SnackBar"
import { useSnackBarStore } from "../../stores/useSnackBarStore"

describe("SnackBar", () => {
  beforeEach(() => {
    const current = useSnackBarStore.getState()

    useSnackBarStore.setState({
      ...current,
      snackbars: [],
    })
  })

  it("메시지를 렌더링한다", () => {
    render(<SnackBar id="1" message="테스트 메시지" />)

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

    render(<SnackBar.List />)

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

    render(<SnackBar.List />)

    fireEvent.click(screen.getByRole("button"))

    expect(screen.queryByText("닫기 테스트")).not.toBeInTheDocument()
  })
})
