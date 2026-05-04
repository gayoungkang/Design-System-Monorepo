import { useNavigate } from "react-router-dom"
import { Box, Button, Flex, Typography, theme } from "@acme/ui"
import styled from "styled-components"

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <PageStack>
      <Hero>
        <Box>
          <Typography
            as="h2"
            variant="h1"
            text="운영 화면에서 확인하는 ACME UI"
            color={theme.colors.text.primary}
            mb="8px"
          />
          <Typography
            as="p"
            variant="b1Regular"
            text="무료 DummyJSON products API를 React Query로 호출하고, @acme/ui 컴포넌트만 조합해 실제 서비스형 데모를 구성했습니다."
            color={theme.colors.text.secondary}
          />
        </Box>

        <Flex gap="8px" wrap="wrap">
          <Button text="데모 시작" onClick={() => navigate("/demo")} />
          <Button
            text="상품 보기"
            variant="outlined"
            color="normal"
            onClick={() => navigate("/demo/products")}
          />
        </Flex>
      </Hero>

      <FeatureGrid>
        <FeatureCard>
          <Typography variant="b1Bold" text="Server state" color={theme.colors.text.primary} />
          <Typography
            variant="b2Regular"
            text="React Query query key factory로 목록과 상세 API 캐시를 분리합니다."
            color={theme.colors.text.secondary}
          />
        </FeatureCard>
        <FeatureCard>
          <Typography variant="b1Bold" text="Operational states" color={theme.colors.text.primary} />
          <Typography
            variant="b2Regular"
            text="로딩, 에러, 빈 결과, 상세 이동, Drawer preview 흐름을 포함합니다."
            color={theme.colors.text.secondary}
          />
        </FeatureCard>
        <FeatureCard>
          <Typography variant="b1Bold" text="Design system use" color={theme.colors.text.primary} />
          <Typography
            variant="b2Regular"
            text="Button, TextField, Select, Table, Drawer, Skeleton, Progress, Typography, Box, Flex를 실제 앱에서 소비합니다."
            color={theme.colors.text.secondary}
          />
        </FeatureCard>
      </FeatureGrid>
    </PageStack>
  )
}

const PageStack = styled.div`
  display: grid;
  gap: 20px;
`

const Hero = styled.section`
  display: grid;
  gap: 20px;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  background: ${({ theme }) => theme.colors.grayscale.white};
`

const FeatureGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

const FeatureCard = styled.article`
  display: grid;
  gap: 8px;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  background: ${({ theme }) => theme.colors.grayscale.white};
`

export default HomePage
