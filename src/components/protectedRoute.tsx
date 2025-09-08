// src/components/protectedRoute.tsx
import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const userString = localStorage.getItem("user");
  if (!userString) return <Navigate to="/login" />;

  const user = JSON.parse(userString);

  // Normalize role to lowercase
  const role = user.role?.toLowerCase();

  // Check if role is allowed
  if (!allowedRoles.map(r => r.toLowerCase()).includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
