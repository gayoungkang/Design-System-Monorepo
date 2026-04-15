import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Skeleton from "./Skeleton"

describe("Skeleton", () => {
  it("renders basic skeleton", () => {
    const { container } = render(<Skeleton width={100} />)
    expect(container.firstChild).toBeTruthy()
  })

  it("renders children overlay mode", () => {
    render(
      <Skeleton>
        <div>content</div>
      </Skeleton>,
    )

    expect(screen.getByText("content")).toBeInTheDocument()
  })

  it("applies circular variant", () => {
    const { container } = render(<Skeleton variant="circular" width={40} height={40} />)

    expect(container.firstChild).toBeTruthy()
  })
})
