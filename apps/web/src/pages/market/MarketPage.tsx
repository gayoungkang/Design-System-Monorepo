import { useNavigate } from "react-router-dom"
import { Box, Button, Flex, Typography, theme } from "@acme/ui"

const MarketPage = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      <Box
        as="section"
        p="28px"
        sx={{
          display: "grid",
          gap: "14px",
          border: `1px solid ${theme.colors.border.default}`,
          borderRadius: theme.borderRadius[8],
          background: theme.colors.grayscale.white,
        }}
      >
        <Typography
          as="h2"
          variant="h1"
          text="Market Experience"
          color={theme.colors.text.primary}
        />
        <Typography
          as="p"
          variant="b1Regular"
          text="사용자용 반응형 탐색 앱을 위한 자리입니다. 다음 단계에서 카드 기반 검색, 모바일 필터, Drawer 탐색 흐름을 검증합니다."
          color={theme.colors.text.secondary}
        />
        <Flex gap="8px" wrap="wrap">
          <Button text="Admin Operations 보기" onClick={() => navigate("/admin")} />
          <Button
            text="Overview로 이동"
            variant="outlined"
            color="normal"
            onClick={() => navigate("/")}
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
            title: "Card browsing",
            description: "상품 이미지를 중심으로 빠르게 스캔하는 사용자용 탐색 흐름입니다.",
          },
          {
            title: "Mobile filters",
            description: "작은 화면에서 Drawer와 하단 액션을 활용하는 UX 검증 영역입니다.",
          },
          {
            title: "Responsive states",
            description: "로딩, 빈 결과, 에러, 상세 진입을 모바일 기준으로 다시 점검합니다.",
          },
        ].map((item) => (
          <Box
            key={item.title}
            as="article"
            p="18px"
            sx={{
              display: "grid",
              gap: "8px",
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius[8],
              background: theme.colors.background.default,
            }}
          >
            <Typography variant="b1Bold" text={item.title} color={theme.colors.text.primary} />
            <Typography
              variant="b2Regular"
              text={item.description}
              color={theme.colors.text.secondary}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default MarketPage
