import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useUserStore } from "../../global/userState";

const AdminRoute = () => {
  const { id, accessLevel } = useUserStore((state) => state.userInfo);

  // If we can't yet determine the user's access level, wait
  const isCheckingAuth = id === null || accessLevel === null;

  if (isCheckingAuth) {
    return <div>Loading...</div>; // Or null/spinner
  }

  // After loading, if still not authorized, redirect
  if (!id || accessLevel !== "admin") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;
