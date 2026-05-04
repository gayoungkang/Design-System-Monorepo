import type { ReactNode } from "react"
import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "styled-components"
import { GlobalStyle, theme, IconSpriteProvider } from "@acme/ui"

type Props = { children: ReactNode }

export default function AppProviders({ children }: Props) {
  const spriteUrl = `${import.meta.env.BASE_URL}acme-ui-icon-sprite.svg`
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            retry: 1,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <IconSpriteProvider spriteUrl={spriteUrl} />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
