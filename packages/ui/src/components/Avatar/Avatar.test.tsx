import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, test } from "vitest"
import { ThemeProvider } from "styled-components"
import Avatar from "./Avatar"
import { theme } from "../../tokens/theme"

const renderAvatar = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe("Avatar", () => {
  beforeEach(() => {
    // * jsdom 이미지 로드 상태 초기화를 위해 body 정리
    document.body.innerHTML = ""
  })

  test("src가 없으면 name 기반 이니셜을 렌더링한다", () => {
    renderAvatar(<Avatar name="Jane Doe" />)

    expect(screen.getByText("JD")).toBeInTheDocument()
  })

  test("name이 한 단어면 첫 글자만 렌더링한다", () => {
    renderAvatar(<Avatar name="jane" />)

    expect(screen.getByText("J")).toBeInTheDocument()
  })

  test("name이 비어 있으면 fallback 문자 '?'를 렌더링한다", () => {
    renderAvatar(<Avatar name="   " />)

    expect(screen.getByText("?")).toBeInTheDocument()
  })

  test("src가 있으면 이미지 아바타를 렌더링하고 alt를 적용한다", () => {
    renderAvatar(<Avatar src="/profile.png" alt="profile avatar" name="Jane Doe" />)

    const image = screen.getByRole("img", { name: "profile avatar" })

    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", "/profile.png")
  })

  test("이미지 로드 실패 시 이니셜 fallback으로 전환된다", () => {
    renderAvatar(<Avatar src="/broken.png" name="Jane Doe" />)

    const image = screen.getByRole("img", { name: "Jane Doe" })
    image.dispatchEvent(new Event("error"))

    expect(screen.getByText("JD")).toBeInTheDocument()
    expect(screen.queryByRole("img", { name: "Jane Doe" })).not.toBeInTheDocument()
  })

  test("src가 변경되면 에러 상태가 리셋되어 새 이미지를 다시 렌더링한다", () => {
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <Avatar src="/broken.png" name="Jane Doe" />
      </ThemeProvider>,
    )

    const brokenImage = screen.getByRole("img", { name: "Jane Doe" })
    brokenImage.dispatchEvent(new Event("error"))

    expect(screen.getByText("JD")).toBeInTheDocument()

    rerender(
      <ThemeProvider theme={theme}>
        <Avatar src="/next.png" name="Jane Doe" />
      </ThemeProvider>,
    )

    const nextImage = screen.getByRole("img", { name: "Jane Doe" })
    expect(nextImage).toBeInTheDocument()
    expect(nextImage).toHaveAttribute("src", "/next.png")
  })

  test("size prop에 따라 wrapper 크기가 적용된다", () => {
    const { container } = renderAvatar(<Avatar name="Jane Doe" size="L" />)

    const wrapper = container.firstChild as HTMLElement

    expect(wrapper).toHaveStyle({ width: "40px", height: "40px" })
  })

  test("bgColor와 fgColor 커스텀 값이 적용된다", () => {
    renderAvatar(<Avatar name="Jane Doe" bgColor="rgb(1, 2, 3)" fgColor="rgb(255, 0, 0)" />)

    const initials = screen.getByText("JD")
    const wrapper = initials.parentElement as HTMLElement

    expect(wrapper).toHaveStyle({ backgroundColor: "rgb(1, 2, 3)" })
    expect(initials).toHaveStyle({ color: "rgb(255, 0, 0)" })
  })
})
