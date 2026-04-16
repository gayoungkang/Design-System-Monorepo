import type { ReactElement } from "react"
import { screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, it } from "vitest"
import { renderWithProviders } from "../../test"
import Skeleton from "./Skeleton"

const renderSkeleton = (ui: ReactElement) => renderWithProviders(ui)

describe("Skeleton", () => {
  it("renders basic skeleton", () => {
    const { container } = renderSkeleton(<Skeleton width={100} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it("renders children overlay mode", () => {
    renderSkeleton(
      <Skeleton>
        <div>content</div>
      </Skeleton>,
    )

    expect(screen.getByText("content")).toBeInTheDocument()
  })

  it("applies circular variant", () => {
    const { container } = renderSkeleton(<Skeleton variant="circular" width={40} height={40} />)

    expect(container.firstChild).toBeInTheDocument()
  })
})
