import React, { useEffect, useMemo, useRef, useState } from "react"
import type { FocusEventHandler, KeyboardEvent } from "react"
import type { ReactNode } from "react"
import dayjs from "dayjs"
import type { BaseMixinProps } from "../../tokens/baseMixin"
import { styled } from "../../tokens/customStyled"
import type { SizeUiType } from "../../types/ui"
import type { DirectionalPlacement, AxisPlacement } from "../../types/placement"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import IconButton from "../IconButton/IconButton"
import Button from "../Button/Button"
import { Typography } from "../Typography/Typography"
import Popper from "../Popper/Popper"
import TextField from "../TextField/TextField"
import Divider from "../Divider/Divider"
import type { LabelProps } from "../Label/Label"

export type DateType = "Date" | "Time" | "Month" | "DateTime" | "Year"
export type DatePickerMode = "Single" | "Range"

type DatePickerPresetApi = {
  mode: DatePickerMode
  dateType: DateType

  value: dayjs.Dayjs | null
  rangeValue: [dayjs.Dayjs | null, dayjs.Dayjs | null]

  isOpen: boolean
  open: () => void
  close: () => void

  setSingle: (next: dayjs.Dayjs | null, options?: { close?: boolean }) => void
  setRange: (
    from: dayjs.Dayjs | null,
    to: dayjs.Dayjs | null,
    options?: { close?: boolean },
  ) => void
}

export type DatePickerProps = BaseMixinProps & {
  size?: SizeUiType
  mode?: DatePickerMode
  panels?: 1 | 2
  dateType?: DateType

  value?: dayjs.Dayjs | null
  onChange?: (value: dayjs.Dayjs | null) => void

  rangeValue?: [dayjs.Dayjs | null, dayjs.Dayjs | null]
  onRangeChange?: (from: dayjs.Dayjs | null, to: dayjs.Dayjs | null) => void

  label?: string
  required?: boolean
  readOnly?: boolean
  disabled?: boolean
  error?: boolean
  helperText?: string
  placeholder?: string
  clearable?: boolean

  minDate?: dayjs.Dayjs
  maxDate?: dayjs.Dayjs

  timeIntervals?: number
  minTime?: dayjs.Dayjs
  maxTime?: dayjs.Dayjs

  placement?: DirectionalPlacement
  labelPlacement?: AxisPlacement
  labelProps?: Partial<Omit<LabelProps, "text">>

  hiddenPresetButtons?: boolean

  presetNode?: ReactNode | ((api: DatePickerPresetApi) => ReactNode)

  cancelNode?: ReactNode
  confirmNode?: ReactNode

  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>

  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

type CalendarStyleProps = {
  $panels?: 1 | 2
}

const pad2 = (v: number) => `${v}`.padStart(2, "0")

const isBetweenInclusive = (
  d: dayjs.Dayjs,
  a: dayjs.Dayjs,
  b: dayjs.Dayjs,
  unit: dayjs.OpUnitType,
) => {
  const min = a.isBefore(b, unit) ? a : b
  const max = a.isBefore(b, unit) ? b : a
  return (
    (d.isAfter(min, unit) || d.isSame(min, unit)) && (d.isBefore(max, unit) || d.isSame(max, unit))
  )
}

const getPlaceholder = (mode: DatePickerMode, dateType: DateType) => {
  // * 입력 모드/타입 조합에 따라 placeholder 포맷 문자열을 반환
  if (mode === "Range") {
    if (dateType === "Month") return "YYYY-MM - YYYY-MM"
    if (dateType === "Year") return "YYYY - YYYY"
    if (dateType === "Time") return "HH:mm - HH:mm"
    if (dateType === "DateTime") return "YYYY-MM-DD HH:mm - YYYY-MM-DD HH:mm"
    return "YYYY-MM-DD - YYYY-MM-DD"
  }
  if (dateType === "Month") return "YYYY-MM"
  if (dateType === "Year") return "YYYY"
  if (dateType === "Time") return "HH:mm"
  if (dateType === "DateTime") return "YYYY-MM-DD HH:mm"
  return "YYYY-MM-DD"
}

const formatValueText = (
  mode: DatePickerMode,
  dateType: DateType,
  value?: dayjs.Dayjs | null,
  rangeValue?: [dayjs.Dayjs | null, dayjs.Dayjs | null],
) => {
  // * 현재 값(단일/범위)을 dateType에 맞는 문자열로 포맷해 input 표시 텍스트를 생성
  const fmtSingle =
    dateType === "Year"
      ? "YYYY"
      : dateType === "Month"
        ? "YYYY-MM"
        : dateType === "Time"
          ? "HH:mm"
          : dateType === "DateTime"
            ? "YYYY-MM-DD HH:mm"
            : "YYYY-MM-DD"

  if (mode === "Range") {
    const [a, b] = rangeValue ?? [null, null]
    const left = a ? a.format(fmtSingle) : ""
    const right = b ? b.format(fmtSingle) : ""
    if (!left && !right) return ""
    if (left && !right) return left
    return `${left} - ${right}`.trim()
  }
  return value ? value.format(fmtSingle) : ""
}

const parseSingleDigits = (digits: string, dateType: DateType) => {
  // * 숫자만 입력된 문자열을 dateType 규칙에 따라 엄격 파싱(dayjs strict)하여 Dayjs로 변환
  if (dateType === "Year") {
    if (digits.length < 4) return null
    const y = digits.slice(0, 4)
    const d = dayjs(y, "YYYY", true)
    return d.isValid() ? d.startOf("year") : null
  }

  if (dateType === "Month") {
    if (digits.length < 6) return null
    const y = digits.slice(0, 4)
    const m = digits.slice(4, 6)
    const d = dayjs(`${y}-${m}`, "YYYY-MM", true)
    return d.isValid() ? d.startOf("month") : null
  }

  if (dateType === "Time") {
    if (digits.length < 4) return null
    const hh = digits.slice(0, 2)
    const mm = digits.slice(2, 4)
    const d = dayjs(`${hh}:${mm}`, "HH:mm", true)
    return d.isValid() ? d : null
  }

  if (dateType === "DateTime") {
    if (digits.length < 12) return null
    const y = digits.slice(0, 4)
    const mo = digits.slice(4, 6)
    const da = digits.slice(6, 8)
    const hh = digits.slice(8, 10)
    const mi = digits.slice(10, 12)
    const d = dayjs(`${y}-${mo}-${da} ${hh}:${mi}`, "YYYY-MM-DD HH:mm", true)
    return d.isValid() ? d : null
  }

  if (digits.length < 8) return null
  const y = digits.slice(0, 4)
  const m = digits.slice(4, 6)
  const dday = digits.slice(6, 8)
  const d = dayjs(`${y}-${m}-${dday}`, "YYYY-MM-DD", true)
  return d.isValid() ? d : null
}

const formatSingleDigits = (digits: string, dateType: DateType) => {
  // * 숫자 입력을 사용자에게 보여줄 마스킹 문자열(구분자 포함)로 변환
  if (dateType === "Year") return digits.slice(0, 4)
  if (dateType === "Month") {
    if (digits.length >= 6) return `${digits.slice(0, 4)}-${digits.slice(4, 6)}`
    if (digits.length >= 4) return `${digits.slice(0, 4)}-${digits.slice(4)}`
    return digits
  }
  if (dateType === "Time") {
    if (digits.length >= 4) return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`
    if (digits.length >= 2) return `${digits.slice(0, 2)}:${digits.slice(2)}`
    return digits
  }
  if (dateType === "DateTime") {
    if (digits.length >= 12) {
      return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)} ${digits.slice(8, 10)}:${digits.slice(10, 12)}`
    }
    return digits
  }
  if (digits.length >= 8) return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`
  if (digits.length >= 6)
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}${digits.length > 6 ? `-${digits.slice(6)}` : ""}`
  if (digits.length >= 4) return `${digits.slice(0, 4)}-${digits.slice(4)}`
  return digits
}

const getMaxDigitsSingle = (dateType: DateType) => {
  // * dateType 별 단일 입력에서 허용되는 숫자 최대 길이를 반환
  if (dateType === "Year") return 4
  if (dateType === "Month") return 6
  if (dateType === "Time") return 4
  if (dateType === "DateTime") return 12
  return 8
}

const getWeekdayLabels = (weekStartsOn: number) => {
  // * weekStartsOn 기준으로 요일 라벨(로케일 short)을 재정렬해 반환
  const base = new Date(Date.UTC(2021, 7, 1))
  const fmt = new Intl.DateTimeFormat(undefined, { weekday: "short" })
  const labels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base)
    d.setUTCDate(base.getUTCDate() + i)
    return fmt.format(d)
  })
  return [...labels.slice(weekStartsOn), ...labels.slice(0, weekStartsOn)]
}

const buildMonthCells = (view: dayjs.Dayjs, weekStartsOn: number) => {
  // * 해당 월의 달력 셀(leading empty 포함)을 생성
  const start = view.startOf("month")
  const startWeekday = (start.day() - weekStartsOn + 7) % 7
  const daysInMonth = start.daysInMonth()
  const leading = Array.from({ length: startWeekday }, () => null as dayjs.Dayjs | null)
  const days = Array.from({ length: daysInMonth }, (_, i) => start.add(i, "day"))
  return [...leading, ...days]
}
/**---------------------------------------------------------------------------/
 *
 * ! DatePicker
 *
 * * dayjs 기반으로 Date/Time/Month/DateTime/Year 입력을 지원하는 팝오버형 DatePicker 컴포넌트
 * * TextField에 포커스/클릭 시 Popper를 열고, 선택 결과를 입력 문자열로 표시하며 (mode/dateType에 따라) 값 확정 정책이 달라짐
 * * 주요 상태/제어 방식
 *   * controlled: value/onChange, rangeValue/onRangeChange를 외부에서 주입받아 표시/확정에 사용
 *   * internal: 입력 표시용 inputText, Range 임시 선택값 draftRange, 팝오버 열림/활성 상태(isOpen/isActive), 캘린더 뷰(leftView/rightView), 키보드 포커스 상태(focusedDay/month/year/time) 관리
 *   * disabled/readOnly = interaction 차단(isInteractionBlocked)으로 모든 입력/선택/확정 동작을 막음
 * * 외부 훅(onBeforeOpen 등) 호출 시점과 의도
 *   * onBlur: TextField blur 시 내부 활성 상태 해제 후 사용자 onBlur 전달
 *   * presetNode가 함수인 경우 내부 presetApi를 주입하여 외부에서 open/close 및 setSingle/setRange를 통해 값/초안 조작 가능
 *
 * * 동작 규칙
 *   * 주요 분기 조건 및 처리 우선순위
 *     * mode: "Single" | "Range"에 따라 선택/확정 정책, 입력 파싱/마스킹, UI(ActionBar) 렌더링이 달라짐
 *     * dateType: "Date" | "Time" | "Month" | "DateTime" | "Year"에 따라
 *       - placeholder/format 규칙, 파싱 기준(자리수), 뷰 이동 단위(unit), 패널 구성(renderPanels), 시간 패널 포함 여부(DateTime) 및 팝오버 높이(poppeHeight)가 달라짐
 *     * panels: Range + panels=2 일 때 좌/우 패널(달/월/년 뷰)을 동시에 렌더링하고, 범위 확정/동기화 시 좌우 뷰를 정렬/보정함
 *   * 이벤트 처리 방식
 *     * TextField
 *       - onClick/onFocus: interaction 가능 시 팝오버 open 및 활성화
 *       - onBlur: 활성화 해제 + 외부 onBlur 호출
 *       - onKeyDown: 숫자 입력만 허용(구분자 "-", ":", " "는 허용), 컨트롤 키/네비게이션 키는 통과, 최대 자리수 초과 입력은 prevent
 *       - onChange: 입력값에서 숫자만 추출해 dateType별 마스킹 문자열로 inputText 갱신
 *         - Single: 자리수 충족 시 파싱→정규화→범위 체크 후 onChange 호출(자동 확정)
 *         - Range: 좌/우 파트 각각 자리수 충족 시 두 값 파싱→정렬→정규화→범위 체크 후 draftRange/inputText 갱신(확정은 하지 않음)
 *       - onClear: Single이면 onChange(null), Range면 onRangeChange(null,null) 및 draftRange 초기화
 *     * Popper
 *       - open 상태로 렌더링되며 onClose는 closePopover로 연결
 *     * 캘린더/리스트 셀 버튼
 *       - onClick: 선택 활성(activate) → dateType별 selectDay/selectMonth/selectYear/selectTime 실행
 *       - onKeyDown: Enter/Space로 activate, Arrow/Home/End로 roving focus 이동(패널별 moveFocus* 로직)
 *       - onFocus: 해당 셀을 focused* 상태로 반영하여 tabIndex roving focus 유지
 *     * Range ActionBar
 *       - Cancel: open 시 스냅샷(openSnapshotRef)으로 모든 내부 상태 복원 후 닫기
 *       - Confirm: 현재 draftRange를 onRangeChange로 반영 후 닫기(Confirm-only policy)
 *   * disabled 상태에서 차단되는 동작
 *     * disabled 또는 readOnly이면: 팝오버 open, 입력 변화, clear, 셀 선택, confirm/cancel 버튼 동작이 모두 차단되거나(초기 체크) disabled 속성으로 비활성화됨
 *
 * * 레이아웃/스타일 관련 규칙
 *   * Popper
 *     * anchorRef(div)를 기준으로 placement(기본 bottom-start) 및 offsetY=6 적용
 *     * width는 max-content, height는 dateType/mode에 따라 고정 또는 max-content(단일 DateTime=520px, 단일 Time=320px)
 *   * 패널 구성
 *     * dateType=Time: 시간 리스트 단독 패널(standalone)만 렌더링
 *     * dateType=Date: Day 패널(필요 시 Range+panels=2로 2개) 렌더링
 *     * dateType=Month: Month 패널(필요 시 2개) 렌더링
 *     * dateType=Year: 12년 그리드 단일 패널 렌더링
 *     * dateType=DateTime: Day 패널 + Divider(세로) + Time 패널 병렬 렌더링
 *   * 캘린더 그리드/셀 스타일
 *     * DayGrid는 7열, Month/YearGrid는 3열, CalendarGrid는 panels 수에 따라 1fr/1fr 2열 구성
 *     * DayCell/MonthCell/YearCell/TimeItem은 상태 플래그($disabled/$selected/$inRange/$rangeStart/$rangeEnd 등)에 따라
 *       - 선택/범위 시작/끝: primary[400] 배경 + white 텍스트 + bold
 *       - 범위 내부: primary[50] 배경 + primary[400] 텍스트
 *       - hover: 비선택/비범위 시작/끝 상태에서 primary[50] 배경 및 primary[300] 텍스트
 *       - focus-visible: primary[300] outline
 *     * DayCell 주말 표시: weekday 라벨(첫/마지막) 및 날짜 셀의 weekend는 grayscale[300]로 표시(단, disabled는 text.disabled 우선)
 *     * 오늘 표시: 선택/비활성/빈칸이 아닌 경우 테두리로 primary[400] 강조
 *
 * * 데이터 처리 규칙
 *   * 입력 props 계약(필수/선택)
 *     * mode(기본 Single), dateType(기본 Date), panels(기본 1)
 *     * Single 제어: value?: Dayjs|null, onChange?: (Dayjs|null)=>void
 *     * Range 제어: rangeValue?: [Dayjs|null, Dayjs|null], onRangeChange?: (from,to)=>void
 *     * 제한: minDate/maxDate(일 단위), minTime/maxTime(시간-of-day 제한), timeIntervals(기본 5분 간격)
 *     * UI: label/required/readOnly/disabled/error/helperText/placeholder/clearable
 *     * 위치: placement, labelPlacement, labelProps
 *     * 프리셋: hiddenPresetButtons, presetNode(노드 또는 (api)=>노드), cancelNode/confirmNode
 *     * A11y/i18n: weekStartsOn(기본 0)
 *   * 내부 계산 로직 요약(보정, fallback, formatter 등)
 *     * 표시 문자열
 *       - getPlaceholder/formatValueText로 mode/dateType별 포맷(YYYY / YYYY-MM / HH:mm / YYYY-MM-DD / YYYY-MM-DD HH:mm) 결정
 *     * 입력 파싱/마스킹
 *       - 숫자만 허용, dateType별 최대 자리수(getMaxDigitsSingle)로 제한
 *       - formatSingleDigits로 마스킹된 문자열 구성, parseSingleDigits로 strict 파싱(dayjs(..., true))
 *     * 값 정규화
 *       - Single: Year/Month/Date는 startOf 단위 보정, DateTime/Time은 second/millisecond 제거
 *       - Range: 단위별(startOf/second/millisecond)로 양끝 값 정규화
 *     * 범위 제한
 *       - Date/Month/Year는 day 기준으로 minDate/maxDate 검사
 *       - Time은 분(minute) 기준으로 minTime/maxTime 검사(날짜와 무관한 time-of-day 정책)
 *       - DateTime은 day 범위 + time-of-day 범위를 모두 적용
 *     * Range 순서 보정
 *       - normalizeRangeOrder로 unit 기준 역전 입력을 정렬하고, 표시/초안에 반영
 *     * 뷰 동기화
 *       - Range + panels=2에서 시작/끝 월이 같은 경우 오른쪽 뷰를 다음 달로 보정하여 중복을 피함
 *   * 서버 제어/클라이언트 제어 여부
 *     * 선택 값 자체는 외부 콜백(onChange/onRangeChange)로 전달되는 controlled 계약을 전제로 하며,
 *       내부에서는 입력/초안/뷰/포커스 상태를 클라이언트에서 관리하여 UI 상호작용을 구성함
 *
 * @module DatePicker
 * dayjs 기반 날짜/시간 선택 UI를 Popper로 제공하며, 입력 직접 타이핑(숫자 마스킹/파싱)과 패널 선택(마우스/키보드)을 함께 지원한다.
 *
 * @usage
 * <DatePicker
 *   {...props}
 * />
 *
/---------------------------------------------------------------------------**/
const DatePicker = (props: DatePickerProps) => {
  const {
    size = "M",
    mode = "Single",
    panels = 1,
    dateType = "Date",

    value,
    onChange,

    rangeValue,
    onRangeChange,

    label,
    required,
    readOnly = false,
    disabled = false,
    error = false,
    helperText,
    placeholder,
    clearable = false,

    minDate,
    maxDate,

    timeIntervals = 5,
    minTime,
    maxTime,

    placement = "bottom-start",
    labelPlacement = "top",
    labelProps,

    hiddenPresetButtons = true,

    presetNode,

    cancelNode,
    confirmNode,

    onBlur,

    weekStartsOn = 0,
    ...others
  } = props

  const anchorRef = useRef<HTMLDivElement>(null)

  const [isActive, setIsActive] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const unit: dayjs.OpUnitType = useMemo(() => {
    // * 입력 타입에 따른 range 정렬/비교 단위를 결정
    if (dateType === "Year") return "year"
    if (dateType === "Month") return "month"
    if (dateType === "Time") return "minute"
    if (dateType === "DateTime") return "minute"
    return "day"
  }, [dateType])

  const weekdayLabels = useMemo(() => getWeekdayLabels(weekStartsOn), [weekStartsOn])

  const displayText = useMemo(() => {
    // * 외부 value/rangeValue를 기준으로 input 표시 텍스트를 동기화
    return formatValueText(mode, dateType, value ?? null, rangeValue)
  }, [mode, dateType, value, rangeValue])

  const [inputText, setInputText] = useState<string>(displayText)

  const [draftRange, setDraftRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>(() => {
    // * Range 모드에서 popover 내부에서만 사용하는 임시 값을 초기화
    const base = rangeValue ?? [null, null]
    return [base[0] ?? null, base[1] ?? null]
  })

  const [activeRangePart, setActiveRangePart] = useState<"start" | "end">("start")

  const [leftView, setLeftView] = useState<dayjs.Dayjs>(() => {
    // * 좌측 패널 기준 뷰(월/년 시작점)를 초기화
    const base = mode === "Range" ? (draftRange[0] ?? dayjs()) : (value ?? dayjs())
    if (dateType === "Year") return base.startOf("year")
    if (dateType === "Month") return base.startOf("year")
    return base.startOf("month")
  })

  const [rightView, setRightView] = useState<dayjs.Dayjs>(() => {
    // * 우측 패널 기준 뷰(월/년 시작점)를 초기화 (2패널용)
    const base = mode === "Range" ? (draftRange[1] ?? dayjs()) : (value ?? dayjs())
    if (dateType === "Year") return base.startOf("year")
    if (dateType === "Month") return base.startOf("year")
    return base.add(1, "month").startOf("month")
  })

  const todayRef = useRef(dayjs().startOf("day"))

  const [focusedDay, setFocusedDay] = useState<dayjs.Dayjs | null>(null)
  const [focusedMonthIndex, setFocusedMonthIndex] = useState<number>(0)
  const [focusedYearIndex, setFocusedYearIndex] = useState<number>(0)
  const [focusedTimeIndex, setFocusedTimeIndex] = useState<number>(0)

  const openSnapshotRef = useRef<{
    inputText: string
    value: dayjs.Dayjs | null
    rangeValue: [dayjs.Dayjs | null, dayjs.Dayjs | null]
    leftView: dayjs.Dayjs
    rightView: dayjs.Dayjs
    activeRangePart: "start" | "end"
    focusedDay: dayjs.Dayjs | null
    focusedMonthIndex: number
    focusedYearIndex: number
    focusedTimeIndex: number
  } | null>(null)

  const timeItems = useMemo(() => {
    // * timeIntervals 기준으로 24시간 time option 목록을 생성
    if (!(dateType === "Time" || dateType === "DateTime")) return []
    const step = Math.max(1, timeIntervals)
    const list: { label: string; minutes: number }[] = []
    for (let m = 0; m < 24 * 60; m += step) {
      const hh = Math.floor(m / 60)
      const mm = m % 60
      list.push({ label: `${pad2(hh)}:${pad2(mm)}`, minutes: m })
    }
    return list
  }, [dateType, timeIntervals])

  useEffect(() => {
    // * 외부 값 변경 시 inputText를 표시 텍스트로 동기화
    setInputText(displayText)
  }, [displayText])

  useEffect(() => {
    // * popover open 시점에 외부 값/설정을 기준으로 view/focus/draftRange를 재동기화
    if (!isOpen) return

    if (mode === "Range") {
      const [a, b] = rangeValue ?? [null, null]
      const nextA = a ?? null
      const nextB = b ?? null
      setDraftRange([nextA, nextB])
      setActiveRangePart(!nextA ? "start" : nextA && !nextB ? "end" : "end")

      const baseLeft = nextA ?? dayjs()
      const baseRight =
        nextB ??
        baseLeft.add(1, dateType === "Year" ? "year" : dateType === "Month" ? "year" : "month")

      if (dateType === "Year") {
        const l = baseLeft.startOf("year")
        const r = baseRight.startOf("year")
        if (panels === 2) {
          const leftFinal = r.isBefore(l, "year") ? r : l
          const rightFinal = r.isBefore(l, "year") ? l : r
          setLeftView(leftFinal)
          setRightView(rightFinal)
        } else {
          setLeftView(l)
          setRightView(l)
        }
        setFocusedDay(nextA?.startOf("day") ?? l.startOf("month"))
        return
      }

      if (dateType === "Month") {
        const l = baseLeft.startOf("year")
        const r = baseRight.startOf("year")
        if (panels === 2) {
          const leftFinal = r.isBefore(l, "year") ? r : l
          const rightFinal = r.isBefore(l, "year") ? l : r
          setLeftView(leftFinal)
          setRightView(rightFinal)
        } else {
          setLeftView(l)
          setRightView(l)
        }
        setFocusedMonthIndex((nextA ?? l).month())
        return
      }

      const l = baseLeft.startOf("month")
      const r = baseRight.startOf("month")

      if (panels === 2) {
        const leftFinal = r.isBefore(l, "month") ? r : l
        const rightFinal = r.isBefore(l, "month") ? l : r
        setLeftView(leftFinal)
        setRightView(rightFinal.isSame(leftFinal, "month") ? leftFinal.add(1, "month") : rightFinal)
      } else {
        setLeftView(l)
        setRightView(l)
      }

      setFocusedDay((nextA ?? l).startOf("day"))
      return
    }

    const base = value ?? dayjs()
    const v =
      dateType === "Year"
        ? base.startOf("year")
        : dateType === "Month"
          ? base.startOf("year")
          : base.startOf("month")
    setLeftView(v)
    setRightView(dateType === "Year" || dateType === "Month" ? v : v.add(1, "month"))

    if (dateType === "Month") setFocusedMonthIndex(base.month())
    if (dateType === "Year") {
      const baseYear = v.year()
      const startYear = baseYear - (baseYear % 12)
      setFocusedYearIndex(Math.min(11, Math.max(0, base.year() - startYear)))
    }
    if (dateType === "Date" || dateType === "DateTime") setFocusedDay(base.startOf("day"))
    if (dateType === "Time" || dateType === "DateTime") {
      const minutes = base.hour() * 60 + base.minute()
      const idx = Math.max(
        0,
        Math.min(timeItems.length - 1, Math.floor(minutes / Math.max(1, timeIntervals))),
      )
      setFocusedTimeIndex(idx)
    }
  }, [isOpen, mode, rangeValue, value, dateType, panels, timeIntervals, timeItems.length])

  const isInteractionBlocked = disabled || readOnly

  const isDateOutOfRange = (d: dayjs.Dayjs) => {
    // * minDate/maxDate(day 단위) 범위를 벗어났는지 확인
    if (minDate && d.isBefore(minDate, "day")) return true
    if (maxDate && d.isAfter(maxDate, "day")) return true
    return false
  }

  const isTimeOutOfRange = (d: dayjs.Dayjs) => {
    // * minTime/maxTime(time-of-day) 범위를 벗어났는지 확인
    if (!(dateType === "Time" || dateType === "DateTime")) return false
    if (!minTime && !maxTime) return false
    const m = d.hour() * 60 + d.minute()
    const minM = minTime ? minTime.hour() * 60 + minTime.minute() : 0
    const maxM = maxTime ? maxTime.hour() * 60 + maxTime.minute() : 24 * 60 - 1
    return m < minM || m > maxM
  }

  const isOutOfRange = (d: dayjs.Dayjs) => {
    // * dateType 정책에 맞게 날짜/시간 제한을 합성해 out-of-range 여부를 판정
    if (dateType === "Time") return isTimeOutOfRange(d)
    if (dateType === "DateTime") return isDateOutOfRange(d.startOf("day")) || isTimeOutOfRange(d)
    return isDateOutOfRange(d.startOf("day"))
  }

  const openPopover = () => {
    // * open 시점의 상태를 스냅샷으로 저장(취소 복원용)하고 popover를 연다
    if (isInteractionBlocked) return

    openSnapshotRef.current = {
      inputText,
      value: value ?? null,
      rangeValue: [rangeValue?.[0] ?? null, rangeValue?.[1] ?? null],
      leftView,
      rightView,
      activeRangePart,
      focusedDay,
      focusedMonthIndex,
      focusedYearIndex,
      focusedTimeIndex,
    }

    setIsActive(true)
    setIsOpen(true)
  }

  const closePopover = () => {
    // * popover를 닫고 포커스 active 상태를 해제
    setIsOpen(false)
    setIsActive(false)
  }

  const handleBlurLocal = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // * TextField blur 시 내부 active 상태를 해제하고 외부 onBlur를 호출
    setIsActive(false)
    onBlur?.(e)
  }

  const handleClear = () => {
    // * clear 액션을 단일/범위 모드에 맞춰 적용하고 inputText를 초기화
    if (isInteractionBlocked) return
    if (mode === "Range") {
      setDraftRange([null, null])
      onRangeChange?.(null, null)
      setInputText("")
    } else {
      onChange?.(null)
      setInputText("")
    }
  }

  const normalizeSingleValue = (d: dayjs.Dayjs) => {
    // * dateType 정책에 맞게 단일 값을 표준화(startOf/seconds 제거)
    if (dateType === "Month") return d.startOf("month")
    if (dateType === "Year") return d.startOf("year")
    if (dateType === "Date") return d.startOf("day")
    if (dateType === "DateTime") return d.second(0).millisecond(0)
    return d
  }

  const normalizeRangeValue = (a: dayjs.Dayjs, b: dayjs.Dayjs) => {
    // * dateType 정책에 맞게 범위 값을 표준화(startOf/seconds 제거)
    if (dateType === "Year") return [a.startOf("year"), b.startOf("year")] as const
    if (dateType === "Month") return [a.startOf("month"), b.startOf("month")] as const
    if (dateType === "Date") return [a.startOf("day"), b.startOf("day")] as const
    if (dateType === "DateTime")
      return [a.second(0).millisecond(0), b.second(0).millisecond(0)] as const
    return [a, b] as const
  }

  const commitSingle = (next: dayjs.Dayjs | null, close: boolean) => {
    // * 단일 값 확정(onChange) 및 inputText 동기화, 필요 시 popover 닫기
    if (isInteractionBlocked) return
    if (next && isOutOfRange(next)) return

    if (!next) {
      onChange?.(null)
      setInputText("")
      if (close) closePopover()
      return
    }

    const normalized = normalizeSingleValue(next)
    onChange?.(normalized)
    setInputText(formatValueText("Single", dateType, normalized, undefined))
    if (close) closePopover()
  }

  const commitRangeConfirm = () => {
    // * Range 모드 Confirm-only 정책에 따라 draftRange를 외부로 확정
    if (isInteractionBlocked) return
    const [a, b] = draftRange
    onRangeChange?.(a ?? null, b ?? null)
    closePopover()
  }

  const commitRangeCancel = () => {
    // * open 시점 스냅샷으로 상태를 복원하고 popover를 닫는다
    const snap = openSnapshotRef.current
    if (!snap) {
      closePopover()
      return
    }
    setInputText(snap.inputText)
    setDraftRange(snap.rangeValue)
    setLeftView(snap.leftView)
    setRightView(snap.rightView)
    setActiveRangePart(snap.activeRangePart)
    setFocusedDay(snap.focusedDay)
    setFocusedMonthIndex(snap.focusedMonthIndex)
    setFocusedYearIndex(snap.focusedYearIndex)
    setFocusedTimeIndex(snap.focusedTimeIndex)
    closePopover()
  }

  const normalizeRangeOrder = (a: dayjs.Dayjs, b: dayjs.Dayjs, u: dayjs.OpUnitType) => {
    // * 범위 입력의 순서를 단위(u) 기준으로 정렬
    if (b.isBefore(a, u)) return [b, a] as const
    return [a, b] as const
  }

  const applyDraftRange = (a: dayjs.Dayjs | null, b: dayjs.Dayjs | null) => {
    // * draftRange와 inputText를 범위 표기 문자열로 동기화
    setDraftRange([a, b])
    setInputText(formatValueText("Range", dateType, null, [a, b]))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // * 숫자 외 입력 차단 + 최대 자리수 초과 입력 방지
    if (isInteractionBlocked) {
      e.preventDefault()
      return
    }

    const ctrlKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ]
    if (e.ctrlKey || e.metaKey) return
    if (ctrlKeys.includes(e.key)) return
    if (["-", ":", " "].includes(e.key)) return

    if (!/^\d$/.test(e.key)) {
      e.preventDefault()
      return
    }

    const maxDigitsSingle = getMaxDigitsSingle(dateType)
    const maxDigits = mode === "Range" ? maxDigitsSingle * 2 : maxDigitsSingle

    const t = e.target as HTMLInputElement | HTMLTextAreaElement
    const selStart = t.selectionStart ?? t.value.length
    const selEnd = t.selectionEnd ?? t.value.length
    const before = t.value.slice(0, selStart)
    const after = t.value.slice(selEnd)
    const nextDigits = (before + e.key + after).replace(/\D/g, "").length
    if (nextDigits > maxDigits) e.preventDefault()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // * input 텍스트 변경을 digits 기반으로 마스킹/파싱하여 내부/외부 값을 갱신
    if (isInteractionBlocked) return
    const digits = e.target.value.replace(/\D/g, "")
    const maxDigitsSingle = getMaxDigitsSingle(dateType)

    if (mode === "Range") {
      const first = digits.slice(0, maxDigitsSingle)
      const second = digits.slice(maxDigitsSingle, maxDigitsSingle * 2)

      const left = formatSingleDigits(first, dateType)
      const right = formatSingleDigits(second, dateType)
      const next = second.length === 0 ? left : `${left} - ${right}`.trim()

      setInputText(next)

      if (digits.length < maxDigitsSingle * 2) return

      const a = parseSingleDigits(first, dateType)
      const b = parseSingleDigits(second, dateType)
      if (!a || !b) return

      const [finalA, finalB] = normalizeRangeOrder(a, b, unit)
      const [na, nb] = normalizeRangeValue(finalA, finalB)
      if (isOutOfRange(na) || isOutOfRange(nb)) return

      applyDraftRange(na, nb)
      setActiveRangePart("end")
      return
    }

    const masked = formatSingleDigits(digits, dateType)
    setInputText(masked)

    if (digits.length < maxDigitsSingle) return
    const parsed = parseSingleDigits(digits, dateType)
    if (!parsed) return
    const normalized = normalizeSingleValue(parsed)
    if (isOutOfRange(normalized)) return

    onChange?.(normalized)
  }

  const headerTitle = (view: dayjs.Dayjs) => {
    // * 상단 헤더 표시 텍스트를 dateType에 맞춰 반환
    if (dateType === "Year") return view.format("YYYY")
    if (dateType === "Month") return view.format("YYYY")
    return view.format("YYYY.MM")
  }

  const moveView = (which: "left" | "right", delta: number) => {
    // * 패널의 view(월/년)를 dateType 규칙에 따라 이동
    if (dateType === "Year") {
      if (which === "left") setLeftView((p) => p.add(delta * 12, "year").startOf("year"))
      else setRightView((p) => p.add(delta * 12, "year").startOf("year"))
      return
    }

    if (dateType === "Month") {
      if (which === "left") setLeftView((p) => p.add(delta, "year").startOf("year"))
      else setRightView((p) => p.add(delta, "year").startOf("year"))
      return
    }

    if (which === "left") setLeftView((p) => p.add(delta, "month").startOf("month"))
    else setRightView((p) => p.add(delta, "month").startOf("month"))
  }

  const syncDateViewsForRange = (a: dayjs.Dayjs, b: dayjs.Dayjs) => {
    // * 2패널 Range에서 시작/끝 월을 기준으로 좌/우 패널을 자연스럽게 정렬
    if (panels !== 2) return
    const aM = a.startOf("month")
    const bM = b.startOf("month")
    const left = aM
    const right = bM.isSame(aM, "month") ? aM.add(1, "month") : bM
    setLeftView(left)
    setRightView(right.isBefore(left, "month") ? left.add(1, "month") : right)
  }

  const singleSelected = value ?? null
  const rangeA = draftRange[0]
  const rangeB = draftRange[1]

  const isSelectedDay = (d: dayjs.Dayjs) => {
    // * 단일(Date/DateTime)에서 선택 여부 판정(일 단위)
    if (mode === "Range") return false
    if (!singleSelected) return false
    return d.isSame(singleSelected, "day")
  }

  const isRangeStartDay = (d: dayjs.Dayjs) => {
    // * Range 시작 날짜 셀 여부
    if (mode !== "Range") return false
    if (!rangeA) return false
    return d.isSame(rangeA, "day")
  }

  const isRangeEndDay = (d: dayjs.Dayjs) => {
    // * Range 끝 날짜 셀 여부
    if (mode !== "Range") return false
    if (!rangeB) return false
    return d.isSame(rangeB, "day")
  }

  const isInRangeDay = (d: dayjs.Dayjs) => {
    // * Range 범위 포함 여부(일 단위)
    if (mode !== "Range") return false
    if (!rangeA || !rangeB) return false
    return isBetweenInclusive(d, rangeA, rangeB, "day")
  }

  const isRangeStartMonth = (d: dayjs.Dayjs) => {
    // * Range 시작 월 셀 여부
    if (mode !== "Range") return false
    if (!rangeA) return false
    return d.isSame(rangeA, "month")
  }

  const isRangeEndMonth = (d: dayjs.Dayjs) => {
    // * Range 끝 월 셀 여부
    if (mode !== "Range") return false
    if (!rangeB) return false
    return d.isSame(rangeB, "month")
  }

  const isInRangeMonth = (d: dayjs.Dayjs) => {
    // * Range 범위 포함 여부(월 단위)
    if (mode !== "Range") return false
    if (!rangeA || !rangeB) return false
    return isBetweenInclusive(d, rangeA, rangeB, "month")
  }

  const isRangeStartYear = (d: dayjs.Dayjs) => {
    // * Range 시작 연도 셀 여부
    if (mode !== "Range") return false
    if (!rangeA) return false
    return d.isSame(rangeA, "year")
  }

  const isRangeEndYear = (d: dayjs.Dayjs) => {
    // * Range 끝 연도 셀 여부
    if (mode !== "Range") return false
    if (!rangeB) return false
    return d.isSame(rangeB, "year")
  }

  const isInRangeYear = (d: dayjs.Dayjs) => {
    // * Range 범위 포함 여부(연도 단위)
    if (mode !== "Range") return false
    if (!rangeA || !rangeB) return false
    return isBetweenInclusive(d, rangeA, rangeB, "year")
  }

  const rangeMinutesA = useMemo(() => {
    // * Range 시작 시각(분) 캐싱
    if (mode !== "Range") return null
    if (!rangeA) return null
    return rangeA.hour() * 60 + rangeA.minute()
  }, [mode, rangeA])

  const rangeMinutesB = useMemo(() => {
    // * Range 끝 시각(분) 캐싱
    if (mode !== "Range") return null
    if (!rangeB) return null
    return rangeB.hour() * 60 + rangeB.minute()
  }, [mode, rangeB])

  const isRangeStartTime = (m: number) => {
    // * Range 시작 시각 옵션 여부
    if (mode !== "Range") return false
    if (rangeMinutesA == null) return false
    return m === rangeMinutesA
  }

  const isRangeEndTime = (m: number) => {
    // * Range 끝 시각 옵션 여부
    if (mode !== "Range") return false
    if (rangeMinutesB == null) return false
    return m === rangeMinutesB
  }

  const isInRangeTime = (m: number) => {
    // * Range 시각 옵션 포함 여부
    if (mode !== "Range") return false
    if (rangeMinutesA == null || rangeMinutesB == null) return false
    const min = Math.min(rangeMinutesA, rangeMinutesB)
    const max = Math.max(rangeMinutesA, rangeMinutesB)
    return m >= min && m <= max
  }

  const selectDay = (d: dayjs.Dayjs, which: "left" | "right") => {
    // * 일 셀 선택 처리(단일 즉시 확정 / Range는 draftRange 갱신)
    if (isInteractionBlocked) return
    if (isOutOfRange(d.startOf("day"))) return

    if (mode === "Range") {
      const [a, b] = draftRange

      if (!a || (a && b)) {
        const start = d.startOf("day")
        applyDraftRange(start, null)
        setActiveRangePart("end")
        setFocusedDay(start)

        if (panels === 2) {
          const base = d.startOf("month")
          if (which === "left") {
            setLeftView(base)
            setRightView(base.add(1, "month"))
          } else {
            setRightView(base)
            setLeftView(base.subtract(1, "month"))
          }
        }
        return
      }

      const nextA = a.startOf("day")
      const nextB = d.startOf("day")
      const [finalA, finalB] = normalizeRangeOrder(nextA, nextB, "day")
      const [na, nb] = normalizeRangeValue(finalA, finalB)
      if (isOutOfRange(na) || isOutOfRange(nb)) return

      syncDateViewsForRange(na, nb)
      applyDraftRange(na, nb)
      setActiveRangePart("end")
      setFocusedDay(nb)
      return
    }

    const next = dateType === "Date" ? d.startOf("day") : d
    commitSingle(next, true)
  }

  const selectMonth = (mIndex: number, view: dayjs.Dayjs) => {
    // * 월 셀 선택 처리(단일 즉시 확정 / Range는 draftRange 갱신)
    const d = view.month(mIndex).startOf("month")
    if (isOutOfRange(d)) return

    if (mode === "Range") {
      const [a, b] = draftRange
      if (!a || (a && b)) {
        applyDraftRange(d, null)
        setActiveRangePart("end")
        setFocusedMonthIndex(mIndex)
        return
      }
      const nextA = a.startOf("month")
      const nextB = d
      const [finalA, finalB] = normalizeRangeOrder(nextA, nextB, "month")
      const [na, nb] = normalizeRangeValue(finalA, finalB)
      if (isOutOfRange(na) || isOutOfRange(nb)) return

      applyDraftRange(na, nb)
      setFocusedMonthIndex(mIndex)
      return
    }

    commitSingle(d, true)
    setLeftView(d.startOf("year"))
    setFocusedMonthIndex(mIndex)
  }

  const selectYear = (y: number, startYear: number) => {
    // * 연도 셀 선택 처리(단일 즉시 확정 / Range는 draftRange 갱신)
    const d = dayjs().year(y).startOf("year")
    if (isOutOfRange(d)) return

    if (mode === "Range") {
      const [a, b] = draftRange
      if (!a || (a && b)) {
        applyDraftRange(d, null)
        setActiveRangePart("end")
        setFocusedYearIndex(y - startYear)
        return
      }
      const nextA = a.startOf("year")
      const nextB = d
      const [finalA, finalB] = normalizeRangeOrder(nextA, nextB, "year")
      const [na, nb] = normalizeRangeValue(finalA, finalB)
      if (isOutOfRange(na) || isOutOfRange(nb)) return

      applyDraftRange(na, nb)
      setFocusedYearIndex(y - startYear)
      return
    }

    commitSingle(d, true)
    setFocusedYearIndex(y - startYear)
  }

  const applyTimeTo = (base: dayjs.Dayjs, minutes: number) => {
    // * minutes(0~1439)를 base 날짜에 반영하여 새로운 Dayjs를 생성
    const hh = Math.floor(minutes / 60)
    const mm = minutes % 60
    return base.hour(hh).minute(mm).second(0).millisecond(0)
  }

  const selectTime = (minutes: number, index: number) => {
    // * 시간 옵션 선택 처리(Time/DateTime, 단일 즉시 확정 / Range는 draftRange 갱신)
    if (isInteractionBlocked) return
    if (!(dateType === "Time" || dateType === "DateTime")) return

    setFocusedTimeIndex(index)

    if (mode === "Range") {
      const [a, b] = draftRange

      const makeBase = (x: dayjs.Dayjs | null) => {
        // * Time은 오늘, DateTime은 오늘 00:00을 기본으로 사용(없으면)
        if (x) return x
        if (dateType === "Time") return dayjs()
        return dayjs().startOf("day")
      }

      if (!a || (a && b)) {
        const base = makeBase(null)
        const nextA = applyTimeTo(base, minutes)
        if (isOutOfRange(nextA)) return
        applyDraftRange(nextA, null)
        setActiveRangePart("end")
        return
      }

      if (!b) {
        const baseB = makeBase(a)
        const nextB = applyTimeTo(baseB, minutes)
        if (isOutOfRange(nextB)) return
        const [finalA, finalB] = normalizeRangeOrder(a, nextB, "minute")
        const [na, nb] = normalizeRangeValue(finalA, finalB)
        if (isOutOfRange(na) || isOutOfRange(nb)) return
        applyDraftRange(na, nb)
        return
      }

      const nextTarget = activeRangePart === "start" ? "start" : "end"
      if (nextTarget === "start") {
        const nextA = applyTimeTo(makeBase(a), minutes)
        if (isOutOfRange(nextA)) return
        const [finalA, finalB] = normalizeRangeOrder(nextA, b, "minute")
        const [na, nb] = normalizeRangeValue(finalA, finalB)
        if (isOutOfRange(na) || isOutOfRange(nb)) return
        applyDraftRange(na, nb)
        return
      }

      const nextB = applyTimeTo(makeBase(b), minutes)
      if (isOutOfRange(nextB)) return
      const [finalA, finalB] = normalizeRangeOrder(a, nextB, "minute")
      const [na, nb] = normalizeRangeValue(finalA, finalB)
      if (isOutOfRange(na) || isOutOfRange(nb)) return
      applyDraftRange(na, nb)
      return
    }

    const hh = Math.floor(minutes / 60)
    const mm = minutes % 60

    if (dateType === "Time") {
      const base = value ?? dayjs()
      const next = base.hour(hh).minute(mm).second(0).millisecond(0)
      commitSingle(next, true)
      return
    }

    const base = value ?? dayjs().startOf("day")
    const next = base.hour(hh).minute(mm).second(0).millisecond(0)
    onChange?.(normalizeSingleValue(next))
    closePopover()
  }

  const onCellActivate = (fn: () => void) => fn()

  const onCellKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    activate: () => void,
    move?: (key: string) => void,
  ) => {
    // * 셀 키보드 조작(Enter/Space 활성화, 방향키 이동) 공통 처리
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      activate()
      return
    }
    if (!move) return
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"]
    if (keys.includes(e.key)) {
      e.preventDefault()
      move(e.key)
    }
  }

  const renderDayPanel = (view: dayjs.Dayjs, which: "left" | "right") => {
    // * 일 단위 달력 패널 렌더링(로빙 포커스 포함)
    const cells = buildMonthCells(view, weekStartsOn)
    const monthStart = view.startOf("month")

    const moveFocusDay = (current: dayjs.Dayjs, key: string) => {
      // * 방향키/홈/엔드로 날짜 포커스를 이동하고 월 경계면 view를 갱신
      const step =
        key === "ArrowLeft"
          ? -1
          : key === "ArrowRight"
            ? 1
            : key === "ArrowUp"
              ? -7
              : key === "ArrowDown"
                ? 7
                : 0

      let next = current
      if (key === "Home") next = current.startOf("month")
      else if (key === "End") next = current.endOf("month")
      else next = current.add(step, "day")

      setFocusedDay(next.startOf("day"))

      const nextMonth = next.startOf("month")
      if (!nextMonth.isSame(view, "month")) {
        if (which === "left") setLeftView(nextMonth)
        else setRightView(nextMonth)
      }
    }

    return (
      <CalendarPanel role="group" aria-label="calendar-panel">
        <CalendarHeader justify="space-between" align="center">
          <IconButton
            icon="ArrowLeft"
            size={16}
            variant="contained"
            iconProps={{ color: "grayscale.500" }}
            disabled={isInteractionBlocked}
            onClick={() => moveView(which, -1)}
          />
          <Typography text={headerTitle(monthStart)} variant="h3" />
          <IconButton
            icon="ArrowRight"
            size={16}
            variant="contained"
            iconProps={{ color: "grayscale.500" }}
            disabled={isInteractionBlocked}
            onClick={() => moveView(which, 1)}
          />
        </CalendarHeader>

        <WeekRow role="row">
          {weekdayLabels.map((w, idx) => {
            const isWeekend = idx === 0 || idx === 6
            return (
              <Weekday key={w} role="columnheader">
                <Typography
                  text={w}
                  variant="b3Regular"
                  color={isWeekend ? "grayscale.300" : undefined}
                />
              </Weekday>
            )
          })}
        </WeekRow>

        <DayGrid role="grid" aria-label="day-grid">
          {cells.map((d, i) => {
            if (!d)
              return (
                <DayCell key={`e-${i}`} type="button" $empty $disabled aria-hidden tabIndex={-1} />
              )

            const disabledCell = isOutOfRange(d.startOf("day"))
            const today = d.isSame(todayRef.current, "day")
            const selected = isSelectedDay(d)
            const start = isRangeStartDay(d)
            const end = isRangeEndDay(d)
            const inRange = isInRangeDay(d)
            const isWeekend = d.day() === 0 || d.day() === 6

            const isFocused =
              focusedDay != null ? d.isSame(focusedDay, "day") : today || selected || start || end

            const activate = () => {
              // * 셀 클릭/키보드 활성화 시 선택 처리
              if (disabledCell) return
              selectDay(d, which)
            }

            return (
              <DayCell
                key={d.valueOf()}
                type="button"
                $empty={false}
                $disabled={disabledCell}
                $today={today}
                $selected={selected}
                $rangeStart={start}
                $rangeEnd={end}
                $inRange={inRange}
                $weekend={isWeekend}
                aria-disabled={disabledCell}
                aria-selected={selected || start || end}
                aria-current={today ? "date" : undefined}
                tabIndex={isFocused ? 0 : -1}
                data-testid={`datepicker-day-${d.format("YYYY-MM-DD")}`}
                onClick={activate}
                onFocus={() => setFocusedDay(d.startOf("day"))}
                onKeyDown={(e) => onCellKeyDown(e, activate, (k) => moveFocusDay(d, k))}
              >
                <Typography text={`${d.date()}`} variant="b2Regular" />
              </DayCell>
            )
          })}
        </DayGrid>
      </CalendarPanel>
    )
  }

  const renderMonthPanel = (view: dayjs.Dayjs, which: "left" | "right") => {
    // * 월 단위 패널 렌더링(로빙 포커스 포함)
    const y = view.year()
    const months = Array.from({ length: 12 }, (_, i) => i)

    const moveFocusMonth = (idx: number, key: string) => {
      // * 3열 그리드 기준 월 포커스 이동(경계면은 view 이동으로 처리)
      const next =
        key === "ArrowLeft"
          ? idx - 1
          : key === "ArrowRight"
            ? idx + 1
            : key === "ArrowUp"
              ? idx - 3
              : key === "ArrowDown"
                ? idx + 3
                : key === "Home"
                  ? 0
                  : key === "End"
                    ? 11
                    : idx

      const clamped = Math.max(0, Math.min(11, next))
      setFocusedMonthIndex(clamped)

      if (clamped !== idx) return
      if (key === "ArrowLeft") moveView(which, -1)
      if (key === "ArrowRight") moveView(which, 1)
    }

    return (
      <CalendarPanel role="group" aria-label="month-panel">
        <CalendarHeader justify="space-between" align="center">
          <IconButton
            icon="ArrowLeft"
            size={16}
            variant="contained"
            iconProps={{ color: "grayscale.500" }}
            disabled={isInteractionBlocked}
            onClick={() => moveView(which, -1)}
          />
          <Typography text={`${y}`} variant="h3" />
          <IconButton
            icon="ArrowRight"
            size={16}
            variant="contained"
            iconProps={{ color: "grayscale.500" }}
            disabled={isInteractionBlocked}
            onClick={() => moveView(which, 1)}
          />
        </CalendarHeader>

        <MonthGrid role="grid" aria-label="month-grid">
          {months.map((m) => {
            const d = view.month(m).startOf("month")
            const disabledCell = isOutOfRange(d)

            const selectedSingle = mode === "Single" ? !!value && value.isSame(d, "month") : false
            const rangeStart = isRangeStartMonth(d)
            const rangeEnd = isRangeEndMonth(d)
            const inRange = isInRangeMonth(d)

            const isFocused = focusedMonthIndex === m

            const activate = () => {
              // * 셀 클릭/키보드 활성화 시 선택 처리
              if (disabledCell) return
              selectMonth(m, view)
            }

            return (
              <MonthCell
                key={m}
                type="button"
                $disabled={disabledCell}
                $selected={selectedSingle}
                $inRange={inRange}
                $rangeStart={rangeStart}
                $rangeEnd={rangeEnd}
                aria-disabled={disabledCell}
                aria-selected={selectedSingle || rangeStart || rangeEnd}
                tabIndex={isFocused ? 0 : -1}
                data-testid={`datepicker-month-${y}-${pad2(m + 1)}`}
                onClick={activate}
                onFocus={() => setFocusedMonthIndex(m)}
                onKeyDown={(e) => onCellKeyDown(e, activate, (k) => moveFocusMonth(m, k))}
              >
                <Typography text={`${m + 1}월`} variant="b2Regular" />
              </MonthCell>
            )
          })}
        </MonthGrid>
      </CalendarPanel>
    )
  }

  const renderYearPanel = (view: dayjs.Dayjs) => {
    // * 12년 단위 연도 패널 렌더링(로빙 포커스 포함)
    const base = view.startOf("year")
    const startYear = base.year() - (base.year() % 12)
    const years = Array.from({ length: 12 }, (_, i) => startYear + i)

    const moveFocusYear = (idx: number, key: string) => {
      // * 3열 그리드 기준 연도 포커스 이동(경계면은 view 이동으로 처리)
      const next =
        key === "ArrowLeft"
          ? idx - 1
          : key === "ArrowRight"
            ? idx + 1
            : key === "ArrowUp"
              ? idx - 3
              : key === "ArrowDown"
                ? idx + 3
                : key === "Home"
                  ? 0
                  : key === "End"
                    ? 11
                    : idx

      if (next < 0) {
        setLeftView((p) => p.add(-12, "year").startOf("year"))
        setFocusedYearIndex(0)
        return
      }
      if (next > 11) {
        setLeftView((p) => p.add(12, "year").startOf("year"))
        setFocusedYearIndex(11)
        return
      }
      setFocusedYearIndex(next)
    }

    return (
      <CalendarPanel role="group" aria-label="year-panel">
        <CalendarHeader justify="space-between" align="center">
          <IconButton
            icon="ArrowLeft"
            size={16}
            variant="contained"
            iconProps={{ color: "grayscale.500" }}
            disabled={isInteractionBlocked}
            onClick={() => setLeftView((p) => p.add(-12, "year").startOf("year"))}
          />
          <Typography text={`${startYear} - ${startYear + 11}`} variant="h3" />
          <IconButton
            icon="ArrowRight"
            size={16}
            variant="contained"
            iconProps={{ color: "grayscale.500" }}
            disabled={isInteractionBlocked}
            onClick={() => setLeftView((p) => p.add(12, "year").startOf("year"))}
          />
        </CalendarHeader>

        <YearGrid role="grid" aria-label="year-grid">
          {years.map((y, idx) => {
            const d = dayjs().year(y).startOf("year")
            const disabledCell = isOutOfRange(d)

            const selectedSingle = mode === "Single" ? !!value && value.isSame(d, "year") : false
            const rangeStart = isRangeStartYear(d)
            const rangeEnd = isRangeEndYear(d)
            const inRange = isInRangeYear(d)

            const isFocused = focusedYearIndex === idx

            const activate = () => {
              // * 셀 클릭/키보드 활성화 시 선택 처리
              if (disabledCell) return
              selectYear(y, startYear)
            }

            return (
              <YearCell
                key={y}
                type="button"
                $disabled={disabledCell}
                $selected={selectedSingle}
                $inRange={inRange}
                $rangeStart={rangeStart}
                $rangeEnd={rangeEnd}
                aria-disabled={disabledCell}
                aria-selected={selectedSingle || rangeStart || rangeEnd}
                tabIndex={isFocused ? 0 : -1}
                data-testid={`datepicker-year-${y}`}
                onClick={activate}
                onFocus={() => setFocusedYearIndex(idx)}
                onKeyDown={(e) => onCellKeyDown(e, activate, (k) => moveFocusYear(idx, k))}
              >
                <Typography text={`${y}`} variant="b2Regular" />
              </YearCell>
            )
          })}
        </YearGrid>
      </CalendarPanel>
    )
  }

  const renderTimePanel = (standalone?: boolean) => {
    // * Time/DateTime에서 time list 패널을 렌더링(로빙 포커스 포함)
    if (!(dateType === "Time" || dateType === "DateTime")) return null

    const selectedMinutesSingle = (() => {
      if (!value) return null
      return value.hour() * 60 + value.minute()
    })()

    const moveFocusTime = (idx: number, key: string) => {
      const max = timeItems.length - 1
      const next =
        key === "ArrowUp"
          ? idx - 1
          : key === "ArrowDown"
            ? idx + 1
            : key === "Home"
              ? 0
              : key === "End"
                ? max
                : idx
      setFocusedTimeIndex(Math.max(0, Math.min(max, next)))
    }

    return (
      <TimePanel $standalone={standalone} role="listbox" aria-label="time-list">
        <TimeList>
          {timeItems.map((t, idx) => {
            const activeSingle = mode === "Single" && selectedMinutesSingle === t.minutes
            const rangeStart = mode === "Range" && isRangeStartTime(t.minutes)
            const rangeEnd = mode === "Range" && isRangeEndTime(t.minutes)
            const inRange = mode === "Range" && isInRangeTime(t.minutes)

            const isFocused = focusedTimeIndex === idx

            const activate = () => selectTime(t.minutes, idx)

            return (
              <TimeItem
                key={t.minutes}
                type="button"
                $active={activeSingle}
                $inRange={inRange}
                $rangeStart={rangeStart}
                $rangeEnd={rangeEnd}
                role="option"
                aria-selected={activeSingle || rangeStart || rangeEnd}
                tabIndex={isFocused ? 0 : -1}
                data-testid={`datepicker-time-${t.label}`}
                onClick={activate}
                onFocus={() => setFocusedTimeIndex(idx)}
                onKeyDown={(e) => onCellKeyDown(e, activate, (k) => moveFocusTime(idx, k))}
              >
                <Typography text={t.label} variant="h3" />
              </TimeItem>
            )
          })}
        </TimeList>
      </TimePanel>
    )
  }

  const renderPanels = () => {
    // * dateType/mode/panels 조합에 맞는 패널 구성을 렌더링
    if (dateType === "Time") return renderTimePanel(true)

    if (dateType === "Year") {
      return <CalendarGrid $panels={1}>{renderYearPanel(leftView)}</CalendarGrid>
    }

    if (dateType === "Month") {
      return (
        <CalendarGrid $panels={mode === "Range" ? panels : 1}>
          {renderMonthPanel(leftView, "left")}
          {mode === "Range" && panels === 2 && renderMonthPanel(rightView, "right")}
        </CalendarGrid>
      )
    }

    return (
      <CalendarGrid $panels={mode === "Range" ? panels : 1}>
        {renderDayPanel(leftView, "left")}
        {mode === "Range" && panels === 2 && renderDayPanel(rightView, "right")}
      </CalendarGrid>
    )
  }

  const popperHeight = useMemo(() => {
    // * 단일 모드에서 DateTime/Time의 고정 높이를 적용
    if (mode === "Single") {
      if (dateType === "DateTime") return "520px"
      if (dateType === "Time") return "320px"
    }
    return "max-content"
  }, [dateType, mode])

  const presetApi: DatePickerPresetApi = useMemo(
    () => ({
      mode,
      dateType,
      value: value ?? null,
      rangeValue: mode === "Range" ? draftRange : [null, null],
      isOpen,
      open: openPopover,
      close: closePopover,
      setSingle: (next, options) => {
        // * preset에서 단일 값을 설정(옵션에 따라 close 제어)
        const closeNow = options?.close ?? true
        if (next == null) {
          if (isInteractionBlocked) return
          onChange?.(null)
          setInputText("")
          if (closeNow) closePopover()
          return
        }
        commitSingle(next, closeNow)
      },
      setRange: (from, to, options) => {
        // * preset에서 범위를 설정(옵션에 따라 close 제어)
        if (isInteractionBlocked) return
        const closeNow = options?.close ?? false
        if (!from && !to) {
          applyDraftRange(null, null)
          setActiveRangePart("start")
          if (closeNow) closePopover()
          return
        }
        if (!from || !to) {
          applyDraftRange(from ?? null, to ?? null)
          setActiveRangePart("end")
          if (closeNow) closePopover()
          return
        }
        const [a, b] = normalizeRangeOrder(from, to, unit)
        const [na, nb] = normalizeRangeValue(a, b)
        if (isOutOfRange(na) || isOutOfRange(nb)) return
        applyDraftRange(na, nb)
        setActiveRangePart("end")
        if (closeNow) closePopover()
      },
    }),
    [
      mode,
      dateType,
      value,
      draftRange,
      isOpen,
      isInteractionBlocked,
      unit,
      onChange,
      onRangeChange,
    ],
  )

  const resolvedPresetNode =
    typeof presetNode === "function"
      ? (presetNode as (api: DatePickerPresetApi) => ReactNode)(presetApi)
      : presetNode

  const popperBody = (
    <Popper
      open={isOpen}
      anchorRef={anchorRef}
      placement={placement}
      offsetY={6}
      width="max-content"
      height={popperHeight}
      onClose={closePopover}
      aria-modal={false}
      aria-label="date-picker"
    >
      <PopoverInner>
        {!hiddenPresetButtons && resolvedPresetNode != null && (
          <>
            <PresetWrap>{resolvedPresetNode}</PresetWrap>
            <Divider />
          </>
        )}

        <PanelWrap>
          {renderPanels()}
          {dateType === "DateTime" && (
            <>
              <Divider direction="vertical" flexItem />
              {renderTimePanel(false)}
            </>
          )}
        </PanelWrap>

        {mode === "Range" && (
          <>
            <Divider />
            <ActionBar>
              <Flex width="100%" gap={8}>
                <ActionNodeButton
                  type="button"
                  disabled={isInteractionBlocked}
                  onClick={commitRangeCancel}
                  data-testid="datepicker-range-cancel"
                >
                  {cancelNode ?? (
                    <Button width="100%" variant="text" color="normal" text="cancel" />
                  )}
                </ActionNodeButton>

                <ActionNodeButton
                  type="button"
                  disabled={isInteractionBlocked}
                  onClick={commitRangeConfirm}
                  data-testid="datepicker-range-confirm"
                >
                  {confirmNode ?? <Button width="100%" text="ok" />}
                </ActionNodeButton>
              </Flex>
            </ActionBar>
          </>
        )}
      </PopoverInner>
    </Popper>
  )

  const leftIconName = dateType === "Time" ? "Time" : dateType === "DateTime" ? "DateTime" : "Date"

  return (
    <Box {...others}>
      <div ref={anchorRef}>
        <TextField
          size={size}
          variant="outlined"
          label={label}
          required={required}
          labelPlacement={labelPlacement}
          labelProps={labelProps}
          value={inputText}
          placeholder={placeholder ?? getPlaceholder(mode, dateType)}
          disabled={disabled}
          readOnly={readOnly}
          error={error}
          helperText={helperText}
          startIcon={leftIconName as any}
          clearable={clearable}
          onClick={openPopover}
          onFocus={() => {
            // * 포커스 진입 시 interaction 가능할 때 popover를 연다
            if (isInteractionBlocked) return
            setIsActive(true)
            setIsOpen(true)
          }}
          onBlur={handleBlurLocal}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          onClear={handleClear}
        />
      </div>

      {popperBody}
    </Box>
  )
}

const PopoverInner = styled.div`
  width: max-content;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const PresetWrap = styled.div`
  width: auto;
  padding: 12px;
`

const PanelWrap = styled.div`
  display: flex;
  align-items: flex-start;
  width: auto;
  flex: 1;
  min-height: 0;
`

const CalendarGrid = styled.div<CalendarStyleProps>`
  display: grid;
  grid-template-columns: ${({ $panels }) => ($panels === 2 ? "1fr 1fr" : "1fr")};
  gap: 12px;
  width: auto;
  padding: 12px;
  min-height: 0;
`

const CalendarPanel = styled.div`
  width: auto;
  min-width: 240px;
`

const CalendarHeader = styled(Flex)`
  margin-bottom: 12px;
`

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
`

const Weekday = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`

const DayCell = styled.button<{
  $empty?: boolean
  $disabled?: boolean
  $today?: boolean
  $selected?: boolean
  $inRange?: boolean
  $rangeStart?: boolean
  $rangeEnd?: boolean
  $weekend?: boolean
}>`
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius[4]};
  user-select: none;
  border: none;
  background: transparent;

  ${({ $empty }) =>
    $empty &&
    `
      pointer-events: none;
      background: transparent;
    `}

  color: ${({ theme, $disabled, $weekend, $empty }) => {
    if ($empty) return "transparent"
    if ($disabled) return theme.colors.text.disabled
    if ($weekend) return theme.colors.grayscale[300]
    return theme.colors.text.tertiary
  }};

  & > * {
    color: inherit !important;
  }

  cursor: ${({ $disabled, $empty }) =>
    $empty ? "default" : $disabled ? "not-allowed" : "pointer"};

  ${({ theme, $today, $disabled, $empty }) =>
    $today &&
    !$disabled &&
    !$empty &&
    `
      border: 1px solid ${theme.colors.primary[400]};
    `}

  ${({ theme, $inRange, $empty, $selected, $rangeStart, $rangeEnd }) =>
    $inRange &&
    !$empty &&
    !$selected &&
    !$rangeStart &&
    !$rangeEnd &&
    `
      background-color: ${theme.colors.primary[50]};
      color: ${theme.colors.primary[400]};
    `}

  ${({ theme, $selected, $empty }) =>
    $selected &&
    !$empty &&
    `
      font-weight: 700;
      color: ${theme.colors.grayscale.white};
      background-color: ${theme.colors.primary[400]};
    `}

  ${({ theme, $rangeStart, $empty }) =>
    $rangeStart &&
    !$empty &&
    `
      font-weight: 700;
      color: ${theme.colors.grayscale.white};
      background-color: ${theme.colors.primary[400]};
    `}

  ${({ theme, $rangeEnd, $empty }) =>
    $rangeEnd &&
    !$empty &&
    `
      font-weight: 700;
      color: ${theme.colors.grayscale.white};
      background-color: ${theme.colors.primary[400]};
    `}

  &:hover {
    ${({ theme, $disabled, $empty, $selected, $rangeStart, $rangeEnd }) =>
      !$disabled &&
      !$empty &&
      !$selected &&
      !$rangeStart &&
      !$rangeEnd &&
      `
        color: ${theme.colors.primary[300]};
        background-color: ${theme.colors.primary[50]};
      `}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[300]};
    outline-offset: 2px;
  }
`

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`

const MonthCell = styled.button<{
  $disabled?: boolean
  $selected?: boolean
  $inRange?: boolean
  $rangeStart?: boolean
  $rangeEnd?: boolean
}>`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius[4]};
  user-select: none;
  border: none;
  background: transparent;

  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.text.disabled : theme.colors.text.tertiary};

  & > * {
    color: inherit !important;
  }

  ${({ theme, $inRange, $selected, $rangeStart, $rangeEnd }) =>
    $inRange &&
    !$selected &&
    !$rangeStart &&
    !$rangeEnd &&
    `
      background-color: ${theme.colors.primary[50]};
      color: ${theme.colors.primary[400]};
    `}

  ${({ theme, $selected }) =>
    $selected &&
    `
      font-weight: 700;
      color: ${theme.colors.grayscale.white};
      background-color: ${theme.colors.primary[400]};
    `}

  ${({ theme, $rangeStart }) =>
    $rangeStart &&
    `
      font-weight: 700;
      color: ${theme.colors.grayscale.white};
      background-color: ${theme.colors.primary[400]};
    `}

  ${({ theme, $rangeEnd }) =>
    $rangeEnd &&
    `
      font-weight: 700;
      color: ${theme.colors.grayscale.white};
      background-color: ${theme.colors.primary[400]};
    `}

  &:hover {
    ${({ theme, $disabled, $selected, $rangeStart, $rangeEnd }) =>
      !$disabled &&
      !$selected &&
      !$rangeStart &&
      !$rangeEnd &&
      `
        color: ${theme.colors.primary[300]};
        background-color: ${theme.colors.primary[50]};
      `}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[300]};
    outline-offset: 2px;
  }
`

const YearGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`

const YearCell = styled.button<{
  $disabled?: boolean
  $selected?: boolean
  $inRange?: boolean
  $rangeStart?: boolean
  $rangeEnd?: boolean
}>`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius[4]};
  user-select: none;
  border: none;
  background: transparent;

  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.text.disabled : theme.colors.text.tertiary};

  & > * {
    color: inherit !important;
  }

  ${({ theme, $inRange, $selected, $rangeStart, $rangeEnd }) =>
    $inRange &&
    !$selected &&
    !$rangeStart &&
    !$rangeEnd &&
    `
      background-color: ${theme.colors.primary[50]};
      color: ${theme.colors.primary[400]};
    `}

  ${({ theme, $selected }) =>
    $selected &&
    `
      font-weight: 700;
      color: ${theme.colors.grayscale.white};
      background-color: ${theme.colors.primary[400]};
    `}

  ${({ theme, $rangeStart }) =>
    $rangeStart &&
    `
      font-weight: 700;
      color: ${theme.colors.grayscale.white};
      background-color: ${theme.colors.primary[400]};
    `}

  ${({ theme, $rangeEnd }) =>
    $rangeEnd &&
    `
      font-weight: 700;
      color: ${theme.colors.grayscale.white};
      background-color: ${theme.colors.primary[400]};
    `}

  &:hover {
    ${({ theme, $disabled, $selected, $rangeStart, $rangeEnd }) =>
      !$disabled &&
      !$selected &&
      !$rangeStart &&
      !$rangeEnd &&
      `
        color: ${theme.colors.primary[300]};
        background-color: ${theme.colors.primary[50]};
      `}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[300]};
    outline-offset: 2px;
  }
`

const TimePanel = styled.div<{ $standalone?: boolean }>`
  padding: 12px;
  ${({ $standalone }) =>
    $standalone
      ? `
        width: auto;
        min-width: 180px;
      `
      : `
        width: 180px;
        min-width: 180px;
        align-self: flex-start;
      `}
`

const TimeList = styled.div`
  height: 200px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 6px;
`

const TimeItem = styled.button<{
  $active?: boolean
  $inRange?: boolean
  $rangeStart?: boolean
  $rangeEnd?: boolean
}>`
  height: 28px;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: ${({ theme }) => theme.borderRadius[4]};
  cursor: pointer;
  user-select: none;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.tertiary};

  & > * {
    color: inherit !important;
  }

  ${({ theme, $inRange, $active, $rangeStart, $rangeEnd }) =>
    $inRange &&
    !$active &&
    !$rangeStart &&
    !$rangeEnd &&
    `
      background-color: ${theme.colors.primary[50]};
      color: ${theme.colors.primary[400]};
    `}

  ${({ theme, $active }) =>
    $active &&
    `
      font-weight: 700;
      color: ${theme.colors.grayscale.white};
      background-color: ${theme.colors.primary[400]};
    `}

  ${({ theme, $rangeStart }) =>
    $rangeStart &&
    `
      font-weight: 700;
      color: ${theme.colors.grayscale.white};
      background-color: ${theme.colors.primary[400]};
    `}

  ${({ theme, $rangeEnd }) =>
    $rangeEnd &&
    `
      font-weight: 700;
      color: ${theme.colors.grayscale.white};
      background-color: ${theme.colors.primary[400]};
    `}

  &:hover {
    ${({ theme, $active, $rangeStart, $rangeEnd }) =>
      !$active &&
      !$rangeStart &&
      !$rangeEnd &&
      `
        background-color: ${theme.colors.primary[50]};
        color: ${theme.colors.primary[300]};
      `}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[300]};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

const ActionBar = styled.div`
  width: auto;
  padding: 12px;
`

const ActionNodeButton = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

export default DatePicker
