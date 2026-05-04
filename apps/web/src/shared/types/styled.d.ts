import "styled-components"
import type { RuleSet } from "styled-components"

type Scale<TKeys extends string | number> = Record<TKeys, string>
type FontToken = RuleSet<object>

declare module "styled-components" {
  export interface DefaultTheme {
    zIndex: {
      base: number
      content: number
      dropdown: number
      sticky: number
      modal: number
      popover: number
      toast: number
      tooltip: number
      loading: number
    }
    colors: {
      grayscale: Scale<"900" | "800" | "700" | "600" | "500" | "400" | "300" | "200" | "100" | "50"> & {
        white: string
      }
      text: Record<"primary" | "secondary" | "tertiary" | "disabled", string>
      background: Record<"dark" | "default", string>
      border: Record<"thick" | "default", string>
      dim: Record<"default", string>
      primary: Scale<"400" | "300" | "200" | "100" | "50">
      secondary: Scale<"400" | "300" | "200" | "100" | "50">
      error: Scale<"500" | "300" | "100" | "50">
      info: Scale<"500" | "300" | "100" | "50">
      success: Scale<"500" | "300" | "100" | "50">
      warning: Scale<"500" | "300" | "100" | "50">
      darkblue: Scale<"800" | "700" | "100" | "50">
    }
    fonts: {
      heading: Record<"h1" | "h2" | "h3", FontToken>
      body: {
        b1: Record<"Bold" | "Medium" | "Regular", FontToken>
        b2: Record<"Medium" | "Regular", FontToken>
        b3: Record<"Medium" | "Regular", FontToken>
      }
    }
    shadows: {
      elevation: string[]
    }
    borderRadius: Scale<0 | 1 | 4 | 6 | 8 | 16 | 18 | 50>
  }
}
