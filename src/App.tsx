import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "@/auth/AuthProvider";
import RequireAdmin from "@/auth/RequireAdmin";
import RequireAuth from "@/auth/RequireAuth";
import CartProvider from "@/cart/CartProvider";
import ProductsPage from "./pages/admin/ProductsPage";
import AddProductPage from "./pages/admin/AddProductPage";
import EditProductPage from "./pages/admin/EditProductPage";
import AdminProductDetailPage from "./pages/admin/ProductDetailPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import NotFound from "./pages/NotFound";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/shop" element={<Navigate to="/" replace />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/cart"
                element={
                  <RequireAuth>
                    <CartPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/checkout"
                element={
                  <RequireAuth>
                    <CheckoutPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/orders"
                element={
                  <RequireAuth>
                    <OrdersPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <RequireAuth>
                    <OrderDetailPage />
                  </RequireAuth>
                }
              />

              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <ProductsPage />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <RequireAdmin>
                    <ProductsPage />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/products/:id"
                element={
                  <RequireAdmin>
                    <AdminProductDetailPage />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <RequireAdmin>
                    <CategoriesPage />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/products/new"
                element={
                  <RequireAdmin>
                    <AddProductPage />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/products/:id/edit"
                element={
                  <RequireAdmin>
                    <EditProductPage />
                  </RequireAdmin>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
