import { useCallback, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { styled } from "@acme/ui"

import { productQueries } from "../../../entities/product/queries/productQueries"
import type { ProductSortValue } from "../../../entities/product/model/product.types"
import { toProductSortParams } from "../../../entities/product/model/productUtils"
import { INFINITE_BATCH_SIZE, type ViewMode } from "../utils/productQueryParams"
import ProductPageHeader from "../components/ProductPageHeader"
import { useProductListQueryState } from "../hooks/useProductListQueryState"
import { useProductPreviewDrawer } from "../hooks/useProductPreviewDrawer"
import {
  readStoredFilters,
  useProductScrollRestore,
} from "../hooks/useProductScrollRestore"
import { useProductToolbarState } from "../hooks/useProductToolbarState"
import { useProductListDataPipeline } from "../hooks/useProductListDataPipeline"
import { useProductTableConfig } from "../hooks/useProductTableConfig"
import ProductTableSection from "../sections/ProductTableSection"
import ProductPreviewDrawer, { DRAWER_WIDTH } from "../sections/ProductPreviewDrawer"

const ProductListContainer = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    committedKeyword,
    querySort,
    queryPage,
    queryRows,
    queryView,
    updateQueryParams,
  } = useProductListQueryState()
  const restoredFilterStateRef = useRef(readStoredFilters())
  const saveListStateRef = useRef<(selectedProductId?: number) => void>(() => {})
  const tableSectionRef = useRef<HTMLElement | null>(null)
  const { previewProduct, openPreview, closePreview } = useProductPreviewDrawer()
  const updateParams = useCallback(
    (next: {
      q?: string
      sort?: ProductSortValue
      page?: number
      rows?: number
      view?: ViewMode
    }) => {
      saveListStateRef.current()
      updateQueryParams(next)
    },
    [updateQueryParams],
  )
  const {
    tableSearchValue,
    setTableSearchValue,
    appliedFilters,
    draftFilters,
    setDraftFilters,
    draftSort,
    setDraftSort,
    filterOpen,
    setFilterOpen,
    visibleColumnKeys,
    setVisibleColumnKeys,
    infiniteLimit,
    setInfiniteLimit,
    applyFilters,
    resetFilters,
    handleToolbarSearchChange,
  } = useProductToolbarState({
    committedKeyword,
    querySort,
    restoredFilterState: restoredFilterStateRef.current,
    updateParams,
  })
  const sortParams = toProductSortParams(querySort)

  const catalogQuery = useQuery(productQueries.catalog())
  const productsQuery = useQuery(
    productQueries.list({
      q: committedKeyword,
      page: queryPage,
      limit: queryRows,
      ...sortParams,
    }),
  )

  const getCurrentListUrl = useCallback(
    () => `${location.pathname}${location.search}`,
    [location.pathname, location.search],
  )

  const catalogProducts = catalogQuery.data?.products ?? productsQuery.data?.products ?? []
  const {
    sortedProducts,
    summary,
    pageCount,
    tableRows,
    infiniteRows,
    categoryOptions,
    activeFilterCount,
    tableFilters,
    hasMore,
    exportRows,
  } = useProductListDataPipeline({
    catalogProducts,
    committedKeyword,
    tableSearchValue,
    appliedFilters,
    querySort,
    queryPage,
    queryRows,
    infiniteLimit,
  })
  const hasCatalogData = Boolean(catalogQuery.data)
  const isInitialLoading = catalogQuery.isLoading && !hasCatalogData
  const isError = catalogQuery.isError && !hasCatalogData
  const errorMessage =
    catalogQuery.error?.message ??
    productsQuery.error?.message ??
    "상품 데이터를 불러오지 못했습니다."
  const getFilterState = useCallback(
    () => ({
      appliedFilters,
      draftFilters,
      tableSearchValue,
      draftSort,
    }),
    [appliedFilters, draftFilters, draftSort, tableSearchValue],
  )
  const { saveListState } = useProductScrollRestore({
    tableSectionRef,
    location,
    isInitialLoading,
    isError,
    queryView,
    rowCount: tableRows.length,
    getFilterState,
  })

  useEffect(() => {
    saveListStateRef.current = saveListState
  }, [saveListState])

  useEffect(() => {
    if (queryPage <= pageCount) return
    updateParams({ page: 1 })
  }, [pageCount, queryPage])

  const navigateToProductDetail = useCallback(
    (productId: number) => {
      saveListState(productId)
      navigate(`/admin/${productId}`, {
        state: { from: getCurrentListUrl() },
      })
    },
    [getCurrentListUrl, navigate, saveListState],
  )

  const {
    visibleColumns,
    tableQuery,
    tableToolbar,
    infiniteToolbar,
    handleQueryChange,
    handleExport,
  } = useProductTableConfig({
    queryPage,
    queryRows,
    querySort,
    tableSearchValue,
    setTableSearchValue,
    tableFilters,
    visibleColumnKeys,
    setVisibleColumnKeys,
    exportRows,
    activeFilterCount,
    filterOpen,
    setFilterOpen,
    draftSort,
    setDraftSort,
    draftFilters,
    setDraftFilters,
    categoryOptions,
    applyFilters,
    resetFilters,
    handleToolbarSearchChange,
    openPreview,
    navigateToProductDetail,
    updateParams,
  })

  return (
    <PageFrame $drawerOpen={previewProduct !== null}>
      <ContentColumn>
        <ProductPageHeader summary={summary} />

        <ProductTableSection
          ref={tableSectionRef}
          isInitialLoading={isInitialLoading}
          isError={isError}
          errorMessage={errorMessage}
          queryView={queryView}
          onViewChange={(view) => updateParams({ view, page: 1 })}
          visibleColumns={visibleColumns}
          tableRows={tableRows}
          infiniteRows={infiniteRows}
          tableQuery={tableQuery}
          totalCount={sortedProducts.length}
          onQueryChange={handleQueryChange}
          tableToolbar={tableToolbar}
          infiniteToolbar={infiniteToolbar}
          hasMore={hasMore}
          onLoadMore={() =>
            setInfiniteLimit((prev) => Math.min(prev + INFINITE_BATCH_SIZE, sortedProducts.length))
          }
          onExport={handleExport}
          onRetry={() => void Promise.all([catalogQuery.refetch(), productsQuery.refetch()])}
        />
      </ContentColumn>

      <ProductPreviewDrawer
        product={previewProduct}
        onClose={closePreview}
        onDetail={navigateToProductDetail}
      />
    </PageFrame>
  )
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

export default ProductListContainer
