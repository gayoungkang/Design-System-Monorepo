import type { ReactElement, PropsWithChildren } from "react"
import { render } from "@testing-library/react"
import { ThemeProvider } from "styled-components"
import { theme } from "../tokens/theme"

const TestProviders = ({ children }: PropsWithChildren) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export const renderWithProviders = (ui: ReactElement) => {
  return render(ui, {
    wrapper: TestProviders,
  })
}
