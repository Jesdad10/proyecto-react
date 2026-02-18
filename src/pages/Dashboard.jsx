import { useAuthStore } from "../store/auth.store";

export default function Dashboard() {
    const user = useAuthStore((s) => s.user);
    const isAdmin = useAuthStore((s) => s.isAdmin);

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <h2 className="text-xl font-bold">Dashboard</h2>
                <p className="mt-1 text-slate-300">
                    Logueado como <b>{user?.username}</b> {isAdmin ? "(ADMIN)" : "(USER)"}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                    Aquí demuestras rutas protegidas + roles + responsive.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-3 md:grid-cols-2 sm:grid-cols-1">
                <Card title="Rutas" text="React Router + ProtectedRoute + AdminRoute" />
                <Card title="API" text="GET/POST/PUT/PATCH/DELETE con fetch (sin Axios)" />
                <Card title="Responsive" text="Tailwind con breakpoints del enunciado" />
            </div>
        </div>
    );
}

function Card({ title, text }) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
            <div className="font-semibold">{title}</div>
            <div className="mt-1 text-sm text-slate-300">{text}</div>
        </div>
    );
}