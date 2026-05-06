import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom"
import AppLayout from "./layouts/AppLayout"
import HomePage from "../pages/home/HomePage"
import ProductListPage from "../pages/products/ProductListPage"
import ProductDetailPage from "../pages/products/ProductDetailPage"
import MarketPage from "../pages/market/MarketPage"

const LegacyDemoRedirect = () => {
  const location = useLocation()
  return <Navigate replace to={`/admin${location.search}`} state={location.state} />
}

const LegacyProductDetailRedirect = () => {
  const location = useLocation()
  const { id } = useParams()
  return <Navigate replace to={`/admin/${id ?? ""}${location.search}`} state={location.state} />
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="admin" element={<ProductListPage />} />
          <Route path="admin/:id" element={<ProductDetailPage />} />
          <Route path="market" element={<MarketPage />} />
          <Route path="demo" element={<LegacyDemoRedirect />} />
          <Route path="demo/products" element={<LegacyDemoRedirect />} />
          <Route path="demo/products/:id" element={<LegacyProductDetailRedirect />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
