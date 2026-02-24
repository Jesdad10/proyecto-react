import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import "../styles/layout.css";

export default function AppLayout() {
    const user = useAuthStore((s) => s.user);
    const isAdmin = useAuthStore((s) => s.isAdmin);
    const logout = useAuthStore((s) => s.logout);

    return (
        <div className="layout-shell">
            <div className="layout-orb layout-orb-left" />
            <div className="layout-orb layout-orb-right" />
            <div className="layout-orb layout-orb-bottom" />

            <header className="app-header">
                <div className="app-header-row">
                    <div>
                        <p className="app-kicker">Organizador personal</p>
                        <h1 className="app-title">MemoryCare</h1>
                    </div>

                    <div className="app-header-actions">
                        <span className="app-user-pill">
                            {user?.username} {isAdmin ? "• admin" : "• usuario"}
                        </span>

                        <button onClick={logout} className="app-logout-btn">
                            Salir
                        </button>
                    </div>
                </div>

                <nav className="app-nav">
                    <Tab to="/dashboard" end>
                        Inicio
                    </Tab>

                    <Tab to="/tareas">Tareas</Tab>

                    {isAdmin && (
                        <>
                            <Tab to="/admin" end>
                                Admin
                            </Tab>

                            <Tab to="/admin/usuarios">Usuarios</Tab>
                        </>
                    )}
                </nav>
            </header>

            <main className="app-main">
                <Outlet />
            </main>
        </div>
    );
}

function Tab({ to, end, children }) {
    return (
        <NavLink to={to} end={end} className={({ isActive }) => (isActive ? "app-tab app-tab-active" : "app-tab")}>
            {children}
        </NavLink>
    );
}
