import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function AppLayout() {
    const user = useAuthStore((s) => s.user);
    const isAdmin = useAuthStore((s) => s.isAdmin);
    const logout = useAuthStore((s) => s.logout);

    return (
        <div className="relative min-h-screen overflow-hidden text-slate-100">
            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-yellow-300/25 blur-3xl" />
            <div className="pointer-events-none absolute right-0 top-28 h-72 w-72 rounded-full bg-pink-400/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl" />

            <header className="sticky top-0 z-10 border-b border-white/15 bg-indigo-950/70 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-amber-200/85">Organizador personal</p>
                        <h1 className="text-lg font-semibold tracking-tight">Proyecto React Evaluación</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-slate-100">
                            {user?.username} {isAdmin ? "• admin" : "• usuario"}
                        </span>

                        <button
                            onClick={logout}
                            className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-sm transition hover:bg-white/20"
                        >
                            Salir
                        </button>
                    </div>
                </div>

                <nav className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 pb-4">
                    <Tab to="/dashboard" end>
                        Inicio
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
                    "rounded-xl border px-4 py-2 text-sm transition-all",
                    isActive
                        ? "border-amber-200/60 bg-amber-300/20 text-amber-100 shadow-[0_0_0_1px_rgba(252,211,77,0.25)]"
                        : "border-white/20 bg-white/10 text-slate-100 hover:bg-white/20",
                ].join(" ")
            }
        >
            {children}
        </NavLink>
    );
}
