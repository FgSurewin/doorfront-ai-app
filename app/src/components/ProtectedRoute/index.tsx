import React from "react";
import { useUserStore } from "../../global/userState";
import { Outlet, Navigate } from "react-router-dom";
import { readLocal } from "../../utils/localStorage";

export default function ProtectedRoute() {
  const { userInfo } = useUserStore();

  const isLogin = React.useMemo(() => {
    const checkGlobalState = userInfo.nickname && userInfo.token;
    const checkLocalState = readLocal("token") && readLocal("nickname");
    return checkGlobalState || checkLocalState;
  }, [userInfo]);

  return <>{isLogin ? <Outlet /> : <Navigate to="/login" />}</>;
}
