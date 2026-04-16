import "styled-components"
import type {
  ColorsType,
  ZindexType,
  FontsType,
  ShadowsType,
  BorderRadiusType,
} from "./tokens/theme"

declare module "styled-components" {
  export interface DefaultTheme {
    zIndex: ZindexType
    colors: ColorsType
    fonts: FontsType
    shadows: ShadowsType
    borderRadius: BorderRadiusType
  }
}
