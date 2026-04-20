/** @public */
import type { ReactNode } from "react"
import { BaseMixin, type BaseMixinProps } from "../../tokens/baseMixin"
import { styled } from "../../tokens/customStyled"
import { indeterminateAnimation } from "../../tokens/keyframes"
import { css } from "styled-components"
import { cssValue } from "../../utils/string"/** @public */
/** @public */


export type SkeletonProps = BaseMixinProps & {
  variant?: "text" | "rectangular" | "rounded" | "circular"
  width?: string | number
  height?: string | number
  animation?: "wave" | "none"
  children?: ReactNode
}

type SkeletonItemStyleProps = {
  variant: NonNullable<SkeletonProps["variant"]>
  width?: string | number
  height?: string | number
  animation: NonNullable<SkeletonProps["animation"]>
}
/**---------------------------------------------------------------------------/
 *
 * ! Skeleton
 *
 * * 로딩 상태를 시각적으로 표현하기 위한 placeholder UI 컴포넌트
 * * children 유무에 따라 단독 스켈레톤 또는 기존 콘텐츠를 가린 오버레이 방식으로 렌더링된다
 * * variant에 따라 모양(text/rectangular/rounded/circular)이 달라지며, animation 값으로 wave 효과 적용 여부를 제어한다
 * * 별도 상태 없이 props 기반으로만 동작하며, 외부 훅이나 콜백 호출 없이 표시 전용 역할을 수행한다
 *
 * * 동작 규칙
 *   * 주요 분기 조건 및 처리 우선순위
 *     * children이 존재하면 SkeletonWrapper 내부에 실제 children을 숨김 상태로 렌더링하고, 그 위에 Overlay + SkeletonItem을 덮는 방식으로 표시한다
 *     * children이 없으면 SkeletonItem 단독으로 렌더링된다
 *     * variant가 "text"이고 height가 지정되지 않은 경우에만 기본 높이 1em을 적용한다
 *     * animation이 "wave"일 때만 after pseudo element를 생성해 이동 하이라이트 애니메이션을 적용한다
 *   * 이벤트 처리 방식(onClick, onChange, onDoubleClick 등)
 *     * 자체 이벤트 처리 로직은 없으며, 표시 전용 컴포넌트로 동작한다
 *   * disabled 상태에서 차단되는 동작
 *     * disabled 개념은 없으며, children 존재 여부와 animation/variant props에 따라 렌더링 방식만 달라진다
 *
 * * 레이아웃/스타일 관련 규칙
 *   * SkeletonWrapper는 position: relative, width: 100%를 기준으로 오버레이 배치의 기준 컨테이너 역할을 한다
 *   * ContentWrapper는 visibility: hidden으로 실제 레이아웃 크기는 유지하되 콘텐츠는 보이지 않게 처리한다
 *   * Overlay는 absolute/inset:0으로 children 위를 전부 덮고 pointer-events: none으로 상호작용을 차단하지 않는다
 *   * SkeletonItem은 overflow: hidden과 회색 배경을 사용하며, width/height는 전달값 또는 기본값으로 계산된다
 *   * variant별 모양 규칙:
 *     * circular: 원형 border-radius 50%
 *     * rounded: theme borderRadius[8]
 *     * rectangular: theme borderRadius[0]
 *     * text: theme borderRadius[4] + height 미지정 시 1em
 *   * wave 애니메이션은 좌측 바깥에서 시작하는 40% 너비의 gradient 레이어를 indeterminateAnimation으로 반복 이동시킨다
 *
 * * 데이터 처리 규칙
 *   * 입력 props 계약(필수/선택)
 *     * variant, width, height, animation, children은 모두 선택값이다
 *     * BaseMixinProps를 확장하므로 spacing/size/sx 등 공통 스타일 props를 함께 지원한다
 *   * 내부 계산 로직 요약(보정, fallback, formatter 등)
 *     * width/height는 cssValue 유틸을 통해 number/string 값을 CSS 값으로 변환한다
 *     * children이 있는 경우 width/height fallback은 각각 "100%"로 적용되어 오버레이가 콘텐츠 영역 전체를 덮는다
 *     * children이 없는 경우 height 기본값은 "auto"이며, text variant만 추가 높이 보정 규칙을 가진다
 *   * 서버 제어/클라이언트 제어 여부
 *     * 서버 통신이나 외부 상태 제어 로직은 없으며, props 기반으로 렌더링만 수행하는 클라이언트 표시 컴포넌트이다
 *
 * @module Skeleton
 * 로딩 중 콘텐츠 자리를 시각적으로 대체하거나 기존 레이아웃을 유지한 채
 * 스켈레톤 오버레이를 표시하기 위해 사용하는 placeholder 컴포넌트
 *
 * @usage
 * <Skeleton
 *   {...props}
 * />
 *
/---------------------------------------------------------------------------**/
const Skeleton = ({
  variant = "text",
  width,
  height,
  animation = "wave",
  children,
  ...others
}: SkeletonProps) => {
  if (children) {
    return (
      <SkeletonWrapper {...others} aria-busy>
        <ContentWrapper>{children}</ContentWrapper>

        <Overlay>
          <SkeletonItem
            variant={variant}
            width={width ?? "100%"}
            height={height ?? "100%"}
            animation={animation}
          />
        </Overlay>
      </SkeletonWrapper>
    )
  }

  return (
    <SkeletonItem
      {...others}
      role="status"
      aria-busy
      variant={variant}
      width={width}
      height={height}
      animation={animation}
    />
  )
}

const getVariantCss = (variant: SkeletonProps["variant"], hasHeight: boolean) => {
  switch (variant) {
    case "circular":
      return css`
        border-radius: 50%;
      `
    case "rounded":
      return css`
        border-radius: ${({ theme }) => theme.borderRadius[8]};
      `
    case "rectangular":
      return css`
        border-radius: ${({ theme }) => theme.borderRadius[0]};
      `
    case "text":
    default:
      return css`
        border-radius: ${({ theme }) => theme.borderRadius[4]};
        ${!hasHeight && "height: 1em;"}
      `
  }
}

const SkeletonWrapper = styled.div<BaseMixinProps>`
  position: relative;
  display: block;
  width: 100%;

  ${BaseMixin}
`

const ContentWrapper = styled.div`
  visibility: hidden;
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`

const SkeletonItem = styled.div<SkeletonItemStyleProps & BaseMixinProps>`
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.grayscale[200]};

  width: ${({ width }) => cssValue(width ?? "100%")};
  height: ${({ height }) => cssValue(height ?? "auto")};

  ${({ variant, height }) => getVariantCss(variant, height !== undefined)}

  ${({ animation }) =>
    animation === "wave" &&
    css`
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: -40%;
        height: 100%;
        width: 40%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
        animation: ${indeterminateAnimation} 1.5s infinite linear;
      }
    `}

  ${BaseMixin}
`

Skeleton.displayName = "Skeleton"/** @public */
/** @public */


export default Skeleton
