import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { type RootState } from "@store";

const ProtectedRoute = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return isLoggedIn ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
