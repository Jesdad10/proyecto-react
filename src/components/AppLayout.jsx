import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function AppLayout() {
    const user = useAuthStore((s) => s.user);
    const isAdmin = useAuthStore((s) => s.isAdmin);
    const logout = useAuthStore((s) => s.logout);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            {/* HEADER */}
            <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
                <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                    <div className="font-bold tracking-tight">
                        Proyecto React Evaluación
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-300">
                            {user?.username} {isAdmin ? "(admin)" : "(usuario)"}
                        </span>

                        <button
                            onClick={logout}
                            className="rounded-xl border border-slate-700 px-3 py-1.5 hover:bg-slate-900 transition"
                        >
                            Salir
                        </button>
                    </div>
                </div>

                {/* NAV */}
                <nav className="mx-auto max-w-6xl px-4 pb-3 flex gap-2 flex-wrap">
                    <Tab to="/dashboard" end>
                        Dashboard
                    </Tab>

                    <Tab to="/tareas">
                        Tareas
                    </Tab>

                    {isAdmin && (
                        <>
                            <Tab to="/admin" end>
                                Admin
                            </Tab>

                            <Tab to="/admin/usuarios">
                                Usuarios
                            </Tab>
                        </>
                    )}
                </nav>
            </header>

            {/* CONTENIDO */}
            <main className="mx-auto max-w-6xl px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
}

/* COMPONENTE TAB */
function Tab({ to, end, children }) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                [
                    "rounded-xl px-3 py-2 text-sm border transition",
                    isActive
                        ? "border-sky-400/40 bg-sky-500/10 text-sky-200"
                        : "border-slate-800 hover:bg-slate-900 text-slate-200",
                ].join(" ")
            }
        >
            {children}
        </NavLink>
    );
}