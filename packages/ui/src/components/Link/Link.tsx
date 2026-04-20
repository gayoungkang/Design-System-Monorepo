/** @public */
import { useTheme } from "styled-components"
import type { AnchorHTMLAttributes, MouseEvent as ReactMouseEvent, ReactNode } from "react"
import { BaseMixin, type BaseMixinProps } from "../../tokens/baseMixin"
import { styled } from "../../tokens/customStyled"
import { Typography } from "../Typography/Typography"
import type { TypographyProps } from "../Typography/Typography"/** @public */
/** @public */


export type LinkProps = BaseMixinProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseMixinProps> & {
    children: string | ReactNode
    underline?: "none" | "hover" | "always"
    color?: string
    hoverColor?: string
    disabled?: boolean
    typographyProps?: Partial<Omit<TypographyProps, "text" | "variant" | "color">>
  }
/**---------------------------------------------------------------------------/
 *
 * ! Link
 *
 * * 텍스트 또는 커스텀 노드를 감싸는 링크(anchor) 컴포넌트
 * * underline 옵션과 color/disabled 상태에 따라 시각적·동작적 링크 규칙을 제어
 * * 문자열 children은 Typography로 래핑하여 디자인 시스템 타이포 규칙을 유지
 * * BaseMixinProps를 통해 spacing/size/sx 등 공통 스타일 확장을 지원
 *
 * * 동작 규칙
 *   * 주요 분기 조건
 *     * disabled === true 인 경우 기본 링크 동작(href 이동)을 차단
 *     * disabled === false 인 경우에만 onClick 핸들러 위임
 *   * 이벤트 처리 방식
 *     * onClick: disabled가 아닐 때만 실행
 *     * disabled 상태에서 click 발생 시 preventDefault 처리
 *   * disabled 상태에서 차단되는 동작
 *     * href 이동 불가
 *     * hover 시 underline/색상 변화 없음
 *
 * * 레이아웃/스타일 관련 규칙
 *   * underline 옵션
 *     * "always": 항상 underline 표시
 *     * "hover": hover 시에만 underline 표시
 *     * "none": underline 미표시
 *   * hover 시 기본 컬러는 theme.colors.primary[400]으로 전환
 *   * disabled 상태에서는 text.disabled 컬러 + not-allowed 커서 적용
 *   * Typography 래핑 시 lineHeight를 inherit하여 레이아웃 깨짐 방지
 *   * BaseMixin을 통해 외부 spacing/sx 스타일을 루트 anchor에 병합
 *
 * * 데이터 처리 규칙
 *   * 입력 props 계약
 *     * children: string | ReactNode (string일 경우 Typography로 자동 래핑)
 *     * underline: "none" | "hover" | "always", 기본 "always"
 *     * color: 링크 기본 색상, 기본 text.primary
 *     * hoverColor: hover 시 색상, 기본 primary[400]
 *     * disabled: 링크 비활성화 여부
 *     * typographyProps: children이 string일 때 text/variant/color를 제외한 Typography 옵션 확장
 *   * 내부 처리 로직
 *     * disabled 상태에 따라 href를 undefined로 처리하여 브라우저 기본 이동 차단
 *   * 클라이언트 제어 컴포넌트 (서버 제어 없음)
 *
 * @module Link
 * 디자인 시스템 규칙을 따르는 텍스트 링크 컴포넌트
 *
 * @usage
 * <Link href="/detail" underline="hover">
 *   상세보기
 * </Link>
 *
/---------------------------------------------------------------------------**/

const Link = ({
  children,
  underline = "always",
  color,
  hoverColor,
  disabled = false,
  onClick,
  href,
  typographyProps,
  tabIndex,
  ...others
}: LinkProps) => {
  const theme = useTheme()

  const resolvedColor = color ?? theme.colors.text.primary
  const resolvedHoverColor = hoverColor ?? theme.colors.primary[400]

  // * disabled 상태일 때 기본 링크 동작을 막고, 활성 상태일 때만 onClick을 위임
  const handleClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault()
      return
    }

    onClick?.(e)
  }

  return (
    <StyledLink
      href={disabled ? undefined : href}
      onClick={handleClick}
      $underline={underline}
      $disabled={disabled}
      $color={resolvedColor}
      $hoverColor={resolvedHoverColor}
      aria-disabled={disabled ? "true" : undefined}
      tabIndex={disabled ? -1 : tabIndex}
      {...others}
    >
      {typeof children === "string" ? (
        <Typography
          variant="b1Bold"
          text={children}
          color={disabled ? theme.colors.text.disabled : resolvedColor}
          sx={{ lineHeight: "inherit" }}
          {...typographyProps}
        />
      ) : (
        children
      )}
    </StyledLink>
  )
}

const StyledLink = styled.a<
  BaseMixinProps & {
    $underline: "none" | "hover" | "always"
    $disabled: boolean
    $color: string
    $hoverColor: string
  }
>`
  ${BaseMixin};
  display: inline;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  color: ${({ theme, $disabled, $color }) => ($disabled ? theme.colors.text.disabled : $color)};
  text-decoration: ${({ $underline }) => ($underline === "always" ? "underline" : "none")};

  &:hover {
    color: ${({ theme, $disabled, $hoverColor }) =>
      $disabled ? theme.colors.text.disabled : $hoverColor};
    text-decoration: ${({ $underline }) => ($underline === "hover" ? "underline" : "none")};
  }
`/** @public */
/** @public */


export default Link
