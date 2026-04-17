import type { HTMLAttributes } from "react"
import { BaseMixin, type BaseMixinProps } from "../../tokens/baseMixin"
import { styled } from "../../tokens/customStyled"

const toCssUnit = (value?: number | string) => {
  if (value === undefined) return undefined
  return typeof value === "number" ? `${value}px` : value
}/** @public */


export type GridProps = BaseMixinProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof BaseMixinProps> & {
    columns: string
    rows?: string
    gap?: number | string
    rowGap?: number | string
    columnGap?: number | string
    inline?: boolean
  }
/**---------------------------------------------------------------------------/
 *
 * ! Grid
 *
 * * CSS Grid 기반 레이아웃을 제공하는 베이스 컴포넌트
 * * columns(gridTemplateColumns) 문자열을 통해 컬럼 구조를 직접 제어
 * * rows(gridTemplateRows) 문자열을 통해 행 구조를 직접 제어할 수 있음
 * * gap / rowGap / columnGap 옵션으로 전체/축별 간격 설정 지원
 * * inline 옵션으로 display: inline-grid 전환 지원
 * * BaseMixin 기반 외부 스타일 확장 지원
 *
 * * 주요 로직
 *   * Grid():
 *     * columns/rows/gap/rowGap/columnGap/inline 값을 Root styled 컴포넌트에 전달함
 *     * 나머지 HTML div 속성은 그대로 전달하여 className, data-testid, onClick 등을 지원함
 *   * toCssUnit():
 *     * number는 px 문자열로 변환하고 string은 그대로 반환함
 *     * undefined는 스타일 미지정 상태를 유지함
 *   * Root:
 *     * display를 grid 또는 inline-grid로 결정함
 *     * grid-template-columns / rows 및 gap 관련 스타일을 선언적으로 적용함
 *     * BaseMixin을 통해 spacing, size, sx 등 공통 스타일 props를 함께 처리함
 *
 * @module Grid
 * CSS Grid 레이아웃을 간단하고 일관되게 사용할 수 있도록 래핑한 베이스 컴포넌트입니다.
 *
 * @usage
 * <Grid columns="1fr 1fr" gap={12} />
 * <Grid columns="200px 1fr 1fr" rowGap={12} columnGap={20} />
 * <Grid columns="repeat(3, minmax(0, 1fr))" rows="auto auto" inline />
 *
/---------------------------------------------------------------------------**/

const Grid = ({ columns, rows, gap, rowGap, columnGap, inline = false, ...props }: GridProps) => {
  return (
    <Root
      {...props}
      $columns={columns}
      $rows={rows}
      $gap={gap}
      $rowGap={rowGap}
      $columnGap={columnGap}
      $inline={inline}
    />
  )
}

const Root = styled.div<
  BaseMixinProps & {
    $columns: string
    $rows?: string
    $gap?: number | string
    $rowGap?: number | string
    $columnGap?: number | string
    $inline: boolean
  }
>`
  display: ${({ $inline }) => ($inline ? "inline-grid" : "grid")};
  grid-template-columns: ${({ $columns }) => $columns};
  grid-template-rows: ${({ $rows }) => $rows ?? "none"};
  gap: ${({ $gap }) => toCssUnit($gap) ?? "0px"};
  row-gap: ${({ $rowGap }) => toCssUnit($rowGap) ?? "normal"};
  column-gap: ${({ $columnGap }) => toCssUnit($columnGap) ?? "normal"};
  ${BaseMixin};
`

export default Grid
