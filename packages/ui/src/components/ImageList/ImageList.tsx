/** @public */
import type { HTMLAttributes, ReactNode } from "react"
import { BaseMixin, type BaseMixinProps } from "../../tokens/baseMixin"
import { styled } from "../../tokens/customStyled"

/** Responsive column configuration for ImageList. @public */
export type ImageListCols =
  | number
  | {
      base?: number
      tablet?: number
      desktop?: number
    }

/** Visual layout variant for ImageList. @public */
export type ImageListVariant = "standard" | "masonry"

/** Props for ImageList. @public */
export type ImageListProps = BaseMixinProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof BaseMixinProps> & {
    children?: ReactNode
    cols?: ImageListCols
    gap?: number
    variant?: ImageListVariant
    ariaLabel?: string
  }

const normalizeCols = (cols: ImageListCols | undefined) => {
  if (typeof cols === "number") {
    const safe = Math.max(1, Math.floor(cols))
    return { base: safe, tablet: safe, desktop: safe }
  }

  return {
    base: Math.max(1, Math.floor(cols?.base ?? 1)),
    tablet: Math.max(1, Math.floor(cols?.tablet ?? cols?.base ?? 2)),
    desktop: Math.max(1, Math.floor(cols?.desktop ?? cols?.tablet ?? cols?.base ?? 3)),
  }
}

/** Image layout container for standard grid and masonry compositions. @public */
const ImageList = ({
  children,
  cols = 2,
  gap = 8,
  variant = "standard",
  ariaLabel,
  role = "list",
  ...props
}: ImageListProps) => {
  const normalizedCols = normalizeCols(cols)

  return (
    <Root
      role={role}
      aria-label={ariaLabel}
      $colsBase={normalizedCols.base}
      $colsTablet={normalizedCols.tablet}
      $colsDesktop={normalizedCols.desktop}
      $gap={Math.max(0, gap)}
      $variant={variant}
      {...props}
    >
      {children}
    </Root>
  )
}

const Root = styled.div<
  BaseMixinProps & {
    $colsBase: number
    $colsTablet: number
    $colsDesktop: number
    $gap: number
    $variant: ImageListVariant
  }
>`
  ${BaseMixin};

  width: 100%;
  gap: ${({ $gap }) => `${$gap}px`};

  ${({ $variant, $colsBase, $gap }) =>
    $variant === "masonry"
      ? `
        column-count: ${$colsBase};
        column-gap: ${$gap}px;

        > * {
          margin-bottom: ${$gap}px;
        }
      `
      : `
        display: grid;
        grid-template-columns: repeat(${$colsBase}, minmax(0, 1fr));
      `}

  @media (min-width: 640px) {
    ${({ $variant, $colsTablet }) =>
      $variant === "masonry"
        ? `column-count: ${$colsTablet};`
        : `grid-template-columns: repeat(${$colsTablet}, minmax(0, 1fr));`}
  }

  @media (min-width: 1024px) {
    ${({ $variant, $colsDesktop }) =>
      $variant === "masonry"
        ? `column-count: ${$colsDesktop};`
        : `grid-template-columns: repeat(${$colsDesktop}, minmax(0, 1fr));`}
  }
`

export default ImageList
