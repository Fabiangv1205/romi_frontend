import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import LoginRegister from "./pages/LoginRegister";
import AdminUsers from "./pages/AdminUsers";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import UserHome from "./pages/UserHome";

function RedirectIfAuth({ children }) {
  const { isAuth, isAdmin } = useAuth();
  if (isAuth) return <Navigate to={isAdmin ? "/admin" : "/user"} replace />;
  return children;
}

function HomeRedirect() {
  const { isAuth, isAdmin } = useAuth();
  if (!isAuth) return <Navigate to="/auth" replace />;
  return <Navigate to={isAdmin ? "/admin" : "/user"} replace />;
}

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route
          path="/auth"
          element={
            <RedirectIfAuth>
              <LoginRegister />
            </RedirectIfAuth>
          }
        />
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<AdminUsers />} />
        </Route>

        <Route element={<ProtectedRoute roles={["user"]} />}>
          <Route path="/user" element={<UserHome />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
