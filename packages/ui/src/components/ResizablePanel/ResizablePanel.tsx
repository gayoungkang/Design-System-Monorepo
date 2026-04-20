/** @public */
import { forwardRef, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import { BaseMixin } from "../../tokens/baseMixin"
import type { BaseMixinProps } from "../../tokens/baseMixin"
import { styled } from "../../tokens/customStyled"
import { RESIZABLEPANEL } from "../../types/zindex"
import type { DirectionType } from "../../types/layout"

const SIZE = 8/** @public */
/** @public */


export type ResizablePanelProps = BaseMixinProps & {
  direction?: DirectionType
  minSize?: number
  maxSize?: number
  initialSize?: number

  size?: number
  onResize?: (size: number) => void

  children: ReactNode
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
/**---------------------------------------------------------------------------/
 *
 * ! ResizablePanel
 *
 * * 드래그 가능한 리사이저를 통해 패널의 너비 또는 높이를 조절하는 레이아웃 패널 컴포넌트
 * * direction에 따라 vertical은 width, horizontal은 height를 조절하며, children은 내부 콘텐츠 영역에 그대로 렌더링된다
 * * controlled(size prop 제공)와 uncontrolled(initialSize 기반 내부 state) 두 방식 모두 지원한다
 * * 리사이즈 중 계산된 크기는 minSize~maxSize 범위로 항상 보정되며, 변경 시 onResize 콜백을 호출한다
 *
 * * 동작 규칙
 *   * 주요 분기 조건 및 처리 우선순위
 *     * size prop이 전달되면 controlled 모드로 동작하고, 없으면 internal state를 사용하는 uncontrolled 모드로 동작한다
 *     * 실제 적용 크기(size)는 controlled면 controlledSize, 아니면 internal 값을 사용한다
 *     * uncontrolled 모드에서는 initialSize/minSize/maxSize 변경 시 내부 크기를 clamp 후 재설정한다
 *     * direction이 "vertical"이면 clientX 기준으로 width를 계산하고, 그 외에는 clientY 기준으로 height를 계산한다
 *   * 이벤트 처리 방식(onClick, onChange, onDoubleClick 등)
 *     * 리사이저 영역에서 pointerdown이 발생하면 좌클릭(button===0)일 때만 드래그를 시작한다
 *     * 드래그 중 window pointermove 이벤트로 현재 포인터 위치와 panelRef 기준 rect를 이용해 새 크기를 계산한다
 *     * pointerup 시 window에 등록한 pointermove/pointerup 리스너를 제거해 드래그를 종료한다
 *     * 크기 변경 시 uncontrolled 모드에서는 내부 state를 갱신하고, 모든 모드에서 onResize를 호출한다
 *   * disabled 상태에서 차단되는 동작
 *     * disabled 개념은 없으며, 좌클릭이 아닌 pointerdown은 무시된다
 *
 * * 레이아웃/스타일 관련 규칙
 *   * PanelRoot는 direction에 따라 vertical이면 width=size,height=100%, horizontal이면 height=size,width=100%를 sx로 적용한다
 *   * PanelRoot는 position: relative를 항상 적용해 리사이저를 내부 절대 배치 기준으로 사용한다
 *   * 내부 콘텐츠는 Box(width="100%", height="100%")로 감싸 패널 크기를 그대로 채운다
 *   * Resizer는 absolute + z-index(RESIZABLEPANEL)로 배치되며:
 *     * vertical이면 right:0, width:8px, height:100%, cursor: ew-resize
 *     * horizontal이면 bottom:0, height:8px, width:100%, cursor: ns-resize
 *   * Grip은 Resizer 내부 중앙(top/left 50%, translate(-50%, -50%))에 배치된다
 *
 * * 데이터 처리 규칙
 *   * 입력 props 계약(필수/선택)
 *     * children은 필수이며, direction/minSize/maxSize/initialSize/size/onResize는 선택값이다
 *     * BaseMixinProps를 함께 지원하여 spacing/size/sx 등 공통 스타일 props를 전달할 수 있다
 *   * 내부 계산 로직 요약(보정, fallback, formatter 등)
 *     * clamp 함수로 모든 크기 값을 min~max 범위로 제한한다
 *     * uncontrolled 초기값은 useState(initialSize)로 시작하지만, 이후 effect에서 initialSize/min/max 기준으로 다시 보정된다
 *     * 드래그 중 새 크기는 panel의 좌상단(rect.left/top)을 기준으로 포인터 좌표 차이로 계산된다
 *   * 서버 제어/클라이언트 제어 여부
 *     * 서버 통신이나 외부 데이터 제어는 없으며, 포인터 이벤트 기반으로 동작하는 클라이언트 레이아웃 제어 컴포넌트이다
 *
 * @module ResizablePanel
 * 패널의 한 축 크기를 드래그로 조절할 수 있도록 제공하며,
 * controlled/uncontrolled 방식 모두에서 min/max 범위를 지키는 리사이즈 레이아웃 패널 역할을 수행한다
 *
 * @usage
 * <ResizablePanel
 *   {...props}
 * />
 *
/---------------------------------------------------------------------------**/
const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(
  (
    {
      direction = "vertical",
      minSize = 100,
      maxSize = 800,
      initialSize = 300,
      size: controlledSize,
      onResize,
      children,
      ...others
    },
    ref,
  ) => {
    const panelRef = useRef<HTMLDivElement | null>(null)

    const isControlled = controlledSize !== undefined
    const [internal, setInternal] = useState(initialSize)

    const size = isControlled ? controlledSize : internal

    const setSize = (next: number) => {
      if (!isControlled) setInternal(next)
      onResize?.(next)
    }

    useEffect(() => {
      if (!isControlled) {
        setInternal(clamp(initialSize, minSize, maxSize))
      }
    }, [initialSize, minSize, maxSize, isControlled])

    const handlePointerDown = (e: React.PointerEvent) => {
      if (e.button !== 0) return

      const move = (ev: PointerEvent) => {
        if (!panelRef.current) return
        const rect = panelRef.current.getBoundingClientRect()

        const next = direction === "vertical" ? ev.clientX - rect.left : ev.clientY - rect.top

        setSize(clamp(next, minSize, maxSize))
      }

      const up = () => {
        window.removeEventListener("pointermove", move)
        window.removeEventListener("pointerup", up)
      }

      window.addEventListener("pointermove", move)
      window.addEventListener("pointerup", up)
    }

    return (
      <PanelRoot
        ref={(node) => {
          panelRef.current = node

          if (typeof ref === "function") {
            ref(node)
            return
          }

          if (ref) {
            ref.current = node
          }
        }}
        role="separator"
        aria-orientation={direction === "vertical" ? "vertical" : "horizontal"}
        sx={{
          ...(direction === "vertical"
            ? { width: `${size}px`, height: "100%" }
            : { height: `${size}px`, width: "100%" }),
          position: "relative",
        }}
        {...others}
      >
        <Box width="100%" height="100%">
          {children}
        </Box>

        <Resizer direction={direction} onPointerDown={handlePointerDown}>
          <Grip direction={direction} />
        </Resizer>
      </PanelRoot>
    )
  },
)

const PanelRoot = styled(Flex)`
  ${BaseMixin}
`

const Resizer = styled.div<{ direction: DirectionType }>`
  position: absolute;
  z-index: ${RESIZABLEPANEL};

  ${({ direction }) =>
    direction === "vertical"
      ? `right:0;width:${SIZE}px;height:100%;cursor:ew-resize;`
      : `bottom:0;height:${SIZE}px;width:100%;cursor:ns-resize;`}
`

const Grip = styled.div<{ direction: DirectionType }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

ResizablePanel.displayName = "ResizablePanel"/** @public */
/** @public */

export default ResizablePanel
