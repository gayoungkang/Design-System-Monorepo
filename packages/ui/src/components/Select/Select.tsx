/** @public */
import { useId, useMemo, useRef, useState } from "react"
import type { FocusEventHandler, KeyboardEvent, ReactNode } from "react"
import type { BaseMixinProps } from "../../tokens/baseMixin"
import Label from "../Label/Label"
import type { LabelProps } from "../Label/Label"
import { Typography } from "../Typography/Typography"
import type { TypographyProps } from "../Typography/Typography"
import Chip from "../Chip/Chip"
import { theme } from "../../tokens/theme"
import Menu from "../Menu/Menu"
import Popper from "../Popper/Popper"
import type { PopperProps } from "../Popper/Popper"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import Progress from "../Progress/Progress"
import IconButton from "../IconButton/IconButton"
import HelperText from "../HelperText/HelperText"
import { styled } from "../../tokens/customStyled"
import type { VariantFormType } from "../../types/form"
import type { SizeUiType } from "../../types/ui"
import type { AxisPlacement } from "../../types/placement"/** @public */
/** @public */


export type SelectOptionType<
  TValue extends string | number = string | number,
  TPayload extends Record<string, unknown> = Record<string, unknown>,
> = {
  value: TValue
  label: string
  chipColor?: string
  onClick?: () => void
  children?: ReactNode
  payload?: TPayload
  isAllOption?: boolean
}

type SingleValue<TValue extends string | number> = TValue | undefined
type MultipleValue<TValue extends string | number> = TValue[]

type SelectCommonProps<TValue extends string | number> = BaseMixinProps & {
  variant?: VariantFormType
  multipleType?: "default" | "chip" | "multiple"
  label?: string
  options: SelectOptionType<TValue>[]
  onBlur?: FocusEventHandler<HTMLDivElement>
  onFocus?: () => void
  error?: boolean
  helperText?: string
  disabled?: boolean
  placeholder?: string
  size?: SizeUiType
  color?: string
  required?: boolean
  readOnly?: boolean
  autoFocus?: boolean
  isLoading?: boolean
  labelProps?: Partial<Omit<LabelProps, "text">>
  typographyProps?: Partial<TypographyProps>
  labelPlacement?: AxisPlacement
  popperProps?: Omit<
    Partial<PopperProps>,
    "anchorRef" | "open" | "children" | "placement" | "width" | "onClose"
  >
}/** @public */
/** @public */


export type SingleSelectProps<TValue extends string | number> = SelectCommonProps<TValue> & {
  multiple?: false
  value?: SingleValue<TValue>
  defaultValue?: SingleValue<TValue>
  onChange?: (value: SingleValue<TValue>) => void
}/** @public */
/** @public */


export type MultipleSelectProps<TValue extends string | number> = SelectCommonProps<TValue> & {
  multiple: true
  value?: MultipleValue<TValue>
  defaultValue?: MultipleValue<TValue>
  onChange?: (value: MultipleValue<TValue>) => void
}/** @public */
/** @public */


export type SelectProps<TValue extends string | number = string> =
  | SingleSelectProps<TValue>
  | MultipleSelectProps<TValue>

type SelectWrapperStyleProps = {
  variant?: VariantFormType
  open?: boolean
  disabled?: boolean
  error?: boolean
  size?: SizeUiType
  color?: string
  readOnly?: boolean
  loading?: boolean
  isActive?: boolean
}

type ThemeShape = typeof theme
type NormalizedAxis = "top" | "bottom" | "left" | "right"
type AlignCss = "flex-start" | "center" | "flex-end"

const getSizePx = (size: SizeUiType): string => {
  switch (size) {
    case "S":
      return "10px"
    case "L":
      return "12px"
    default:
      return "11px"
  }
}

const getMinHeight = (size: SizeUiType): string => {
  switch (size) {
    case "L":
      return "32px"
    case "S":
      return "24px"
    default:
      return "28px"
  }
}

const getDisabledStyle = (variant: VariantFormType, t: ThemeShape) => {
  switch (variant) {
    case "outlined":
      return `
        border-color: ${t.colors.grayscale[200]};
        background-color: ${t.colors.grayscale[100]};
        color: ${t.colors.text.disabled};
      `
    case "filled":
      return `
        border-color: transparent;
        background-color: ${t.colors.grayscale[100]};
        color: ${t.colors.text.disabled};
      `
    case "standard":
      return `
        border-bottom-color: ${t.colors.grayscale[200]};
        background-color: transparent;
        color: ${t.colors.text.disabled};
      `
    default:
      return ""
  }
}

const normalizeAxisPlacement = (placement?: AxisPlacement): NormalizedAxis => {
  if (!placement) return "top"
  if (placement.startsWith("top")) return "top"
  if (placement.startsWith("bottom")) return "bottom"
  if (placement.startsWith("left")) return "left"
  if (placement.startsWith("right")) return "right"
  return "top"
}

const getPlacementAlign = (placement?: AxisPlacement): AlignCss => {
  if (!placement) return "flex-start"
  if (placement.endsWith("start")) return "flex-start"
  if (placement.endsWith("end")) return "flex-end"
  return "flex-start"
}
/**---------------------------------------------------------------------------/
 *
 * ! Select
 *
 * * 접근성(ARIA)과 키보드 네비게이션을 강화한 Popper 기반 Select 컴포넌트
 * * single/multiple 선택을 명시적 타입으로 분리하고, value 존재 여부에 따라 controlled/uncontrolled로 동작한다
 * * open 상태와 activeIndex를 통해 드롭다운 및 키보드 포커스 이동을 관리한다
 * * disabled/readOnly/isLoading 상태에서는 모든 상호작용을 차단한다 :contentReference[oaicite:0]{index=0}
 *
 * * 동작 규칙
 *   * 주요 분기 조건 및 처리 우선순위
 *     * isControlled = value !== undefined
 *     * currentValue는 controlled면 value, 아니면 internalValue를 사용한다
 *     * multiple 여부는 props.multiple로 명시적으로 결정된다
 *     * normalizedValue는 항상 배열 형태로 정규화되어 내부 로직의 기준이 된다
 *     * selectedValueKeys는 value를 string key로 변환한 배열로 비교/선택 상태 판단에 사용된다
 *     * isAllSelected는 isAllOption 제외 옵션 기준으로 전체 선택 여부를 판단한다
 *   * 이벤트 처리 방식(onClick, onChange, onDoubleClick 등)
 *     * SelectBox 클릭(onMouseDown) 시 toggleMenu 실행(open 토글 + activeIndex 초기화)
 *     * 키보드:
 *       * Enter/Space: open 상태면 현재 activeIndex 옵션 선택, 아니면 open
 *       * ArrowDown/ArrowUp: open 상태에서 activeIndex 순환 이동, 닫혀있으면 open
 *       * Home/End: 첫/마지막 옵션으로 이동
 *       * Escape: 메뉴 닫기(closeMenu)
 *     * 옵션 클릭:
 *       * single: handleSingleSelect → commitValue → closeMenu
 *       * multiple: handleMultipleSelect → commitValue (메뉴 유지)
 *     * chip 삭제:
 *       * multiple + chip 타입에서 특정 값 제거 후 commit
 *     * focus/blur:
 *       * focus 시 isActive=true + onFocus 호출
 *       * blur 시 isActive=false + onBlur 호출
 *   * disabled 상태에서 차단되는 동작
 *     * disabled/readOnly/isLoading 상태에서는 open, 키보드 조작, 선택, chip 삭제 모두 차단된다
 *
 * * 레이아웃/스타일 관련 규칙
 *   * SelectBox는 role="combobox"와 aria-* 속성(listbox, expanded 등)을 적용해 접근성을 보장한다
 *   * Popper는 anchorRef(selectBoxRef) 기준 bottom-start 위치에 렌더링된다
 *   * 옵션 리스트는 role="listbox"이며 multiple일 경우 aria-multiselectable이 활성화된다
 *   * activeIndex에 해당하는 Menu는 background 강조 스타일을 적용한다
 *   * variant(outlined/filled/standard)에 따라 border/background 스타일이 분기된다
 *   * open 상태에서는 info 색상으로 강조, error 상태에서는 error 색상으로 override된다
 *   * disabled/readOnly 상태에서는 getDisabledStyle로 스타일을 변경하고 cursor를 not-allowed로 설정한다
 *   * focus-visible 상태에서는 outline 대신 box-shadow로 포커스 표시를 적용한다
 *
 * * 데이터 처리 규칙
 *   * 입력 props 계약(필수/선택)
 *     * options는 필수이며 { value, label, isAllOption, chipColor, onClick, payload } 구조를 가진다
 *     * multiple=true이면 value는 배열, 아니면 단일 값으로 타입이 분리된다
 *     * value/defaultValue/onChange는 Single/Multiple 타입에 맞게 강제된다
 *   * 내부 계산 로직 요약(보정, fallback, formatter 등)
 *     * valueKeyMap(Map)으로 value → option 매핑을 구성해 O(1) 조회로 label/옵션 정보 접근
 *     * normalizedValue를 기준으로 선택 상태를 일관되게 관리
 *     * selectedElement:
 *       * 0개: placeholder 또는 "선택"
 *       * 1개: label
 *       * 전체 선택: "전체"
 *       * 다수 선택: `"첫 라벨" 외 N건`
 *     * isAllOption 선택 시:
 *       * 전체 선택 상태면 []로 초기화
 *       * 아니면 realOptions 전체 선택
 *   * 서버 제어/클라이언트 제어 여부
 *     * controlled 모드에서는 외부 value가 단일 소스이며 내부 상태는 반영만 수행
 *     * uncontrolled 모드에서는 internalValue를 상태로 유지하며 commitValue로 변경
 *
 * @module Select
 * 접근성과 키보드 네비게이션을 포함한 고급 Select 컴포넌트로,
 * single/multiple 타입 안전성과 Popper 기반 드롭다운을 결합해 일관된 선택 UX를 제공한다
 *
 * @usage
 * <Select
 *   {...props}
 * />
 *
/---------------------------------------------------------------------------**/
const Select = <TValue extends string | number = string>({
  variant = "outlined",
  multipleType = "default",
  label,
  options,
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  placeholder,
  error = false,
  helperText,
  required = false,
  size = "M",
  autoFocus = false,
  color,
  readOnly = false,
  isLoading = false,
  labelProps,
  typographyProps,
  labelPlacement = "top",
  popperProps,
  multiple = false,
  ...others
}: SelectProps<TValue>) => {
  const reactId = useId()
  const listboxId = `select-listbox-${reactId}`
  const labelId = `select-label-${reactId}`
  const helperTextId = `select-helper-${reactId}`

  const [open, setOpen] = useState(autoFocus && !disabled && !readOnly)
  const [isActive, setIsActive] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const popperRef = useRef<HTMLDivElement>(null)
  const selectBoxRef = useRef<HTMLDivElement>(null)

  const isControlled = value !== undefined

  const [internalValue, setInternalValue] = useState<SingleValue<TValue> | MultipleValue<TValue>>(
    () => {
      if (isControlled) return value as SingleValue<TValue> | MultipleValue<TValue>
      if (defaultValue !== undefined)
        return defaultValue as SingleValue<TValue> | MultipleValue<TValue>
      return multiple ? [] : undefined
    },
  )

  const currentValue = (isControlled ? value : internalValue) as
    | SingleValue<TValue>
    | MultipleValue<TValue>

  const normalizedValue = useMemo<MultipleValue<TValue>>(() => {
    if (multiple) {
      return Array.isArray(currentValue) ? currentValue : []
    }

    return currentValue === undefined ? [] : [currentValue as TValue]
  }, [currentValue, multiple])

  const valueKeyMap = useMemo(() => {
    const map = new Map<string, SelectOptionType<TValue>>()
    options.forEach((option) => {
      map.set(String(option.value), option)
    })
    return map
  }, [options])

  const selectedValueKeys = useMemo(
    () => normalizedValue.map((item) => String(item)),
    [normalizedValue],
  )

  const axis = useMemo(() => normalizeAxisPlacement(labelPlacement), [labelPlacement])
  const labelAlign = useMemo(() => getPlacementAlign(labelPlacement), [labelPlacement])

  const realOptions = useMemo(() => options.filter((option) => !option.isAllOption), [options])

  const realOptionKeys = useMemo(
    () => realOptions.map((option) => String(option.value)),
    [realOptions],
  )

  const isAllSelected = useMemo(() => {
    if (!multiple) return false
    if (realOptionKeys.length === 0) return false
    return realOptionKeys.every((key) => selectedValueKeys.includes(key))
  }, [multiple, realOptionKeys, selectedValueKeys])

  const commitValue = (next: SingleValue<TValue> | MultipleValue<TValue>) => {
    if (!isControlled) {
      setInternalValue(next)
    }

    if (multiple) {
      ;(onChange as MultipleSelectProps<TValue>["onChange"] | undefined)?.(
        (Array.isArray(next) ? next : []) as MultipleValue<TValue>,
      )
      return
    }

    ;(onChange as SingleSelectProps<TValue>["onChange"] | undefined)?.(
      (Array.isArray(next) ? undefined : next) as SingleValue<TValue>,
    )
  }

  const closeMenu = () => {
    setOpen(false)
    setActiveIndex(-1)
  }

  const openMenu = () => {
    if (disabled || readOnly || isLoading) return
    setOpen(true)
    setActiveIndex(0)
  }

  const toggleMenu = () => {
    if (disabled || readOnly || isLoading) return
    setOpen((prev) => {
      const next = !prev
      if (next) setActiveIndex(0)
      else setActiveIndex(-1)
      return next
    })
  }

  const handleSingleSelect = (nextValue: TValue, option?: SelectOptionType<TValue>) => {
    commitValue(nextValue)
    option?.onClick?.()
    closeMenu()
  }

  const handleMultipleSelect = (option: SelectOptionType<TValue>) => {
    const optionKey = String(option.value)

    if (option.isAllOption) {
      const nextValues = isAllSelected ? [] : realOptions.map((item) => item.value)

      commitValue(nextValues)
      option.onClick?.()
      return
    }

    const isSelected = selectedValueKeys.includes(optionKey)
    const nextValues = isSelected
      ? normalizedValue.filter((item) => String(item) !== optionKey)
      : [...normalizedValue, option.value]

    commitValue(nextValues)
    option.onClick?.()
  }

  const handleDelete = (valueKey: string) => {
    if (!multiple || readOnly || disabled) return

    const nextValues = normalizedValue.filter((item) => String(item) !== valueKey)
    commitValue(nextValues)
  }

  const handleFocus = () => {
    setIsActive(true)
    onFocus?.()
  }

  const handleBlur: FocusEventHandler<HTMLDivElement> = (event) => {
    setIsActive(false)
    onBlur?.(event)
  }

  const selectedElement = () => {
    const fontSize = getSizePx(size)

    if (selectedValueKeys.length === 0) {
      return (
        <Typography
          text={placeholder || "선택"}
          variant="b2Regular"
          color={theme.colors.grayscale[500]}
          ellipsis
          sx={{ fontSize, lineHeight: "inherit" }}
          {...typographyProps}
        />
      )
    }

    if (multiple) {
      if (multipleType === "chip") {
        return (
          <>
            {normalizedValue.map((item) => {
              const valueKey = String(item)
              const matchedOption = valueKeyMap.get(valueKey)

              return (
                <Chip
                  key={valueKey}
                  label={matchedOption?.label || valueKey}
                  onDelete={!readOnly && !disabled ? () => handleDelete(valueKey) : undefined}
                  size="M"
                  color={matchedOption?.chipColor || "normal"}
                  disabled={disabled}
                />
              )
            })}
          </>
        )
      }

      const selectedLabels = normalizedValue
        .map((item) => valueKeyMap.get(String(item))?.label)
        .filter((labelItem): labelItem is string => Boolean(labelItem))

      const text =
        selectedLabels.length === 1
          ? selectedLabels[0]
          : isAllSelected
            ? "전체"
            : `"${selectedLabels[0]}" 외 ${selectedLabels.length - 1}건`

      return (
        <Typography
          text={text}
          variant="b2Regular"
          color={disabled ? theme.colors.text.disabled : theme.colors.text.secondary}
          ellipsis
          sx={{ fontSize, lineHeight: "inherit" }}
          {...typographyProps}
        />
      )
    }

    const selectedKey = selectedValueKeys[0]
    const matchedOption = valueKeyMap.get(selectedKey)

    return (
      <Typography
        text={matchedOption?.label || selectedKey}
        variant="b2Regular"
        color={disabled ? theme.colors.text.disabled : theme.colors.text.secondary}
        ellipsis
        sx={{ fontSize, lineHeight: "inherit" }}
        {...typographyProps}
      />
    )
  }

  const renderOptions = () => {
    if (options.length === 0) {
      return (
        <Typography
          p={size === "M" ? "8px" : "4px"}
          variant="b2Regular"
          color={theme.colors.text.disabled}
          text="No options available."
          width="100%"
          align="center"
          sx={{ fontSize: getSizePx(size) }}
        />
      )
    }

    return options.map((item, index) => {
      const itemKey = String(item.value)
      const isSelected = item.isAllOption ? isAllSelected : selectedValueKeys.includes(itemKey)

      return (
        <Menu
          key={itemKey}
          text={item.label}
          selected={isSelected}
          width="100%"
          size={size}
          onClick={(event) => {
            event.preventDefault()

            if (multiple) {
              handleMultipleSelect(item)
              return
            }

            handleSingleSelect(item.value, item)
          }}
          sx={
            activeIndex === index
              ? {
                  backgroundColor: "background.default",
                }
              : undefined
          }
        />
      )
    })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || readOnly || isLoading) return

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      if (!open) {
        openMenu()
        return
      }

      const activeOption = options[activeIndex]
      if (!activeOption) return

      if (multiple) {
        handleMultipleSelect(activeOption)
      } else {
        handleSingleSelect(activeOption.value, activeOption)
      }
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      closeMenu()
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()

      if (!open) {
        openMenu()
        return
      }

      setActiveIndex((prev) => {
        if (options.length === 0) return -1
        return prev < options.length - 1 ? prev + 1 : 0
      })
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()

      if (!open) {
        openMenu()
        return
      }

      setActiveIndex((prev) => {
        if (options.length === 0) return -1
        return prev > 0 ? prev - 1 : options.length - 1
      })
      return
    }

    if (event.key === "Home") {
      if (!open || options.length === 0) return
      event.preventDefault()
      setActiveIndex(0)
      return
    }

    if (event.key === "End") {
      if (!open || options.length === 0) return
      event.preventDefault()
      setActiveIndex(options.length - 1)
    }
  }

  const renderTopLabel = label && axis === "top"
  const renderBottomLabel = label && axis === "bottom"
  const renderLeftLabel = label && axis === "left"
  const renderRightLabel = label && axis === "right"

  const iconSize = getSizePx(size)
  const describedBy = error ? helperTextId : undefined

  return (
    <Box
      width="100%"
      height="max-content"
      sx={{ position: "relative", backgroundColor: "transparent" }}
      {...others}
    >
      {renderTopLabel && (
        <Flex align={labelAlign}>
          <Label text={label} required={required} mb={4} {...labelProps} />
        </Flex>
      )}

      <Flex width="100%" height="100%" align="center" justify="space-between">
        {renderLeftLabel && <Label text={label} required={required} mr={4} {...labelProps} />}

        <SelectBox
          ref={selectBoxRef}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listboxId : undefined}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={describedBy}
          aria-invalid={error || undefined}
          aria-disabled={disabled || undefined}
          aria-readonly={readOnly || undefined}
          tabIndex={disabled || readOnly ? -1 : 0}
          onMouseDown={(event) => {
            if (event.detail === 0) return
            event.preventDefault()
            toggleMenu()
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          variant={variant}
          open={open}
          disabled={disabled}
          error={error}
          size={size}
          color={color}
          readOnly={readOnly}
          loading={isLoading}
          isActive={isActive}
        >
          <Flex ml={8} gap="4px" align="center" sx={{ overflow: "hidden", flexWrap: "wrap" }}>
            {isLoading ? (
              <Progress
                type="circular"
                size={iconSize}
                color={theme.colors.grayscale[400]}
                backgroundColor={theme.colors.grayscale[100]}
              />
            ) : (
              selectedElement()
            )}
          </Flex>

          <IconButton
            disableInteraction
            onClick={(event) => {
              event.stopPropagation()
              toggleMenu()
            }}
            icon={open ? "ArrowUp" : "ArrowDown"}
            size={iconSize}
            mr={8}
            disabled={readOnly || disabled || isLoading}
            iconProps={{ color: theme.colors.grayscale[300] }}
            sx={{ padding: 0, backgroundColor: "transparent" }}
          />

          {open && selectBoxRef.current && (
            <Popper
              ref={popperRef}
              anchorRef={selectBoxRef}
              placement="bottom-start"
              offsetY={4}
              open={open}
              width="anchor"
              onClose={closeMenu}
              {...popperProps}
            >
              <Box id={listboxId} role="listbox" aria-multiselectable={multiple || undefined}>
                {renderOptions()}
              </Box>
            </Popper>
          )}
        </SelectBox>

        {renderRightLabel && <Label text={label} required={required} ml={4} {...labelProps} />}
      </Flex>

      {renderBottomLabel && (
        <Flex align={labelAlign}>
          <Label text={label} required={required} mt={4} {...labelProps} />
        </Flex>
      )}

      {error && <HelperText status="error" text={helperText ?? ""} mt={6} />}
    </Box>
  )
}

const SelectBox = styled.div<SelectWrapperStyleProps>`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  min-height: ${({ size = "M" }) => getMinHeight(size)};
  border-radius: ${({ theme, variant }) => (variant === "outlined" ? theme.borderRadius[4] : 0)};
  transition: all 0.2s ease-in-out;
  outline: none;

  cursor: ${({ disabled, readOnly, loading }) =>
    disabled || readOnly || loading ? "not-allowed" : "pointer"};

  background-color: ${({ theme, variant }) => {
    switch (variant) {
      case "standard":
        return "transparent"
      case "filled":
        return theme.colors.grayscale[100]
      default:
        return theme.colors.grayscale.white
    }
  }};

  border: ${({ theme, variant }) =>
    variant === "outlined" ? `1px solid ${theme.colors.border.default}` : "0"};

  border-bottom: ${({ theme, variant }) =>
    variant === "standard"
      ? `1px solid ${theme.colors.border.default}`
      : `1px solid ${theme.colors.border.default}`};

  ${({ open, variant, theme, disabled, readOnly }) =>
    open &&
    !disabled &&
    !readOnly &&
    (variant === "standard"
      ? `
        border-bottom: 1px solid ${theme.colors.info[300]};
      `
      : `
        border-color: ${theme.colors.info[300]};
      `)}

  ${({ error, theme, variant }) =>
    error &&
    `
      ${
        variant === "standard"
          ? `border-bottom: 1px solid ${theme.colors.error[300]};`
          : `border-color: ${theme.colors.error[300]};`
      }
    `}

  ${({ disabled, readOnly, variant = "outlined" }) =>
    (disabled || readOnly) &&
    `
      ${getDisabledStyle(variant, theme)}
      cursor: not-allowed;
    `}

  &:focus-visible {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[200]};
  }
`

Select.displayName = "Select"/** @public */
/** @public */


export default Select
