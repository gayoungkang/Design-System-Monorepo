import { createRef } from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import { ThemeProvider } from "styled-components"
import Box from "./Box"
import { theme } from "../../tokens/theme"

const renderBox = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe("Box", () => {
  test("children를 렌더링한다", () => {
    renderBox(<Box>Box Content</Box>)

    expect(screen.getByText("Box Content")).toBeInTheDocument()
  })

  test("기본 태그는 div로 렌더링된다", () => {
    const { container } = renderBox(<Box>Default Element</Box>)

    const element = container.firstElementChild

    expect(element?.tagName).toBe("DIV")
  })

  test("as prop으로 렌더링 태그를 변경할 수 있다", () => {
    const { container } = renderBox(<Box as="section">Section Content</Box>)

    const element = container.firstElementChild

    expect(element?.tagName).toBe("SECTION")
    expect(screen.getByText("Section Content")).toBeInTheDocument()
  })

  test("기본 HTML 속성을 전달한다", () => {
    renderBox(
      <Box id="box-id" role="region" aria-label="box-region" data-testid="box-element">
        Accessible Box
      </Box>,
    )

    const element = screen.getByTestId("box-element")

    expect(element).toHaveAttribute("id", "box-id")
    expect(element).toHaveAttribute("role", "region")
    expect(element).toHaveAttribute("aria-label", "box-region")
  })

  test("BaseMixin 기반 스타일 props가 적용된다", () => {
    renderBox(
      <Box data-testid="styled-box" width="120px" height="40px" p="12px" m="8px">
        Styled Box
      </Box>,
    )

    const element = screen.getByTestId("styled-box")

    expect(element).toHaveStyle({
      width: "120px",
      height: "40px",
      padding: "12px",
      margin: "8px",
    })
  })

  test("sx prop으로 추가 스타일을 적용할 수 있다", () => {
    renderBox(
      <Box
        data-testid="sx-box"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        SX Box
      </Box>,
    )

    const element = screen.getByTestId("sx-box")

    expect(element).toHaveStyle({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    })
  })

  test("ref가 루트 DOM 엘리먼트에 연결된다", () => {
    const ref = createRef<HTMLDivElement>()

    renderBox(<Box ref={ref}>Ref Box</Box>)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current?.textContent).toBe("Ref Box")
  })
})
