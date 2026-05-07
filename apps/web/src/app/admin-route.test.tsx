import { cleanup, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import App from "../App"
import AppProviders from "../AppProviders"
import type { Product } from "../entities/product/model/product.types"

const products: Product[] = [
  {
    id: 1,
    title: "Laptop Pro",
    description: "Portable workstation",
    category: "laptops",
    price: 1299,
    discountPercentage: 8,
    rating: 4.8,
    stock: 30,
    tags: ["laptop"],
    brand: "Acme",
    thumbnail: "https://example.com/laptop.png",
    images: ["https://example.com/laptop.png"],
  },
  {
    id: 2,
    title: "Phone Basic",
    description: "Entry phone",
    category: "smartphones",
    price: 499,
    discountPercentage: 5,
    rating: 3.4,
    stock: 0,
    tags: ["phone"],
    brand: "Acme",
    thumbnail: "https://example.com/phone.png",
    images: ["https://example.com/phone.png"],
  },
  {
    id: 3,
    title: "Kitchen Mixer",
    description: "Countertop mixer",
    category: "kitchen-accessories",
    price: 189,
    discountPercentage: 4,
    rating: 4.5,
    stock: 12,
    tags: ["kitchen"],
    brand: "Home Lab",
    thumbnail: "https://example.com/mixer.png",
    images: ["https://example.com/mixer.png"],
  },
]

const spriteSvg = `
  <svg xmlns="http://www.w3.org/2000/svg">
    <symbol id="icon-SearchLine" viewBox="0 0 24 24"><path d="M1 1h10v10H1z"/></symbol>
    <symbol id="icon-Filter" viewBox="0 0 24 24"><path d="M1 1h10v10H1z"/></symbol>
    <symbol id="icon-ViewColumn" viewBox="0 0 24 24"><path d="M1 1h10v10H1z"/></symbol>
    <symbol id="icon-Download" viewBox="0 0 24 24"><path d="M1 1h10v10H1z"/></symbol>
    <symbol id="icon-CloseLine" viewBox="0 0 24 24"><path d="M1 1h10v10H1z"/></symbol>
    <symbol id="icon-reset" viewBox="0 0 24 24"><path d="M1 1h10v10H1z"/></symbol>
    <symbol id="icon-ArrowDown" viewBox="0 0 24 24"><path d="M1 1h10v10H1z"/></symbol>
    <symbol id="icon-FirstPageArrow" viewBox="0 0 24 24"><path d="M1 1h10v10H1z"/></symbol>
    <symbol id="icon-LastPageArrow" viewBox="0 0 24 24"><path d="M1 1h10v10H1z"/></symbol>
    <symbol id="icon-ArrowLeft" viewBox="0 0 24 24"><path d="M1 1h10v10H1z"/></symbol>
    <symbol id="icon-ArrowRight" viewBox="0 0 24 24"><path d="M1 1h10v10H1z"/></symbol>
    <symbol id="icon-Folder" viewBox="0 0 24 24"><path d="M1 1h10v10H1z"/></symbol>
    <symbol id="icon-BookmarkLine" viewBox="0 0 24 24"><path d="M1 1h10v10H1z"/></symbol>
    <symbol id="icon-BookmarkFill" viewBox="0 0 24 24"><path d="M1 1h10v10H1z"/></symbol>
  </svg>
`

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })

const textResponse = (body: string) =>
  new Response(body, {
    status: 200,
    headers: { "Content-Type": "image/svg+xml" },
  })

const getUrl = (input: RequestInfo | URL) => {
  if (typeof input === "string") return input
  if (input instanceof URL) return input.toString()
  return input.url
}

const mockFetch = () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = getUrl(input)

      if (url.includes("acme-ui-icon-sprite.svg")) return textResponse(spriteSvg)

      if (url.includes("/products/search")) {
        const parsed = new URL(url)
        const keyword = parsed.searchParams.get("q")?.toLowerCase() ?? ""
        const filtered = products.filter((product) =>
          [product.title, product.category, product.brand ?? ""].some((value) =>
            value.toLowerCase().includes(keyword),
          ),
        )
        return jsonResponse({ products: filtered, total: filtered.length, skip: 0, limit: 200 })
      }

      const detailMatch = url.match(/\/products\/(\d+)/)
      if (detailMatch) {
        const product = products.find((item) => item.id === Number(detailMatch[1]))
        return jsonResponse(product ?? products[0])
      }

      if (url.includes("/products")) {
        return jsonResponse({ products, total: products.length, skip: 0, limit: 200 })
      }

      return jsonResponse({})
    }),
  )
}

const renderRoute = (route: string) => {
  window.history.pushState({}, "", route)
  return render(
    <AppProviders>
      <App />
    </AppProviders>,
  )
}

describe("Admin route regression", () => {
  beforeEach(() => {
    mockFetch()
    window.sessionStorage.clear()
    document.body.innerHTML = ""
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it("renders /admin with product table data", async () => {
    renderRoute("/admin")

    expect(await screen.findByRole("heading", { name: "마켓 탐색기" })).toBeInTheDocument()
    expect(await screen.findByText("Laptop Pro")).toBeInTheDocument()
    expect(screen.getByText("Phone Basic")).toBeInTheDocument()
  })

  it("applies URL search query on /admin", async () => {
    renderRoute("/admin?q=phone")

    expect(await screen.findByText("Phone Basic")).toBeInTheDocument()
    expect(screen.queryByText("Laptop Pro")).not.toBeInTheDocument()
  })

  it("applies and resets table toolbar filters", async () => {
    const user = userEvent.setup()
    renderRoute("/admin")

    expect(await screen.findByText("Phone Basic")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "필터" }))
    await user.click(await screen.findByRole("combobox", { name: "섹터" }))
    await user.click(await screen.findByRole("option", { name: "laptops" }))
    await user.click(screen.getAllByRole("button", { name: "검색" }).at(-1)!)

    await waitFor(() => expect(screen.queryByText("Phone Basic")).not.toBeInTheDocument())
    expect(screen.getByText("Laptop Pro")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "초기화" }))

    expect(await screen.findByText("Phone Basic")).toBeInTheDocument()
  })

  it("switches between Table and Infinite views", async () => {
    const user = userEvent.setup()
    renderRoute("/admin")

    expect(await screen.findByText("Laptop Pro")).toBeInTheDocument()

    await user.click(screen.getByRole("tab", { name: "무한 스크롤 테이블 보기" }))
    expect(await screen.findByRole("button", { name: "모든 항목을 표시했습니다" })).toBeInTheDocument()

    await user.click(screen.getByRole("tab", { name: "테이블 보기" }))
    expect(await screen.findByText("1–3 of 3")).toBeInTheDocument()
  })

  it("updates column visibility from the table toolbar", async () => {
    const user = userEvent.setup()
    renderRoute("/admin")

    expect(await screen.findByText("Laptop Pro")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "컬럼 표시" }))
    const columnMenu = await screen.findByText("표시할 컬럼 선택")
    const popper = columnMenu.closest("div")
    expect(popper).not.toBeNull()

    const sectorCheckbox = screen.getByRole("checkbox", { name: "섹터" })
    expect(sectorCheckbox).toBeChecked()

    await user.click(sectorCheckbox)
    expect(sectorCheckbox).not.toBeChecked()
  })

  it("opens/closes preview drawer and navigates to detail", async () => {
    const user = userEvent.setup()
    renderRoute("/admin")

    expect(await screen.findByText("Laptop Pro")).toBeInTheDocument()

    await user.click(screen.getAllByRole("button", { name: "미리보기" })[0])
    const drawerHeading = await screen.findByRole("heading", { name: "Laptop Pro" })
    expect(drawerHeading).toBeInTheDocument()

    await user.click(screen.getAllByRole("button", { name: "닫기" })[0])
    await waitFor(() =>
      expect(screen.queryByRole("heading", { name: "Laptop Pro" })).not.toBeInTheDocument(),
    )

    await user.click(screen.getAllByRole("button", { name: "상세보기" })[0])
    expect(await screen.findByRole("button", { name: "목록으로" })).toBeInTheDocument()
    expect(window.location.pathname).toBe("/admin/1")
  })

  it("redirects legacy /demo products route to /admin", async () => {
    renderRoute("/demo/products?q=phone")

    expect(await screen.findByText("Phone Basic")).toBeInTheDocument()
    expect(window.location.pathname).toBe("/admin")
    expect(window.location.search).toBe("?q=phone")
  })

  it("renders /market as a visual product discovery surface", async () => {
    const user = userEvent.setup()
    renderRoute("/market")

    expect(await screen.findByRole("heading", { name: "Market" })).toBeInTheDocument()
    expect(screen.getByRole("navigation", { name: "Market bottom navigation" })).toBeInTheDocument()
    expect(await screen.findByRole("list", { name: "Market products" })).toBeInTheDocument()

    await user.type(screen.getByRole("searchbox", { name: "Search products" }), "phone")

    expect(await screen.findByRole("listitem", { name: "Open Phone Basic" })).toBeInTheDocument()
    expect(screen.queryByRole("listitem", { name: "Open Laptop Pro" })).not.toBeInTheDocument()
  })

  it("opens market detail from a product card", async () => {
    const user = userEvent.setup()
    renderRoute("/market")

    await user.click(await screen.findByRole("listitem", { name: "Open Laptop Pro" }))

    expect(await screen.findByRole("button", { name: "목록으로" })).toBeInTheDocument()
    expect(window.location.pathname).toBe("/market/1")
  })
})
