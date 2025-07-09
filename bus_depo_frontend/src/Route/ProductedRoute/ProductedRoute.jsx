// Route/ProductedRoute/ProductedRoute.jsx
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { tokenValidateApi } from "../../services/ApiService";

export default function ProductedRoute({ children }) {
  const [ok, setOk] = useState(null);      // null = still checking

  useEffect(() => {
    let isMounted = true;
    tokenValidateApi()
      .then(() => isMounted && setOk(true))
      .catch(() => isMounted && setOk(false));
    return () => (isMounted = false);
  }, []);

  if (ok === null) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border" /></div>;
  return ok ? children : <Navigate to="/" replace />;
}
