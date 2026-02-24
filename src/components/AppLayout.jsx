import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function AppLayout() {
    const user = useAuthStore((s) => s.user);
    const isAdmin = useAuthStore((s) => s.isAdmin);
    const logout = useAuthStore((s) => s.logout);

    return (
        <div className="relative min-h-screen overflow-hidden text-emerald-950">
            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-200/45 blur-3xl" />
            <div className="pointer-events-none absolute right-0 top-28 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-lime-100/45 blur-3xl" />

            <header className="sticky top-0 z-10 border-b border-emerald-200/80 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-emerald-700">Organizador personal</p>
                        <h1 className="text-lg font-semibold tracking-tight text-emerald-950">MemoryCare</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-900">
                            {user?.username} {isAdmin ? "• admin" : "• usuario"}
                        </span>

                        <button
                            onClick={logout}
                            className="rounded-xl border border-emerald-300 bg-emerald-100 px-3 py-1.5 text-sm text-emerald-900 transition hover:bg-emerald-200"
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
                        ? "border-emerald-700 bg-emerald-700 text-white shadow-[0_0_0_1px_rgba(4,120,87,0.3)]"
                        : "border-emerald-200 bg-white/80 text-emerald-900 hover:bg-emerald-100",
                ].join(" ")
            }
        >
            {children}
        </NavLink>
    );
}
