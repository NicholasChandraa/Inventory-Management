/* eslint-disable */
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ element: Component }) => {
  return Cookies.get("Token") ? Component : <Navigate to="/Login" />;
};

export default ProtectedRoute;
