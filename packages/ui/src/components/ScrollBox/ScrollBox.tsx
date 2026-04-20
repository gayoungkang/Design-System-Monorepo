/** @public */
import type { CSSProperties, ReactNode } from "react"
import { forwardRef } from "react"
import { BaseMixin, type BaseMixinProps } from "../../tokens/baseMixin"
import { styled } from "../../tokens/customStyled"
import { cssValue } from "../../utils/string"/** @public */
/** @public */


export type ScrollBoxProps = BaseMixinProps & {
  children?: ReactNode
  minWidth?: string | number
  minHeight?: string | number
  maxWidth?: string | number
  maxHeight?: string | number
  overflow?: CSSProperties["overflow"]
  overflowX?: CSSProperties["overflowX"]
  overflowY?: CSSProperties["overflowY"]
}

type StyledProps = BaseMixinProps & {
  $minWidth?: string | number
  $minHeight?: string | number
  $maxWidth?: string | number
  $maxHeight?: string | number
  $overflow?: CSSProperties["overflow"]
  $overflowX?: CSSProperties["overflowX"]
  $overflowY?: CSSProperties["overflowY"]
}
/**---------------------------------------------------------------------------/
 *
 * ! ScrollBox
 *
 * * 크기 제약과 overflow 정책을 props로 받아 스크롤 가능한 컨테이너를 구성하는 공용 래퍼 컴포넌트
 * * children을 내부에 그대로 렌더링하며, width/height/min/max/overflow 값을 BaseMixin 기반 스타일과 함께 적용한다
 * * 별도 상태 없이 props만으로 동작하고, forwardRef를 통해 루트 div DOM을 외부에 노출한다
 * * 외부 훅이나 콜백 호출 없이 레이아웃 및 스크롤 제어 역할만 수행한다
 *
 * * 동작 규칙
 *   * 주요 분기 조건 및 처리 우선순위
 *     * width와 height는 기본값으로 "100%"를 사용한다
 *     * minWidth/minHeight는 기본값 "initial", maxWidth는 "100%", maxHeight는 "none"을 사용한다
 *     * overflow 기본값은 "auto"이며, overflowX/overflowY가 지정되면 각 축 값이 overflow보다 우선 적용된다
 *     * children은 별도 가공 없이 Container 내부에 그대로 렌더링된다
 *   * 이벤트 처리 방식(onClick, onChange, onDoubleClick 등)
 *     * 자체 이벤트 처리 로직은 없으며, 전달된 DOM 이벤트 props가 있다면 BaseMixin/기본 div props 경로로 위임된다
 *   * disabled 상태에서 차단되는 동작
 *     * disabled 개념은 없으며, overflow 관련 props 조합에 따라 스크롤 허용 범위만 달라진다
 *
 * * 레이아웃/스타일 관련 규칙
 *   * Container는 box-sizing: border-box를 고정 적용한다
 *   * width/height/min-width/min-height/max-width/max-height는 cssValue 유틸을 통해 숫자/문자열 값을 CSS 크기 값으로 변환해 적용한다
 *   * overflow는 전체 기본 정책으로 적용되고, overflow-x/overflow-y는 개별 축 제어값이 있으면 이를 우선 사용한다
 *   * BaseMixin을 적용해 spacing/size/sx/backgroundColor 등 공통 스타일 props를 함께 처리한다
 *
 * * 데이터 처리 규칙
 *   * 입력 props 계약(필수/선택)
 *     * children, minWidth, minHeight, maxWidth, maxHeight, overflow, overflowX, overflowY는 모두 선택값이다
 *     * BaseMixinProps를 확장하므로 width, height, p/m/sx 등 공통 스타일 props도 함께 전달할 수 있다
 *   * 내부 계산 로직 요약(보정, fallback, formatter 등)
 *     * width/height 및 min/max 크기 값은 props 기본값을 먼저 설정한 뒤 cssValue로 최종 CSS 값으로 변환한다
 *     * overflowX/overflowY는 각 축 개별값이 없을 때 overflow 값을 fallback으로 사용하고, overflow도 없으면 "auto"를 사용한다
 *   * 서버 제어/클라이언트 제어 여부
 *     * 서버 통신이나 외부 데이터 제어 로직은 없으며, props 기반으로 레이아웃과 스크롤만 제어하는 클라이언트 UI 래퍼 컴포넌트이다
 *
 * @module ScrollBox
 * 스크롤 가능한 영역을 공통 규칙으로 감싸기 위해 사용하며,
 * 크기 제한과 축별 overflow 정책을 일관된 방식으로 적용하는 컨테이너 컴포넌트
 *
 * @usage
 * <ScrollBox
 *   {...props}
 * />
 *
/---------------------------------------------------------------------------**/
const ScrollBox = forwardRef<HTMLDivElement, ScrollBoxProps>(
  (
    {
      children,
      width = "100%",
      height = "100%",
      minWidth = "initial",
      minHeight = "initial",
      maxWidth = "100%",
      maxHeight = "none",
      overflow = "auto",
      overflowX,
      overflowY,
      ...others
    },
    ref,
  ) => {
    return (
      <Container
        ref={ref}
        width={width}
        height={height}
        $minWidth={minWidth}
        $minHeight={minHeight}
        $maxWidth={maxWidth}
        $maxHeight={maxHeight}
        $overflow={overflow}
        $overflowX={overflowX}
        $overflowY={overflowY}
        {...others}
      >
        {children}
      </Container>
    )
  },
)

const Container = styled.div<StyledProps>`
  ${BaseMixin}
  box-sizing: border-box;

  width: ${({ width }) => cssValue(width ?? "100%")};
  height: ${({ height }) => cssValue(height ?? "100%")};

  min-width: ${({ $minWidth }) => cssValue($minWidth ?? "initial")};
  min-height: ${({ $minHeight }) => cssValue($minHeight ?? "initial")};

  max-width: ${({ $maxWidth }) => cssValue($maxWidth ?? "100%")};
  max-height: ${({ $maxHeight }) => cssValue($maxHeight ?? "none")};

  overflow: ${({ $overflow }) => $overflow ?? "auto"};
  overflow-x: ${({ $overflowX, $overflow }) => $overflowX ?? $overflow ?? "auto"};
  overflow-y: ${({ $overflowY, $overflow }) => $overflowY ?? $overflow ?? "auto"};
`

ScrollBox.displayName = "ScrollBox"/** @public */
/** @public */


export default ScrollBox
