import { useState } from "react";
import { uploadRouteByDriverApi } from "../ApiService";

const to12 = (t)=>{if(!t)return"";const[h,m]=t.split(":").map(Number);
const ampm=h>=12?"PM":"AM";const h12=((h+11)%12)+1;
return`${h12.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")} ${ampm}`};

export default function AddRoute({ onRouteAdded }) {
  const [stops,setStops] = useState([""]);
  const [time,setTime]   = useState("");
  const [busy,setBusy]   = useState(false);

  const add   =()=>setStops([...stops,""]);
  const del   =i =>stops.length>1&&setStops(stops.filter((_,x)=>x!==i));
  const edit  =(i,v)=>setStops(stops.map((s,x)=>x===i?v:s));

  const submit = async()=>{
    if(busy) return;
    const clean=stops.map(s=>s.trim()).filter(Boolean);
    if(!clean.length) return alert("Enter at least one stop");
    if(!time)         return alert("Pick a time");

    const payload={userName:localStorage.getItem("username")||"unknown",
                   route:`{${clean.join(",")}}`,time:to12(time)};
    setBusy(true);
    try{
      const {data}=await uploadRouteByDriverApi(payload);
      const row=data?.id?data:{...payload,id:crypto.randomUUID()};
      onRouteAdded?.(row);
      setStops([""]); setTime("");
    }catch(e){console.error(e);}finally{setBusy(false);}
  };

  return(
    <div className="vstack gap-2">
      {stops.map((v,i)=>(
        <div key={i} className="input-group input-group-sm">
          <input className="form-control" placeholder={`Stop ${i+1}`}
                 value={v} onChange={e=>edit(i,e.target.value)}/>
          {i===stops.length-1 &&
            <button className="btn btn-outline-success btn-icon" onClick={add}>
              <i className="bi bi-plus-lg"></i>
            </button>}
          {stops.length>1 &&
            <button className="btn btn-outline-danger btn-icon" onClick={()=>del(i)}>
              <i className="bi bi-dash-lg"></i>
            </button>}
        </div>
      ))}

      <div className="input-group input-group-sm" style={{maxWidth:220}}>
        <span className="input-group-text">Time</span>
        <input type="time" value={time}
               onChange={e=>setTime(e.target.value)} className="form-control"/>
      </div>

      <button className="btn btn-primary btn-sm px-4 rounded-pill align-self-start"
              disabled={busy} onClick={submit}>
        {busy?"Saving…":"Submit"}
      </button>
    </div>
  );
}
