import type { ReactElement } from "react"
import { screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, it } from "vitest"
import { renderWithProviders } from "../../test"
import Progress from "./Progress"

const renderProgress = (ui: ReactElement) => renderWithProviders(ui)

describe("Progress", () => {
  it("renders determinate value", () => {
    renderProgress(<Progress variant="determinate" value={50} label="renders determinate value" />)

    expect(screen.getByText("50%")).toBeInTheDocument()
  })

  it("clamps value between 0 and 100", () => {
    renderProgress(
      <Progress variant="determinate" value={150} label="clamps value between 0 and 100" />,
    )

    expect(screen.getByText("100%")).toBeInTheDocument()
  })

  it("renders circular", () => {
    const { container } = renderProgress(
      <Progress type="circular" variant="determinate" value={40} />,
    )

    expect(container.querySelector("svg")).toBeInTheDocument()
  })
})
