/** @public */
import type {
  ReactNode,
  JSX,
  CSSProperties,
  ComponentProps,
  MouseEvent as ReactMouseEvent,
} from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import type {
  ColumnProps,
  ServerTableQuery,
  SortDirection,
  VirtualizedOptions,
} from "./@Types/table"
import TableContainer from "./_internal/TableContainer"
import TableHead from "./_internal/TableHead"
import TableRow from "./_internal/TableRow"
import TableTd from "./_internal/TableTd"
import TableTh from "./_internal/TableTh"
import TableTr from "./_internal/TableTr"
import TableSummaryRow, { type SummaryRowProps } from "./_internal/TableSummaryRow"
import TableToolBar, { type TableToolBarProps } from "./_internal/TableToolbar"
import TableTotalRows from "./_internal/TableTotalRows"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"
import { Typography } from "../Typography/Typography"
import { theme } from "../../tokens/theme"
import type { ExportType } from "./_internal/TableExport"
import Progress from "../Progress/Progress"
import { clamp, parseWidthToPx } from "./@utils/table"
import useIntersect from "./@hooks/useIntersect"/** @public */
/** @public */


/** Row action configuration for InfiniteTable. @public */
export type InfiniteTableRowAction<T extends Record<string, unknown>> = {
  key: string
  render: (row: T, index: number) => ReactNode
}


/** @public */
export type InfiniteTableExportItem = {
  type: ExportType
  label: string
  icon?: string
}/** @public */
/** @public */


export type InfiniteTableExportContext = Record<string, unknown>/** @public */
/** @public */


export type InfiniteTableProps<T extends Record<string, unknown>> = {
  tableKey: string
  columnConfig: ColumnProps<T>[]
  data?: T[]

  // * infinite
  loading?: boolean
  hasMore?: boolean
  loadMore?: () => void

  // * server-controlled (single source of truth)
  query: ServerTableQuery
  onQueryChange: (next: ServerTableQuery) => void
  totalCount?: number

  // * view-only
  onRowClick?: (row: T, index: number) => void
  rowActions?: InfiniteTableRowAction<T>[]

  // * layout
  sticky?: boolean
  height?: number
  emptyRowText?: string
  disabled?: boolean
  summaryRow?: SummaryRowProps<T>
  customTableHeader?: JSX.Element | null

  // * toolbar
  toolbar?: TableToolBarProps

  // * export (server job only)
  exportEnabled?: boolean
  exportItems?: InfiniteTableExportItem[]
  excludeExportTypes?: ExportType[]
  onExport?: (type: ExportType, ctx: InfiniteTableExportContext) => void
  exportContext?: InfiniteTableExportContext

  // * virtualization
  virtualized?: VirtualizedOptions
}

/**---------------------------------------------------------------------------/
 *
 * ! InfiniteTable
 *
 * * 무한 스크롤 기반 서버 제어형 Table 컴포넌트입니다.
 * * `query`를 단일 진실원천으로 사용하며, 검색/정렬/필터 변경은 `onQueryChange`로만 외부에 반영합니다.
 * * page/rowsPerPage는 UI에 직접 노출하지 않지만, query 내부 값은 유지하여 서버 계약을 깨지 않습니다.
 * * 컬럼 폭은 내부 state(`colPx`)로 관리하며, 드래그 리사이즈는 requestAnimationFrame으로 묶어 성능 저하를 줄입니다.
 * * body의 scrollLeft를 추적해 헤더를 translateX로 동기화하고, 옵션에 따라 virtualization(windowing)을 적용합니다.
 * * 하단 sentinel이 교차(intersect)되면 `loadMore()`를 호출해 다음 데이터를 불러옵니다.
 *
 * * 동작 규칙
 *   * 서버 제어 계약:
 *     * `query(keyword/sort/filters/page/rowsPerPage)`가 렌더 기준이며, 변경은 `emitQuery(partial)`로만 발생합니다.
 *     * InfiniteTable에서는 page/rowsPerPage UI를 숨기되, 기존 query 값은 그대로 유지합니다.
 *   * 검색:
 *     * 툴바 `onSearchChange(v)` → `emitQuery({ keyword: v })`
 *   * 정렬:
 *     * Header에서 컬럼별 `col.onSortChange(col.key, nextDirection)`를 호출합니다.
 *   * 무한 스크롤:
 *     * `useIntersect`가 sentinel 노출을 감지하면 `disabled/hasMore/loading/loadMore` 조건을 검사한 뒤 `loadMore()`를 호출합니다.
 *     * 중복 호출 방지를 위해 intersect enabled를 false로 내렸다가, 다음 렌더 사이클에서 다시 활성화합니다.
 *   * disabled:
 *     * emitQuery, resize, loadMore, export 등 주요 인터랙션을 차단합니다.
 *
 * * 레이아웃/스타일 관련 규칙
 *   * 헤더 동기화:
 *     * body의 `scrollLeft`를 상태로 추적해 headerInner에 `translateX(-scrollLeft)`를 적용합니다.
 *   * 컬럼 폭:
 *     * `columnConfig.width` 또는 기본 160px을 사용해 초기 `colPx`를 구성합니다.
 *     * `gridColumns`는 px 단위 문자열로 생성되며, rowActions가 있으면 action 컬럼(80px)이 뒤에 추가됩니다.
 *   * virtualization:
 *     * `rowHeight`, `overscan`, `scrollTop`, `viewportH`로 visible window와 상하 padding을 계산합니다.
 *   * 로딩 행:
 *     * `hasMore && loading`이면 하단에 Circular Progress 행을 렌더링합니다.
 *   * summary row:
 *     * `summaryRow.enabled`이고 `summaryRow.data.length > 0`일 때만 sticky bottom summary row를 렌더링합니다.
 *
 * * 데이터 처리 규칙
 *   * 입력 props 계약:
 *     * `columnConfig`: 헤더/바디/요약행 렌더 및 초기 width 계산 기준
 *     * `data`: 현재까지 로드된 누적 데이터
 *     * `query` + `onQueryChange`: 검색/정렬/필터의 외부 제어 인터페이스
 *     * `hasMore/loadMore/loading`: infinite scroll 제어 인터페이스
 *   * 내부 계산:
 *     * `safeTotalCount`는 `totalCount ?? data.length`를 기반으로 음수 방지 보정합니다.
 *     * row key는 `row.id/key/_id/rowId` 우선, 없으면 `${tableKey}_${index}` fallback을 사용합니다.
 *     * export ctx는 `exportContext` + `query(keyword/sort/filters)` 병합 결과를 사용합니다.
 *
 * @module InfiniteTable
 * 무한 스크롤 + 가상화 + 툴바 + 요약행을 지원하는 서버 제어형 데이터 테이블 컴포넌트입니다.
 *
 * @usage
 * <InfiniteTable
 *   tableKey="users"
 *   columnConfig={columns}
 *   data={rows}
 *   query={query}
 *   hasMore={hasMore}
 *   loadMore={loadMore}
 *   onQueryChange={setQuery}
 *   toolbar={{ searchEnabled: true }}
 *   virtualized={{ enabled: true, rowHeight: 32, overscan: 6 }}
 * />
 *
/---------------------------------------------------------------------------**/

const InfiniteTable = <T extends Record<string, unknown>>({
  tableKey,
  columnConfig,
  data = [],

  // * infinite
  loading = false,
  hasMore = false,
  loadMore,

  // * server-controlled
  query,
  onQueryChange,
  totalCount,

  // * view-only
  onRowClick,
  rowActions,

  // * layout
  sticky = true,
  height = 300,
  emptyRowText,
  disabled = false,
  summaryRow,
  customTableHeader,

  // * toolbar
  toolbar,

  // * export
  exportEnabled = false,
  exportItems,
  excludeExportTypes,
  onExport,
  exportContext,

  // * virtualization
  virtualized,

  ...baseProps
}: InfiniteTableProps<T>): JSX.Element => {
  type TableThAlign = ComponentProps<typeof TableTh>["align"]
  type TableRowProps = ComponentProps<typeof TableRow<T>>
  type TableSummaryRowProps = ComponentProps<typeof TableSummaryRow<T>>
  type TableToolbarOnExport = NonNullable<TableToolBarProps["onExport"]>

  // * server query emit (single source of truth) - page/rowsPerPage는 유지하되 UI는 미노출
  const emitQuery = (partial: Partial<ServerTableQuery>) => {
    if (disabled) return

    const next: ServerTableQuery = {
      ...query,
      page: query.page,
      rowsPerPage: query.rowsPerPage,
      keyword: partial.keyword ?? query.keyword,
      sort: partial.sort ?? query.sort,
      filters: partial.filters ?? query.filters,
    }

    onQueryChange({
      ...next,
      keyword: String(next.keyword ?? ""),
    })
  }

  // ---------------------------------------------------------------------------
  // * Column widths + drag resize (RAF)
  // ---------------------------------------------------------------------------

  // * 컬럼 width를 px 단위 배열로 관리(초기값은 columnConfig.width 또는 기본 160)
  const [colPx, setColPx] = useState<number[]>(() =>
    columnConfig.map((c) => parseWidthToPx(c.width) ?? 160),
  )

  // * 컬럼 개수가 변경되면 기존 폭을 최대한 유지하면서 신규 컬럼 폭을 보정
  useEffect(() => {
    setColPx((prev) => {
      if (prev.length === columnConfig.length) return prev
      return columnConfig.map((c, i) => prev[i] ?? parseWidthToPx(c.width) ?? 160)
    })
  }, [columnConfig])

  // * 드래그 상태(활성/컬럼 인덱스/시작 좌표/시작 폭)를 ref로 유지
  const dragRef = useRef<{ active: boolean; colIndex: number; startX: number; startW: number }>({
    active: false,
    colIndex: -1,
    startX: 0,
    startW: 0,
  })

  // * 리사이즈 업데이트를 RAF로 묶기 위한 ref
  const rafResizeRef = useRef<number | null>(null)
  const pendingResizeRef = useRef<{ colIndex: number; width: number } | null>(null)

  // * mousemove/mouseup을 전역에 바인딩해 컬럼 드래그 리사이즈를 처리
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current.active) return
      const dx = e.clientX - dragRef.current.startX
      const nextW = clamp(dragRef.current.startW + dx, 60, 2000)

      pendingResizeRef.current = { colIndex: dragRef.current.colIndex, width: nextW }
      if (rafResizeRef.current !== null) return

      rafResizeRef.current = window.requestAnimationFrame(() => {
        rafResizeRef.current = null
        const pending = pendingResizeRef.current
        if (!pending) return

        setColPx((prev) => {
          const next = [...prev]
          next[pending.colIndex] = pending.width
          return next
        })
      })
    }

    const onUp = () => {
      if (!dragRef.current.active) return
      dragRef.current.active = false
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)

      if (rafResizeRef.current !== null) {
        window.cancelAnimationFrame(rafResizeRef.current)
        rafResizeRef.current = null
      }
    }
  }, [])

  // * 특정 컬럼의 리사이즈를 시작하는 핸들러 생성기
  const startResize = (colIndex: number) => (e: ReactMouseEvent<HTMLDivElement>) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()

    dragRef.current = {
      active: true,
      colIndex,
      startX: e.clientX,
      startW: colPx[colIndex] ?? 160,
    }
  }

  // * 현재 컬럼 폭(px) 기반 grid-template-columns 문자열 생성(+ rowActions가 있으면 action columns 추가)
  const gridColumns = useMemo(() => {
    const base = colPx.map((w) => `${Math.max(60, Math.floor(w))}px`).join(" ")
    const actionCols = (rowActions?.length ?? 0) > 0 ? rowActions!.map(() => "80px").join(" ") : ""
    return actionCols ? `${base} ${actionCols}` : base
  }, [colPx, rowActions])

  // ---------------------------------------------------------------------------
  // * Scroll sync (header translateX) + virtualization range
  // ---------------------------------------------------------------------------

  // * 바디 스크롤 요소 ref
  const bodyScrollRef = useRef<HTMLDivElement | null>(null)

  // * 스크롤 이벤트를 RAF로 묶어 상태 업데이트 비용을 제한
  const rafScrollRef = useRef<number | null>(null)

  // * header/body 동기화를 위한 scrollLeft, virtualization 계산을 위한 scrollTop/viewportH 상태
  const [scrollLeft, setScrollLeft] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportH, setViewportH] = useState(0)

  // * body 스크롤 및 리사이즈 변경을 추적해 scroll 상태를 동기화
  useEffect(() => {
    const el = bodyScrollRef.current
    if (!el) return

    const sync = () => {
      setScrollLeft(el.scrollLeft)
      setScrollTop(el.scrollTop)
      setViewportH(el.clientHeight)
    }

    sync()

    const onScroll = () => {
      if (rafScrollRef.current !== null) return
      rafScrollRef.current = window.requestAnimationFrame(() => {
        rafScrollRef.current = null
        sync()
      })
    }

    el.addEventListener("scroll", onScroll, { passive: true })

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => sync())
      ro.observe(el)
    } else {
      window.addEventListener("resize", sync)
    }

    return () => {
      el.removeEventListener("scroll", onScroll)

      if (ro) ro.disconnect()
      else window.removeEventListener("resize", sync)

      if (rafScrollRef.current !== null) {
        window.cancelAnimationFrame(rafScrollRef.current)
        rafScrollRef.current = null
      }
    }
  }, [])

  // * virtualization이 enabled일 때만 가상 스크롤 옵션을 활성화
  const vOpt: VirtualizedOptions | undefined = virtualized?.enabled ? virtualized : undefined
  const rowHeight = vOpt?.rowHeight ?? 0
  const overscan = vOpt?.overscan ?? 6
  const totalRowsCount = data.length

  // * 스크롤/뷰포트/rowHeight 기준으로 가상 렌더 구간 및 padding 계산
  const virtualRange = useMemo(() => {
    if (!vOpt || rowHeight <= 0) return { start: 0, end: totalRowsCount, padTop: 0, padBottom: 0 }

    const start = clamp(
      Math.floor(scrollTop / rowHeight) - overscan,
      0,
      Math.max(0, totalRowsCount),
    )
    const visibleCount = Math.ceil(viewportH / rowHeight) + overscan * 2
    const end = clamp(start + visibleCount, 0, Math.max(0, totalRowsCount))
    const padTop = start * rowHeight
    const padBottom = Math.max(0, (totalRowsCount - end) * rowHeight)

    return { start, end, padTop, padBottom }
  }, [overscan, rowHeight, scrollTop, totalRowsCount, vOpt, viewportH])

  // * 가상 스크롤 사용 시 slice로 visibleRows만 추출
  const visibleRows = useMemo(() => {
    if (!vOpt) return data
    return data.slice(virtualRange.start, virtualRange.end)
  }, [data, vOpt, virtualRange.end, virtualRange.start])

  // * header를 body scrollLeft에 맞춰 translateX로 동기화하기 위한 style
  const headerInnerStyle: CSSProperties = useMemo(
    () => ({
      transform: `translateX(${-scrollLeft}px)`,
      willChange: "transform",
    }),
    [scrollLeft],
  )

  // * 컬럼 sort 플래그/방향을 TableTh에 전달할 값으로 정규화
  const getSortValue = (colSort?: boolean, colSortDirection?: SortDirection) => {
    if (!colSort) return undefined
    return colSortDirection ?? "ASC"
  }

  // * export 요청 시 서버 작업용 ctx를 구성해 onExport로 전달
  const handleExport = (type: ExportType) => {
    if (!exportEnabled || disabled) return
    if (!onExport) return

    const baseCtx: InfiniteTableExportContext = exportContext ?? {}

    onExport(type, {
      ...baseCtx,
      keyword: String(query.keyword ?? ""),
      sort: query.sort,
      filters: query.filters,
    })
  }

  // * summary row 표시 여부(서버 집계 데이터가 있을 때만)
  const summaryEnabled = Boolean(summaryRow?.enabled && (summaryRow?.data?.length ?? 0) > 0)
  const summaryRowHeight = 32

  // ---------------------------------------------------------------------------
  // * infinite intersect trigger
  // ---------------------------------------------------------------------------

  // * 하단 sentinel 관찰을 통해 추가 로드를 트리거
  const {
    ref: bottomRef,
    enabled: intersectEnabled,
    setEnabled: setIntersectEnabled,
  } = useIntersect(() => {
    if (disabled) return
    if (!hasMore) return
    if (loading) return
    if (!loadMore) return

    setIntersectEnabled(false)
    loadMore()
  })

  // * loading 완료 후 sentinel 감지를 다시 활성화
  useEffect(() => {
    if (disabled) return
    if (!hasMore) return
    if (loading) return
    if (!intersectEnabled) setIntersectEnabled(true)
  }, [disabled, hasMore, loading, intersectEnabled, setIntersectEnabled])

  // ---------------------------------------------------------------------------
  // * render
  // ---------------------------------------------------------------------------

  // * 툴바 렌더 여부를 기능 플래그 기준으로 결정
  const shouldRenderToolbar =
    Boolean(toolbar?.searchEnabled) ||
    Boolean(toolbar?.filterEnabled) ||
    Boolean(toolbar?.columnVisibilityEnabled) ||
    Boolean(exportEnabled && onExport && (exportItems?.length ?? 0) > 0)

  // * 헤더 렌더러(스크롤 동기화 + sortable/resizable 헤더 구성)
  const renderHeader = () => {
    return (
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <div style={headerInnerStyle}>
          <TableHead sticky={sticky} top={"0px"}>
            {customTableHeader ?? null}

            <TableTr columns={gridColumns} disabled={disabled}>
              {columnConfig.map((col, idx) => {
                const sortValue = getSortValue(col.sort, col.sortDirection)
                const sortEnabled = !disabled && col.sort && col.onSortChange

                return (
                  <TableTh
                    key={`${tableKey}_th_${String(col.title)}_${idx}`}
                    align={col.textAlign as TableThAlign}
                    sort={sortEnabled ? sortValue : undefined}
                    onSortChange={
                      sortEnabled
                        ? (nextDirection) => col.onSortChange?.(col.key as keyof T, nextDirection)
                        : undefined
                    }
                    resizable={!disabled}
                    onResizeStart={startResize(idx)}
                    sx={{ userSelect: "none" }}
                  >
                    {col.title}
                  </TableTh>
                )
              })}

              {(rowActions?.length ?? 0) > 0
                ? rowActions!.map((action, ai) => (
                    <TableTh
                      key={`${tableKey}_th_action_${String(action.key)}_${ai}`}
                      align={"center" as TableThAlign}
                      sx={{ userSelect: "none" }}
                    >
                      {""}
                    </TableTh>
                  ))
                : null}
            </TableTr>
          </TableHead>
        </div>
      </Box>
    )
  }

  // * 바디 영역에서 데이터 행/로딩 행/sentinel만 렌더링(가상 스크롤 padding 포함)
  const renderBodyRowsOnly = () => {
    const actionCount = rowActions?.length ?? 0
    const colSpanAll = columnConfig.length + actionCount

    if (data.length === 0) {
      return (
        <TableTr columns={gridColumns} disabled={disabled}>
          <TableTd
            colSpan={colSpanAll}
            align={"center" as ComponentProps<typeof TableTd>["align"]}
            disabled={disabled}
          >
            <Typography text={emptyRowText ?? "검색 결과가 없습니다."} align="center" />
          </TableTd>
        </TableTr>
      )
    }

    return (
      <>
        {vOpt ? <div style={{ height: virtualRange.padTop }} /> : null}

        {visibleRows.map((row, ri) => {
          const realIndex = vOpt ? virtualRange.start + ri : ri
          const rowRecord = row as Record<string, unknown>
          const keyCandidate = rowRecord.id ?? rowRecord.key ?? rowRecord._id ?? rowRecord.rowId

          const rowKey =
            keyCandidate !== undefined && keyCandidate !== null
              ? String(keyCandidate)
              : `${tableKey}_${realIndex}`

          return (
            <TableRow<T>
              key={`${tableKey}_row_${rowKey}`}
              tableKey={tableKey}
              index={realIndex}
              data={row as TableRowProps["data"]}
              columnConfig={columnConfig as TableRowProps["columnConfig"]}
              columns={gridColumns}
              rowHeight={vOpt?.rowHeight}
              onRowClick={onRowClick}
              rowActions={rowActions as TableRowProps["rowActions"]}
              disabled={disabled}
            />
          )
        })}

        {vOpt ? <div style={{ height: virtualRange.padBottom }} /> : null}

        {hasMore && loading ? (
          <TableTr columns={gridColumns} disabled={disabled}>
            <TableTd
              colSpan={colSpanAll}
              align={"center" as ComponentProps<typeof TableTd>["align"]}
              disabled={disabled}
            >
              <Progress type="circular" variant="indeterminate" />
            </TableTd>
          </TableTr>
        ) : null}

        {hasMore ? <div ref={bottomRef} style={{ height: 1 }} /> : null}
      </>
    )
  }

  // * totalCount가 없으면 현재 data.length 기준으로 총 행 수를 보정
  const safeTotalCount = useMemo(() => {
    if (typeof totalCount === "number") return Math.max(0, Number(totalCount) || 0)
    return Math.max(0, Number(data.length) || 0)
  }, [totalCount, data.length])

  return (
    <>
      {/* * 툴바 렌더링(검색/필터/컬럼표시/내보내기) */}
      {shouldRenderToolbar ? (
        <TableToolBar
          {...(toolbar ?? {})}
          disabled={disabled}
          title={toolbar?.title}
          searchValue={String(query.keyword ?? "")}
          onSearchChange={(v) => emitQuery({ keyword: v })}
          exportEnabled={exportEnabled}
          exportItems={exportItems}
          excludeExportTypes={excludeExportTypes}
          onExport={
            onExport
              ? (((type) => handleExport(type as ExportType)) as TableToolbarOnExport)
              : undefined
          }
          exportContext={exportContext}
        />
      ) : null}

      {/* * 테이블 컨테이너 + 헤더/바디(스크롤) + summary row */}
      <TableContainer {...baseProps}>
        <Flex
          direction="column"
          height={height}
          width={"100%"}
          sx={{
            minHeight: 0,
            background: theme.colors.grayscale.white,
          }}
        >
          {renderHeader()}

          <Box
            ref={bodyScrollRef}
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: "auto",
            }}
          >
            <Box sx={{ paddingBottom: hasMore ? "80px" : "0px" }}>
              {renderBodyRowsOnly()}

              {/* * summary row는 서버 집계 데이터가 있을 때만 stickyBottom으로 렌더링 */}
              {summaryEnabled ? (
                <TableSummaryRow<T>
                  tableKey={tableKey}
                  columns={columnConfig as TableSummaryRowProps["columns"]}
                  rows={[] as T[]}
                  config={summaryRow as TableSummaryRowProps["config"]}
                  disabled={disabled}
                  gridColumns={gridColumns}
                  stickyBottom
                  rowHeight={summaryRowHeight}
                />
              ) : null}
            </Box>
          </Box>
        </Flex>
      </TableContainer>

      {/* * 하단 총 행 수 패널 */}
      <Flex
        align="center"
        justify="flex-start"
        mt={2}
        p={"6px 8px"}
        bgColor={theme.colors.grayscale.white}
        sx={{
          position: "relative",
          borderRadius: theme.borderRadius[4],
          border: `1px solid ${theme.colors.border.default}`,
        }}
      >
        <TableTotalRows totalRows={safeTotalCount} />
      </Flex>
    </>
  )
}/** @public */
/** @public */


export default InfiniteTable
