import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../services/ApiService";

/**
 * Bootstrap‑only, production‑ready Login form.
 */
export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const loginHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await loginApi({ ...form, role: "" });
      if (data?.Message === "Login Successful") {
        navigate("/home");
      } else {
        setError("Invalid credentials");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Server error – please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-secondary min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h3 className="text-center mb-4">Login</h3>

                {error && (
                  <div className="alert alert-danger py-2" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={loginHandler} noValidate>
                  {/* Username */}
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="name"
                      placeholder="Username"
                      required
                      value={form.name}
                      onChange={handleChange}
                    />
                    <label htmlFor="username">Username</label>
                  </div>

                  {/* Password */}
                  <div className="form-floating mb-4">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Password"
                      required
                      value={form.password}
                      onChange={handleChange}
                    />
                    <label htmlFor="password">Password</label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 shadow-sm d-flex justify-content-center align-items-center"
                    disabled={loading}
                  >
                    {loading && (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                    {loading ? "Signing in…" : "Login"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
