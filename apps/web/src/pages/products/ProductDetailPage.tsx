import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, Flex, Progress, Skeleton, Typography, theme } from "@acme/ui"
import styled from "styled-components"
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
        <Typography variant="h3" text="상품 상세를 불러오지 못했습니다." color={theme.colors.error[500]} />
        <Typography variant="b2Regular" text={productQuery.error.message} color={theme.colors.text.secondary} />
        <Flex gap="8px" wrap="wrap">
          <Button text="다시 시도" onClick={() => void productQuery.refetch()} />
          <Button text="목록으로" variant="outlined" color="normal" onClick={() => navigate("/demo/products")} />
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
    <DetailStack>
      <Button text="목록으로" variant="outlined" color="normal" onClick={() => navigate("/demo/products")} />

      <DetailGrid>
        <Gallery>
          <HeroImage src={product.thumbnail} alt={`${product.title} main image`} />
          <ThumbGrid>
            {product.images.slice(0, 4).map((image, index) => (
              <ThumbImage key={image} src={image} alt={`${product.title} image ${index + 1}`} />
            ))}
          </ThumbGrid>
        </Gallery>

        <InfoPanel>
          <Typography as="h2" variant="h1" text={product.title} color={theme.colors.text.primary} />
          <Typography
            as="p"
            variant="b1Regular"
            text={product.description}
            color={theme.colors.text.secondary}
            mt="10px"
          />

          <MetricGrid>
            <Metric>
              <span>Price</span>
              <strong>{formatCurrency(product.price)}</strong>
            </Metric>
            <Metric>
              <span>Rating</span>
              <strong>{product.rating.toFixed(1)}</strong>
            </Metric>
            <Metric>
              <span>Stock</span>
              <strong>{product.stock.toLocaleString()}</strong>
            </Metric>
          </MetricGrid>

          <Box mt="18px">
            <Typography variant="b2Medium" text="Stock health" color={theme.colors.text.primary} mb="8px" />
            <Progress type="bar" variant="determinate" value={Math.min(100, product.stock)} label="Stock health" />
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
        </InfoPanel>
      </DetailGrid>
    </DetailStack>
  )
}

const DetailStack = styled.div`
  display: grid;
  justify-items: start;
  gap: 16px;
`

const DetailGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.1fr);
  gap: 18px;
  width: 100%;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`

const Gallery = styled.div`
  display: grid;
  gap: 12px;
`

const HeroImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  background: ${({ theme }) => theme.colors.grayscale.white};
`

const ThumbGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
`

const ThumbImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius[6]};
  background: ${({ theme }) => theme.colors.grayscale.white};
`

const InfoPanel = styled.article`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  background: ${({ theme }) => theme.colors.grayscale.white};
`

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`

const Metric = styled.div`
  display: grid;
  gap: 4px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius[6]};
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

const SpecList = styled.dl`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 10px 14px;
  margin: 20px 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  ${({ theme }) => theme.fonts.body.b2.Regular};

  dt,
  dd {
    margin: 0;
  }

  dt {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  dd {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
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

export default ProductDetailPage
