import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"
import { renderWithProviders } from "../../test"
import ImageListItem from "./ImageListItem"

describe("ImageListItem", () => {
  test("children을 렌더링하고 listitem role을 제공한다", () => {
    renderWithProviders(<ImageListItem>Product image</ImageListItem>)

    expect(screen.getByRole("listitem")).toHaveTextContent("Product image")
  })

  test("interactive일 때 focus 가능하다", () => {
    renderWithProviders(
      <ImageListItem interactive ariaLabel="Open product">
        Product
      </ImageListItem>,
    )

    expect(screen.getByRole("listitem", { name: "Open product" })).toHaveAttribute("tabindex", "0")
  })

  test("click 시 onClick을 호출한다", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    renderWithProviders(
      <ImageListItem interactive ariaLabel="Open product" onClick={onClick}>
        Product
      </ImageListItem>,
    )

    await user.click(screen.getByRole("listitem", { name: "Open product" }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test("Enter key로 onClick을 호출한다", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    renderWithProviders(
      <ImageListItem interactive ariaLabel="Open product" onClick={onClick}>
        Product
      </ImageListItem>,
    )

    screen.getByRole("listitem", { name: "Open product" }).focus()
    await user.keyboard("{Enter}")

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test("disabled 상태에서는 클릭을 차단한다", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    renderWithProviders(
      <ImageListItem interactive disabled ariaLabel="Open product" onClick={onClick}>
        Product
      </ImageListItem>,
    )

    await user.click(screen.getByRole("listitem", { name: "Open product" }))

    expect(onClick).not.toHaveBeenCalled()
  })

  test("cols와 rows span style을 반영한다", () => {
    renderWithProviders(
      <ImageListItem cols={2} rows={3} ariaLabel="Featured">
        Product
      </ImageListItem>,
    )

    const item = screen.getByRole("listitem", { name: "Featured" })

    expect(item).toHaveStyle("grid-column: span 2")
    expect(item).toHaveStyle("grid-row: span 3")
  })
})
