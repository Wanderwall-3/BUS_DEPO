import React from "react";
import LogoutService from "../../services/LogoutService";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await LogoutService();
    localStorage.clear();
    navigate("/", { replace: true });
    window.location.reload(); // flush in‑memory state
  };

  return (
    <div>
      <button className="btn btn-danger" type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Logout;
