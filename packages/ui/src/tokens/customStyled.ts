import styled from "styled-components"

const _STYLE_PROPS = new Set<string>([
  "placement",
  "maxWidth",
  "variant",
  "italic",
  "ellipsis",
  "align",
  "color",
  "size",
  "startIcon",
  "colorVariant",
  "isActive",
  "error",
  "multiline",
  "resizableMultiline",
  "borderRadius",
  "selected",
  "clickable",
  "disableInteraction",
  "showArrow",
  "flexItem",
  "labelPlacement",
  "multipleMonth",
  "leftDisabled",
  "rightDisabled",
  "loading",
  "bgColor",
  "maxHeight",
  "minHeight",
  "minWidth",
  "sticky",
  "boxShadow",
  "closeBehavior",
  "collapsedSize",
])

const isStyleProp = (prop: string) => {
  if (prop.startsWith("$")) return true
  if (_STYLE_PROPS.has(prop)) return true
  return false
}

/** @public */
export const shouldForwardProp = (prop: string) => {
  if (isStyleProp(prop)) return false
  return true
}

const customStyled = new Proxy(styled, {
  get(target, prop, receiver) {
    const original = Reflect.get(target, prop, receiver)

    if (typeof original === "function") {
      return original.withConfig({
        shouldForwardProp,
      })
    }

    return original
  },

  apply(target, thisArg, argArray) {
    const styledFn = Reflect.apply(target, thisArg, argArray)

    if (typeof styledFn === "function") {
      return styledFn.withConfig({
        shouldForwardProp,
      })
    }

    return styledFn
  },
})

/** @public */
export { customStyled as styled }
