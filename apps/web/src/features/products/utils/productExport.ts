import type { ColumnProps } from "@acme/ui"
import type { ProductTableRow } from "../../../entities/product/model/product.types"

export type ProductExportType = "csv"

export const exportProductRowsToCsv = (
  rows: ProductTableRow[],
  columns: ColumnProps<ProductTableRow>[],
) => {
  if (typeof document === "undefined") return

  const exportColumns = columns.filter((column) => column.key !== "id")
  const header = exportColumns.map((column) => escapeCsvValue(String(column.title))).join(",")
  const body = rows
    .map((row) =>
      exportColumns
        .map((column) => {
          const value = row[column.key]
          return escapeCsvValue(value == null ? "" : String(value))
        })
        .join(","),
    )
    .join("\n")
  const csv = [header, body].filter(Boolean).join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")

  anchor.href = url
  anchor.download = `market-products-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

const escapeCsvValue = (value: string) => {
  const escaped = value.replaceAll('"', '""')
  return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped
}
