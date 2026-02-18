import { useAuthStore } from "../store/auth.store";

export default function Dashboard() {
    const user = useAuthStore((s) => s.user);
    const isAdmin = useAuthStore((s) => s.isAdmin);

    return (
        <div className="space-y-5">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-sky-300/70">Resumen</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight">Dashboard</h2>
                <p className="mt-2 text-slate-200">
                    Logueado como <b>{user?.username}</b> {isAdmin ? "(ADMIN)" : "(USER)"}
                </p>
                <p className="mt-2 max-w-2xl text-sm text-slate-300/90">
                    Gestiona tus pendientes y recordatorios futuros desde una interfaz clara para que no olvides lo importante.
                </p>
            </section>

            <div className="grid grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1">
                <Card title="Rutas seguras" text="React Router + ProtectedRoute + AdminRoute" />
                <Card title="Conexión API" text="GET/POST/PUT/PATCH/DELETE con fetch (sin Axios)" />
                <Card title="Enfoque responsive" text="Diseño adaptable para escritorio, tablet y móvil" />
            </div>
        </div>
    );
}

function Card({ title, text }) {
    return (
        <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/[0.07]">
            <div className="font-semibold text-slate-100">{title}</div>
            <div className="mt-2 text-sm text-slate-300">{text}</div>
        </article>
    );
}
