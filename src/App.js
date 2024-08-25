// import './App.scss';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdApp from "./pages/admin/app/AdApp";
import AdSignIn from "./pages/admin/auth/AdSignIn";
import SignIn from "./pages/customer/auth/signIn/SignIn";
import SignUp from "./pages/customer/auth/signUp/SignUp";
import { ToastContainer } from 'react-toastify';
import GoogleLoginSuccess from "./pages/customer/auth/googleLoginSuccess/GoogleLoginSuccess";
import ForgotPassword from "./pages/customer/auth/forgotPassword/ForgotPassword";
import EmailVerify from "./pages/customer/auth/emailVerify/EmailVerify";
import PasswordReset from "./pages/customer/auth/passwordReset/PasswordReset";
import CusApp from "./pages/customer/app/CusApp";
import Home from "./pages/customer/home/Home";
import Blog from "./pages/customer/blog/Blog";
import SingleBlog from "./pages/customer/blog/SingleBlog";
import Shop from "./pages/customer/shop/Shop";
import SingleProduct from "./pages/customer/shop/singleProduct/SingleProduct";
import CartPage from "./pages/customer/shop/cartPage/CartPage";
import About from "./pages/customer/about/About";
import Contact from "./pages/customer/contact/Contact";
import AdDashboard from "./pages/admin/dashboard/AdDashboard";
import ScrollToTop from "./components/ScrollToTop";
import PrivateRoute from "./routes/PrivateRoute";
import AdTeam from "./pages/admin/team/AdTeam";
import AdCategory from "./pages/admin/category/AdCategory";
import AdSizeColor from "./pages/admin/size-color/AdSizeColor";
import AdProduct from "./pages/admin/product/AdProduct";
import AdBanner from "./pages/admin/banner/AdBanner";
import AdEvent from "./pages/admin/event/AdEvent";
import NotFoundPageCus from "./components/NotFoundPageCus/NotFoundPageCus";
import NotFoundPageAd from "./components/NotFoundPageAd/NotFoundPageAd";
import AdPost from "./pages/admin/post/AdPost";

const App = () => {
    return (
      <>
          <Router>
            <ScrollToTop />
            <Routes>
                {/* Admin routes */}
                <Route path="/admin" element={
                    <PrivateRoute>
                        <AdApp />
                    </PrivateRoute>
                }>
                    <Route index element={<AdDashboard />}/>
                    <Route path="banners" element={<AdBanner />}/>
                    <Route path="events" element={<AdEvent />} />
                    <Route path="posts" element={<AdPost />}/>
                    <Route path="categories" element={<AdCategory />}/>
                    <Route path="teams" element={<AdTeam />}/>
                    <Route path="sizes-colors" element={<AdSizeColor />}/>
                    <Route path="products" element={<AdProduct />}/>

                    <Route path="*" element={<NotFoundPageAd />}/>
                </Route>
                <Route path="/admin/sign-in" element={<AdSignIn />}/>

                {/*Customer routes*/}
                <Route path="/" element={<CusApp />}>
                    <Route index element={<Home />}/>
                    <Route path="blogs" element={<Blog />} />
                    <Route path="blogs/:slug" element={<SingleBlog />} />
                    <Route path="shops" element={<Shop />} />
                    <Route path="shops/:team" element={<Shop />} />
                    <Route path="shops/category/:category" element={<Shop />} />
                    <Route path="products/:slug" element={<SingleProduct />} />
                    <Route path="carts" element={<CartPage />} />
                    <Route path="abouts" element={<About />} />
                    <Route path="contacts" element={<Contact />} />

                    <Route path="*" element={<NotFoundPageCus />}/>
                </Route>

                <Route path="/sign-in" element={<SignIn />}/>
                <Route path="/sign-up" element={<SignUp />}/>
                <Route path="/cus/:id/verify/:token" element={<EmailVerify />}/>
                <Route path="/sign-in-success/:userId/:tokenLoginGoogle" element={<GoogleLoginSuccess />}/>
                <Route path="/forgot-password" element={<ForgotPassword />}/>
                <Route path="/password-reset/:id/:token" element={<PasswordReset />}/>

            </Routes>
          </Router>

          <ToastContainer
              position="top-center"
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
