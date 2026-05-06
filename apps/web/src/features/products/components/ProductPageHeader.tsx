import { Box, Flex, Typography, styled, theme } from "@acme/ui"
import { formatCurrency } from "../../../entities/product/model/productUtils"

type ProductPageHeaderProps = {
  summary: {
    count: number
    averagePrice: number
    averageRating: number
    totalStock: number
  }
}

const ProductPageHeader = ({ summary }: ProductPageHeaderProps) => (
  <HeaderPanel>
    <Flex justify="space-between" align="center" gap="16px" wrap="wrap">
      <Box>
        <Typography as="h2" variant="h1" text="마켓 탐색기" color={theme.colors.text.primary} />
        <Typography
          as="p"
          variant="b2Regular"
          text="DummyJSON products 데이터를 마켓 탐색형 지표로 재구성한 포트폴리오 데모입니다."
          color={theme.colors.text.secondary}
          ml={5}
        />
      </Box>
      <MarketBadge>
        <Typography variant="b3Medium" text="Products API" color={theme.colors.primary[400]} />
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
  </HeaderPanel>
)

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

export default ProductPageHeader
