import { canUseDOM } from "./canUseDOM"

let lockCount = 0
let previousOverflow: string | null = null

export const lockBodyScroll = () => {
  if (!canUseDOM()) return () => undefined

  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow
  }

  lockCount += 1
  document.body.style.overflow = "hidden"

  let released = false

  return () => {
    if (released) return
    released = true

    lockCount = Math.max(0, lockCount - 1)

    if (lockCount === 0) {
      document.body.style.overflow = previousOverflow ?? ""
      previousOverflow = null
    }
  }
}
