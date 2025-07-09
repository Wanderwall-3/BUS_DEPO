import { useEffect, useState } from "react";
import AdminHome  from "../HomeComponent/Home";
import DriverHome from "../DriverComponent/DriverHome";
import { getDetailsApi } from "../../services/ApiService";
import StudentHome from "../StudentComponent/StudentHome";

export default function HomeGate() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await getDetailsApi();
      setMe(data);
    })();
  }, []);

  if (!me) return null;

  if (me.role === "ADMIN")  return <AdminHome />;
  if (me.role === "DRIVER") return <DriverHome />;
  if (me.role === "STUDENT") return <StudentHome />;
  return <div className="p-4">Unknown role: {me.role}</div>;
}
