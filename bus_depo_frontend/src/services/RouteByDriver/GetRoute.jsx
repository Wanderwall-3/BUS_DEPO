/* GetRoute.jsx – standalone Route‑Path viewer for drivers
   ------------------------------------------------------------------
   • Pure Bootstrap 5 (no Tailwind)
   • Fetches the driver’s routes via RouteService and shows them
     in a vertical, numbered timeline.
   Usage:
     <GetRoute userName={me.userName} />
*/

import React, { useEffect, useState, Fragment } from "react";



export default function GetRoute({ userName }) {
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userName) return;
    (async () => {
      setLoading(true);
      try {
        // const res = await getDriverRoutes(userName);
        // const list = Array.isArray(res.data) ? res.data : res.data.route || [];
        // setRoutes(list);
      } catch (err) {
        console.error(err);
        setError("Could not load routes ❗️");
      } finally {
        setLoading(false);
      }
    })();
  }, [userName]);

  return (
    <div className="card border-0 shadow-lg rounded-4 h-100">
      <div className="card-body p-4">
        <h5 className="fw-semibold mb-3">Route Path</h5>

        {loading ? (
          <div className="text-muted">Loading…</div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : routes.length ? (
          <div className="d-flex flex-column align-items-start">
            {routes.map((r, i) => (
              <Fragment key={i}>
                <div className="d-flex align-items-center">
                  <span className="badge bg-primary me-2">{i + 1}</span>
                  <span className="fw-medium text-capitalize">{r}</span>
                </div>
                {i < routes.length - 1 && (
                  <div
                    className="ms-3 border-start border-2 border-primary opacity-75"
                    style={{ height: "20px" }}
                  />
                )}
              </Fragment>
            ))}
          </div>
        ) : (
          <p className="text-muted fst-italic mb-0">No routes uploaded yet.</p>
        )}
      </div>
    </div>
  );
}