import type { ChangeEvent, KeyboardEvent } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  Box,
  Button,
  Drawer,
  Flex,
  InfiniteTable,
  Progress,
  Select,
  Skeleton,
  Table,
  Tabs,
  TextField,
  Typography,
  theme,
  styled,
} from "@acme/ui"
import type { ColumnProps, ServerTableQuery, SortDirection } from "@acme/ui"

import { productQueries } from "../../entities/product/queries/productQueries"
import type { ProductSortValue, ProductTableRow } from "../../entities/product/model/product.types"
import {
  PRODUCT_SORT_OPTIONS,
  createProductSuggestions,
  filterProducts,
  formatCurrency,
  sortProducts,
  summarizeProducts,
  toProductSortParams,
  toProductTableRow,
  toRatingScore,
  toStockScore,
} from "../../entities/product/model/productUtils"

const DEFAULT_PAGE = 1
const DEFAULT_ROWS_PER_PAGE = 10
const INFINITE_BATCH_SIZE = 12
const DRAWER_WIDTH = 380

type ViewMode = "table" | "infinite"

const ProductListPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryKeyword = searchParams.get("q") ?? ""
  const querySort = normalizeSortValue(searchParams.get("sort"))
  const queryPage = normalizePositiveInt(searchParams.get("page"), DEFAULT_PAGE)
  const queryRows = normalizePositiveInt(searchParams.get("rows"), DEFAULT_ROWS_PER_PAGE)
  const queryView = normalizeViewMode(searchParams.get("view"))
  const [searchInput, setSearchInput] = useState(queryKeyword)
  const [suggestionOpen, setSuggestionOpen] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const [previewProduct, setPreviewProduct] = useState<ProductTableRow | null>(null)
  const [infiniteLimit, setInfiniteLimit] = useState(INFINITE_BATCH_SIZE)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const sortParams = toProductSortParams(querySort)

  const catalogQuery = useQuery(productQueries.catalog())
  const productsQuery = useQuery(
    productQueries.list({
      q: queryKeyword,
      page: queryPage,
      limit: queryRows,
      ...sortParams,
    }),
  )

  useEffect(() => {
    setSearchInput(queryKeyword)
  }, [queryKeyword])

  useEffect(() => {
    setInfiniteLimit(INFINITE_BATCH_SIZE)
  }, [queryKeyword, querySort])

  const catalogProducts = catalogQuery.data?.products ?? productsQuery.data?.products ?? []
  const filteredProducts = useMemo(
    () => filterProducts(catalogProducts, queryKeyword),
    [catalogProducts, queryKeyword],
  )
  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, querySort),
    [filteredProducts, querySort],
  )
  const summary = useMemo(() => summarizeProducts(sortedProducts), [sortedProducts])
  const tableRows = useMemo(() => {
    const start = (queryPage - 1) * queryRows
    return sortedProducts.slice(start, start + queryRows).map(toProductTableRow)
  }, [queryPage, queryRows, sortedProducts])
  const infiniteRows = useMemo(
    () => sortedProducts.slice(0, infiniteLimit).map(toProductTableRow),
    [infiniteLimit, sortedProducts],
  )
  const suggestions = useMemo(
    () => createProductSuggestions(catalogProducts, searchInput),
    [catalogProducts, searchInput],
  )
  const showSuggestions = suggestionOpen && searchInput.trim().length > 0 && suggestions.length > 0
  const isLoading = catalogQuery.isLoading || productsQuery.isLoading
  const isError = catalogQuery.isError || productsQuery.isError
  const errorMessage =
    catalogQuery.error?.message ??
    productsQuery.error?.message ??
    "상품 데이터를 불러오지 못했습니다."
  const isEmpty = !isLoading && !isError && sortedProducts.length === 0
  const hasMore = infiniteRows.length < sortedProducts.length

  const tableQuery: ServerTableQuery = useMemo(
    () => ({
      page: queryPage,
      rowsPerPage: queryRows,
      keyword: queryKeyword,
      sort: toServerSort(querySort),
    }),
    [queryKeyword, queryPage, queryRows, querySort],
  )

  const columns = useMemo<ColumnProps<ProductTableRow>[]>(
    () => createColumns(querySort, setPreviewProduct, navigate, updateSortFromHeader),
    [navigate, querySort],
  )

  const updateParams = (next: {
    q?: string
    sort?: ProductSortValue
    page?: number
    rows?: number
    view?: ViewMode
  }) => {
    const params = new URLSearchParams(searchParams)
    const nextKeyword = next.q ?? queryKeyword
    const nextSort = next.sort ?? querySort
    const nextPage = next.page ?? queryPage
    const nextRows = next.rows ?? queryRows
    const nextView = next.view ?? queryView

    if (nextKeyword.trim()) params.set("q", nextKeyword.trim())
    else params.delete("q")

    if (nextSort === "relevance") params.delete("sort")
    else params.set("sort", nextSort)

    if (nextPage > DEFAULT_PAGE) params.set("page", String(nextPage))
    else params.delete("page")

    if (nextRows !== DEFAULT_ROWS_PER_PAGE) params.set("rows", String(nextRows))
    else params.delete("rows")

    if (nextView === "table") params.delete("view")
    else params.set("view", nextView)

    setSearchParams(params)
  }

  function updateSortFromHeader(key: keyof ProductTableRow, direction: SortDirection) {
    const nextSort = toProductSortValue(key, direction)
    updateParams({ sort: nextSort, page: 1 })
  }

  const submitSearch = (value = searchInput) => {
    const nextValue = value.trim()
    setSearchInput(nextValue)
    setSuggestionOpen(false)
    updateParams({ q: nextValue, page: 1 })
  }

  const resetSearch = () => {
    setSearchInput("")
    setSuggestionOpen(false)
    updateParams({ q: "", sort: "relevance", page: 1, rows: DEFAULT_ROWS_PER_PAGE })
  }

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      submitSearch(showSuggestions ? suggestions[activeSuggestionIndex] : searchInput)
      return
    }

    if (event.key === "Escape") {
      setSuggestionOpen(false)
      return
    }

    if (event.key === "ArrowDown" && suggestions.length > 0) {
      event.preventDefault()
      setSuggestionOpen(true)
      setActiveSuggestionIndex((prev) => (prev + 1) % suggestions.length)
      return
    }

    if (event.key === "ArrowUp" && suggestions.length > 0) {
      event.preventDefault()
      setSuggestionOpen(true)
      setActiveSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
    }
  }

  const handleQueryChange = (next: ServerTableQuery) => {
    updateParams({
      page: next.rowsPerPage !== queryRows ? 1 : next.page,
      rows: next.rowsPerPage,
      q: next.keyword,
      sort: fromServerSort(next.sort, querySort),
    })
  }

  return (
    <PageFrame $drawerOpen={previewProduct !== null}>
      <ContentColumn>
        <HeaderPanel>
          <Flex justify="space-between" align="center" gap="16px" wrap="wrap">
            <Box>
              <Typography
                as="h2"
                variant="h1"
                text="Market Explorer"
                color={theme.colors.text.primary}
              />
              <Typography
                as="p"
                variant="b2Regular"
                text="DummyJSON products 데이터를 마켓 탐색형 지표로 재구성한 포트폴리오 데모입니다."
                color={theme.colors.text.secondary}
              />
            </Box>
            <MarketBadge>
              <Typography
                variant="b3Medium"
                text="Products API"
                color={theme.colors.primary[400]}
              />
            </MarketBadge>
          </Flex>

          <SummaryGrid aria-label="Market summary">
            <SummaryCard>
              <span>탐색 종목</span>
              <strong>{summary.count.toLocaleString()}</strong>
            </SummaryCard>
            <SummaryCard>
              <span>평균 현재가</span>
              <strong>{formatCurrency(summary.averagePrice)}</strong>
            </SummaryCard>
            <SummaryCard>
              <span>평균 지표</span>
              <strong>{summary.averageRating.toFixed(2)}</strong>
            </SummaryCard>
            <SummaryCard>
              <span>거래 가능 수량</span>
              <strong>{summary.totalStock.toLocaleString()}</strong>
            </SummaryCard>
          </SummaryGrid>

          <ControlGrid>
            <SearchArea>
              <TextField
                type="search"
                label="마켓 검색"
                placeholder="상품명, 섹터, 브랜드 검색"
                value={searchInput}
                startIcon="SearchLine"
                onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  setSearchInput(event.target.value)
                  setSuggestionOpen(true)
                  setActiveSuggestionIndex(0)
                }}
                onFocus={() => setSuggestionOpen(true)}
                onSearch={submitSearch}
                onKeyDown={handleSearchKeyDown}
              />
              {showSuggestions ? (
                <SuggestionList role="listbox" aria-label="추천 검색어">
                  {suggestions.map((suggestion, index) => (
                    <SuggestionItem
                      key={suggestion}
                      type="button"
                      role="option"
                      aria-selected={index === activeSuggestionIndex}
                      $active={index === activeSuggestionIndex}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => submitSearch(suggestion)}
                    >
                      <span>{suggestion}</span>
                    </SuggestionItem>
                  ))}
                </SuggestionList>
              ) : null}
            </SearchArea>

            <Select<ProductSortValue>
              label="정렬"
              value={querySort}
              options={PRODUCT_SORT_OPTIONS}
              onChange={(value) => updateParams({ sort: value ?? "relevance", page: 1 })}
            />
            <Flex align="end" gap="8px" wrap="wrap">
              <Button text="검색" startIcon="SearchLine" onClick={() => submitSearch()} />
              <Button text="전체 초기화" variant="outlined" color="normal" onClick={resetSearch} />
            </Flex>
          </ControlGrid>
        </HeaderPanel>

        {isLoading ? (
          <LoadingPanel aria-label="Loading market products">
            <Skeleton variant="rounded" height="84px" />
            <Skeleton variant="rounded" height="360px" />
          </LoadingPanel>
        ) : null}

        {isError ? (
          <StatePanel role="alert">
            <Typography
              variant="h3"
              text="마켓 데이터를 불러오지 못했습니다."
              color={theme.colors.error[500]}
            />
            <Typography
              variant="b2Regular"
              text={errorMessage}
              color={theme.colors.text.secondary}
            />
            <Button
              text="다시 시도"
              onClick={() => void Promise.all([catalogQuery.refetch(), productsQuery.refetch()])}
            />
          </StatePanel>
        ) : null}

        {isEmpty ? (
          <StatePanel>
            <Typography
              variant="h3"
              text="조건에 맞는 항목이 없습니다."
              color={theme.colors.text.primary}
            />
            <Typography
              variant="b2Regular"
              text="검색어를 줄이거나 전체 초기화로 마켓 전체를 다시 확인해보세요."
              color={theme.colors.text.secondary}
            />
            <Button text="전체 초기화" variant="outlined" color="normal" onClick={resetSearch} />
          </StatePanel>
        ) : null}

        {!isLoading && !isError && !isEmpty ? (
          <TableSection>
            <Flex justify="space-between" align="center" gap="12px" wrap="wrap" mb="12px">
              <Tabs
                value={queryView}
                size="M"
                onSelect={(value) => updateParams({ view: value as ViewMode, page: 1 })}
                options={[
                  { label: "Table View", value: "table" },
                  { label: "Infinite View", value: "infinite" },
                ]}
              />
              <Typography
                variant="b3Regular"
                text={`${sortedProducts.length.toLocaleString()}개 항목 탐색 중`}
                color={theme.colors.text.secondary}
              />
            </Flex>

            {queryView === "table" ? (
              <Table<ProductTableRow>
                tableKey="market-products-table"
                columnConfig={columns}
                data={tableRows}
                getRowKey={(row) => row.id}
                query={tableQuery}
                totalCount={sortedProducts.length}
                rowsPerPageOptions={[5, 10, 20]}
                onQueryChange={handleQueryChange}
                pagination="Table"
                emptyRowText="No market items"
                height={460}
              />
            ) : (
              <InfiniteTable<ProductTableRow>
                tableKey="market-products-infinite"
                columnConfig={columns}
                data={infiniteRows}
                query={tableQuery}
                totalCount={sortedProducts.length}
                onQueryChange={handleQueryChange}
                hasMore={hasMore}
                loading={false}
                loadMore={() =>
                  setInfiniteLimit((prev) =>
                    Math.min(prev + INFINITE_BATCH_SIZE, sortedProducts.length),
                  )
                }
                emptyRowText="No market items"
                height={520}
              />
            )}
          </TableSection>
        ) : null}
      </ContentColumn>

      <Drawer
        open={previewProduct !== null}
        onClose={() => setPreviewProduct(null)}
        placement="right"
        variant="fixed"
        width={`${DRAWER_WIDTH}px`}
        overlay
        disableBackdrop
      >
        {previewProduct ? (
          <DrawerContent>
            <Flex justify="space-between" align="start" gap="12px">
              <Box>
                <Typography
                  as="h3"
                  variant="h2"
                  text={previewProduct.title}
                  color={theme.colors.text.primary}
                />
                <Typography
                  variant="b2Regular"
                  text={previewProduct.category}
                  color={theme.colors.text.secondary}
                />
              </Box>
              <Button
                ref={triggerRef}
                text="닫기"
                size="S"
                variant="outlined"
                color="normal"
                onClick={() => setPreviewProduct(null)}
              />
            </Flex>
            <PreviewImage src={previewProduct.thumbnail} alt={`${previewProduct.title} preview`} />
            <Typography
              variant="b2Regular"
              text={previewProduct.description}
              color={theme.colors.text.secondary}
            />
            <InfoList>
              <dt>현재가</dt>
              <dd>{formatCurrency(previewProduct.price)}</dd>
              <dt>지표</dt>
              <dd>{previewProduct.ratingLabel}</dd>
              <dt>거래 가능 수량</dt>
              <dd>{previewProduct.stockLabel}</dd>
            </InfoList>
            <SignalCard>
              <Flex justify="space-between" align="center" mb="8px">
                <Typography
                  variant="b2Medium"
                  text="거래 가능 수량 지표"
                  color={theme.colors.text.primary}
                />
                <Typography
                  variant="b3Medium"
                  text={`${toStockScore(previewProduct.stock)}%`}
                  color={theme.colors.text.secondary}
                />
              </Flex>
              <Progress
                type="bar"
                variant="determinate"
                value={toStockScore(previewProduct.stock)}
                label="거래 가능 수량 지표"
              />
              <Typography
                variant="b3Regular"
                text="재고 수량을 0-100 범위의 탐색 신호로 환산했습니다."
                color={theme.colors.text.tertiary}
                mt="8px"
              />
            </SignalCard>
            <SignalCard>
              <Flex justify="space-between" align="center" mb="8px">
                <Typography
                  variant="b2Medium"
                  text="평점 기반 관심도"
                  color={theme.colors.text.primary}
                />
                <Typography
                  variant="b3Medium"
                  text={`${toRatingScore(previewProduct.rating)}%`}
                  color={theme.colors.text.secondary}
                />
              </Flex>
              <Progress
                type="bar"
                variant="determinate"
                value={toRatingScore(previewProduct.rating)}
                label="평점 기반 관심도"
              />
            </SignalCard>
            <Flex gap="8px" wrap="wrap">
              <Button
                text="상세 보기"
                onClick={() => navigate(`/demo/products/${previewProduct.id}`)}
              />
              <Button
                text="닫기"
                variant="outlined"
                color="normal"
                onClick={() => setPreviewProduct(null)}
              />
            </Flex>
          </DrawerContent>
        ) : null}
      </Drawer>
    </PageFrame>
  )
}

const createColumns = (
  querySort: ProductSortValue,
  setPreviewProduct: (row: ProductTableRow) => void,
  navigate: ReturnType<typeof useNavigate>,
  onSortChange: (key: keyof ProductTableRow, direction: SortDirection) => void,
): ColumnProps<ProductTableRow>[] => [
  {
    key: "title",
    title: "종목/상품명",
    width: 300,
    sort: true,
    sortDirection: querySort === "title-asc" ? "ASC" : undefined,
    onSortChange,
    render: (row) => (
      <ProductCell>
        <ProductThumb src={row.thumbnail} alt={`${row.title} thumbnail`} />
        <Box>
          <Typography variant="b2Medium" text={row.title} color={theme.colors.text.primary} />
          <Typography
            variant="b3Regular"
            text={row.brandLabel}
            color={theme.colors.text.tertiary}
          />
        </Box>
      </ProductCell>
    ),
  },
  { key: "category", title: "섹터", width: 150 },
  {
    key: "price",
    title: "현재가",
    width: 130,
    sort: true,
    sortDirection:
      querySort === "price-asc" ? "ASC" : querySort === "price-desc" ? "DESC" : undefined,
    onSortChange,
    textAlign: "right",
    render: (row) => formatCurrency(row.price),
  },
  {
    key: "rating",
    title: "지표",
    width: 110,
    sort: true,
    sortDirection: querySort === "rating-desc" ? "DESC" : undefined,
    onSortChange,
    textAlign: "right",
    render: (row) => row.ratingLabel,
  },
  {
    key: "stock",
    title: "거래 가능 수량",
    width: 150,
    sort: true,
    sortDirection: querySort === "stock-desc" ? "DESC" : undefined,
    onSortChange,
    textAlign: "right",
    render: (row) => row.stockLabel,
  },
  {
    key: "id",
    title: "Action",
    width: 190,
    render: (row) => (
      <Flex gap="6px" justify="flex-end">
        <Button
          text="Preview"
          size="S"
          variant="outlined"
          color="normal"
          onClick={() => setPreviewProduct(row)}
        />
        <Button text="Detail" size="S" onClick={() => navigate(`/demo/products/${row.id}`)} />
      </Flex>
    ),
  },
]

const normalizePositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return Math.floor(parsed)
}

const normalizeSortValue = (value: string | null): ProductSortValue => {
  if (PRODUCT_SORT_OPTIONS.some((option) => option.value === value))
    return value as ProductSortValue
  return "relevance"
}

const normalizeViewMode = (value: string | null): ViewMode =>
  value === "infinite" ? "infinite" : "table"

const toServerSort = (sort: ProductSortValue): ServerTableQuery["sort"] => {
  switch (sort) {
    case "title-asc":
      return { key: "title", direction: "ASC" }
    case "price-asc":
      return { key: "price", direction: "ASC" }
    case "price-desc":
      return { key: "price", direction: "DESC" }
    case "rating-desc":
      return { key: "rating", direction: "DESC" }
    case "stock-desc":
      return { key: "stock", direction: "DESC" }
    case "relevance":
      return undefined
  }
}

const fromServerSort = (
  sort: ServerTableQuery["sort"],
  fallback: ProductSortValue,
): ProductSortValue => {
  if (!sort) return fallback
  if (sort.key === "title") return "title-asc"
  if (sort.key === "price") return sort.direction === "ASC" ? "price-asc" : "price-desc"
  if (sort.key === "rating") return "rating-desc"
  if (sort.key === "stock") return "stock-desc"
  return fallback
}

const toProductSortValue = (
  key: keyof ProductTableRow,
  direction: SortDirection,
): ProductSortValue => {
  if (key === "title") return "title-asc"
  if (key === "price") return direction === "ASC" ? "price-asc" : "price-desc"
  if (key === "rating") return "rating-desc"
  if (key === "stock") return "stock-desc"
  return "relevance"
}

const PageFrame = styled.div<{ $drawerOpen: boolean }>`
  display: grid;
  transition: padding-right 220ms ease;
  padding-right: ${({ $drawerOpen }) => ($drawerOpen ? `${DRAWER_WIDTH + 16}px` : "0")};

  @media (max-width: 960px) {
    padding-right: 0;
  }
`

const ContentColumn = styled.div`
  display: grid;
  gap: 16px;
  min-width: 0;
`

const HeaderPanel = styled.section`
  display: grid;
  gap: 18px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  background: ${({ theme }) => theme.colors.grayscale.white};
`

const MarketBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid ${({ theme }) => theme.colors.primary[100]};
  border-radius: ${({ theme }) => theme.borderRadius[16]};
  background: ${({ theme }) => theme.colors.primary[50]};
`

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`

const SummaryCard = styled.div`
  display: grid;
  gap: 6px;
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  background: ${({ theme }) => theme.colors.background.default};

  span {
    color: ${({ theme }) => theme.colors.text.secondary};
    ${({ theme }) => theme.fonts.body.b3.Regular};
  }

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    ${({ theme }) => theme.fonts.body.b1.Bold};
  }
`

const ControlGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 1fr) minmax(220px, 280px) auto;
  gap: 12px;
  align-items: end;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const SearchArea = styled.div`
  position: relative;
`

const SuggestionList = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 6px);
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  display: grid;
  gap: 4px;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  background: ${({ theme }) => theme.colors.grayscale.white};
  box-shadow: ${({ theme }) => theme.shadows.elevation[4]};
`

const SuggestionItem = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 34px;
  padding: 0 8px;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius[4]};
  background: ${({ theme, $active }) => ($active ? theme.colors.primary[50] : "transparent")};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: left;
  cursor: pointer;
  ${({ theme }) => theme.fonts.body.b2.Regular};

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.primary[50]};
    outline: none;
  }
`

const TableSection = styled.section`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  background: ${({ theme }) => theme.colors.grayscale.white};
  overflow: hidden;
`

const ProductCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`

const ProductThumb = styled.img`
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius[6]};
  background: ${({ theme }) => theme.colors.background.default};
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

const DrawerContent = styled.div`
  display: grid;
  gap: 14px;
  padding: 20px;
  max-height: 100vh;
  overflow-y: auto;
`

const PreviewImage = styled.img`
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: contain;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  background: ${({ theme }) => theme.colors.background.default};
`

const InfoList = styled.dl`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px 12px;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  ${({ theme }) => theme.fonts.body.b2.Regular};

  dt,
  dd {
    margin: 0;
  }

  dd {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 700;
  }
`

const SignalCard = styled.div`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  background: ${({ theme }) => theme.colors.background.default};
`

export default ProductListPage
