import { screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import { renderWithProviders } from "../../test"
import ImageList from "./ImageList"
import ImageListItem from "../ImageListItem/ImageListItem"

describe("ImageList", () => {
  test("children을 렌더링한다", () => {
    renderWithProviders(
      <ImageList ariaLabel="Product images">
        <ImageListItem>first</ImageListItem>
        <ImageListItem>second</ImageListItem>
      </ImageList>,
    )

    expect(screen.getByText("first")).toBeInTheDocument()
    expect(screen.getByText("second")).toBeInTheDocument()
  })

  test("list semantics와 accessible label을 제공한다", () => {
    renderWithProviders(
      <ImageList ariaLabel="Gallery">
        <ImageListItem>item</ImageListItem>
      </ImageList>,
    )

    expect(screen.getByRole("list", { name: "Gallery" })).toBeInTheDocument()
    expect(screen.getByRole("listitem")).toBeInTheDocument()
  })

  test("cols와 gap style을 반영한다", () => {
    renderWithProviders(
      <ImageList cols={3} gap={12} ariaLabel="Gallery">
        <ImageListItem>item</ImageListItem>
      </ImageList>,
    )

    const list = screen.getByRole("list", { name: "Gallery" })

    expect(list).toHaveStyle("grid-template-columns: repeat(3, minmax(0, 1fr))")
    expect(list).toHaveStyle("gap: 12px")
  })

  test("masonry variant를 column layout으로 렌더링한다", () => {
    renderWithProviders(
      <ImageList cols={2} gap={10} variant="masonry" ariaLabel="Masonry gallery">
        <ImageListItem>item</ImageListItem>
      </ImageList>,
    )

    const list = screen.getByRole("list", { name: "Masonry gallery" })

    expect(list).toHaveStyle("column-count: 2")
    expect(list).toHaveStyle("column-gap: 10px")
  })
})
