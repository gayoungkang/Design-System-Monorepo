import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"
import { ThemeProvider } from "styled-components"
import Button from "./Button"
import { theme } from "../../tokens/theme"

const renderButton = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe("Button", () => {
  test("텍스트가 렌더링된다", () => {
    renderButton(<Button text="Click Me" />)

    expect(screen.getByText("Click Me")).toBeInTheDocument()
  })

  test("클릭 시 onClick이 호출된다", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    renderButton(<Button text="Click" onClick={onClick} />)

    await user.click(screen.getByRole("button", { name: "Click" }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test("disabled면 클릭이 동작하지 않는다", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    renderButton(<Button text="Disabled" onClick={onClick} disabled />)

    const button = screen.getByRole("button", { name: "Disabled" })

    expect(button).toBeDisabled()

    await user.click(button)

    expect(onClick).not.toHaveBeenCalled()
  })

  test("loading 상태에서는 클릭이 동작하지 않는다", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    renderButton(<Button text="Loading" onClick={onClick} loading />)

    const button = screen.getByRole("button")

    await user.click(button)

    expect(onClick).not.toHaveBeenCalled()
    expect(button).toHaveAttribute("data-loading", "true")
  })

  test("loading이면 텍스트 대신 Progress가 렌더링된다", () => {
    renderButton(<Button text="Loading" loading />)

    expect(screen.queryByText("Loading")).not.toBeInTheDocument()
  })

  test("startIcon과 endIcon이 렌더링된다", () => {
    renderButton(<Button text="Icon" startIcon="ArrowDown" endIcon="ArrowDown" />)

    const icons = screen.getAllByTestId("icon")

    expect(icons.length).toBeGreaterThanOrEqual(2)
  })

  test("loading 상태에서는 아이콘이 렌더링되지 않는다", () => {
    renderButton(<Button text="Icon" startIcon="ArrowDown" endIcon="ArrowDown" loading />)

    expect(screen.queryByTestId("icon")).not.toBeInTheDocument()
  })

  test("fileUrl + fileName이 있으면 다운로드 트리거가 실행된다", async () => {
    const user = userEvent.setup()

    const createElementSpy = vi.spyOn(document, "createElement")
    const appendSpy = vi.spyOn(document.body, "appendChild")
    const removeSpy = vi.spyOn(document.body, "removeChild")

    renderButton(<Button text="Download" fileUrl="/file.csv" fileName="file.csv" />)

    await user.click(screen.getByRole("button", { name: "Download" }))

    expect(createElementSpy).toHaveBeenCalledWith("a")
    expect(appendSpy).toHaveBeenCalled()
    expect(removeSpy).toHaveBeenCalled()

    createElementSpy.mockRestore()
    appendSpy.mockRestore()
    removeSpy.mockRestore()
  })

  test("onDownload이 있으면 download 대신 onDownload가 실행된다", async () => {
    const user = userEvent.setup()
    const onDownload = vi.fn()

    renderButton(
      <Button text="Download" fileUrl="/file.csv" fileName="file.csv" onDownload={onDownload} />,
    )

    await user.click(screen.getByRole("button", { name: "Download" }))

    expect(onDownload).toHaveBeenCalledTimes(1)
  })

  test("size에 따라 padding이 적용된다", () => {
    const { container } = renderButton(<Button text="Size" size="L" />)

    const button = container.querySelector("button") as HTMLElement

    expect(button).toHaveStyle({
      padding: "7px 21px",
    })
  })
})
