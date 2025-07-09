/* eslint-disable no-irregular-whitespace */
/* StudentHome.jsx – Student dashboard with profile upload + route overview
   ------------------------------------------------------------------------
   Assumes the same styling/dev stack as DriverHome (Bootstrap 5 + bootstrap‑icons).
*/

import { useEffect, useRef, useState } from "react";
import Logout from "../LogoutComponent/Logout";
import {
  getStudentDetailsApi,
  uploadStudentProfileApi,
} from "../../services/ApiService";


export default function StudentHome() {
  const [me, setMe] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const defaultAvatar = "https://vdbczxmbmzljohcjoqvt.supabase.co/storage/v1/object/public/profile-bucket//126-1262807_instagram-default-profile-picture-png.png";

  useEffect(() => {
    fetchMe();
  }, []);

  async function fetchMe() {
    try {
      const { data } = await getStudentDetailsApi();
      setMe(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file",file)
      await uploadStudentProfileApi(form);
      await fetchMe(); // refresh avatar
      setFile(null);
    } finally {
      setUploading(false);
    }
  }

  if (!me)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status" />
      </div>
    );

  return (
    <>
      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">Bus.D</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#studentNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="studentNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  <i className="bi bi-house-door me-1" />Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#route">
                  <i className="bi bi-signpost me-1" />My Route
                </a>
              </li>
              <li className="nav-item">
                <Logout className="nav-link" />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ensure content is not hidden behind the fixed navbar */}
      <header style={{ paddingTop: "80px" }} />

      <div className="container">
        <section className="row gy-4">
          {/* ── Profile card ─────────────────────────────────────────────── */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="position-relative d-inline-block">
                  <img
                    src={me.profile ?? defaultAvatar}
                    className="rounded-circle object-fit-cover"
                    width="140"
                    height="140"
                    alt="profile"
                  />
                  <button
                    className="btn btn-sm btn-light rounded-circle position-absolute bottom-0 end-0"
                    title="Change photo"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <i className="bi bi-camera" />
                  </button>
                </div>
                <h5 className="mt-3 mb-0">{me.userName}</h5>
                <span className="text-muted">
                  Reg No: {me.collegeRegisterNumber}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file && (
                <div className="card-footer bg-white border-top-0">
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading…" : "Upload"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Route card ──────────────────────────────────────────────── */}
          <div className="col-md-8" id="route">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">
                  <i className="bi bi-signpost me-2" />My Route
                </h5>
              </div>
              <div className="card-body">
                {me.routeModel?.length ? (
                  me.routeModel.map((r) => {
                    const parsed = JSON.parse(r.route);
                    return (
                      <div
                        key={r.id}
                        className="d-flex align-items-start border-bottom py-2"
                      >
                        <i className="bi bi-geo-alt-fill fs-4 me-3 text-primary" />
                        <div>
                          <p className="mb-1 fw-medium">
                            {parsed.from} → {parsed.to}
                          </p>
                          <small className="text-muted">
                            Time: {r.time}
                            {r.driverModel?.userName && (
                              <> • Driver: {r.driverModel.userName}</>
                            )}
                          </small>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted mb-0">
                    You don’t have any route assigned yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
