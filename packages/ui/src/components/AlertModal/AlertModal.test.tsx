import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { ThemeProvider } from "styled-components"
import { theme } from "../../tokens/theme"
import AlertModal from "./AlertModal"
import { useAlertStore } from "../../stores/useAlertStore"

vi.mock("../../stores/useAlertStore")

type AlertModalStoreState = {
  open: boolean
  type?: "alert" | "confirm" | string
  message?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  resetAlert: () => void
  confirmButtonProps?: Record<string, unknown>
  cancelButtonProps?: Record<string, unknown>
  title?: string
  bodySx?: Record<string, unknown>
}

const mockedUseAlertStore = vi.mocked(useAlertStore)

const createStoreState = (
  overrides: Partial<AlertModalStoreState> = {},
): ReturnType<typeof useAlertStore> => {
  const baseState: AlertModalStoreState = {
    open: false,
    type: "alert",
    message: "",
    confirmText: "ok",
    cancelText: "cancel",
    onConfirm: undefined,
    onCancel: undefined,
    resetAlert: vi.fn(),
    confirmButtonProps: undefined,
    cancelButtonProps: undefined,
    title: "",
    bodySx: { p: "4px 0px 10px 0px" },
  }

  return {
    ...baseState,
    ...overrides,
  } as unknown as ReturnType<typeof useAlertStore>
}

const renderModal = (storeState: Partial<AlertModalStoreState> = {}) => {
  mockedUseAlertStore.mockReturnValue(createStoreState(storeState))

  return render(
    <ThemeProvider theme={theme}>
      <AlertModal />
    </ThemeProvider>,
  )
}

describe("AlertModal", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("open=false면 렌더링되지 않는다", () => {
    renderModal({
      open: false,
    })

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  test("alert 타입: 메시지와 확인 버튼이 렌더링된다", () => {
    renderModal({
      open: true,
      type: "alert",
      message: "알림 메시지",
      confirmText: "확인",
      resetAlert: vi.fn(),
    })

    expect(screen.getByText("알림 메시지")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument()
  })

  test("confirm 타입: 취소 + 확인 버튼이 렌더링된다", () => {
    renderModal({
      open: true,
      type: "confirm",
      message: "확인 메시지",
      confirmText: "확인",
      cancelText: "취소",
      resetAlert: vi.fn(),
    })

    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument()
  })

  test("확인 버튼 클릭 시 resetAlert + onConfirm 호출", async () => {
    const user = userEvent.setup()
    const resetAlert = vi.fn()
    const onConfirm = vi.fn()

    renderModal({
      open: true,
      type: "alert",
      message: "메시지",
      confirmText: "ok",
      resetAlert,
      onConfirm,
    })

    await user.click(screen.getByRole("button", { name: "ok" }))

    expect(resetAlert).toHaveBeenCalledTimes(1)
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  test("취소 버튼 클릭 시 resetAlert + onCancel 호출", async () => {
    const user = userEvent.setup()
    const resetAlert = vi.fn()
    const onCancel = vi.fn()

    renderModal({
      open: true,
      type: "confirm",
      message: "메시지",
      confirmText: "ok",
      cancelText: "cancel",
      resetAlert,
      onCancel,
    })

    await user.click(screen.getByRole("button", { name: "cancel" }))

    expect(resetAlert).toHaveBeenCalledTimes(1)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  test("alert 타입에서 X 버튼 클릭 시 confirm 동작 수행", async () => {
    const user = userEvent.setup()
    const resetAlert = vi.fn()
    const onConfirm = vi.fn()

    renderModal({
      open: true,
      type: "alert",
      message: "메시지",
      confirmText: "ok",
      resetAlert,
      onConfirm,
    })

    const closeButton = screen.getAllByRole("button")[0]

    await user.click(closeButton)

    expect(resetAlert).toHaveBeenCalledTimes(1)
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  test("confirm 타입에서 X 버튼 클릭 시 cancel 동작 수행", async () => {
    const user = userEvent.setup()
    const resetAlert = vi.fn()
    const onCancel = vi.fn()

    renderModal({
      open: true,
      type: "confirm",
      message: "메시지",
      confirmText: "ok",
      cancelText: "cancel",
      resetAlert,
      onCancel,
    })

    const closeButton = screen.getAllByRole("button")[0]

    await user.click(closeButton)

    expect(resetAlert).toHaveBeenCalledTimes(1)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
