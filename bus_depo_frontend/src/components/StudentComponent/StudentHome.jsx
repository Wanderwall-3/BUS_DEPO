/* eslint-disable no-irregular-whitespace */
/* StudentHome.jsx – enterprise‑grade, fully responsive student dashboard
   ─────────────────────────────────────────────────────────────────────────────
   Stack   : React 18 + Bootstrap 5 + bootstrap‑icons
   Features: ▸ Avatar upload with live preview
             ▸ Assigned‑route list
             ▸ Google‑style search (stop + time) with results card
             ▸ Click a route (assigned or search result) to open a modal that
               shows the **full stop list** parsed from the `route` field.
   Robust  : ▸ Safe JSON parsing
             ▸ Graceful empty & error states
             ▸ Loading spinners
*/

import { useEffect, useRef, useState } from "react";
import Logout from "../LogoutComponent/Logout";
import {
  getStudentDetailsApi,
  uploadStudentProfileApi,
  searchRouteApi,
} from "../../services/ApiService";

/* ───────────────────────── helpers */
const padSeconds = (t = "") => (t && t.length === 5 ? `${t}:00` : t || "00:00:00");
const safeParseRoute = (raw = "") => {
  try {
    const { from = "—", to = "—" } = JSON.parse(raw);
    return { from, to };
  } catch (_) {
    return { from: "—", to: "—" };
  }
};
// full stop list – supports {a,b,c} or ["a","b","c"], or {"route":[…]}
const extractStops = (raw = "") => {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed?.route && Array.isArray(parsed.route)) return parsed.route;
  } catch (_) {
    /* fall through */
  }
  return raw.replace(/[{}\[\]"]+/g, "").split(/\s*,\s*/).filter(Boolean);
};

export default function StudentHome() {
  /* ─────────── state */
  const [me, setMe] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [stopQuery, setStopQuery] = useState("");
  const [timeQuery, setTimeQuery] = useState("09:30");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);

  const [modalRoute, setModalRoute] = useState(null); // currently selected route for modal

  const fileInput = useRef(null);
  const defaultAvatar =
    "https://vdbczxmbmzljohcjoqvt.supabase.co/storage/v1/object/public/profile-bucket//126-1262807_instagram-default-profile-picture-png.png";

  /* ─────────── effects */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getStudentDetailsApi();
        setMe(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  /* ─────────── handlers */
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setAvatarUploading(true);
    try {
      const form = new FormData();
      form.append("file", avatarFile);
      await uploadStudentProfileApi(form);
      const { data } = await getStudentDetailsApi();
      setMe(data);
      setAvatarFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!stopQuery.trim()) return;
    setSearching(true);
    try {
      const { data } = await searchRouteApi(stopQuery.trim(), padSeconds(timeQuery));
      setResults(data);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const openModal = (routeObj) => setModalRoute(routeObj);
  const closeModal = () => setModalRoute(null);

  /* ─────────── skeleton */
  if (!me)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" />
      </div>
    );

  /* ─────────── render */
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm py-2">
        <div className="container-fluid gap-3">
          <span className="navbar-brand fw-bold fs-4">Bus.D</span>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#studentNav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="studentNav">
            {/* search */}
            <form
              className="d-flex flex-grow-1 mx-lg-3 my-2 my-lg-0"
              onSubmit={handleSearch}
              role="search"
            >
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search" />
                </span>
                <input
                  className="form-control border-start-0"
                  type="search"
                  placeholder="Search stop…"
                  value={stopQuery}
                  onChange={(e) => setStopQuery(e.target.value)}
                />
                <input
                  type="time"
                  step="60"
                  className="form-control"
                  value={timeQuery}
                  onChange={(e) => setTimeQuery(e.target.value)}
                  style={{ maxWidth: 135 }}
                />
                <button className="btn btn-primary" disabled={searching}>
                  {searching ? <span className="spinner-border spinner-border-sm" /> : "Go"}
                </button>
              </div>
            </form>

            <ul className="navbar-nav ms-lg-auto mb-2 mb-lg-0">
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

      {/* push below navbar */}
      <header style={{ paddingTop: 88 }} />

      <div className="container-xl pb-5">
        <section className="row gy-4">
          {/* Profile */}
          <div className="col-lg-4 col-md-5 col-12">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="position-relative d-inline-block">
                  <img
                    src={avatarFile ? URL.createObjectURL(avatarFile) : me.profile ?? defaultAvatar}
                    alt="profile"
                    width="140"
                    height="140"
                    className="rounded-circle object-fit-cover border border-2 border-white shadow-sm"
                  />
                  <button
                    className="btn btn-sm btn-light rounded-circle position-absolute bottom-0 end-0 border"
                    title="Change photo"
                    onClick={() => fileInput.current?.click()}
                  >
                    <i className="bi bi-camera" />
                  </button>
                </div>
                <h5 className="mt-3 mb-1 fw-semibold text-break">{me.userName}</h5>
                <small className="text-muted d-block">Reg No: {me.collegeRegisterNumber}</small>
              </div>

              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              />

              {avatarFile && (
                <div className="card-footer bg-white border-top-0 p-2">
                  <button
                    className="btn btn-primary w-100"
                    disabled={avatarUploading}
                    onClick={handleAvatarUpload}
                  >
                    {avatarUploading ? "Uploading…" : "Upload"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Assigned route list */}
          <div className="col-lg-8 col-md-7 col-12" id="route">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent d-flex align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-signpost me-2 text-primary" />My Route
                </h5>
              </div>
              <div className="card-body p-0">
                {me.routeModel?.length ? (
                  <ul className="list-group list-group-flush">
                    {me.routeModel.map((r) => {
                      const { from, to } = safeParseRoute(r.route);
                      return (
                        <li
                          key={r.id}
                          className="list-group-item d-flex align-items-start gap-3 list-group-item-action"
                          style={{ cursor: "pointer" }}
                          onClick={() => openModal(r)}
                        >
                          <i className="bi bi-geo-alt-fill fs-5 text-primary" />
                          <div>
                            <span className="fw-medium">
                              {from} → {to}
                            </span>
                            <br />
                            <small className="text-muted">
                              Time: {r.time}
                              {r.driverModel?.userName && <> • Driver: {r.driverModel.userName}</>}
                              {r.driverModel?.busId && <> • Bus ID: {r.driverModel.busId}</>}
                              {r.driverModel?.collegeRegisterNumber && <> • Reg No: {r.driverModel.collegeRegisterNumber}</>}
                            </small>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="py-4 text-center text-muted">
                    <i className="bi bi-info-circle me-1" />No assigned route yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search results card */}
          {!!results.length && (
            <div className="col-12">
              <div className="card border-0 shadow-sm animate__animated animate__fadeIn">
                <div className="card-header bg-transparent d-flex align-items-center justify-content-between">
                  <h5 className="mb-0">
                    <i className="bi bi-search me-2" />Search Results ({results.length})
                  </h5>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => setResults([])}>
                    Clear
                  </button>
                </div>
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    {results.map((r) => {
                      const { from, to } = safeParseRoute(r.route);
                      return (
                        <li
                          key={r.id}
                          className="list-group-item d-flex align-items-start gap-3 list-group-item-action"
                          style={{ cursor: "pointer" }}
                          onClick={() => openModal(r)}
                        >
                          <i className="bi bi-pin-map-fill fs-5 text-success" />
                          <div>
                            <span className="fw-medium">
                              {from} → {to}
                            </span>
                            <br />
                            <small className="text-muted">
                              Time: {r.time}
                              {r.driverModel?.userName && <> • Driver: {r.driverModel.userName}</>}
                              {r.driverModel?.busId && <> • Bus ID: {r.driverModel.busId}</>}
                              {r.driverModel?.collegeRegisterNumber && <> • Reg No: {r.driverModel.collegeRegisterNumber}</>}
                            </small>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Route Details Modal */}
      {modalRoute && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={closeModal}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-map me-2" />Route Details
                </h5>
                <button type="button" className="btn-close" onClick={closeModal} />
              </div>
              <div className="modal-body p-0">
                <ul className="list-group list-group-flush">
                  {extractStops(modalRoute.route).map((stop, idx) => (
                    <li key={idx} className="list-group-item d-flex align-items-start gap-2">
                      <span className="badge bg-secondary rounded-pill">{idx + 1}</span>
                      <span className="flex-grow-1">{stop}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
