import "./App.css";
import AdminHome from "./components/HomeComponent/Home";
import Login from "./components/LoginComponent/Login";
import Logout from "./components/LogoutComponent/Logout";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import  ProductedRoute from "./Route/ProductedRoute/ProductedRoute";
import { Routes, Route } from "react-router-dom";
import HomeGate from "./components/HomeGate/HomeGate";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/home"
          element={
            <ProductedRoute>
              <HomeGate />
            </ProductedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <ProductedRoute>
              <Logout />
            </ProductedRoute>
          }
        />

        
      </Routes>
    </>
  );
}

export default App;
