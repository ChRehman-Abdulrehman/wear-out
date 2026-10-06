import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import NotFound from './pages/NotFound';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuth';
import { ConfigProvider } from './context/ConfigContext';
import store from './store';
import { Provider } from 'react-redux';

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Products = lazy(() => import('./pages/admin/Products'));
const Orders = lazy(() => import('./pages/admin/Orders'));
const BlogManager = lazy(() => import('./pages/admin/BlogManager'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const ReviewsModeration = lazy(() => import('./pages/admin/ReviewsModeration'));
const Shopkeepers = lazy(() => import('./pages/admin/Shopkeepers'));
const FeaturedRequests = lazy(() => import('./pages/admin/FeaturedRequests'));
const CourierHub = lazy(() => import('./pages/admin/CourierHub'));
const Logistics = lazy(() => import('./pages/admin/Logistics'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const SellerLogin = lazy(() => import('./pages/seller/SellerLogin'));
const SellerSignup = lazy(() => import('./pages/seller/SellerSignup'));
const ShopkeeperLayout = lazy(() => import('./pages/seller/ShopkeeperLayout'));
const ShopkeeperDashboard = lazy(() => import('./pages/seller/ShopkeeperDashboard'));
const ShopkeeperProducts = lazy(() => import('./pages/seller/ShopkeeperProducts'));
const ShopkeeperOrders = lazy(() => import('./pages/seller/ShopkeeperOrders'));
const ShopkeeperCustomers = lazy(() => import('./pages/seller/ShopkeeperCustomers'));

function AdminFallback() {
  return <div className="p-6 text-slate-400">Loading…</div>;
}

function Suspended({ children }) {
  return <Suspense fallback={<AdminFallback />}>{children}</Suspense>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Provider store={store}>
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
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogDetail />} />
                </Route>

                <Route path="/admin/login" element={<Suspended><AdminLogin /></Suspended>} />
                <Route path="/seller/login" element={<Suspended><SellerLogin /></Suspended>} />
                <Route path="/seller/signup" element={<Suspended><SellerSignup /></Suspended>} />
                <Route path="/seller" element={<Suspended><ShopkeeperLayout /></Suspended>}>
                  <Route index element={<ShopkeeperDashboard />} />
                  <Route path="products" element={<ShopkeeperProducts />} />
                  <Route path="orders" element={<ShopkeeperOrders />} />
                  <Route path="customers" element={<ShopkeeperCustomers />} />
                </Route>
                <Route path="/admin" element={<ProtectedRoute />}>
                  <Route element={<Suspended><AdminLayout /></Suspended>}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="blog" element={<BlogManager />} />
                    <Route path="customers" element={<Suspense fallback={<AdminFallback />}><Customers /></Suspense>} />
                    <Route path="reviews" element={<Suspense fallback={<AdminFallback />}><ReviewsModeration /></Suspense>} />
                    <Route path="shopkeepers" element={<Suspense fallback={<AdminFallback />}><Shopkeepers /></Suspense>} />
                    <Route path="featured-requests" element={<Suspense fallback={<AdminFallback />}><FeaturedRequests /></Suspense>} />
                    <Route path="courier" element={<Suspense fallback={<AdminFallback />}><CourierHub /></Suspense>} />
                    <Route path="logistics" element={<Suspense fallback={<AdminFallback />}><Logistics /></Suspense>} />
                    <Route path="analytics" element={<Suspense fallback={<AdminFallback />}><Analytics /></Suspense>} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </CartProvider>
          </AdminAuthProvider>
        </ConfigProvider>
      </Provider>
    </BrowserRouter>
  );
}