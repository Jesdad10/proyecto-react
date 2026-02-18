import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function AppLayout() {
    const user = useAuthStore((s) => s.user);
    const isAdmin = useAuthStore((s) => s.isAdmin);
    const logout = useAuthStore((s) => s.logout);

    return (
        <div className="relative min-h-screen overflow-hidden text-slate-100">
            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

            <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-sky-300/70">Organizador personal</p>
                        <h1 className="text-lg font-semibold tracking-tight">Proyecto React Evaluación</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                            {user?.username} {isAdmin ? "• admin" : "• usuario"}
                        </span>

                        <button
                            onClick={logout}
                            className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm transition hover:bg-white/10"
                        >
                            Salir
                        </button>
                    </div>
                </div>

                <nav className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 pb-4">
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

            <main className="relative mx-auto max-w-6xl px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}

function Tab({ to, end, children }) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                [
                    "rounded-xl px-4 py-2 text-sm border transition-all",
                    isActive
                        ? "border-sky-300/40 bg-sky-400/15 text-sky-100 shadow-[0_0_0_1px_rgba(56,189,248,0.15)]"
                        : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                ].join(" ")
            }
        >
            {children}
        </NavLink>
    );
}
