/* eslint-disable no-irregular-whitespace */
import React, { useEffect, useState, useMemo } from "react";
import Logout from "../LogoutComponent/Logout";
import {
  getDetailsApi,
  addAdminApi,
  addDriverApi,
  addStudentApi,
  listByRoleApi,
  deleteAccountApi,
} from "../../services/ApiService";

/**
 * AdminHome – Bootstrap‑only & fully responsive.
 */
export default function AdminHome() {
  /* ───────────── State ───────────── */
  const [details, setDetails] = useState(null);
  const [activeForm, setActiveForm] = useState(null); // "student" | "driver" | "admin"
  const [selectedRole, setSelectedRole] = useState("");
  const [rows, setRows] = useState([]);

  /* Columns config */
  const HIDDEN_COLS = ["userModel", "password","profile"];
  const XS_ONLY_HIDE = ["email", "department"]; // hide these on phones

  /* ───────────── Fetch user + saved role (once) ───────────── */
  useEffect(() => {
    (async () => {
      const [{ data: user }, savedRole] = await Promise.all([
        getDetailsApi(),
        Promise.resolve(localStorage.getItem("admin-selected-role") || ""),
      ]);
      setDetails(user);
      if (savedRole) setSelectedRole(savedRole);
    })();
  }, []);

  /* ───────────── Persist + refresh data on role change ───────────── */
  useEffect(() => {
    if (!selectedRole) return;
    localStorage.setItem("admin-selected-role", selectedRole);
    fetchRows(selectedRole);
  }, [selectedRole]);

  /* ───────────── Form metadata (static) ───────────── */
  const formMeta = useMemo(
    () => ({
      student: {
        title: "Add Student",
        submit: addStudentApi,
        fields: [
          { name: "userName", label: "Name", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "passoutYear", label: "Pass‑out Year", type: "number" },
          { name: "department", label: "Department", type: "text" },
          { name: "collegeRegisterNumber", label: "College Register #", type: "number" },
        ],
      },
      driver: {
        title: "Add Driver",
        submit: addDriverApi,
        fields: [
          { name: "userName", label: "Name", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "joinDate", label: "Join Date", type: "date" },
          { name: "busId", label: "Bus ID", type: "text" },
          { name: "phoneNumber", label: "Phone", type: "number" },
          { name: "department", label: "Department", type: "text" },
          { name: "collegeRegisterNumber", label: "College Register #", type: "number" },
        ],
      },
      admin: {
        title: "Add Admin",
        submit: addAdminApi,
        fields: [
          { name: "userName", label: "Name", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "department", label: "Department", type: "text" },
          { name: "collegeRegisterNumber", label: "College Register #", type: "number" },
        ],
      },
    }),
    []
  );

  /* ───────────── Helpers ───────────── */
  const fetchRows = async (role) => {
    try {
      const { data } = await listByRoleApi(role);
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Could not load list ❗️");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeForm) return;
    const { submit } = formMeta[activeForm];
    const payload = Object.fromEntries(new FormData(e.target).entries());
    ["phoneNumber", "collegeRegisterNumber", "passoutYear"].forEach((k) => {
      if (payload[k]) payload[k] = Number(payload[k]);
    });
    try {
      await submit(payload);
      await fetchRows(selectedRole);
      alert("Saved ✨");
      setActiveForm(null);
      e.target.reset();
    } catch {
      alert("Already Added ❗️");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete account for ${user.userName}?`)) return;
    try {
      await deleteAccountApi(user.userName);
      await fetchRows(selectedRole);
      alert("Deleted successfully ✅");
    } catch {
      alert("Error while deleting. Please try again.");
    }
  };

  const handleEdit = (row) => {
    alert(`Edit flow coming soon for: ${row.userName}`);
  };

  /* ───────────── Early exit ───────────── */
  if (!details) return null;

  /* ───────────── UI ───────────── */
  return (
    <>
      {details.role === "ADMIN" && (
        <>
          {/* Navbar */}
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
            <div className="container-fluid">
              <span className="navbar-brand">Admin Portal</span>
              <div className="d-none d-md-block text-white fw-medium">
                {details.name?.toUpperCase()}
              </div>
              <div><Logout/></div>
            </div>
          </nav>
          <div style={{ paddingTop: "4rem" }} />

          {/* Quick actions */}
          <div className="container mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white"><h5 className="mb-0">Quick Actions</h5></div>
              <div className="card-body d-flex flex-column flex-md-row gap-2">
                {["student", "driver", "admin"].map((role) => (
                  <button
                    key={role}
                    className={`btn flex-fill ${
                      { student: "btn-outline-primary", driver: "btn-outline-success", admin: "btn-outline-warning" }[role]
                    }`}
                    onClick={() => setActiveForm(role)}
                  >
                    Add {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Role picker */}
          <div className="container mb-3 d-flex align-items-center gap-2">
            <label htmlFor="roleSelect" className="form-label mb-0">Choose a role:</label>
            <select id="roleSelect" className="form-select d-inline-block w-auto" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="">— Select —</option>
              <option value="ADMIN">ADMIN</option>
              <option value="DRIVER">DRIVER</option>
              <option value="STUDENT">STUDENT</option>
            </select>
          </div>

          {/* Data view */}
          {rows.length === 0 ? (
            <div className="container text-muted">No data loaded.</div>
          ) : (
            <>
              {/* Mobile cards (<768 px) */}
              <div className="container d-block d-md-none">
                <div className="d-flex flex-column gap-2">
                  {rows.map((row, i) => (
                    <div className="card p-2" key={i}>
                      {Object.entries(row)
                        .filter(([k]) => !HIDDEN_COLS.includes(k))
                        .map(([k, v]) => (
                          <div key={k} className={`d-flex ${XS_ONLY_HIDE.includes(k) ? "d-none" : ""}`}>
                            <strong className="me-2 text-capitalize">{k}:</strong>
                            <span>{String(v)}</span>
                          </div>
                        ))}

                      <div className="d-flex gap-2 mt-2">
                        <button className="btn btn-sm btn-primary flex-fill" onClick={() => handleEdit(row)}>Edit</button>
                        <button className="btn btn-sm btn-danger  flex-fill" onClick={() => handleDelete(row)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop table (≥768 px) */}
              <div className="container d-none d-md-block">
                <div className="table-responsive-md">
                  <table className="table table-striped table-sm align-middle">
                    <thead>
                      <tr>
                        {Object.keys(rows[0])
                          .filter((k) => !HIDDEN_COLS.includes(k))
                          .map((k) => (
                            <th key={k} className={XS_ONLY_HIDE.includes(k) ? "d-none d-md-table-cell" : ""}>{k}</th>
                          ))}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr key={i}>
                          {Object.entries(row)
                            .filter(([k]) => !HIDDEN_COLS.includes(k))
                            .map(([k, v]) => (
                              <td key={k} className={XS_ONLY_HIDE.includes(k) ? "d-none d-md-table-cell" : ""}>{String(v)}</td>
                            ))}
                          <td className="text-nowrap">
                            <div className="btn-group btn-group-sm">
                              <button type="button" className="btn btn-primary" onClick={() => handleEdit(row)}>Edit</button>
                              <button type="button" className="btn btn-danger"  onClick={() => handleDelete(row)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Modal */}
          {activeForm && (
            <>
              <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">{formMeta[activeForm].title}</h5>
                      <button type="button" className="btn-close" onClick={() => setActiveForm(null)} />
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="modal-body">
                        {formMeta[activeForm].fields.map((f) => (
                          <div className="mb-3" key={f.name}>
                            <label className="form-label" htmlFor={f.name}>{f.label}</label>
                            <input id={f.name} name={f.name} type={f.type} className="form-control" required />
                          </div>
                        ))}
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setActiveForm(null)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="modal-backdrop fade show" />
            </>
          )}
        </>
      )}
    </>
  );
}
