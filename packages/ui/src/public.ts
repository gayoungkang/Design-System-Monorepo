/** ---------------------------------------------------------------------------
 * @packageDocumentation
 * @public
 *
 * Stable public API surface for \@acme/ui.
 * Only supported consumer-facing contracts are exported here.
 * App-specific stores and internal utilities are intentionally excluded.
 * --------------------------------------------------------------------------- */

// Public styling contracts used by component props. Keep these stable because most
// component Props extend BaseMixinProps.
export type { BaseMixinProps, SxProps } from "./tokens/baseMixin"

// Deprecated implementation exports. Kept for compatibility; prefer components,
// theme, GlobalStyle, and typed props over building app code on these internals.
/** @deprecated Internal styling primitive. Prefer exported components or theme tokens. */
export { BaseMixin, addImportantToSx } from "./tokens/baseMixin"
/** @deprecated Internal styled-components wrapper. Prefer exported components. */
export { styled } from "./tokens/customStyled"

// App bootstrap API.
export { GlobalStyle } from "./tokens/globalStyle"

// Deprecated animation internals. Kept for compatibility with existing consumers.
/** @deprecated Internal animation tokens. Prefer component-level APIs. */
export {
  spin,
  indeterminateAnimation,
  wave,
  circularIndeterminate,
  fadeInUp,
  popover,
} from "./tokens/keyframes"

// Theme API.
export { theme, zIndex, typographyVariants } from "./tokens/theme"
export type { ThemeVariantType, TypographyVariant } from "./tokens/theme"

// Shared UI contract types.
export type { VariantFormType, HelperTextUiType } from "./types/form"
export type { DirectionType } from "./types/layout"
export type { DirectionalPlacement, AxisPlacement, CornerPlacement } from "./types/placement"
export type { StatusUiType } from "./types/status"
export type { SizeUiType, ColorUiType, VariantUiType } from "./types/ui"
/** @deprecated Internal layering constants. Prefer theme.zIndex. */
export {
  COMMON_PARENTS_ELEMENT_ZINDEX,
  COMMON_CHILD_ELEMENT_ZINDEX,
  LOADING_ZINDEX,
  SNACKBAR_ZINDEX,
  POPOVER_ZINDEX,
  MODAL_ZINDEX,
  RESIZABLEPANEL,
  TABLE_HEADER_ZINDEX,
} from "./types/zindex"

// Icon contracts.
export { IconNames } from "./components/Icon/icon-types"
export type { IconName } from "./components/Icon/icon-types"

// Table contracts used by app column/query definitions.
export type {
  ColumnVisibilityItem,
  TableColumnVisibleProps,
} from "./components/Table/_internal/TableColumnVisible"
export type { TableFilterProps } from "./components/Table/_internal/TableFilter"
export type {
  DefaultExportType,
  ExportItem,
  ExportType,
  TableExportProps,
} from "./components/Table/_internal/TableExport"
export type {
  SummaryItem as TableSummaryItem,
  SummaryRowLine as TableSummaryRowLine,
  SummaryRowProps as TableSummaryRowProps,
} from "./components/Table/_internal/TableSummaryRow"
export type { TableToolBarProps } from "./components/Table/_internal/TableToolbar"
export type {
  ColumnProps,
  ServerTableFilter,
  ServerTableQuery,
  ServerTableSort,
  SortDirection,
  SummaryRowItem,
  SummaryRowLine,
  SummaryRowProps,
  TableCellAlign,
  TableMode,
  TableProps,
  TableRowAction,
  TableToolbarProps,
  VirtualizedOptions,
} from "./components/Table/@Types/table"

// Components.
export * from "./components/DatePicker/DatePicker"
export * from "./components/Accordion/Accordion"
export * from "./components/AlertModal/AlertModal"
export * from "./components/Avatar/Avatar"
export * from "./components/Badge/Badge"
/** @public */
export { default as Box } from "./components/Box/Box"
export * from "./components/Box/Box"
export * from "./components/Breadcrumbs/Breadcrumbs"
/** @public */
export { default as Button } from "./components/Button/Button"
export * from "./components/Button/Button"
export * from "./components/CheckBoxGroup/CheckBoxGroup"
export * from "./components/Chip/Chip"
export * from "./components/Divider/Divider"
/** @public */
export { default as Drawer } from "./components/Drawer/Drawer"
export * from "./components/Drawer/Drawer"
/** @public */
export { default as Flex } from "./components/Flex/Flex"
export * from "./components/Flex/Flex"
export * from "./components/FloatingButton/FloatingButton"
export * from "./components/Grid/Grid"
export * from "./components/HelperText/HelperText"
export * from "./components/Icon/Icon"
export * from "./components/Icon/IconSpriteProvider"
export * from "./components/IconButton/IconButton"
export * from "./components/Label/Label"
export * from "./components/Link/Link"
export * from "./components/List/List"
export * from "./components/Menu/Menu"
export * from "./components/Modal/Modal"
export * from "./components/Pagination/Pagination"
export * from "./components/Paper/Paper"
export * from "./components/Popper/Popper"
/** @public */
export { default as Progress } from "./components/Progress/Progress"
export * from "./components/Progress/Progress"
export * from "./components/RadioGroup/RadioGroup"
export * from "./components/Rating/Rating"
export * from "./components/ResizablePanel/ResizablePanel"
export * from "./components/ScrollBox/ScrollBox"
/** @public */
export { default as Select } from "./components/Select/Select"
export * from "./components/Select/Select"
/** @public */
export { default as Skeleton } from "./components/Skeleton/Skeleton"
export * from "./components/Skeleton/Skeleton"
export * from "./components/Slider/Slider"
export * from "./components/SnackBar/SnackBar"
export * from "./components/Stepper/Stepper"
export * from "./components/SwitchButton/SwitchButton"
/** @public */
export { default as Table } from "./components/Table/Table"
export * from "./components/Table/Table"
/** @public */
export { default as InfiniteTable } from "./components/Table/InfiniteTable"
export * from "./components/Table/InfiniteTable"
export * from "./components/Tabs/Tabs"
/** @public */
export { default as TextField } from "./components/TextField/TextField"
export * from "./components/TextField/TextField"
export * from "./components/ToggleButton/ToggleButton"
export * from "./components/Tooltip/Tooltip"
export * from "./components/TreeView/TreeView"
export * from "./components/Typography/Typography"
