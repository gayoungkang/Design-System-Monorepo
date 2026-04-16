import type { ReactElement } from "react"
import { screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { renderWithProviders } from "../../test"
import Paper from "./Paper"

const renderPaper = (ui: ReactElement) => renderWithProviders(ui)

describe("Paper", () => {
  it("children을 렌더링한다", () => {
    renderPaper(<Paper>내용</Paper>)

    expect(screen.getByText("내용")).toBeInTheDocument()
  })

  it("기본 padding을 적용한다", () => {
    const { container } = renderPaper(<Paper>내용</Paper>)

    expect(container.firstChild).toHaveStyle("padding: 16px")
  })

  it("string radius를 그대로 적용한다", () => {
    const { container } = renderPaper(<Paper radius="20px">내용</Paper>)

    expect(container.firstChild).toHaveStyle("border-radius: 20px")
  })

  it("theme borderRadius key/number radius를 해석한다", () => {
    const { container } = renderPaper(<Paper radius={4}>내용</Paper>)

    const styles = window.getComputedStyle(container.firstChild as HTMLElement)

    expect(styles.borderRadius).toBe("4px")
  })

  it("elevation을 box-shadow로 적용한다", () => {
    const { container } = renderPaper(<Paper elevation={2}>내용</Paper>)

    const styles = window.getComputedStyle(container.firstChild as HTMLElement)

    expect(styles.boxShadow).not.toBe("none")
  })

  it("elevation이 음수면 0으로 보정한다", () => {
    const { container } = renderPaper(<Paper elevation={-3}>내용</Paper>)

    const styles = window.getComputedStyle(container.firstChild as HTMLElement)

    expect(styles.boxShadow).not.toBe("")
  })

  it("elevation이 최대 인덱스를 초과하면 마지막 shadow로 보정한다", () => {
    const { container } = renderPaper(<Paper elevation={999}>내용</Paper>)

    const styles = window.getComputedStyle(container.firstChild as HTMLElement)

    expect(styles.boxShadow).not.toBe("")
  })
})
