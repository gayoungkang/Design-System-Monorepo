import { forwardRef, useLayoutEffect, useRef, useState } from "react"
import type { ReactNode, RefObject } from "react"
import { createPortal } from "react-dom"
import { POPOVER_ZINDEX } from "../../types/zindex"
import { styled } from "../../tokens/customStyled"
import { popover } from "../../tokens/keyframes"
import { canUseDOM } from "../../utils/canUseDOM"
import type { DirectionalPlacement } from "../../types/placement"/** @public */
/** @public */


export type PopperProps = {
  anchorRef: RefObject<HTMLElement | null>
  children: ReactNode
  placement?: DirectionalPlacement
  offsetX?: number
  offsetY?: number
  open: boolean
  showArrow?: boolean
  height?: string
  width?: "auto" | "anchor" | "max-content"
  minWidth?: number
  maxWidth?: number
  strategy?: "absolute" | "fixed"
  onClose?: () => void
}
/**---------------------------------------------------------------------------/
 *
 * ! Popper
 *
 * * anchor 엘리먼트를 기준으로 위치를 계산해 Portal로 렌더링되는 floating UI 컨테이너 컴포넌트
 * * open=true이고 DOM 환경일 때만 document.body에 Portal로 렌더링되며, anchorRef 기준으로 위치를 동적으로 계산한다
 * * 위치는 placement/offset/strategy 조합으로 제어되며, viewport 경계를 넘어가지 않도록 보정된다
 * * ESC 키 또는 외부 클릭(pointerdown) 시 onClose 콜백을 호출한다
 *
 * * 동작 규칙
 *   * 주요 분기 조건 및 처리 우선순위
 *     * open=false 또는 DOM 사용 불가(canUseDOM=false)면 null 반환
 *     * anchorRef.current 또는 popper DOM이 없으면 위치 계산(updatePosition)을 수행하지 않는다
 *     * placement(top/bottom/left/right)에 따라 기준 위치(base)를 계산한 뒤 viewport 기준 clamp 처리 후 offset을 적용한다
 *     * width 설정은 "anchor"이면 anchor width 사용, "max-content"이면 해당 문자열, 그 외는 "auto"
 *   * 이벤트 처리 방식(onClick, onChange, onDoubleClick 등)
 *     * ResizeObserver(anchor, popper) + window resize 이벤트로 위치 재계산(scheduleUpdate → RAF)
 *     * keydown(ESC) 시 onClose 호출
 *     * pointerdown 시 popper 내부/anchor 내부 클릭은 무시하고, 외부 클릭이면 onClose 호출
 *   * disabled 상태에서 차단되는 동작
 *     * disabled 개념은 없으며, open=false일 때 모든 렌더링/이벤트/observer가 비활성화된다
 *
 * * 레이아웃/스타일 관련 규칙
 *   * position은 strategy("absolute" | "fixed")로 결정되며, absolute일 경우 scrollY/scrollX를 보정값으로 추가한다
 *   * top/left는 anchorRect + placement 계산값 + offsetX/offsetY + viewport clamp 결과로 결정된다
 *   * viewport padding(8px)을 기준으로 화면 밖으로 나가지 않도록 clamp 처리한다
 *   * StyledPopper는 max-height 제한 + overflow-y:auto로 내부 스크롤을 허용한다
 *   * animation(popover keyframes)이 적용되어 mount 시 진입 애니메이션이 실행된다
 *   * showArrow=true일 때 Arrow 요소를 absolute로 추가하며, placement 기반 위치는 스타일 외부에서 제어되지 않고 단순 표시만 수행한다
 *
 * * 데이터 처리 규칙
 *   * 입력 props 계약(필수/선택)
 *     * anchorRef: 필수 — 위치 기준이 되는 HTMLElement ref
 *     * open: 필수 — 렌더링/이벤트 활성화 기준
 *     * children: 필수 — popper 내부 콘텐츠
 *     * placement, offsetX, offsetY, width, height, minWidth, maxWidth, strategy, showArrow, onClose는 선택값
 *   * 내부 계산 로직 요약(보정, fallback, formatter 등)
 *     * 위치 계산은 getBoundingClientRect 기반으로 수행되고, placement별 기준 좌표 계산 → viewport clamp → offset 적용 순서로 처리된다
 *     * requestAnimationFrame을 통해 연속 업데이트를 하나로 묶어 성능 최적화(scheduleUpdate)한다
 *     * ResizeObserver가 존재하면 anchor와 popper 모두 관찰하여 크기 변경 시 위치를 재계산한다
 *   * 서버 제어/클라이언트 제어 여부
 *     * 서버 렌더링 시 DOM이 없으면 렌더링하지 않으며(canUseDOM), 클라이언트에서만 동작하는 UI 포지셔닝 컴포넌트이다
 *
 * @module Popper
 * anchor 기준 위치 계산 + viewport 보정 + Portal 렌더링을 통해
 * 툴팁/드롭다운/팝오버 등 floating UI를 안정적으로 표시하는 위치 제어 컴포넌트
 *
 * @usage
 * <Popper
 *   {...props}
 * />
 *
/---------------------------------------------------------------------------**/
const Popper = forwardRef<HTMLDivElement, PopperProps>(
  (
    {
      anchorRef,
      children,
      placement = "bottom",
      offsetX = 0,
      offsetY = 8,
      open,
      showArrow = false,
      height = "300px",
      width = "auto",
      minWidth,
      maxWidth,
      strategy = "absolute",
      onClose,
    },
    ref,
  ) => {
    const [style, setStyle] = useState<React.CSSProperties>({})
    const containerRef = useRef<HTMLDivElement | null>(null)
    const rafIdRef = useRef<number | null>(null)

    const setMergedRef = (node: HTMLDivElement | null) => {
      containerRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
    }

    const scheduleUpdate = () => {
      if (rafIdRef.current !== null) return
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null
        updatePosition()
      })
    }

    const clampToViewport = (left: number, top: number, width: number, height: number) => {
      const padding = 8
      const vw = window.innerWidth
      const vh = window.innerHeight

      return {
        left: Math.max(padding, Math.min(left, vw - width - padding)),
        top: Math.max(padding, Math.min(top, vh - height - padding)),
      }
    }

    const updatePosition = () => {
      const anchor = anchorRef.current
      const popper = containerRef.current
      if (!anchor || !popper || !open) return

      const anchorRect = anchor.getBoundingClientRect()
      const popperRect = popper.getBoundingClientRect()

      const base = (() => {
        switch (placement) {
          case "top":
            return {
              left: anchorRect.left + anchorRect.width / 2 - popperRect.width / 2,
              top: anchorRect.top - popperRect.height,
            }
          case "bottom":
            return {
              left: anchorRect.left + anchorRect.width / 2 - popperRect.width / 2,
              top: anchorRect.bottom,
            }
          case "left":
            return {
              left: anchorRect.left - popperRect.width,
              top: anchorRect.top + anchorRect.height / 2 - popperRect.height / 2,
            }
          case "right":
            return {
              left: anchorRect.right,
              top: anchorRect.top + anchorRect.height / 2 - popperRect.height / 2,
            }
          default:
            return {
              left: anchorRect.left,
              top: anchorRect.bottom,
            }
        }
      })()

      const clamped = clampToViewport(base.left, base.top, popperRect.width, popperRect.height)

      const calculatedWidth =
        width === "anchor" ? anchorRect.width : width === "max-content" ? "max-content" : "auto"

      setStyle({
        position: strategy,
        top: clamped.top + offsetY + (strategy === "absolute" ? window.scrollY : 0),
        left: clamped.left + offsetX + (strategy === "absolute" ? window.scrollX : 0),
        zIndex: POPOVER_ZINDEX,
        width: calculatedWidth,
        minWidth,
        maxWidth,
      })
    }

    useLayoutEffect(() => {
      if (!open) return
      updatePosition()

      const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(scheduleUpdate) : null

      const anchor = anchorRef.current
      const popper = containerRef.current

      if (ro && anchor && popper) {
        ro.observe(anchor)
        ro.observe(popper)
      }

      window.addEventListener("resize", scheduleUpdate)

      return () => {
        ro?.disconnect()
        window.removeEventListener("resize", scheduleUpdate)

        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current)
        }
      }
    }, [open, placement, offsetX, offsetY, width, strategy])

    useLayoutEffect(() => {
      if (!open) return

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose?.()
      }

      const onPointerDown = (e: PointerEvent) => {
        const popperEl = containerRef.current
        const anchorEl = anchorRef.current
        const target = e.target as Node

        if (!popperEl || popperEl.contains(target)) return
        if (anchorEl && anchorEl.contains(target)) return
        onClose?.()
      }

      document.addEventListener("keydown", onKeyDown)
      document.addEventListener("pointerdown", onPointerDown)

      return () => {
        document.removeEventListener("keydown", onKeyDown)
        document.removeEventListener("pointerdown", onPointerDown)
      }
    }, [open, onClose])

    if (!open || !canUseDOM()) return null

    return createPortal(
      <StyledPopper
        ref={setMergedRef}
        role="dialog"
        aria-hidden={!open}
        placement={placement}
        height={height}
        style={style}
      >
        {showArrow && <Arrow placement={placement} />}
        {children}
      </StyledPopper>,
      document.body,
    )
  },
)

const StyledPopper = styled.div<{ placement: DirectionalPlacement; height: string }>`
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.grayscale.white};
  box-shadow: ${({ theme }) => theme.shadows.elevation["8"]};
  border-radius: ${({ theme }) => theme.borderRadius[4]};
  padding: 4px;
  max-height: ${({ height }) => height};
  animation: ${popover} 0.2s cubic-bezier(0.25, 2, 0.5, 1) forwards;
`

const Arrow = styled.div<{ placement: DirectionalPlacement }>`
  width: 10px;
  height: 10px;
  background-color: ${({ theme }) => theme.colors.grayscale.white};
  position: absolute;
  transform: rotate(45deg);
`

Popper.displayName = "Popper"
export default Popper
