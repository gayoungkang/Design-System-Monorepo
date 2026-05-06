import type { CSSProperties } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { Box, Flex, Typography, theme } from "@acme/ui"

const navLinkStyle = ({ isActive }: { isActive: boolean }): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  minHeight: "30px",
  padding: "0 10px",
  borderRadius: theme.borderRadius[4],
  color: isActive ? theme.colors.primary[400] : theme.colors.text.secondary,
  background: isActive ? theme.colors.primary[50] : "transparent",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "20px",
})

const AppLayout = () => {
  return (
    <Box sx={{ minHeight: "100vh", background: theme.colors.background.default }}>
      <Box
        as="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: theme.zIndex.sticky,
          borderBottom: `1px solid ${theme.colors.border.default}`,
          background: theme.colors.grayscale.white,
        }}
      >
        <Flex align="center" justify="space-between" gap="16px" wrap="wrap">
          <Box>
            <Typography
              as="h1"
              variant="h2"
              text="ACME Design System"
              color={theme.colors.text.primary}
            />
            <Typography
              as="p"
              variant="b2Regular"
              text="운영 가능한 UI 패키지와 실제 소비 앱을 함께 검증한 포트폴리오"
              color={theme.colors.text.secondary}
              ml={5}
            />
          </Box>

          <Box
            as="nav"
            aria-label="Primary navigation"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <NavLink to="/" style={navLinkStyle}>
              Overview
            </NavLink>
            <NavLink to="/admin" style={navLinkStyle}>
              Admin
            </NavLink>
            <NavLink to="/market" style={navLinkStyle}>
              Market
            </NavLink>
          </Box>
        </Flex>
      </Box>

      <Box
        as="main"
        sx={{
          width: "min(1120px, calc(100% - 32px))",
          margin: "0 auto",
          padding: "32px 0 56px",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default AppLayout
