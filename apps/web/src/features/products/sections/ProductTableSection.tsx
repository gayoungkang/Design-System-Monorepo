import { forwardRef } from "react"
import {
  Button,
  Flex,
  InfiniteTable,
  Skeleton,
  Table,
  Tabs,
  Typography,
  styled,
  theme,
} from "@acme/ui"
import type { ColumnProps, ServerTableQuery, TableToolBarProps, TableToolbarProps } from "@acme/ui"
import type { ProductTableRow } from "../../../entities/product/model/product.types"
import { INFINITE_BATCH_SIZE, type ViewMode } from "../utils/productQueryParams"
import type { ProductExportType } from "../utils/productExport"

type ProductTableSectionProps = {
  isInitialLoading: boolean
  isError: boolean
  errorMessage: string
  queryView: ViewMode
  onViewChange: (view: ViewMode) => void
  visibleColumns: ColumnProps<ProductTableRow>[]
  tableRows: ProductTableRow[]
  infiniteRows: ProductTableRow[]
  tableQuery: ServerTableQuery
  totalCount: number
  onQueryChange: (next: ServerTableQuery) => void
  tableToolbar: TableToolbarProps<ProductExportType>
  infiniteToolbar: TableToolBarProps
  hasMore: boolean
  onLoadMore: () => void
  onExport: (type: ProductExportType) => void
  onRetry: () => void
}

const ProductTableSection = forwardRef<HTMLElement, ProductTableSectionProps>(
  (
    {
      isInitialLoading,
      isError,
      errorMessage,
      queryView,
      onViewChange,
      visibleColumns,
      tableRows,
      infiniteRows,
      tableQuery,
      totalCount,
      onQueryChange,
      tableToolbar,
      infiniteToolbar,
      hasMore,
      onLoadMore,
      onExport,
      onRetry,
    },
    ref,
  ) => {
    if (isInitialLoading) {
      return (
        <LoadingPanel aria-label="Loading market products">
          <Skeleton variant="rounded" height="84px" />
          <Skeleton variant="rounded" height="360px" />
        </LoadingPanel>
      )
    }

    if (isError) {
      return (
        <StatePanel role="alert">
          <Typography
            variant="h3"
            text="마켓 데이터를 불러오지 못했습니다."
            color={theme.colors.error[500]}
          />
          <Typography variant="b2Regular" text={errorMessage} color={theme.colors.text.secondary} />
          <Button text="다시 시도" onClick={onRetry} />
        </StatePanel>
      )
    }

    return (
      <TableSection ref={ref}>
        <Flex justify="space-between" align="center" gap="12px" wrap="wrap" mb="12px">
          <Tabs
            value={queryView}
            size="M"
            onSelect={(value) => onViewChange(value as ViewMode)}
            options={[
              { label: "테이블 보기", value: "table" },
              { label: "무한 스크롤 테이블 보기", value: "infinite" },
            ]}
          />
        </Flex>

        {queryView === "table" ? (
          <Table<ProductTableRow, ProductExportType>
            tableKey="market-products-table"
            columnConfig={visibleColumns}
            data={tableRows}
            getRowKey={(row) => row.id}
            query={tableQuery}
            totalCount={totalCount}
            rowsPerPageOptions={[5, 10, 25]}
            onQueryChange={onQueryChange}
            pagination="Table"
            emptyRowText="검색 결과가 없습니다."
            height={460}
            toolbar={tableToolbar}
            exportEnabled
            exportItems={[{ type: "csv", label: "CSV 다운로드" }]}
            onExport={(type) => onExport(type)}
          />
        ) : (
          <Flex direction="column" gap="12px">
            <InfiniteTable<ProductTableRow>
              tableKey="market-products-infinite"
              columnConfig={visibleColumns}
              data={infiniteRows}
              query={tableQuery}
              totalCount={totalCount}
              onQueryChange={onQueryChange}
              hasMore={hasMore}
              loading={false}
              loadMore={onLoadMore}
              emptyRowText="검색 결과가 없습니다."
              height={520}
              toolbar={infiniteToolbar}
              exportEnabled
              exportItems={[{ type: "csv", label: "CSV 다운로드" }]}
              onExport={() => onExport("csv")}
            />
            <Flex justify="center">
              <Button
                text={hasMore ? "더 보기" : "모든 항목을 표시했습니다"}
                variant="outlined"
                color="normal"
                disabled={!hasMore}
                onClick={onLoadMore}
              />
            </Flex>
          </Flex>
        )}
      </TableSection>
    )
  },
)

ProductTableSection.displayName = "ProductTableSection"

const TableSection = styled.section`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  background: ${({ theme }) => theme.colors.grayscale.white};
  overflow: hidden;
`

const LoadingPanel = styled.section`
  display: grid;
  gap: 10px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  background: ${({ theme }) => theme.colors.grayscale.white};
`

const StatePanel = styled.section`
  display: grid;
  gap: 12px;
  justify-items: start;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  background: ${({ theme }) => theme.colors.grayscale.white};
`

export default ProductTableSection
