// import './App.scss';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdHomePage from "./components/admin/AdHomePage";
import HomePage from "./components/customer/HomePage";
import AdSignIn from "./components/admin/auth/AdSignIn";
import SignIn from "./components/customer/auth/SignIn";
import SignUp from "./components/customer/auth/SignUp";
import { ToastContainer } from 'react-toastify';
import LoginSuccess from "./components/customer/auth/LoginSuccess";
import ForgotPassword from "./components/customer/auth/ForgotPassword";
import EmailVerify from "./components/customer/auth/EmailVerify";

const App = () => {
    return (
      <>
          <Router>
            <Routes>
                {/* Admin routes */}
                <Route path="/admin" element={<AdHomePage />} />
                <Route path="/admin/sign-in" element={<AdSignIn />}/>

                {/*Customer routes*/}
                <Route path="/" element={<HomePage />}/>
                <Route path="/sign-in" element={<SignIn />}/>
                <Route path="/sign-up" element={<SignUp />}/>
                <Route path="/cus/:id/verify/:token" element={<EmailVerify />}/>
                <Route path="/sign-in-success/:userId/:tokenLoginGoogle" element={<LoginSuccess />}/>
                <Route path="/forgot-password" element={<ForgotPassword />}/>

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
