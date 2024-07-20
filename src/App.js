// import './App.scss';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdApp from "./pages/admin/app/AdApp";
import AdSignIn from "./pages/admin/auth/AdSignIn";
import SignIn from "./pages/customer/auth/SignIn";
import SignUp from "./pages/customer/auth/SignUp";
import { ToastContainer } from 'react-toastify';
import GoogleLoginSuccess from "./pages/customer/auth/GoogleLoginSuccess";
import ForgotPassword from "./pages/customer/auth/ForgotPassword";
import EmailVerify from "./pages/customer/auth/EmailVerify";
import PasswordReset from "./pages/customer/auth/PasswordReset";
import CusApp from "./pages/customer/app/CusApp";
import Home from "./pages/customer/home/Home";
import Blog from "./pages/customer/blog/Blog";
import SingleBlog from "./pages/customer/blog/SingleBlog";
import Shop from "./pages/customer/shop/Shop";
import SingleProduct from "./pages/customer/shop/SingleProduct";
import CartPage from "./pages/customer/shop/CartPage";
import About from "./pages/customer/about/About";
import Contact from "./pages/customer/contact/Contact";
import AdDashboard from "./pages/admin/dashboard/AdDashboard";
import AdProduct from "./pages/admin/product/AdProduct";
import ScrollToTop from "./ScrollToTop";

const App = () => {
    return (
      <>
          <Router>
            <ScrollToTop />
            <Routes>
                {/* Admin routes */}
                <Route path="/admin" element={<AdApp />}>
                    <Route index element={<AdDashboard />}/>
                    <Route path="products/list" element={<AdProduct />}/>
                </Route>
                <Route path="/admin/sign-in" element={<AdSignIn />}/>

                {/*Customer routes*/}
                <Route path="/" element={<CusApp />}>
                    <Route index element={<Home />}/>
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog/:id" element={<SingleBlog />} />
                    <Route path="shop" element={<Shop />} />
                    <Route path="shop/:id" element={<SingleProduct />} />
                    <Route path="cart-page" element={<CartPage />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                </Route>

                <Route path="/sign-in" element={<SignIn />}/>
                <Route path="/sign-up" element={<SignUp />}/>
                <Route path="/cus/:id/verify/:token" element={<EmailVerify />}/>
                <Route path="/sign-in-success/:userId/:tokenLoginGoogle" element={<GoogleLoginSuccess />}/>
                <Route path="/forgot-password" element={<ForgotPassword />}/>
                <Route path="/password-reset/:id/:token" element={<PasswordReset />}/>

                {/*Not found*/}
                <Route path="*" element={<h1 className="container mt-3 text-center">404 Not Found</h1>}/>
            </Routes>
          </Router>

          <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
          />
      </>
  );
}

export default App;
