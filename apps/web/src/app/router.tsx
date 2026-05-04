import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import AppLayout from "./layouts/AppLayout"
import HomePage from "../pages/home/HomePage"
import DemoHomePage from "../pages/demo/DemoHomePage"
import ProductListPage from "../pages/products/ProductListPage"
import ProductDetailPage from "../pages/products/ProductDetailPage"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="demo" element={<DemoHomePage />} />
          <Route path="demo/products" element={<ProductListPage />} />
          <Route path="demo/products/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
