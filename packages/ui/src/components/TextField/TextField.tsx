/** @public */
import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react"
import type {
  ChangeEvent,
  FocusEvent,
  FocusEventHandler,
  HTMLInputTypeAttribute,
  KeyboardEvent,
  MouseEvent,
  Ref,
} from "react"
import type { BaseMixinProps } from "../../tokens/baseMixin"
import Flex from "../Flex/Flex"
import Label from "../Label/Label"
import type { LabelProps } from "../Label/Label"
import Box from "../Box/Box"
import Icon from "../Icon/Icon"
import type { IconProps } from "../Icon/Icon"
import IconButton from "../IconButton/IconButton"
import HelperText from "../HelperText/HelperText"
import { styled } from "../../tokens/customStyled"
import { theme } from "../../tokens/theme"
import { css } from "styled-components"
import type { VariantFormType } from "../../types/form"
import type { SizeUiType } from "../../types/ui"
import type { IconName } from "../Icon/icon-types"
import type { AxisPlacement } from "../../types/placement" /** @public */
/** @public */

export type TextFieldProps = BaseMixinProps & {
  variant?: VariantFormType
  size?: SizeUiType
  type?: HTMLInputTypeAttribute
  name?: string
  label?: string
  placeholder?: string
  value?: string
  onlyNumber?: boolean
  maxLength?: number
  onClear?: () => void
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onFocus?: () => void
  onSearch?: (value: string, isEnter?: boolean) => void
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
  onMouseDown?: (event: MouseEvent<HTMLDivElement>) => void
  onMouseUp?: (event: MouseEvent<HTMLDivElement>) => void
  disabled?: boolean
  error?: boolean
  helperText?: string
  startIcon?: IconName
  endIcon?: IconName
  required?: boolean
  readOnly?: boolean
  labelPlacement?: AxisPlacement
  labelProps?: Partial<Omit<LabelProps, "text">>
  iconProps?: Partial<Omit<IconProps, "name">>
  multiline?: boolean
  rows?: number
  clearable?: boolean
  autoFocus?: boolean
  onSearchEnter?: (value: string, isEnter: boolean) => void
}

type InputWrapperStyleProps = {
  $variant?: VariantFormType
  $size?: SizeUiType
  $isActive?: boolean
  $error?: boolean
  $disabled?: boolean
  $readOnly?: boolean
  $multiline?: boolean
}

type InputStyleProps = {
  $multiline?: boolean
  $labelPlacement?: AxisPlacement
  $readOnly?: boolean
}
/**---------------------------------------------------------------------------/
 *
 * ! TextField
 *
 * * 텍스트 입력을 처리하는 범용 입력 컴포넌트로, single-line(input)과 multiline(textarea)을 모두 지원한다
 * * 내부 상태(inputValue)를 기반으로 동작하며, value prop 변경 시 동기화되는 반제어 형태로 동작한다
 * * 검색(search), 비밀번호 토글, 숫자 제한, clear 기능 등 다양한 입력 보조 기능을 제공한다
 * * disabled/readOnly 상태에서는 입력 및 인터랙션을 제한하고 UI를 비활성화한다 :contentReference[oaicite:0]{index=0}
 *
 * * 동작 규칙
 *   * 주요 분기 조건 및 처리 우선순위
 *     * multiline=true이면 textarea, 아니면 input을 렌더링한다
 *     * type이 "password"이고 isPasswordVisible=true이면 input type을 "text"로 변경한다
 *     * inputValue는 내부 state로 관리되며, value prop 변경 시 useEffect로 동기화된다
 *     * onlyNumber=true이면 입력값에서 숫자 외 문자를 제거한다
 *     * maxLength가 설정되면 입력값 길이를 제한한다
 *   * 이벤트 처리 방식(onClick, onChange, onDoubleClick 등)
 *     * onChange: normalizeValue 적용 후 내부 state 갱신 + 외부 onChange 호출
 *     * onFocus/onBlur: isActive 상태 토글 + 외부 콜백 호출
 *     * onKeyDown:
 *       * type="search" && Enter → onSearch / onSearchEnter 호출
 *       * 그 외 onKeyDown 전달
 *     * clear 버튼 클릭 시 inputValue 초기화 + onClear 호출 + 포커스 유지
 *     * search 아이콘 클릭 시 onSearch 호출
 *     * password 아이콘 클릭 시 isPasswordVisible 토글
 *   * disabled 상태에서 차단되는 동작
 *     * disabled/readOnly 상태에서는 입력, 버튼 클릭, 키보드 이벤트가 제한되고 cursor가 not-allowed/no-drop으로 변경된다
 *
 * * 레이아웃/스타일 관련 규칙
 *   * 전체 구조는 Box → Flex → InputWrapper → Input/Icons 구조로 구성된다
 *   * InputWrapper는 variant(outlined/filled/standard)에 따라 border/background 스타일이 분기된다
 *   * focus(isActive) 상태에서는 info 색상으로 border 강조, error 상태에서는 error 색상으로 override된다
 *   * multiline일 경우 align-items: flex-start로 변경되어 textarea 상단 정렬을 유지한다
 *   * startIcon/endIcon/clear/search/password 아이콘은 내부 Flex 흐름에 따라 좌우에 배치된다
 *   * clear 버튼은 조건(inputValue 존재 && not multiline && clearable && not readOnly && isActive)에서만 노출된다
 *   * placeholder와 텍스트는 Typography 토큰 기반 색상/폰트 규칙을 따른다
 *
 * * 데이터 처리 규칙
 *   * 입력 props 계약(필수/선택)
 *     * value, onChange, placeholder, label, type, onlyNumber, maxLength 등은 모두 선택값이다
 *     * multiline=true일 경우 rows로 높이를 제어한다
 *     * BaseMixinProps를 확장하므로 spacing/sx 등 공통 스타일 props를 함께 전달할 수 있다
 *   * 내부 계산 로직 요약(보정, fallback, formatter 등)
 *     * normalizeValue:
 *       * onlyNumber=true → 숫자만 허용
 *       * maxLength 설정 시 길이 제한 적용
 *     * inputValue는 항상 문자열로 유지되며, 초기값은 value 또는 ""이다
 *     * autoFocus=true && not disabled/readOnly일 때 requestAnimationFrame으로 focus를 지연 적용한다
 *   * 서버 제어/클라이언트 제어 여부
 *     * 완전 controlled가 아닌 내부 상태 기반 컴포넌트이며, value prop은 동기화 용도로만 사용된다
 *     * 서버 통신 로직은 없고 입력 이벤트 기반으로 동작하는 클라이언트 컴포넌트이다
 *
 * @module TextField
 * 다양한 입력 시나리오를 지원하는 텍스트 입력 컴포넌트로,
 * 상태 제어, 포맷 제한, 아이콘 액션, 검색 기능을 통합 제공한다
 *
 * @usage
 * <TextField
 *   {...props}
 * />
 *
/---------------------------------------------------------------------------**/
const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  (
    {
      variant = "outlined",
      size = "M",
      name,
      type = "text",
      label,
      placeholder,
      value,
      onlyNumber = false,
      maxLength,
      onChange,
      onBlur,
      onFocus,
      onSearch,
      onKeyDown,
      onKeyUp,
      onClick,
      onMouseDown,
      onMouseUp,
      disabled = false,
      helperText,
      startIcon,
      endIcon,
      required,
      readOnly = false,
      labelProps,
      iconProps,
      error,
      onClear,
      multiline = false,
      rows = 20,
      clearable = true,
      labelPlacement = "top",
      autoFocus,
      onSearchEnter,
      ...others
    },
    ref: Ref<HTMLInputElement | HTMLTextAreaElement | null>,
  ) => {
    const [inputValue, setInputValue] = useState(value ?? "")
    const [isActive, setIsActive] = useState(false)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const generatedId = useId()
    const helperTextId = `${generatedId}-helper`

    const inputRef = useRef<HTMLInputElement | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    const getIconSize = (s: SizeUiType): string => {
      switch (s) {
        case "S":
          return "14px"
        case "M":
          return "16px"
        case "L":
          return "18px"
        default:
          return "16px"
      }
    }

    useImperativeHandle(ref, () => {
      const element = multiline ? textareaRef.current : inputRef.current
      return element as HTMLInputElement | HTMLTextAreaElement | null
    }, [multiline])

    const inputType = type === "password" && isPasswordVisible ? "text" : type

    useEffect(() => {
      setInputValue(value ?? "")
    }, [value])

    useEffect(() => {
      if (!autoFocus || disabled || readOnly) return
      const el = multiline ? textareaRef.current : inputRef.current
      if (!el) return

      const id = requestAnimationFrame(() => el.focus())
      return () => cancelAnimationFrame(id)
    }, [autoFocus, disabled, readOnly, multiline])

    const normalizeValue = (raw: string) => {
      let nextValue = raw

      if (onlyNumber) nextValue = nextValue.replace(/[^0-9]/g, "")

      if (typeof maxLength === "number" && maxLength >= 0 && nextValue.length > maxLength) {
        nextValue = nextValue.slice(0, maxLength)
      }

      return nextValue
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValue = normalizeValue(e.target.value)
      if (e.target.value !== nextValue) e.target.value = nextValue
      setInputValue(nextValue)
      onChange?.(e)
    }

    const handleClear = () => {
      setInputValue("")
      onClear?.()
      const el = multiline ? textareaRef.current : inputRef.current
      el?.focus()
    }

    const fireSearch = (isEnter: boolean) => {
      const trimmed = inputValue.trim()
      onSearch?.(trimmed, isEnter)
      if (isEnter) onSearchEnter?.(trimmed, true)
    }

    const handleSearchClick = () => {
      fireSearch(false)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (type === "search" && e.key === "Enter") {
        e.preventDefault()
        fireSearch(true)
      }

      onKeyDown?.(e)
    }

    const handleFocus = () => {
      setIsActive(true)
      onFocus?.()
    }

    const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsActive(false)
      onBlur?.(event)
    }

    const renderTopBottomLabel = (position: "top" | "bottom") => {
      if (!label) return null
      if (position === "top" && labelPlacement !== "top") return null
      if (position === "bottom" && labelPlacement !== "bottom") return null

      return (
        <Flex align="flex-start">
          <Label
            text={label}
            required={required}
            mb={position === "top" ? 4 : 0}
            mt={position === "bottom" ? 4 : 0}
            {...labelProps}
          />
        </Flex>
      )
    }

    const iconSize = getIconSize(size)

    return (
      <Box width="100%" sx={{ position: "relative", backgroundColor: "transparent" }} {...others}>
        {renderTopBottomLabel("top")}

        <Flex width="100%" height="fit-content" align="center" justify="space-between">
          {label && labelPlacement === "left" && (
            <Label text={label} required={required} mr={4} {...labelProps} />
          )}

          <InputWrapper
            $variant={variant}
            $error={!!error}
            $disabled={disabled}
            $isActive={isActive}
            $readOnly={readOnly}
            $multiline={multiline}
            $size={size}
            onClick={onClick}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
          >
            {startIcon && <Icon size={iconSize} name={startIcon} ml={8} {...iconProps} />}

            {multiline ? (
              <StyledTextarea
                ref={textareaRef}
                $multiline
                $labelPlacement={labelPlacement}
                $readOnly={readOnly}
                placeholder={placeholder}
                value={inputValue}
                aria-label={label}
                aria-invalid={error || undefined}
                aria-describedby={error && helperText ? helperTextId : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                onKeyUp={onKeyUp}
                disabled={disabled}
                readOnly={readOnly}
                name={name}
                rows={rows}
              />
            ) : (
              <StyledInput
                ref={inputRef}
                $labelPlacement={labelPlacement}
                $readOnly={readOnly}
                type={inputType}
                placeholder={placeholder}
                value={inputValue}
                aria-label={label}
                aria-invalid={error || undefined}
                aria-describedby={error && helperText ? helperTextId : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                onKeyUp={onKeyUp}
                disabled={disabled}
                readOnly={readOnly}
                name={name}
              />
            )}

            {inputValue !== "" && !multiline && clearable && !readOnly && isActive && (
              <IconButton
                onClick={handleClear}
                icon="CloseLine"
                size={iconSize}
                disabled={disabled}
                iconProps={{ color: theme.colors.grayscale[300] }}
                mr={8}
                sx={{ padding: 0, backgroundColor: "transparent" }}
              />
            )}

            {type === "search" && !multiline && (
              <IconButton
                onClick={handleSearchClick}
                icon="SearchLine"
                size={iconSize}
                mr={8}
                iconProps={{ color: theme.colors.grayscale[300] }}
                disabled={readOnly || disabled}
                sx={{ padding: 0, backgroundColor: "transparent" }}
              />
            )}

            {endIcon && <Icon size={iconSize} name={endIcon} mr={8} {...iconProps} />}

            {type === "password" && !multiline && (
              <IconButton
                onClick={() => setIsPasswordVisible((p) => !p)}
                icon={isPasswordVisible ? "Eye" : "EyeOff"}
                size={iconSize}
                mr={8}
                disabled={readOnly || disabled}
                iconProps={{ color: theme.colors.grayscale[300] }}
                sx={{ padding: 0, backgroundColor: "transparent" }}
              />
            )}
          </InputWrapper>

          {label && labelPlacement === "right" && (
            <Label text={label} required={required} ml={4} {...labelProps} />
          )}
        </Flex>

        {renderTopBottomLabel("bottom")}

        {error && (
          <Box id={helperTextId}>
            <HelperText status="error" text={helperText ?? ""} mt={3} />
          </Box>
        )}
      </Box>
    )
  },
)

TextField.displayName = "TextField"

const InputWrapper = styled.div<InputWrapperStyleProps>`
  display: flex;
  align-items: ${({ $multiline }) => ($multiline ? "flex-start" : "center")};
  width: 100%;
  height: auto;
  min-height: ${({ $size }) => ($size === "L" ? "32px" : $size === "M" ? "28px" : "24px")};

  border-radius: ${({ theme, $variant }) => ($variant === "outlined" ? theme.borderRadius[4] : 0)};
  transition: all 0.2s ease-in-out;

  background-color: ${({ theme, $variant }) => {
    switch ($variant) {
      case "filled":
        return theme.colors.background.default
      case "standard":
        return "transparent"
      default:
        return theme.colors.grayscale.white
    }
  }};

  border: ${({ $variant }) =>
    $variant === "outlined" ? `1px solid ${theme.colors.border.default}` : "0"};

  border-bottom: ${({ $variant }) =>
    $variant === "standard"
      ? `1px solid ${theme.colors.border.default}`
      : `1px solid ${theme.colors.border.default}`};

  ${({ $isActive, $variant, $disabled, $readOnly }) =>
    $isActive &&
    !$disabled &&
    !$readOnly &&
    ($variant === "standard"
      ? `
        border-bottom: 1px solid ${theme.colors.info[300]};
      `
      : `
        border-color: ${theme.colors.info[300]};
      `)}

  ${({ $error, $variant }) =>
    $error &&
    `
      ${
        $variant === "standard"
          ? `border-bottom: 1px solid ${theme.colors.error[300]};`
          : `border-color: ${theme.colors.error[300]};`
      }
    `}

  ${({ $disabled, $readOnly, $variant }) =>
    ($disabled || $readOnly) &&
    ($variant === "outlined" || $variant === "filled") &&
    `
      border-color: ${theme.colors.grayscale[200]};
      background-color: ${theme.colors.background.default};
      cursor: not-allowed;
    `}
`

const commonInputStyle = css<InputStyleProps>`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: ${theme.colors.text.secondary};
  width: 100%;
  font-size: 12px;
  padding: 4px 8px;
  text-align: left;

  &::placeholder {
    font-size: 12px;
    color: ${theme.colors.text.disabled};
  }

  &:disabled {
    color: ${theme.colors.text.disabled};
    cursor: not-allowed;
  }

  ${({ $readOnly }) =>
    $readOnly &&
    `
      cursor: no-drop;
    `}
`

const StyledInput = styled.input<InputStyleProps>`
  ${commonInputStyle};
`

const StyledTextarea = styled.textarea<InputStyleProps>`
  ${commonInputStyle};
  resize: none;
  font-family: inherit;
` /** @public */
/** @public */

export default TextField
