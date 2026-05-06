/** @public */
import { useEffect } from "react"

/** @public */
export type IconSpriteProviderProps = {
  spriteUrl: string
  elementId?: string
}

const DEFAULT_ID = "acme-ui-icon-sprite"

/** @public */
export const IconSpriteProvider = ({
  spriteUrl,
  elementId = DEFAULT_ID,
}: IconSpriteProviderProps) => {
  useEffect(() => {
    if (typeof document === "undefined") return
    if (document.getElementById(elementId)) return

    const run = async () => {
      const res = await fetch(spriteUrl)
      if (!res.ok) return
      const text = await res.text()

      const wrap = document.createElement("div")
      wrap.id = elementId
      wrap.setAttribute("aria-hidden", "true")
      wrap.style.position = "absolute"
      wrap.style.width = "0"
      wrap.style.height = "0"
      wrap.style.overflow = "hidden"
      wrap.innerHTML = text
      const svg = wrap.querySelector("svg")
      svg?.removeAttribute("style")
      svg?.setAttribute("width", "0")
      svg?.setAttribute("height", "0")
      svg?.setAttribute("aria-hidden", "true")

      document.body.prepend(wrap)
    }

    void run()
  }, [spriteUrl, elementId])

  return null
}
