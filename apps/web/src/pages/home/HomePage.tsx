import { useNavigate } from "react-router-dom"
import { Box, Button, Flex, Typography, theme } from "@acme/ui"

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ display: "grid", gap: "20px" }}>
      <Box
        as="section"
        p="28px"
        sx={{
          display: "grid",
          gap: "20px",
          border: `1px solid ${theme.colors.border.default}`,
          borderRadius: theme.borderRadius[8],
          background: theme.colors.grayscale.white,
        }}
      >
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
      </Box>

      <Box
        as="section"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "12px",
          "@media (max-width: 760px)": {
            gridTemplateColumns: "1fr",
          },
        }}
      >
        {[
          {
            title: "Server state",
            description: "React Query query key factory로 목록과 상세 API 캐시를 분리합니다.",
          },
          {
            title: "Operational states",
            description: "로딩, 에러, 빈 결과, 상세 이동, Drawer preview 흐름을 포함합니다.",
          },
          {
            title: "Design system use",
            description:
              "Button, TextField, Select, Table, Drawer, Skeleton, Progress, Typography, Box, Flex를 실제 앱에서 소비합니다.",
          },
        ].map((feature) => (
          <Box
            key={feature.title}
            as="article"
            p="18px"
            sx={{
              display: "grid",
              gap: "8px",
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius[8],
              background: theme.colors.grayscale.white,
            }}
          >
            <Typography variant="b1Bold" text={feature.title} color={theme.colors.text.primary} />
            <Typography
              variant="b2Regular"
              text={feature.description}
              color={theme.colors.text.secondary}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default HomePage
