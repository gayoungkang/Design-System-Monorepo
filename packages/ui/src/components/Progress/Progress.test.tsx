import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Progress from "./Progress"

describe("Progress", () => {
  it("renders determinate value", () => {
    const { getByText } = render(
      <Progress variant="determinate" value={50} label="renders determinate value" />,
    )

    expect(getByText("50%")).toBeTruthy()
  })

  it("clamps value between 0 and 100", () => {
    const { getByText } = render(
      <Progress variant="determinate" value={150} label="clamps value between 0 and 100" />,
    )

    expect(getByText("100%")).toBeTruthy()
  })

  it("renders circular", () => {
    const { container } = render(<Progress type="circular" variant="determinate" value={40} />)

    expect(container.querySelector("svg")).toBeTruthy()
  })
})
