// React
import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
// Context
import { UserContext } from "../../context/userContext";

export default function PrivateRoutes() {
  const { user } = useContext(UserContext);
  // Show protected routes (i.e., home page) if user is logged in
  // Else, navigate back to log in form
  return user ? <Outlet /> : <Navigate to="/" />;
}
