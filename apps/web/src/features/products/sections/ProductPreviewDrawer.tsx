import { Box, Button, Drawer, Flex, Progress, Typography, styled, theme } from "@acme/ui"
import type { ProductTableRow } from "../../../entities/product/model/product.types"
import {
  formatCurrency,
  toRatingScore,
  toStockScore,
} from "../../../entities/product/model/productUtils"

const DRAWER_WIDTH = 380

type ProductPreviewDrawerProps = {
  product: ProductTableRow | null
  onClose: () => void
  onDetail: (productId: number) => void
}

const ProductPreviewDrawer = ({ product, onClose, onDetail }: ProductPreviewDrawerProps) => (
  <Drawer
    open={product !== null}
    onClose={onClose}
    placement="right"
    variant="fixed"
    width={`${DRAWER_WIDTH}px`}
    overlay
    disableBackdrop
  >
    {product ? (
      <DrawerContent>
        <Flex justify="space-between" align="start" gap="12px">
          <Box>
            <Typography
              as="h3"
              variant="h2"
              text={product.title}
              color={theme.colors.text.primary}
            />
            <Typography
              variant="b2Regular"
              text={product.category}
              color={theme.colors.text.secondary}
            />
          </Box>
          <Button text="닫기" size="S" variant="outlined" color="normal" onClick={onClose} />
        </Flex>
        <PreviewImage src={product.thumbnail} alt={`${product.title} preview`} />
        <Typography
          variant="b2Regular"
          text={product.description}
          color={theme.colors.text.secondary}
        />
        <InfoList>
          <dt>현재가</dt>
          <dd>{formatCurrency(product.price)}</dd>
          <dt>지표</dt>
          <dd>{product.ratingLabel}</dd>
          <dt>거래 가능 수량</dt>
          <dd>{product.stockLabel}</dd>
        </InfoList>
        <SignalCard>
          <Flex justify="space-between" align="center" mb="8px">
            <Typography
              variant="b2Medium"
              text={`재고: ${product.stock.toLocaleString()} / 100`}
              color={theme.colors.text.primary}
            />
            <Typography
              variant="b3Medium"
              text={`${toStockScore(product.stock)}%`}
              color={theme.colors.text.secondary}
            />
          </Flex>
          <Progress
            type="bar"
            variant="determinate"
            value={toStockScore(product.stock)}
            aria-label={`재고 지표 ${product.stock.toLocaleString()}개`}
          />
          <Typography
            variant="b3Regular"
            text="DummyJSON stock 값을 100 기준의 거래 가능 수량 신호로 표시합니다."
            color={theme.colors.text.tertiary}
            mt="8px"
          />
        </SignalCard>
        <SignalCard>
          <Flex justify="space-between" align="center" mb="8px">
            <Typography
              variant="b2Medium"
              text={`평점: ${product.rating.toFixed(1)} / 5`}
              color={theme.colors.text.primary}
            />
            <Typography
              variant="b3Medium"
              text={`${toRatingScore(product.rating)}%`}
              color={theme.colors.text.secondary}
            />
          </Flex>
          <Progress
            type="bar"
            variant="determinate"
            value={toRatingScore(product.rating)}
            aria-label={`평점 지표 ${product.rating.toFixed(1)}점`}
          />
          <Typography
            variant="b3Regular"
            text="상품 평점을 100점 기준의 관심도 지표로 환산했습니다."
            color={theme.colors.text.tertiary}
            mt="8px"
          />
        </SignalCard>
        <Flex gap="8px" wrap="wrap">
          <Button text="상세 보기" onClick={() => onDetail(product.id)} />
          <Button text="닫기" variant="outlined" color="normal" onClick={onClose} />
        </Flex>
      </DrawerContent>
    ) : null}
  </Drawer>
)

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

export { DRAWER_WIDTH }
export default ProductPreviewDrawer
