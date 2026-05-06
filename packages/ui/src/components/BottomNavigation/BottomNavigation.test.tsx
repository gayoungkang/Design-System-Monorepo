import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"
import { renderWithProviders } from "../../test"
import BottomNavigation from "./BottomNavigation"

const items = [
  { value: "home", label: "Home", icon: <span aria-hidden="true">H</span> },
  { value: "search", label: "Search", icon: <span aria-hidden="true">S</span> },
  { value: "saved", label: "Saved", icon: <span aria-hidden="true">B</span>, disabled: true },
] as const

describe("BottomNavigation", () => {
  test("items를 tab으로 렌더링한다", () => {
    renderWithProviders(<BottomNavigation value="home" items={[...items]} />)

    expect(screen.getByRole("navigation", { name: "Bottom navigation" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Home" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Search" })).toBeInTheDocument()
  })

  test("selected item에 aria-selected와 aria-current를 반영한다", () => {
    renderWithProviders(<BottomNavigation value="search" items={[...items]} />)

    const selected = screen.getByRole("tab", { name: "Search" })

    expect(selected).toHaveAttribute("aria-selected", "true")
    expect(selected).toHaveAttribute("aria-current", "page")
  })

  test("click 시 onChange를 호출한다", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderWithProviders(<BottomNavigation value="home" items={[...items]} onChange={onChange} />)

    await user.click(screen.getByRole("tab", { name: "Search" }))

    expect(onChange).toHaveBeenCalledWith("search")
  })

  test("전체 disabled 상태에서는 클릭할 수 없다", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderWithProviders(
      <BottomNavigation value="home" items={[...items]} onChange={onChange} disabled />,
    )

    await user.click(screen.getByRole("tab", { name: "Search" }))

    expect(onChange).not.toHaveBeenCalled()
  })

  test("item disabled 상태에서는 클릭할 수 없다", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderWithProviders(<BottomNavigation value="home" items={[...items]} onChange={onChange} />)

    await user.click(screen.getByRole("tab", { name: "Saved" }))

    expect(onChange).not.toHaveBeenCalled()
  })

  test("showLabels=false여도 accessible name은 유지한다", () => {
    renderWithProviders(<BottomNavigation value="home" items={[...items]} showLabels={false} />)

    expect(screen.getByRole("tab", { name: "Home" })).toBeInTheDocument()
  })

  test("ArrowRight로 다음 enabled item에 focus를 이동한다", async () => {
    const user = userEvent.setup()

    renderWithProviders(<BottomNavigation value="home" items={[...items]} />)

    const home = screen.getByRole("tab", { name: "Home" })
    home.focus()
    await user.keyboard("{ArrowRight}")

    expect(screen.getByRole("tab", { name: "Search" })).toHaveFocus()
  })
})
