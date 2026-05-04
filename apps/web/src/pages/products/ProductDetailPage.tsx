import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, Flex, Progress, Skeleton, Typography, theme } from "@acme/ui"
import { productQueries } from "../../entities/product/queries/productQueries"
import { formatCurrency } from "../../entities/product/model/productUtils"

const ProductDetailPage = () => {
  const navigate = useNavigate()
  const params = useParams()
  const productId = useMemo(() => Number(params.id), [params.id])
  const isValidId = Number.isFinite(productId) && productId > 0
  const productQuery = useQuery(productQueries.detail(productId))

  if (!isValidId) {
    return (
      <StatePanel role="alert">
        <Typography variant="h3" text="잘못된 상품 주소입니다." color={theme.colors.error[500]} />
        <Button text="목록으로" onClick={() => navigate("/demo/products")} />
      </StatePanel>
    )
  }

  if (productQuery.isLoading) {
    return (
      <DetailGrid aria-label="Loading product detail">
        <Skeleton variant="rounded" height="360px" />
        <Box>
          <Skeleton variant="text" height="32px" mb="12px" />
          <Skeleton variant="text" height="20px" mb="8px" />
          <Skeleton variant="text" height="20px" mb="8px" />
          <Skeleton variant="rounded" height="120px" />
        </Box>
      </DetailGrid>
    )
  }

  if (productQuery.isError) {
    return (
      <StatePanel role="alert">
        <Typography
          variant="h3"
          text="상품 상세를 불러오지 못했습니다."
          color={theme.colors.error[500]}
        />
        <Typography
          variant="b2Regular"
          text={productQuery.error.message}
          color={theme.colors.text.secondary}
        />
        <Flex gap="8px" wrap="wrap">
          <Button text="다시 시도" onClick={() => void productQuery.refetch()} />
          <Button
            text="목록으로"
            variant="outlined"
            color="normal"
            onClick={() => navigate("/demo/products")}
          />
        </Flex>
      </StatePanel>
    )
  }

  const product = productQuery.data

  if (!product) {
    return (
      <StatePanel>
        <Typography variant="h3" text="상품이 없습니다." color={theme.colors.text.primary} />
        <Button text="목록으로" onClick={() => navigate("/demo/products")} />
      </StatePanel>
    )
  }

  return (
    <Box sx={{ display: "grid", justifyItems: "start", gap: "16px" }}>
      <Button
        text="목록으로"
        variant="outlined"
        color="normal"
        onClick={() => navigate("/demo/products")}
      />

      <DetailGrid>
        <Box sx={{ display: "grid", gap: "12px" }}>
          <img
            src={product.thumbnail}
            alt={`${product.title} main image`}
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              objectFit: "contain",
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius[8],
              background: theme.colors.grayscale.white,
            }}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "8px",
            }}
          >
            {product.images.slice(0, 4).map((image, index) => (
              <img
                key={image}
                src={image}
                alt={`${product.title} image ${index + 1}`}
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  objectFit: "contain",
                  border: `1px solid ${theme.colors.border.default}`,
                  borderRadius: theme.borderRadius[6],
                  background: theme.colors.grayscale.white,
                }}
              />
            ))}
          </Box>
        </Box>

        <Box
          as="article"
          p="24px"
          sx={{
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius[8],
            background: theme.colors.grayscale.white,
          }}
        >
          <Typography as="h2" variant="h1" text={product.title} color={theme.colors.text.primary} />
          <Typography
            as="p"
            variant="b1Regular"
            text={product.description}
            color={theme.colors.text.secondary}
            mt="10px"
          />

          <MetricGrid>
            <MetricItem label="Price" value={formatCurrency(product.price)} />
            <MetricItem label="Rating" value={product.rating.toFixed(1)} />
            <MetricItem label="Stock" value={product.stock.toLocaleString()} />
          </MetricGrid>

          <Box mt="18px">
            <Typography
              variant="b2Medium"
              text="Stock health"
              color={theme.colors.text.primary}
              mb="8px"
            />
            <Progress
              type="bar"
              variant="determinate"
              value={Math.min(100, product.stock)}
              label="Stock health"
            />
          </Box>

          <SpecList>
            <dt>Category</dt>
            <dd>{product.category}</dd>
            <dt>Brand</dt>
            <dd>{product.brand ?? "No brand"}</dd>
            <dt>Shipping</dt>
            <dd>{product.shippingInformation ?? "Standard shipping"}</dd>
            <dt>Warranty</dt>
            <dd>{product.warrantyInformation ?? "No warranty information"}</dd>
            <dt>Return policy</dt>
            <dd>{product.returnPolicy ?? "No return policy"}</dd>
          </SpecList>
        </Box>
      </DetailGrid>
    </Box>
  )
}

const DetailGrid = ({ children, ...props }: Parameters<typeof Box>[0]) => (
  <Box
    as="section"
    sx={{
      display: "grid",
      gridTemplateColumns: "minmax(280px, 0.9fr) minmax(0, 1.1fr)",
      gap: "18px",
      width: "100%",
      "@media (max-width: 860px)": {
        gridTemplateColumns: "1fr",
      },
    }}
    {...props}
  >
    {children}
  </Box>
)

const MetricGrid = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "10px",
      marginTop: "18px",
      "@media (max-width: 560px)": {
        gridTemplateColumns: "1fr",
      },
    }}
  >
    {children}
  </Box>
)

const MetricItem = ({ label, value }: { label: string; value: string }) => (
  <Box
    p="12px"
    sx={{
      display: "grid",
      gap: "4px",
      border: `1px solid ${theme.colors.border.default}`,
      borderRadius: theme.borderRadius[6],
      background: theme.colors.background.default,
    }}
  >
    <Typography variant="b3Regular" text={label} color={theme.colors.text.secondary} />
    <Typography variant="b1Bold" text={value} color={theme.colors.text.primary} />
  </Box>
)

const SpecList = ({ children }: { children: React.ReactNode }) => (
  <Box
    as="dl"
    sx={{
      display: "grid",
      gridTemplateColumns: "140px 1fr",
      gap: "10px 14px",
      margin: "20px 0 0",
      color: theme.colors.text.secondary,
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "20px",
      "@media (max-width: 560px)": {
        gridTemplateColumns: "1fr",
      },
      "& dt": {
        margin: 0,
        color: theme.colors.text.tertiary,
      },
      "& dd": {
        margin: 0,
        color: theme.colors.text.primary,
      },
    }}
  >
    {children}
  </Box>
)

const StatePanel = ({ children, ...props }: Parameters<typeof Box>[0]) => (
  <Box
    as="section"
    p="28px"
    sx={{
      display: "grid",
      gap: "12px",
      justifyItems: "start",
      border: `1px solid ${theme.colors.border.default}`,
      borderRadius: theme.borderRadius[8],
      background: theme.colors.grayscale.white,
    }}
    {...props}
  >
    {children}
  </Box>
)

export default ProductDetailPage
