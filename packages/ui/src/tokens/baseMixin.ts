/** @public */
import { css } from "styled-components"
import type { CSSObject } from "styled-components"
import { toCssValue } from "../utils/string"

/** @public */
export type SxProps = CSSObject & {
  [K in `&:${string}` | `@${string}`]?: CSSObject
}

/** @public */
export type BaseMixinProps = {
  p?: string | number
  pt?: string | number
  pr?: string | number
  pb?: string | number
  pl?: string | number
  px?: string | number
  py?: string | number
  m?: string | number
  mt?: string | number
  mr?: string | number
  mb?: string | number
  ml?: string | number
  mx?: string | number
  my?: string | number
  sx?: SxProps
  width?: string | number
  height?: string | number
  bgColor?: string | number
}

/** @public */
export const omittedBaseProps = [
  "p",
  "pt",
  "pr",
  "pb",
  "pl",
  "px",
  "py",
  "m",
  "mt",
  "mr",
  "mb",
  "ml",
  "mx",
  "my",
  "sx",
  "width",
  "height",
  "bgColor",
] as const

/** @public */
export type OmittedBaseProp = (typeof omittedBaseProps)[number]

/** @public */
export const shouldBlock = (prop: string): prop is OmittedBaseProp =>
  (omittedBaseProps as readonly string[]).includes(prop)

/** @public */
export function addImportantToSx(styles: SxProps): SxProps {
  const result: SxProps = {}

  for (const key in styles) {
    const value = styles[key]

    if (typeof value === "string") {
      result[key] = value.includes("!important") ? value : `${value} !important`
    } else if (typeof value === "number") {
      result[key] = `${value} !important`
    } else if (typeof value === "object" && value !== null) {
      result[key] = addImportantToSx(value as SxProps)
    } else {
      result[key] = value
    }
  }

  return result
}

/** @public */
export const BaseMixin = (props: BaseMixinProps) => css`
  padding-top: ${toCssValue(props.pt ?? props.py)};
  padding-right: ${toCssValue(props.pr ?? props.px)};
  padding-bottom: ${toCssValue(props.pb ?? props.py)};
  padding-left: ${toCssValue(props.pl ?? props.px)};
  ${props.p &&
  css`
    padding: ${toCssValue(props.p ?? props.p)};
  `};

  margin-top: ${toCssValue(props.mt ?? props.my)};
  margin-right: ${toCssValue(props.mr ?? props.mx)};
  margin-bottom: ${toCssValue(props.mb ?? props.my)};
  margin-left: ${toCssValue(props.ml ?? props.mx)};
  ${props.m &&
  css`
    margin: ${toCssValue(props.m ?? props.m)};
  `};

  width: ${toCssValue(props.width)};
  height: ${toCssValue(props.height)};
  background-color: ${toCssValue(props.bgColor)};
  ${props.sx && css(addImportantToSx(props.sx))}
`
