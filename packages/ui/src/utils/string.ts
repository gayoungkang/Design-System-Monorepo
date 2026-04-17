/** @internal */
export const formatWithComma = (value: number | string): string => {
  const str = String(value).replace(/,/g, "")
  if (!str || isNaN(Number(str))) return String(value)
  return Number(str).toLocaleString()
}

/** @internal */
export const cssValue = (v: string | number) => (typeof v === "number" ? toCssValue(v) : v)

/** @internal */
export const toCssValue = (value?: string | number): string | undefined => {
  if (value === undefined) return undefined
  return typeof value === "number" ? `${value}px` : value
}
