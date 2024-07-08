// import './App.scss';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdHomePage from "./components/admin/AdHomePage";
import HomePage from "./components/customer/HomePage";
import AdSignIn from "./components/admin/auth/AdSignIn";
import SignIn from "./components/customer/auth/SignIn";
import SignUp from "./components/customer/auth/SignUp";

const App = () => {
  return (
      <Router>
        <Routes>
            {/* Admin routes */}
            <Route path="/admin" element={<AdHomePage />} />
            <Route path="/admin/signin" element={<AdSignIn />}/>

            {/*Customer routes*/}
            <Route path="/" element={<HomePage />}/>
            <Route path="/signin" element={<SignIn />}/>
            <Route path="/signup" element={<SignUp />}/>

            {/*Not found*/}
            <Route path="*" element={<h1 className="container mt-3 text-center">404 Not Found</h1>}/>
        </Routes>
      </Router>
  );
}

export default App;
