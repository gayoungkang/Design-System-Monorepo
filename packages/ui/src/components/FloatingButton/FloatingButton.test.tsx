import { render, screen, fireEvent } from "@testing-library/react"
import FloatingButton from "./FloatingButton"
import { ThemeProvider } from "styled-components"
import { theme } from "@acme/ui"

const renderWithTheme = (ui: React.ReactNode) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe("FloatingButton", () => {
  it("단일 버튼 클릭 시 onClick 호출", () => {
    const onClick = vi.fn()

    renderWithTheme(<FloatingButton icon="Add" onClick={onClick} />)

    fireEvent.click(screen.getByRole("button"))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("submenu 토글 동작", () => {
    renderWithTheme(
      <FloatingButton icon="Add" item={[{ icon: "ClipboardLine", label: "Clipboard" }]} />,
    )

    const button = screen.getByRole("button")

    fireEvent.click(button)

    expect(screen.getByText("edit")).toBeInTheDocument()
  })

  it("submenu item 클릭 시 닫힘", () => {
    const onClick = vi.fn()

    renderWithTheme(
      <FloatingButton icon="Add" item={[{ icon: "ClipboardLine", label: "Clipboard", onClick }]} />,
    )

    fireEvent.click(screen.getByRole("button"))
    fireEvent.click(screen.getByText("edit"))

    expect(onClick).toHaveBeenCalled()
  })

  it("외부 클릭 시 닫힘", () => {
    renderWithTheme(
      <div>
        <FloatingButton icon="Add" item={[{ icon: "ClipboardLine", label: "Clipboard" }]} />
        <button data-testid="outside">outside</button>
      </div>,
    )

    fireEvent.click(screen.getByRole("button"))
    fireEvent.mouseDown(screen.getByTestId("outside"))

    expect(screen.queryByText("edit")).not.toBeVisible()
  })

  it("ESC 키로 닫힘", () => {
    renderWithTheme(
      <FloatingButton icon="Add" item={[{ icon: "ClipboardLine", label: "Clipboard" }]} />,
    )

    fireEvent.click(screen.getByRole("button"))
    fireEvent.keyDown(document, { key: "Escape" })

    expect(screen.queryByText("edit")).not.toBeVisible()
  })

  it("disabled 상태에서 동작하지 않음", () => {
    const onClick = vi.fn()

    renderWithTheme(<FloatingButton icon="Add" disabled onClick={onClick} />)

    fireEvent.click(screen.getByRole("button"))

    expect(onClick).not.toHaveBeenCalled()
  })
})
