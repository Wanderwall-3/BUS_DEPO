import axios from "axios";

const BASE_URL ="https://bus-depo-12.onrender.com";

export const loginApi = (data) =>
  axios.post(`${BASE_URL}/auth/login`, data, { withCredentials: true });
export const tokenValidateApi = () =>
  axios.get(`${BASE_URL}/auth/tokenValidate`, { withCredentials: true });
export const logoutApi = () =>
  axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
export const getDetailsApi = () =>
  axios.get(`${BASE_URL}/auth/getDetails`, { withCredentials: true });
export const deleteAccountApi = (userName) =>
  axios.delete(`${BASE_URL}/register/delete/${userName}`, {
    withCredentials: true,
  });

export const addAdminApi = (data) =>
  axios.post(`${BASE_URL}/register/admin`, data, { withCredentials: true });
export const addDriverApi = (data) =>
  axios.post(`${BASE_URL}/register/driver`, data, { withCredentials: true });
export const addStudentApi = (data) =>
  axios.post(`${BASE_URL}/register/student`, data, { withCredentials: true });

export const listByRoleApi = (role) =>
  axios.get(`${BASE_URL}/list/${role}`, { withCredentials: true });
export const uploadProfileApi = (file, username) =>
  axios.put(`${BASE_URL}/driver/upload/profile/${username}`, file, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getDriverDetailsApi = () =>
  axios.get(`${BASE_URL}/driver/details`, { withCredentials: true });

export const uploadRouteByDriverApi = (route) => {
  return axios.post(`${BASE_URL}/driver/route`, route, {
    withCredentials: true
  });
};

export const getRouteByDriverApi = () => {
  return axios.get(`${BASE_URL}/driver/route`, { withCredentials: true });
};

export const deleteRouteApi = (id) =>
  axios.delete(`${BASE_URL}/driver/route/${id}`, { withCredentials: true });

export const modifyRouteApi = (id,p) => {
  return axios.put(`${BASE_URL}/driver/route/${id}`,p,{withCredentials : true})
};

export const getStudentDetailsApi = () => {
  return axios.get(`${BASE_URL}/student/getDetails`,{withCredentials : true})
};

export const uploadStudentProfileApi = (file) => {
  return axios.put(`${BASE_URL}/student/upload/profile`, file, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const searchRouteApi = (stop,time) => {
  return axios.get(`${BASE_URL}/student/search`,{params : {stop,time},withCredentials : true})
}
