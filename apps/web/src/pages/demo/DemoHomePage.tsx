import { useNavigate } from "react-router-dom"
import { Box, Button, Flex, Progress, Typography, theme } from "@acme/ui"

const DemoHomePage = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, 0.6fr)",
        gap: "16px",
        "@media (max-width: 840px)": {
          gridTemplateColumns: "1fr",
        },
      }}
    >
      <Box
        as="section"
        p="24px"
        sx={{
          border: `1px solid ${theme.colors.border.default}`,
          borderRadius: theme.borderRadius[8],
          background: theme.colors.grayscale.white,
        }}
      >
        <Typography as="h2" variant="h1" text="Products demo" color={theme.colors.text.primary} />
        <Typography
          as="p"
          variant="b1Regular"
          text="검색, 정렬, 페이지네이션, 상세 조회, Drawer preview까지 한 화면에서 확인할 수 있는 상품 탐색 데모입니다."
          color={theme.colors.text.secondary}
          mt="8px"
        />
        <Flex mt="20px" gap="8px">
          <Button text="상품 목록 열기" onClick={() => navigate("/demo/products")} />
          <Button text="홈으로" variant="outlined" color="normal" onClick={() => navigate("/")} />
        </Flex>
      </Box>

      <Box
        as="section"
        p="24px"
        sx={{
          border: `1px solid ${theme.colors.border.default}`,
          borderRadius: theme.borderRadius[8],
          background: theme.colors.grayscale.white,
        }}
      >
        <Typography variant="h3" text="API readiness" color={theme.colors.text.primary} />
        <Box mt="12px">
          <Progress type="bar" variant="determinate" value={70} label="API coverage" />
        </Box>
        <Typography
          variant="b2Regular"
          text="이번 단계는 products API만 연결했습니다. users/posts는 다음 어드민 단계에서 연결하기 좋은 상태로 남겨두었습니다."
          color={theme.colors.text.secondary}
          mt="12px"
        />
      </Box>
    </Box>
  )
}

export default DemoHomePage
