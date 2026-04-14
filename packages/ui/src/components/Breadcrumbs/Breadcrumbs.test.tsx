import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"
import { ThemeProvider } from "styled-components"
import Breadcrumbs from "./Breadcrumbs"
import { theme } from "../../tokens/theme"

const renderBreadcrumbs = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe("Breadcrumbs", () => {
  test("items를 순서대로 렌더링한다", () => {
    renderBreadcrumbs(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Category", href: "/category" },
          { label: "Detail" },
        ]}
      />,
    )

    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Category")).toBeInTheDocument()
    expect(screen.getByText("Detail")).toBeInTheDocument()
  })

  test("마지막 아이템은 aria-current=page로 렌더링된다", () => {
    renderBreadcrumbs(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Category", href: "/category" },
          { label: "Detail" },
        ]}
      />,
    )

    const currentPage = screen.getByText("Detail").closest("[aria-current='page']")

    expect(currentPage).toBeInTheDocument()
  })

  test("마지막이 아닌 href 항목은 링크로 렌더링된다", () => {
    renderBreadcrumbs(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Category", href: "/category" },
          { label: "Detail" },
        ]}
      />,
    )

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "Category" })).toHaveAttribute("href", "/category")
  })

  test("마지막이 아닌 onClick 항목은 클릭 가능하게 렌더링된다", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    renderBreadcrumbs(<Breadcrumbs items={[{ label: "Home", onClick }, { label: "Detail" }]} />)

    await user.click(screen.getByText("Home"))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test("마지막이 아닌 href/onClick 없는 항목은 일반 텍스트로 렌더링된다", () => {
    renderBreadcrumbs(
      <Breadcrumbs items={[{ label: "Home" }, { label: "Category" }, { label: "Detail" }]} />,
    )

    expect(screen.queryByRole("link", { name: "Home" })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "Category" })).not.toBeInTheDocument()
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Category")).toBeInTheDocument()
  })

  test("maxItems가 설정되고 items가 초과되면 중간 경로를 생략한다", () => {
    renderBreadcrumbs(
      <Breadcrumbs
        maxItems={3}
        items={[
          { label: "Home", href: "/" },
          { label: "Level1", href: "/1" },
          { label: "Level2", href: "/2" },
          { label: "Detail" },
        ]}
      />,
    )

    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("...")).toBeInTheDocument()
    expect(screen.queryByText("Level1")).not.toBeInTheDocument()
    expect(screen.queryByText("Level2")).not.toBeInTheDocument()
    expect(screen.getByText("Detail")).toBeInTheDocument()
  })

  test("maxItems가 없거나 items 길이 이하이면 생략 없이 모두 표시한다", () => {
    renderBreadcrumbs(
      <Breadcrumbs
        maxItems={5}
        items={[
          { label: "Home", href: "/" },
          { label: "Category", href: "/category" },
          { label: "Detail" },
        ]}
      />,
    )

    expect(screen.queryByText("...")).not.toBeInTheDocument()
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Category")).toBeInTheDocument()
    expect(screen.getByText("Detail")).toBeInTheDocument()
  })

  test("separator를 커스텀 ReactNode로 교체할 수 있다", () => {
    renderBreadcrumbs(
      <Breadcrumbs
        separator={<span data-testid="custom-separator">/</span>}
        items={[
          { label: "Home", href: "/" },
          { label: "Category", href: "/category" },
          { label: "Detail" },
        ]}
      />,
    )

    expect(screen.getAllByTestId("custom-separator")).toHaveLength(2)
  })
})
