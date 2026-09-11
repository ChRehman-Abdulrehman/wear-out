import { BrowserRouter, Routes, Route, Suspense, lazy } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Category from './pages/Category';
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

const Customers = lazy(() => import('./pages/admin/Customers'));
const ReviewsModeration = lazy(() => import('./pages/admin/ReviewsModeration'));
const Shopkeepers = lazy(() => import('./pages/admin/Shopkeepers'));
const FeaturedRequests = lazy(() => import('./pages/admin/FeaturedRequests'));
const CourierHub = lazy(() => import('./pages/admin/CourierHub'));
const Logistics = lazy(() => import('./pages/admin/Logistics'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));

function AdminFallback() {
  return <div className="p-6 text-slate-400">Loading…</div>;
}

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
                  <Route path="customers" element={<Suspense fallback={<AdminFallback />}><Customers /></Suspense>} />
                  <Route path="reviews" element={<Suspense fallback={<AdminFallback />}><ReviewsModeration /></Suspense>} />
                  <Route path="shopkeepers" element={<Suspense fallback={<AdminFallback />}><Shopkeepers /></Suspense>} />
                  <Route path="featured-requests" element={<Suspense fallback={<AdminFallback />}><FeaturedRequests /></Suspense>} />
                  <Route path="courier" element={<Suspense fallback={<AdminFallback />}><CourierHub /></Suspense>} />
                  <Route path="logistics" element={<Suspense fallback={<AdminFallback />}><Logistics /></Suspense>} />
                  <Route path="analytics" element={<Suspense fallback={<AdminFallback />}><Analytics /></Suspense>} />
                </Route>
              </Route>
            </Routes>
          </CartProvider>
        </AdminAuthProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
}
