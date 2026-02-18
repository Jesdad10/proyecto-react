import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function RoleRoute({ role = "admin" }) {
    const token = useAuthStore((s) => s.token);
    const isAdmin = useAuthStore((s) => s.isAdmin);

    if (!token) return <Navigate to="/login" replace />;

    if (role === "admin" && !isAdmin) {
        return <Navigate to="/app" replace />;
    }

    return <Outlet />;
}