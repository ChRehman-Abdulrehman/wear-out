import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Category from './pages/Category';
import ComingSoon from './pages/ComingSoon';
import Search from './pages/Search';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import BulkOrders from './pages/BulkOrders';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import ReviewsModeration from './pages/admin/ReviewsModeration';
import Shopkeepers from './pages/admin/Shopkeepers';
import FeaturedRequests from './pages/admin/FeaturedRequests';
import CourierHub from './pages/admin/CourierHub';
import Logistics from './pages/admin/Logistics';
import Analytics from './pages/admin/Analytics';
import SellerLogin from './pages/seller/SellerLogin';
import SellerSignup from './pages/seller/SellerSignup';
import ShopkeeperLayout from './pages/seller/ShopkeeperLayout';
import ShopkeeperDashboard from './pages/seller/ShopkeeperDashboard';
import ShopkeeperProducts from './pages/seller/ShopkeeperProducts';
import ShopkeeperOrders from './pages/seller/ShopkeeperOrders';
import ShopkeeperCustomers from './pages/seller/ShopkeeperCustomers';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuth';
import { ConfigProvider } from './context/ConfigContext';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ConfigProvider>
        <AdminAuthProvider>
          <CartProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shirts" element={<Category />} />
                <Route path="/trousers" element={<Category />} />
                <Route path="/caps" element={<Category />} />
                <Route path="/unstitch" element={<Category />} />
                <Route path="/search" element={<Search />} />
                <Route path="/watches" element={<Category />} />
                <Route path="/accessories" element={<Category />} />
                <Route path="/shoes" element={<Category />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/bulk-orders" element={<BulkOrders />} />
              </Route>

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/seller/login" element={<SellerLogin />} />
              <Route path="/seller/signup" element={<SellerSignup />} />
              <Route path="/seller" element={<ShopkeeperLayout />}>
                <Route index element={<ShopkeeperDashboard />} />
                <Route path="products" element={<ShopkeeperProducts />} />
                <Route path="orders" element={<ShopkeeperOrders />} />
                <Route path="customers" element={<ShopkeeperCustomers />} />
              </Route>
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="reviews" element={<ReviewsModeration />} />
                  <Route path="shopkeepers" element={<Shopkeepers />} />
                  <Route path="featured-requests" element={<FeaturedRequests />} />
                  <Route path="courier" element={<CourierHub />} />
                  <Route path="logistics" element={<Logistics />} />
                  <Route path="analytics" element={<Analytics />} />
                </Route>
              </Route>
            </Routes>
          </CartProvider>
        </AdminAuthProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
}
