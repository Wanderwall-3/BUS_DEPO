/* eslint-disable no-irregular-whitespace */
import { useEffect, useRef, useState } from "react";
import Logout from "../LogoutComponent/Logout";
import {
  getDriverDetailsApi,
  uploadProfileApi,
  getRouteByDriverApi,
} from "../../services/ApiService";
import AddRoute     from "../../services/RouteByDriver/AddRoute";
import RouteSection from "../../services/RouteByDriver/RouteSection";
import "./dashboard.css"

export default function DriverHome() {
  /* ── state ── */
  const [me,setMe]           = useState(null);
  const [routes,setRoutes]   = useState([]);
  const [file,setFile]       = useState(null);
  const [busy,setBusy]       = useState(false);
  const inputRef             = useRef(null);
  const defaultAvatar =
    "https://vdbczxmbmzljohcjoqvt.supabase.co/storage/v1/object/public/profile-bucket//126-1262807_instagram-default-profile-picture-png.png";
  const [avatar,setAvatar]   = useState(defaultAvatar);

  /* ── fetch ── */
  useEffect(()=>{(async()=>{
    try{
      const {data}=await getDriverDetailsApi();
      setMe(data); setAvatar(data.profile||defaultAvatar);
      const {data:rows}=await getRouteByDriverApi();
      setRoutes(rows);
    }catch(e){console.error(e);}
  })();},[]);

  /* ── upload ── */
  const choose = e=>setFile(e.target.files?.[0]||null);
  const upload = async()=>{
    if(!file) return;
    setBusy(true);
    try{
      const fd=new FormData(); fd.append("file",file);
      await uploadProfileApi(fd,me.userName);
      const {data}=await getDriverDetailsApi();
      setMe(data); setAvatar(data.profile||defaultAvatar);
      setFile(null); inputRef.current.value="";
    }catch(e){console.error(e);}finally{setBusy(false);}
  };

  if(!me) return null;

  /* ── render ── */
  return(
    <>
      {/* NAVBAR (fixed) */}
      <nav className="navbar navbar-dark fixed-top" style={{background:"#0b3b75"}}>
        <div className="container-fluid">
          <span className="navbar-brand fw-semibold">🚌 Depot Portal</span>
          <Logout />
        </div>
      </nav>

      {/* HEADER */}
      <header className="py-3 text-white mt-5"
              style={{background:"linear-gradient(90deg,#0b3b75,#0d6efd)",paddingTop:72}}>
        <div className="container-xxl">
          <h1 className="h4 fw-semibold mb-0">Driver Dashboard</h1>
          <small className="opacity-75">Welcome back, {me.userName}</small>
        </div>
      </header>

      {/* MAIN */}
      <main className="container-xxl my-4">
        <div className="row g-4">
          {/* PROFILE */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 rounded-4 shadow-sm sticky-top" style={{top:96}}>
              <div className="card-body text-center p-4">
                <img src={avatar} alt=""
                     className="rounded-circle border border-3 border-white shadow"
                     style={{width:120,height:120,objectFit:"cover"}}/>
                <h5 className="fw-semibold mt-3">{me.userName}</h5>
                <small className="text-muted d-block">{me.email}</small>

                <ul className="list-unstyled small text-muted mt-3 mb-4">
                  <li><i className="bi bi-hash me-1"></i>Bus ID <strong>{me.busId}</strong></li>
                  <li><i className="bi bi-calendar3 me-1"></i>Joined {me.joinDate}</li>
                </ul>

                <input ref={inputRef} type="file" accept="image/*"
                       className="form-control form-control-sm mb-2" onChange={choose}/>
                <button className="btn btn-primary btn-sm px-4 rounded-pill"
                        disabled={!file||busy} onClick={upload}>
                  {busy?"Uploading…":"Upload"}
                </button>
              </div>
            </div>
          </div>

          {/* ROUTE WORKFLOW */}
          <div className="col-12 col-lg-8">
            <div className="vstack gap-4">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h5 className="fw-semibold mb-3">
                    <i className="bi bi-pencil-square me-2"></i>Create / Update Route
                  </h5>
                  <AddRoute onRouteAdded={(r)=>setRoutes(p=>[...p,r])}/>
                </div>
              </div>

              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h5 className="fw-semibold mb-3">
                    <i className="bi bi-list-task me-2"></i>Your Routes
                  </h5>
                  <RouteSection routes={routes} setRoutes={setRoutes}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
