import { forwardRef } from "react"
import { useTheme } from "styled-components"
import type { DefaultTheme } from "styled-components"
import { BaseMixin } from "../../tokens/baseMixin"
import type { BaseMixinProps } from "../../tokens/baseMixin"
import Icon, { type IconProps } from "../Icon/Icon"
import { styled } from "../../tokens/customStyled"
import { Tooltip, type TooltipProps } from "../Tooltip/Tooltip"
import type { IconName } from "../Icon/icon-types"
import type { VariantUiType } from "../../types/ui"/** @public */
/** @public */


export type IconButtonProps = BaseMixinProps & {
  icon: IconName
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  color?: string
  size?: number | string
  variant?: VariantUiType
  disabled?: boolean
  iconProps?: Partial<Omit<IconProps, "name">>
  disableInteraction?: boolean
  toolTip?: string
  toolTipProps?: TooltipProps
  ariaLabel?: string
}

const getBaseColor = (variant: VariantUiType, theme: DefaultTheme, disabled: boolean) => {
  if (disabled) return theme.colors.text.disabled
  return theme.colors.grayscale[500]
}
/**---------------------------------------------------------------------------/
 *
 * ! IconButton
 *
 * * 아이콘 단일 액션 버튼
 * * 접근성(button native behavior) 유지
 * * hover/active는 CSS 기반 처리
 *
/---------------------------------------------------------------------------**/

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      onClick,
      color,
      disabled = false,
      disableInteraction = false,
      size = 16,
      variant = "contained",
      iconProps,
      toolTip,
      toolTipProps,
      ariaLabel,
      ...others
    },
    ref,
  ) => {
    const theme = useTheme()

    const baseColor = getBaseColor(variant, theme, disabled)
    const finalColor = disabled ? baseColor : (iconProps?.color ?? color ?? baseColor)

    const content = (
      <IconButtonStyle
        ref={ref}
        type="button"
        disabled={disabled}
        $disableInteraction={disableInteraction}
        $variant={variant}
        onClick={onClick}
        aria-label={ariaLabel ?? toolTip ?? undefined}
        p={"4px"}
        {...others}
      >
        <Icon name={icon} size={size} color={finalColor} {...iconProps} />
      </IconButtonStyle>
    )

    return toolTip ? (
      <Tooltip content={toolTip} {...toolTipProps}>
        {content}
      </Tooltip>
    ) : (
      content
    )
  },
)

const variantStyle = (p: { $variant: VariantUiType; theme: DefaultTheme; disabled?: boolean }) => {
  const { $variant, theme, disabled } = p

  switch ($variant) {
    case "outlined":
      return `
        background-color: ${disabled ? theme.colors.background.dark : "transparent"};
        border: 1px solid ${disabled ? theme.colors.background.dark : theme.colors.border.thick};
      `
    case "text":
      return `
        background-color: transparent;
        border: none;
      `
    case "contained":
    default:
      return `
        background-color: ${disabled ? theme.colors.background.dark : theme.colors.grayscale.white};
        border: none;
      `
  }
}/** @public */
/** @public */


export const IconButtonStyle = styled.button<
  BaseMixinProps & {
    $disableInteraction: boolean
    $variant: VariantUiType
    disabled?: boolean
  }
>`
  ${BaseMixin}

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius[4]};
  transition: all 0.2s ease-in-out;

  cursor: ${({ disabled }) => (disabled ? "no-drop" : "pointer")};

  ${({ theme, $disableInteraction, disabled }) =>
    !$disableInteraction &&
    !disabled &&
    `
      &:hover {
        background-color: ${theme.colors.background.default};
      }
      &:active {
        background-color: ${theme.colors.background.dark};
      }
    `}

  ${({ theme, $variant, disabled }) => variantStyle({ $variant, theme, disabled })}
`

IconButton.displayName = "IconButton"

export default IconButton
