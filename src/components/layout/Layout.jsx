// React
import { useContext } from "react";
import { Outlet } from "react-router";
// Context
import { UserContext } from "../../context/userContext";
// React toastify
import { ToastContainer } from "react-toastify";

export default function Layout() {
  const { authIsReady } = useContext(UserContext);

  return authIsReady ? (
    <main>
      <Outlet />
      <ToastContainer stacked />
    </main>
  ) : (
    <div>Loading...</div>
  );
}
