import React from "react";
import { useUserStore } from "../../global/userState";
import { Outlet, Navigate } from "react-router-dom";
import { readLocal } from "../../utils/localStorage";

export default function BLVRoute() {
  const { userInfo } = useUserStore();

  const isLogin = React.useMemo(() => {
    const checkGlobalState = userInfo.nickname && userInfo.token && userInfo.role === "Blind or Low Vision Data Requester";
    const checkLocalState = readLocal("token") && readLocal("nickname");
    return checkGlobalState || checkLocalState;
  }, [userInfo]);

  return <>{isLogin ? <Outlet /> : <Navigate to="/login" />}</>;
}
