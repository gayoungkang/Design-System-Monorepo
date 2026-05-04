import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { Box, Button, Flex, Typography, theme } from "@acme/ui"
import styled from "styled-components"

const AppLayout = () => {
  const navigate = useNavigate()

  return (
    <Shell>
      <Header>
        <Flex align="center" justify="space-between" gap="16px" wrap="wrap">
          <Box>
            <Typography as="h1" variant="h2" text="ACME Demo" color={theme.colors.text.primary} />
            <Typography
              as="p"
              variant="b2Regular"
              text="DummyJSON products API로 확인하는 디자인 시스템 소비 예제"
              color={theme.colors.text.secondary}
            />
          </Box>

          <Nav aria-label="Primary navigation">
            <StyledNavLink to="/">Home</StyledNavLink>
            <StyledNavLink to="/demo">Demo</StyledNavLink>
            <StyledNavLink to="/demo/products">Products</StyledNavLink>
            <Button text="Browse" size="S" onClick={() => navigate("/demo/products")} />
          </Nav>
        </Flex>
      </Header>

      <Main>
        <Outlet />
      </Main>
    </Shell>
  )
}

const Shell = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.default};
`

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  background: ${({ theme }) => theme.colors.grayscale.white};
`

const Main = styled.main`
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 32px 0 56px;
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

const StyledNavLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.borderRadius[4]};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  ${({ theme }) => theme.fonts.body.b2.Medium};

  &.active {
    background: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[400]};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[200]};
    outline-offset: 2px;
  }
`

export default AppLayout
