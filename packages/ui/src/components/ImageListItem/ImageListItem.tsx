/** @public */
import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from "react"
import { BaseMixin, type BaseMixinProps } from "../../tokens/baseMixin"
import { styled } from "../../tokens/customStyled"

/** Props for ImageListItem. @public */
export type ImageListItemProps = BaseMixinProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof BaseMixinProps | "onClick"> & {
    children?: ReactNode
    cols?: number
    rows?: number
    interactive?: boolean
    rounded?: boolean
    disabled?: boolean
    ariaLabel?: string
    onClick?: (event: MouseEvent<HTMLDivElement>) => void
  }

const isActivationKey = (key: string) => key === "Enter" || key === " "

/** Flexible image/card item wrapper for ImageList. @public */
const ImageListItem = ({
  children,
  cols = 1,
  rows = 1,
  interactive = false,
  rounded = true,
  disabled = false,
  ariaLabel,
  role = "listitem",
  tabIndex,
  onClick,
  onKeyDown,
  ...props
}: ImageListItemProps) => {
  const isInteractive = Boolean(interactive || onClick)
  const safeTabIndex = disabled ? -1 : tabIndex ?? (isInteractive ? 0 : undefined)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (!isInteractive || disabled) return
    if (!isActivationKey(event.key)) return

    event.preventDefault()
    event.currentTarget.click()
  }

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      event.preventDefault()
      return
    }

    onClick?.(event)
  }

  return (
    <Root
      role={role}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      tabIndex={safeTabIndex}
      $cols={Math.max(1, Math.floor(cols))}
      $rows={Math.max(1, Math.floor(rows))}
      $interactive={isInteractive}
      $rounded={rounded}
      $disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </Root>
  )
}

const Root = styled.div<
  BaseMixinProps & {
    $cols: number
    $rows: number
    $interactive: boolean
    $rounded: boolean
    $disabled: boolean
  }
>`
  ${BaseMixin};

  position: relative;
  display: block;
  min-width: 0;
  overflow: hidden;
  break-inside: avoid;
  grid-column: span ${({ $cols }) => $cols};
  grid-row: span ${({ $rows }) => $rows};
  margin-bottom: 0;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme, $rounded }) => ($rounded ? theme.borderRadius[8] : theme.borderRadius[0])};
  background: ${({ theme }) => theme.colors.grayscale.white};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: ${({ $interactive, $disabled }) => ($interactive && !$disabled ? "pointer" : "default")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  img {
    display: block;
    width: 100%;
    height: auto;
  }

  ${({ $interactive }) =>
    $interactive
      ? `
        &:hover {
          box-shadow: 0 0 0 1px currentColor inset;
        }

        &:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }
      `
      : ""}
`

export default ImageListItem
