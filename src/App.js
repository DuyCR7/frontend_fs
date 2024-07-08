import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdHomePage from "./components/admin/AdHomePage";
import HomePage from "./components/customer/HomePage";

function App() {
  return (
      <Router>
        <Routes>
            {/* Admin routes */}
            <Route path="/admin" element={<AdHomePage />} />

            {/*Customer routes*/}
            <Route path="/" element={<HomePage />}/>

            {/*Not found*/}
            <Route path="*" element={<h1 className="container mt-3 text-center">404 Not Found</h1>}/>
        </Routes>
      </Router>
  );
}

export default App;
