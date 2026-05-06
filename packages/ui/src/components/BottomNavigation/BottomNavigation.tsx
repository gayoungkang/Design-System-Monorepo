/** @public */
import type { KeyboardEvent, ReactNode } from "react"
import { createRef, useMemo } from "react"
import { BaseMixin, type BaseMixinProps } from "../../tokens/baseMixin"
import { styled } from "../../tokens/customStyled"
import { Typography } from "../Typography/Typography"

/** Value accepted by BottomNavigation items. @public */
export type BottomNavigationValue = string | number

/** Item model for BottomNavigation. @public */
export type BottomNavigationItem<TValue extends BottomNavigationValue = BottomNavigationValue> = {
  value: TValue
  label: string
  icon?: ReactNode
  activeIcon?: ReactNode
  disabled?: boolean
}

/** Props for BottomNavigation. @public */
export type BottomNavigationProps<
  TValue extends BottomNavigationValue = BottomNavigationValue,
> = BaseMixinProps & {
  value: TValue
  items: BottomNavigationItem<TValue>[]
  onChange?: (value: TValue) => void
  showLabels?: boolean
  disabled?: boolean
  fixed?: boolean
  ariaLabel?: string
}

const getNextEnabledIndex = <TValue extends BottomNavigationValue>(
  items: BottomNavigationItem<TValue>[],
  startIndex: number,
  direction: 1 | -1,
  disabled?: boolean,
) => {
  if (disabled || items.length === 0) return -1

  for (let offset = 1; offset <= items.length; offset += 1) {
    const index = (startIndex + offset * direction + items.length) % items.length
    if (!items[index]?.disabled) return index
  }

  return -1
}

/** Mobile-first bottom navigation with controlled item selection. @public */
const BottomNavigation = <TValue extends BottomNavigationValue = BottomNavigationValue>({
  value,
  items,
  onChange,
  showLabels = true,
  disabled = false,
  fixed = false,
  ariaLabel = "Bottom navigation",
  ...props
}: BottomNavigationProps<TValue>) => {
  const itemRefs = useMemo(
    () => items.map(() => createRef<HTMLButtonElement>()),
    [items],
  )

  const selectedIndex = items.findIndex((item) => item.value === value)

  const focusItem = (index: number) => {
    itemRefs[index]?.current?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      const nextIndex = getNextEnabledIndex(items, index, 1, disabled)
      if (nextIndex >= 0) {
        event.preventDefault()
        focusItem(nextIndex)
      }
      return
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      const nextIndex = getNextEnabledIndex(items, index, -1, disabled)
      if (nextIndex >= 0) {
        event.preventDefault()
        focusItem(nextIndex)
      }
      return
    }

    if (event.key === "Home") {
      const firstIndex = items.findIndex((item) => !item.disabled)
      if (firstIndex >= 0) {
        event.preventDefault()
        focusItem(firstIndex)
      }
      return
    }

    if (event.key === "End") {
      const lastIndex = [...items].reverse().findIndex((item) => !item.disabled)
      if (lastIndex >= 0) {
        event.preventDefault()
        focusItem(items.length - 1 - lastIndex)
      }
    }
  }

  return (
    <Root aria-label={ariaLabel} $fixed={fixed} {...props}>
      <TabList role="tablist" aria-orientation="horizontal">
        {items.map((item, index) => {
          const selected = item.value === value
          const itemDisabled = disabled || Boolean(item.disabled)

          return (
            <NavButton
              key={String(item.value)}
              ref={itemRefs[index]}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-current={selected ? "page" : undefined}
              aria-label={item.label}
              disabled={itemDisabled}
              $selected={selected}
              $showLabels={showLabels}
              tabIndex={itemDisabled ? -1 : selected || (selectedIndex < 0 && index === 0) ? 0 : -1}
              onClick={() => {
                if (itemDisabled) return
                onChange?.(item.value)
              }}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {selected && item.activeIcon ? item.activeIcon : item.icon}
              <Label $visible={showLabels}>
                <Typography variant="b3Medium" text={item.label} />
              </Label>
            </NavButton>
          )
        })}
      </TabList>
    </Root>
  )
}

const Root = styled.nav<
  BaseMixinProps & {
    $fixed: boolean
  }
>`
  ${BaseMixin};

  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme, $fixed }) => ($fixed ? `${theme.borderRadius[8]} ${theme.borderRadius[8]} 0 0` : theme.borderRadius[8])};
  background: ${({ theme }) => theme.colors.grayscale.white};
  box-shadow: ${({ theme, $fixed }) => ($fixed ? theme.shadows.elevation[4] : theme.shadows.elevation[0])};

  ${({ $fixed, theme }) =>
    $fixed
      ? `
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: ${theme.zIndex.sticky};
      `
      : ""}
`

const TabList = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  min-height: 64px;
`

const NavButton = styled.button<{
  $selected: boolean
  $showLabels: boolean
}>`
  appearance: none;
  display: inline-flex;
  min-width: 0;
  min-height: 56px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ $showLabels }) => ($showLabels ? "4px" : "0")};
  padding: ${({ $showLabels }) => ($showLabels ? "8px 10px" : "10px")};
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius[6]};
  background: transparent;
  color: ${({ theme, $selected }) => ($selected ? theme.colors.primary[400] : theme.colors.text.tertiary)};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[400]};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[200]};
    outline-offset: -2px;
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }
`

const Label = styled.span<{ $visible: boolean }>`
  ${({ $visible }) =>
    $visible
      ? `
        display: inline-flex;
      `
      : `
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      `}
`

export default BottomNavigation
