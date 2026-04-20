/** @public */
import { useMemo } from "react"
import type { HTMLAttributes, ReactNode } from "react"
import { useTheme } from "styled-components"
import type { BaseMixinProps } from "../../tokens/baseMixin"
import { styled } from "../../tokens/customStyled"
import Flex from "../Flex/Flex"
import { Typography } from "../Typography/Typography"
import IconButton from "../IconButton/IconButton"
import { clamp } from "../Table/@utils/table"
import type { IconName } from "../Icon/icon-types"/** @public */
/** @public */


export type PaginationType = "Table" | "Basic"

type PaginationIcons = Partial<{
  prev: IconName
  next: IconName
  first: IconName
  last: IconName
}>

type PaginationBaseProps = BaseMixinProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof BaseMixinProps> & {
    disabled?: boolean
    icons?: PaginationIcons
  }

type TablePaginationProps = PaginationBaseProps & {
  type: "Table"
  count?: number
  page?: number
  onPageChange?: (page: number) => void
  labelDisplayedRows?: (from: number, to: number, count: number) => ReactNode
}

type BasicPaginationProps = PaginationBaseProps & {
  type: "Basic"
  count?: number
  page?: number
  onPageChange?: (page: number) => void
  pageCount?: number
  siblingCount?: number
  boundaryCount?: number
  hidePrevNextButtons?: boolean
  hideFirstLastButtons?: boolean
  showFirstLastButtons?: boolean
  showPrevNextButtons?: boolean
}/** @public */
/** @public */


export type PaginationProps = TablePaginationProps | BasicPaginationProps

type BasicItem = number | "start-ellipsis" | "end-ellipsis"

// * start~end 구간의 연속 숫자 배열 생성
const range = (start: number, end: number): number[] => {
  const out: number[] = []
  for (let i = start; i <= end; i += 1) out.push(i)
  return out
}

// * sibling/boundary 규칙으로 Basic 타입의 페이지 아이템(ellipsis 포함)을 계산
const getBasicItems = (
  page: number,
  count: number,
  siblingCount: number,
  boundaryCount: number,
): BasicItem[] => {
  const startPages = range(1, Math.min(boundaryCount, count))
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count)

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  )
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : count - 1,
  )

  const items: BasicItem[] = []

  items.push(...startPages)

  if (siblingsStart > boundaryCount + 2) items.push("start-ellipsis")
  else if (boundaryCount + 1 < count - boundaryCount) items.push(boundaryCount + 1)

  items.push(...range(siblingsStart, siblingsEnd))

  if (siblingsEnd < count - boundaryCount - 1) items.push("end-ellipsis")
  else if (count - boundaryCount > boundaryCount) items.push(count - boundaryCount)

  items.push(...endPages)

  // * 연속으로 중복된 숫자 제거 (start/end 경계에서 발생 가능)
  const dedup: BasicItem[] = []
  for (const it of items) {
    const prev = dedup[dedup.length - 1]
    if (typeof it === "number" && typeof prev === "number" && it === prev) continue
    dedup.push(it)
  }

  return dedup
}
/**---------------------------------------------------------------------------/
 *
 * ! Pagination
 *
 * * Table/Basic 두 가지 타입의 페이지네이션 UI를 제공하는 컴포넌트
 * * Table 타입은 “from–to of count” 표시 + prev/next 이동을 제공
 * * Basic 타입은 숫자 버튼 + ellipsis(start/end) + prev/next/first/last 아이콘 버튼을 제공
 * * page/pageCount/count 입력을 안전하게 보정(clamp)하여 범위를 벗어난 값도 안정적으로 렌더링
 * * disabled 상태를 지원하며, 이동 불가(canPrev/canNext) 조건에서는 네비게이션을 차단
 *
 * * 동작 규칙
 *   * 주요 분기 조건 및 처리 우선순위
 *     * type === "Table" 이면 Table 렌더링만 수행
 *     * type === "Basic" 이면 Basic 렌더링만 수행
 *     * Basic 타입에서 pageCount prop이 유효하면(pageCount > 0) 이를 최우선으로 사용
 *     * pageCount가 없으면 count 기반으로 페이지 수를 계산(기본 10개 단위)
 *     * page는 1~computedPageCount 범위로 clamp하여 safePage로 사용
 *   * 이벤트 처리 방식
 *     * onPageChange: 아이콘(prev/next/first/last) 및 숫자 버튼 클릭 시 목표 page를 전달
 *     * ellipsis 아이템은 버튼이 아니며 클릭 이벤트 없음(표시 전용)
 *   * disabled 상태에서 차단되는 동작
 *     * disabled === true 이면 모든 버튼(PageButton/IconButton) 비활성 처리
 *     * canPrev/canNext가 false이면 해당 네비게이션 버튼 비활성 처리
 *
 * * 레이아웃/스타일 관련 규칙
 *   * 공통: Flex 기반 수평 정렬, width는 "fit-content" 중심
 *   * Table 타입
 *     * displayedRows(문구) + prev/next IconButton 2개 구성
 *   * Basic 타입
 *     * siblingCount/boundaryCount 규칙으로 페이지 아이템을 계산(getBasicItems)
 *     * start-ellipsis/end-ellipsis는 "…" 텍스트로 표시
 *     * PageButton은 $selected에 따라 배경/타이포 variant를 변경
 *     * show/hide 옵션으로 prev/next 및 first/last 노출 제어
 *   * 아이콘 커스터마이즈
 *     * icons(prev/next/first/last) 제공 시 해당 아이콘 사용, 없으면 기본 아이콘 fallback 사용
 *
 * * 데이터 처리 규칙
 *   * 입력 props 계약(필수/선택)
 *     * type: 필수("Table" | "Basic")
 *     * disabled: 옵션(기본 false)
 *     * Table 관련:
 *       * count/page/onPageChange/labelDisplayedRows(옵션)
 *     * Basic 관련:
 *       * pageCount(옵션, 우선 적용)
 *       * siblingCount/boundaryCount(기본 1)
 *       * hidePrevNextButtons/hideFirstLastButtons, showPrevNextButtons(기본 true), showFirstLastButtons(기본 false)
 *     * icons: 네비게이션 아이콘 커스터마이즈(옵션)
 *   * 내부 계산 로직 요약
 *     * safeCount: count를 0 이상으로 보정
 *     * computedPageCount:
 *       * Basic에서는 pageCount 우선, 없으면 safeCount/10으로 계산(최소 1)
 *       * Table에서는 safeCount/10으로 계산(최소 1)
 *     * safePage: page를 1~computedPageCount로 clamp
 *     * Table from/to:
 *       * (safePage-1)*10+1 ~ min(count, safePage*10)
 *     * displayedRows:
 *       * labelDisplayedRows 제공 시 우선 사용, 없으면 기본 문자열 생성
 *     * basicItems:
 *       * getBasicItems로 boundary/sibling 규칙에 따라 숫자/ellipsis 시퀀스 생성 + 중복 숫자 제거
 *   * 클라이언트 제어 컴포넌트 (onPageChange 콜백으로 외부 상태 갱신)
 *
 * @module Pagination
 * Table/Basic 타입을 지원하는 공통 페이지네이션 컴포넌트
 *
 * @usage
 * <Pagination type="Table" count={120} page={1} onPageChange={(p) => {}} />
 * <Pagination type="Basic" page={3} pageCount={20} onPageChange={(p) => {}} />
 *
/---------------------------------------------------------------------------**/

const Pagination = (props: PaginationProps) => {
  const theme = useTheme()
  const { type, disabled = false, icons, ...baseProps } = props

  // * 기본 아이콘 fallback 구성
  const iconPrev = icons?.prev ?? "ArrowLeft"
  const iconNext = icons?.next ?? "ArrowRight"
  const iconFirst = icons?.first ?? "FirstPageArrow"
  const iconLast = icons?.last ?? "LastPageArrow"

  // * count 안전값 보정
  const safeCount = typeof props.count === "number" ? Math.max(0, props.count) : 0

  // * pageCount 우선, 없으면 count 기반으로 페이지 수 계산 (기본 10개 단위)
  const computedPageCount = useMemo(() => {
    if (type === "Basic" && typeof props.pageCount === "number" && props.pageCount > 0) {
      return Math.floor(props.pageCount)
    }
    if (safeCount <= 0) return 1
    return Math.max(1, Math.ceil(safeCount / 10))
  }, [type, props, safeCount])

  // * 입력 page를 1~computedPageCount 범위로 보정
  const safePage = useMemo(() => {
    const p = typeof props.page === "number" ? props.page : 1
    return clamp(p, 1, computedPageCount)
  }, [props.page, computedPageCount])

  // * Table 타입의 from/to 계산 (기본 10개 단위)
  const fromTo = useMemo(() => {
    if (safeCount <= 0) return { from: 0, to: 0 }
    const from = (safePage - 1) * 10 + 1
    const to = Math.min(safeCount, safePage * 10)
    return { from, to }
  }, [safeCount, safePage])

  // * Table 타입 표시 문구 계산 (사용자 formatter 우선)
  const displayedRows = useMemo<ReactNode>(() => {
    if (!safeCount) return "0–0 of 0"
    if (type === "Table" && props.labelDisplayedRows) {
      return props.labelDisplayedRows(fromTo.from, fromTo.to, safeCount)
    }
    return `${fromTo.from}–${fromTo.to} of ${safeCount}`
  }, [type, props, fromTo.from, fromTo.to, safeCount])

  // * Basic 타입 페이지 아이템 계산
  const basicItems = useMemo(() => {
    if (type !== "Basic") return []
    return getBasicItems(
      safePage,
      computedPageCount,
      props.siblingCount ?? 1,
      props.boundaryCount ?? 1,
    )
  }, [type, safePage, computedPageCount, props])

  // * 이전/다음 이동 가능 여부
  const canPrev = safePage > 1
  const canNext = safePage < computedPageCount

  // * Table 타입 렌더링
  const renderTable = () => (
    <Flex align="center" gap={12} width="fit-content">
      {typeof displayedRows === "string" ? (
        <Typography text={displayedRows} variant="b1Bold" color={theme.colors.text.primary} />
      ) : (
        displayedRows
      )}

      <Flex align="center" gap={4}>
        <IconButton
          onClick={() => props.onPageChange?.(safePage - 1)}
          disabled={disabled || !canPrev}
          icon={iconPrev}
        />

        <IconButton
          onClick={() => props.onPageChange?.(safePage + 1)}
          disabled={disabled || !canNext}
          icon={iconNext}
        />
      </Flex>
    </Flex>
  )

  // * Basic 타입 렌더링
  const renderBasic = () => {
    if (type !== "Basic") return null

    const showPrevNext = (props.showPrevNextButtons ?? true) && !props.hidePrevNextButtons
    const showFirstLast = (props.showFirstLastButtons ?? false) && !props.hideFirstLastButtons

    return (
      <Flex align="center" gap={6} width="fit-content">
        {showFirstLast ? (
          <IconButton
            disabled={disabled || !canPrev}
            onClick={() => props.onPageChange?.(1)}
            icon={iconFirst}
            size={13}
          />
        ) : null}

        {showPrevNext ? (
          <IconButton
            disabled={disabled || !canPrev}
            onClick={() => props.onPageChange?.(safePage - 1)}
            icon={iconPrev}
            size={13}
          />
        ) : null}

        {basicItems.map((it, idx) => {
          if (it === "start-ellipsis" || it === "end-ellipsis") {
            return (
              <Flex key={`el-${it}-${idx}`} width={20} height={20} align="center" justify="center">
                <Typography variant="b1Medium" color={theme.colors.text.primary} text="…" />
              </Flex>
            )
          }

          const selected = it === safePage

          return (
            <PageButton
              key={`p-${it}`}
              type="button"
              $selected={selected}
              $selectedBg={theme.colors.grayscale[200]}
              $hoverBg={selected ? theme.colors.grayscale[100] : theme.colors.background.default}
              disabled={disabled}
              aria-current={selected ? "page" : undefined}
              onClick={() => props.onPageChange?.(it)}
            >
              <Typography
                variant={selected ? "b1Bold" : "b1Regular"}
                color={selected ? theme.colors.text.primary : theme.colors.text.secondary}
                text={`${it}`}
                sx={{ lineHeight: "1" }}
              />
            </PageButton>
          )
        })}

        {showPrevNext ? (
          <IconButton
            disabled={disabled || !canNext}
            onClick={() => props.onPageChange?.(safePage + 1)}
            icon={iconNext}
            size={13}
          />
        ) : null}

        {showFirstLast ? (
          <IconButton
            onClick={() => props.onPageChange?.(computedPageCount)}
            disabled={disabled || !canNext}
            icon={iconLast}
            size={13}
          />
        ) : null}
      </Flex>
    )
  }

  return (
    <Flex {...baseProps}>
      {type === "Table" ? renderTable() : null}
      {type === "Basic" ? renderBasic() : null}
    </Flex>
  )
}

const PageButton = styled.button<{
  $selected: boolean
  $selectedBg: string
  $hoverBg: string
}>`
  border: none;
  background: ${({ $selected, $selectedBg }) => ($selected ? $selectedBg : "transparent")};
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.borderRadius[6]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.08s ease,
    opacity 0.15s ease;

  &:hover {
    background: ${({ $hoverBg }) => $hoverBg};
  }

  &:active {
    transform: translateY(0.5px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
    transform: none;
  }
`

Pagination.displayName = "Pagination"/** @public */
/** @public */

export default Pagination
