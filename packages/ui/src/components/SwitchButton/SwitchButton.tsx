import { css } from "styled-components"
import type { DefaultTheme } from "styled-components"
import type { KeyboardEventHandler } from "react"
import type { BaseMixinProps } from "../../tokens/baseMixin"
import { styled } from "../../tokens/customStyled"
import { theme } from "../../tokens/theme"
import Flex from "../Flex/Flex"
import { Typography } from "../Typography/Typography"
import type { TypographyProps } from "../Typography/Typography"
import type { ColorUiType, SizeUiType } from "../../types/ui"
import type { AxisPlacement } from "../../types/placement"/** @public */


export type SwitchButtonProps = BaseMixinProps & {
  checked: boolean
  onChange: (nextChecked: boolean) => void
  disabled?: boolean
  size?: SizeUiType
  color?: ColorUiType | string
  label?: string
  labelPlacment?: AxisPlacement
  labelPlacement?: AxisPlacement
  typographyProps?: Partial<TypographyProps>
}

const sizeMap: Record<
  SizeUiType,
  {
    width: string
    height: string
    knob: { width: string; height: string }
    offset: { checked: string; unchecked: string }
  }
> = {
  S: {
    width: "20px",
    height: "14px",
    knob: { width: "8px", height: "8px" },
    offset: { checked: "9px", unchecked: "2px" },
  },
  M: {
    width: "28px",
    height: "18px",
    knob: { width: "10px", height: "10px" },
    offset: { checked: "14px", unchecked: "2px" },
  },
  L: {
    width: "36px",
    height: "22px",
    knob: { width: "14px", height: "14px" },
    offset: { checked: "17px", unchecked: "4px" },
  },
}

const resolveSwitchColors = (
  color: ColorUiType | string,
  t: DefaultTheme,
  checked: boolean,
  disabled?: boolean,
) => {
  const baseColor =
    color === "primary"
      ? t.colors.primary[400]
      : color === "secondary"
        ? t.colors.secondary[400]
        : color === "normal"
          ? t.colors.text.primary
          : color

  const hoverColor =
    typeof color === "string"
      ? color
      : color === "primary"
        ? t.colors.primary[300]
        : color === "secondary"
          ? t.colors.secondary[300]
          : t.colors.text.secondary

  if (disabled) {
    return { background: t.colors.text.disabled, hover: null, disabled: true }
  }

  if (checked) {
    return { background: baseColor, hover: hoverColor, disabled: false }
  }

  return {
    background: t.colors.grayscale[200],
    hover: hoverColor,
    disabled: false,
  }
}

const renderLabel = (
  label: string,
  placement: AxisPlacement,
  checked: boolean,
  disabled: boolean,
  typographyProps?: Partial<TypographyProps>,
) => (
  <Typography
    text={label}
    variant="b1Medium"
    color={disabled || !checked ? theme.colors.text.disabled : theme.colors.text.primary}
    mr={placement === "left" ? "5px" : 0}
    ml={placement === "right" ? "5px" : 0}
    mb={placement === "top" ? "5px" : 0}
    mt={placement === "bottom" ? "5px" : 0}
    {...typographyProps}
  />
)
/**---------------------------------------------------------------------------/
 *
 * ! SwitchButton
 *
 * * on/off 상태를 토글하는 스위치 UI 컴포넌트로, label과 함께 다양한 배치(top/bottom/left/right)를 지원한다
 * * checked 값을 기반으로 controlled 방식으로 동작하며, 클릭 또는 키보드 입력으로 상태를 전환한다
 * * disabled 상태에서는 모든 인터랙션이 차단되고 스타일이 비활성화된다
 * * ARIA(role="switch", aria-checked)를 적용해 접근성을 보장한다 :contentReference[oaicite:0]{index=0}
 *
 * * 동작 규칙
 *   * 주요 분기 조건 및 처리 우선순위
 *     * checked 값은 외부에서 전달되는 단일 소스이며 내부 상태는 따로 관리하지 않는다
 *     * labelPlacement와 labelPlacment 중 labelPlacement가 우선 적용되고, 없으면 fallback으로 labelPlacment 사용
 *     * labelPlacement가 top/bottom이면 column, left/right면 row 방향으로 Flex 레이아웃을 구성한다
 *   * 이벤트 처리 방식(onClick, onChange, onDoubleClick 등)
 *     * 클릭 시 toggle() → disabled가 아니면 onChange(!checked) 호출
 *     * 키보드 Enter/Space 입력 시 toggle 실행 (preventDefault 처리)
 *     * disabled 상태에서는 클릭 및 키보드 이벤트 모두 무시된다
 *   * disabled 상태에서 차단되는 동작
 *     * disabled=true일 경우 toggle 로직 자체가 실행되지 않으며 cursor는 not-allowed로 변경된다
 *
 * * 레이아웃/스타일 관련 규칙
 *   * SwitchWrapper는 sizeMap 기반으로 width/height가 결정되며 border-radius: 999px로 pill 형태를 유지한다
 *   * 배경 색상은 resolveSwitchColors로 계산되며:
 *     * checked: primary/secondary/normal 또는 custom color 적용
 *     * unchecked: grayscale[200]
 *     * disabled: text.disabled + opacity 감소
 *   * hover 시 hoverColor가 존재하면 background-color가 변경된다
 *   * focus-visible 시 box-shadow로 포커스 링을 표시한다
 *   * Knob은 absolute + translateY(-50%)로 수직 중앙 정렬되며, checked 상태에 따라 left 위치(offset)가 변경된다
 *   * knob 크기와 이동 위치는 sizeMap(S/M/L)에 따라 다르게 계산된다
 *   * label은 Typography로 렌더링되며 placement에 따라 margin이 자동 적용된다
 *
 * * 데이터 처리 규칙
 *   * 입력 props 계약(필수/선택)
 *     * checked와 onChange는 필수이며, disabled/size/color/label/labelPlacement는 선택값이다
 *     * BaseMixinProps를 확장하므로 spacing/sx 등 공통 스타일 props를 함께 전달할 수 있다
 *   * 내부 계산 로직 요약(보정, fallback, formatter 등)
 *     * sizeMap을 통해 스위치 전체 크기, knob 크기, 이동 offset을 계산한다
 *     * resolveSwitchColors로 상태(checked/disabled)에 따른 background/hover 색상을 결정한다
 *     * label 색상은 checked 상태와 disabled 여부에 따라 text.primary 또는 text.disabled로 분기된다
 *   * 서버 제어/클라이언트 제어 여부
 *     * 상태는 외부 checked 값으로만 제어되는 controlled 컴포넌트이며, 내부 상태 저장 없이 이벤트 기반으로 동작한다
 *
 * @module SwitchButton
 * 체크 상태를 토글하는 스위치 UI를 제공하며,
 * 다양한 크기/색상/라벨 배치와 접근성을 지원하는 인터랙티브 컴포넌트
 *
 * @usage
 * <SwitchButton
 *   {...props}
 * />
 *
/---------------------------------------------------------------------------**/
const SwitchButton = ({
  checked,
  onChange,
  disabled = false,
  size = "M",
  color = "primary",
  label,
  labelPlacment,
  labelPlacement,
  typographyProps,
  ...others
}: SwitchButtonProps) => {
  const resolvedLabelPlacement: AxisPlacement = (labelPlacement ??
    labelPlacment ??
    "right") as AxisPlacement
  const verticalPlacement = resolvedLabelPlacement === "top" || resolvedLabelPlacement === "bottom"

  const toggle = () => {
    if (disabled) return
    onChange(!checked)
  }

  const onKeyDown: KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (disabled) return

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      toggle()
    }
  }

  return (
    <Flex align="center" direction={verticalPlacement ? "column" : "row"} {...others}>
      {label &&
        resolvedLabelPlacement === "left" &&
        renderLabel(label, "left", checked, disabled, typographyProps)}
      {label &&
        resolvedLabelPlacement === "top" &&
        renderLabel(label, "top", checked, disabled, typographyProps)}

      <SwitchWrapper
        type="button"
        aria-label={label ?? "switch"}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        $size={size}
        $color={color}
        $checked={checked}
        onClick={toggle}
        onKeyDown={onKeyDown}
      >
        <Knob $size={size} $checked={checked} />
      </SwitchWrapper>

      {label &&
        resolvedLabelPlacement === "right" &&
        renderLabel(label, "right", checked, disabled, typographyProps)}
      {label &&
        resolvedLabelPlacement === "bottom" &&
        renderLabel(label, "bottom", checked, disabled, typographyProps)}
    </Flex>
  )
}

const SwitchWrapper = styled.button<{
  $size: SizeUiType
  $checked: boolean
  $color?: ColorUiType | string
}>`
  ${({ $size }) => {
    const { width, height } = sizeMap[$size]
    return css`
      width: ${width};
      height: ${height};
    `
  }}

  position: relative;
  border-radius: 999px;
  border: 0;
  padding: 0;
  margin: 0;
  outline: none;
  appearance: none;
  background: transparent;
  transition: background-color 0.25s ease;
  display: inline-block;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  ${({ theme: t, $checked, disabled, $color = "primary" }) => {
    const {
      background,
      hover,
      disabled: isDisabled,
    } = resolveSwitchColors($color, t, $checked, disabled)

    if (isDisabled) {
      return `
        background-color: ${background};
        opacity: 0.5;
      `
    }

    return `
      background-color: ${background};
      ${hover ? `&:hover { background-color: ${hover}; }` : ""}
      &:focus-visible {
        box-shadow: 0 0 0 3px ${t.colors.primary[200]};
      }
    `
  }}
`

const Knob = styled.div<{ $size: SizeUiType; $checked: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.grayscale.white};
  transition: left 0.25s ease;

  ${({ $size }) => {
    const { knob } = sizeMap[$size]
    return css`
      width: ${knob.width};
      height: ${knob.height};
    `
  }}

  left: ${({ $size, $checked }) =>
    $checked ? sizeMap[$size].offset.checked : sizeMap[$size].offset.unchecked};
`

SwitchButton.displayName = "SwitchButton"
export default SwitchButton
