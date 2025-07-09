import { useState } from "react";
import { modifyRouteApi, deleteRouteApi } from "../ApiService";

const parse = (r) =>
  r
    .replace(/^\{|\}$/g, "")
    .split(",")
    .map((s) => s.trim());
const str = (a) => `{${a.join(",")}}`;

export default function RouteSection({ routes, setRoutes }) {
  const [editId, setId] = useState(null);
  const [stops, setStops] = useState([]);
  const [time, setTime] = useState("");
  const [busy, setBusy] = useState(false);

  const start = (r) => {
    setId(r.id);
    setStops(parse(r.route));
    setTime(r.time);
  };
  const cancel = () => {
    setId(null);
    setStops([]);
    setTime("");
  };

  const to12 = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = ((h + 11) % 12) + 1;
    return `${h12.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")} ${ampm}`;
  };

  const save = async () => {
    if (!stops.length || !time) return;
    setBusy(true);
    try {
      const p = {
        userName: localStorage.getItem("username") || "unknown",
        route: str(stops),
        time : to12(time)
      };
      await modifyRouteApi(editId, p);
      setRoutes((prev) =>
        prev.map((r) => (r.id === editId ? { ...r, ...p } : r))
      );
      cancel();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete?")) return;
    try {
      await deleteRouteApi(id);
      setRoutes((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  if (!routes.length) return <p className="text-muted mb-0">No routes yet.</p>;

  return routes.map((r, i) =>
    editId === r.id ? (
      /* edit card */
      <div key={i} className="border rounded p-3 mb-2">
        {stops.map((s, idx) => (
          <div key={idx} className="input-group input-group-sm mb-1">
            <input
              className="form-control"
              value={s}
              onChange={(e) =>
                setStops(stops.map((v, j) => (j === idx ? e.target.value : v)))
              }
            />
            {idx === stops.length - 1 && (
              <button
                className="btn btn-outline-success btn-icon"
                onClick={() => setStops([...stops, ""])}
              >
                <i className="bi bi-plus-lg"></i>
              </button>
            )}
            {stops.length > 1 && (
              <button
                className="btn btn-outline-danger btn-icon"
                onClick={() => setStops(stops.filter((_, j) => j !== idx))}
              >
                <i className="bi bi-dash-lg"></i>
              </button>
            )}
          </div>
        ))}
        <div
          className="input-group input-group-sm mb-2"
          style={{ maxWidth: 180 }}
        >
          <span className="input-group-text">Time</span>
          <input
            type="time"
            step="60"
            className="form-control"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary btn-sm me-2"
          disabled={busy}
          onClick={save}
        >
          Save
        </button>
        <button className="btn btn-secondary btn-sm" onClick={cancel}>
          Cancel
        </button>
      </div>
    ) : (
      /* view row */
      <div
        key={i}
        className="d-flex justify-content-between align-items-start mb-2"
      >
        <div>
          <div className="fw-semibold">{parse(r.route).join(", ")}</div>
          <small className="text-muted">{r.time}</small>
        </div>
        <div className="btn-group">
          <button
            className="btn btn-outline-secondary btn-icon"
            onClick={() => start(r)}
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button
            className="btn btn-outline-danger btn-icon"
            onClick={() => remove(r.id)}
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
    )
  );
}
