import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token"); // Check if user has a token

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
