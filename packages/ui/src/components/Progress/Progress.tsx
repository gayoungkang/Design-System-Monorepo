import { theme } from "../../tokens/theme"
import { circularIndeterminate, indeterminateAnimation } from "../../tokens/keyframes"
import type { BaseMixinProps } from "../../tokens/baseMixin"
import { Typography } from "../Typography/Typography"
import Box from "../Box/Box"
import { styled } from "../../tokens/customStyled"

export type ProgressProps = BaseMixinProps & {
  type?: "bar" | "circular"
  variant?: "determinate" | "indeterminate"
  value?: number
  color?: string
  height?: string
  size?: string
  label?: string
  backgroundColor?: string
}
/**---------------------------------------------------------------------------/
 *
 * ! Progress
 *
 * * 진행 상태를 bar 또는 circular 형태로 표현하는 공용 프로그레스 컴포넌트
 * * type과 variant 조합에 따라 determinate/indeterminate 진행 UI를 분기 렌더링한다
 * * value는 0~100 범위로 보정되어 사용되며, determinate일 때만 실제 진행률과 aria-valuenow 및 퍼센트 라벨에 반영된다
 * * 외부 이벤트 훅은 없으며, 전달받은 BaseMixinProps를 루트 래퍼에 그대로 위임해 레이아웃 스타일을 확장할 수 있다
 *
 * * 동작 규칙
 *   * 주요 분기 조건 및 처리 우선순위
 *     * type이 "circular"이면 원형 진행 UI를 렌더링하고, 그 외에는 bar 진행 UI를 렌더링한다
 *     * variant가 "determinate"이면 value 기반 진행률을 표시하고, "indeterminate"이면 애니메이션 기반 진행 상태만 표시한다
 *     * label은 존재하더라도 variant가 "determinate"일 때만 중앙 퍼센트 텍스트로 렌더링된다
 *   * 이벤트 처리 방식(onClick, onChange, onDoubleClick 등)
 *     * 자체 이벤트 처리 로직은 없으며, 표시 전용 컴포넌트로 동작한다
 *   * disabled 상태에서 차단되는 동작
 *     * disabled 개념은 없으며, type/variant/value 조합에 따라 표시 방식만 달라진다
 *
 * * 레이아웃/스타일 관련 규칙
 *   * bar 타입은 Wrapper 내부 Track을 기준으로 진행 막대를 렌더링하며, Track은 relative/overflow hidden 구조를 사용한다
 *   * determinate bar는 width를 safeValue%로 계산하고 width transition으로 변화가 반영된다
 *   * indeterminate bar는 absolute 배치 후 indeterminateAnimation으로 반복 이동한다
 *   * circular 타입은 size를 기준으로 정사각 래퍼와 SVG 크기를 결정한다
 *   * 원형 진행률은 strokeWidth=4 기준으로 radius/circumference/dashOffset을 계산해 표현한다
 *   * determinate circle은 stroke-dashoffset transition으로 값 변화를 표현하고, indeterminate circle은 circularIndeterminate 애니메이션을 반복 적용한다
 *   * 라벨은 bar/circular 모두 CenterLabel을 통해 중앙 절대 배치된다
 *
 * * 데이터 처리 규칙
 *   * 입력 props 계약(필수/선택)
 *     * type, variant, value, color, height, size, label, backgroundColor는 모두 선택값이다
 *     * BaseMixinProps를 함께 지원하여 spacing/size/sx 등 공통 스타일 props를 전달할 수 있다
 *   * 내부 계산 로직 요약(보정, fallback, formatter 등)
 *     * value는 Math.max/Math.min으로 0~100 범위로 보정된 safeValue를 사용한다
 *     * circular 타입에서는 size 문자열을 parseInt로 숫자화한 numericSize를 기준으로 중심 좌표와 반지름을 계산한다
 *     * width 기본값은 bar에서 100%로 동작하고, color/backgroundColor/height/size는 기본 테마값 또는 기본 문자열 값으로 fallback 된다
 *     * label 문자열 자체는 표시 조건에만 사용되고, 실제 렌더링 텍스트는 항상 `${safeValue}%` 형식이다
 *   * 서버 제어/클라이언트 제어 여부
 *     * 서버 통신이나 외부 제어 로직은 없으며, props 기반으로 렌더링만 수행하는 클라이언트 표시 컴포넌트이다
 *
 * @module Progress
 * 진행률 값을 선형 또는 원형 UI로 표시하고,
 * determinate/indeterminate 상태에 따라 실제 진행률 또는 로딩 애니메이션을 시각적으로 제공하는 컴포넌트
 *
 * @usage
 * <Progress
 *   {...props}
 * />
 *
/---------------------------------------------------------------------------**/
const Progress = ({
  type = "bar",
  variant = "indeterminate",
  value = 0,
  color = theme.colors.primary[400],
  backgroundColor = theme.colors.dim.default,
  height = "4px",
  size = "36px",
  label,
  ...others
}: ProgressProps) => {
  const safeValue = Math.max(0, Math.min(100, value))

  if (type === "circular") {
    const numericSize = parseInt(size)
    const strokeWidth = 4
    const radius = (numericSize - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const dashOffset = circumference - (safeValue / 100) * circumference

    return (
      <CircularWrapper
        size={size}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={variant === "determinate" ? safeValue : undefined}
        {...others}
      >
        <svg width={size} height={size}>
          <circle
            cx={numericSize / 2}
            cy={numericSize / 2}
            r={radius}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
          />

          {variant === "indeterminate" ? (
            <IndeterminateCircle
              cx={numericSize / 2}
              cy={numericSize / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
            />
          ) : (
            <DeterminateCircle
              cx={numericSize / 2}
              cy={numericSize / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          )}
        </svg>

        {label && variant === "determinate" && (
          <CenterLabel>
            <Typography text={`${safeValue}%`} variant="b1Regular" />
          </CenterLabel>
        )}
      </CircularWrapper>
    )
  }

  return (
    <Wrapper {...others}>
      {label && variant === "determinate" && (
        <CenterLabel>
          <Typography text={`${safeValue}%`} variant="b1Regular" />
        </CenterLabel>
      )}

      <Track $bg={backgroundColor} $height={height}>
        {variant === "determinate" ? (
          <Bar $color={color} $value={safeValue} />
        ) : (
          <IndeterminateBar $color={color} />
        )}
      </Track>
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  position: relative;
`

const CenterLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const Track = styled.div<{ $bg: string; $height: string }>`
  background-color: ${(props) => props.$bg};
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius[4]};
  overflow: hidden;
  height: ${(props) => props.$height};
  position: relative;
`

const Bar = styled.div<{ $color: string; $value: number }>`
  background-color: ${(props) => props.$color};
  height: 100%;
  width: ${(props) => props.$value}%;
  transition: width 0.4s ease;
`

const IndeterminateBar = styled.div<{ $color: string }>`
  position: absolute;
  height: 100%;
  background-color: ${(props) => props.$color};
  animation: ${indeterminateAnimation} 1.5s infinite ease-in-out;
`

const CircularWrapper = styled.div<{ size: string }>`
  position: relative;
  display: inline-block;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
`

const DeterminateCircle = styled.circle`
  transition: stroke-dashoffset 0.4s ease;
`

const IndeterminateCircle = styled.circle`
  animation: ${circularIndeterminate} 1.4s linear infinite;
`

export default Progress
