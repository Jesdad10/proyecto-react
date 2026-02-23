import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const quickStats = [
    { label: "Tareas activas", value: "128", delta: "+8%" },
    { label: "Usuarios hoy", value: "42", delta: "+12%" },
    { label: "Alertas críticas", value: "3", delta: "-2" },
    { label: "Cumplimiento", value: "91%", delta: "+4%" },
];

const activity = [
    { time: "09:15", action: "Usuario nuevo autenticado", tag: "LOGIN" },
    { time: "10:02", action: "Actualización de recordatorio médico", tag: "UPDATE" },
    { time: "11:20", action: "Revisión de tareas semanales", tag: "REVIEW" },
    { time: "12:40", action: "Ajuste de configuración general", tag: "SETTINGS" },
];

export default function Admin() {
    const user = useAuthStore((s) => s.user);
    const navigate = useNavigate();

    return (
        <div className="space-y-5">
            <button
                onClick={() => navigate(-1)}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
            >
                ← Volver
            </button>

            <section className="rounded-3xl border border-white/20 bg-white/[0.1] p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-200/90">Panel de control</p>
                <h2 className="mt-1 text-2xl font-bold">Admin Center</h2>
                <p className="mt-2 text-slate-100/95">
                    Bienvenido, <b>{user?.username}</b>. Aquí tienes un resumen visual del sistema para supervisar
                    actividad, rendimiento y estado de uso.
                </p>
            </section>

            <section className="grid grid-cols-4 gap-3 lg:grid-cols-2 sm:grid-cols-1">
                {quickStats.map((item) => (
                    <article key={item.label} className="rounded-2xl border border-white/20 bg-white/[0.12] p-4 backdrop-blur">
                        <p className="text-xs uppercase tracking-wider text-slate-200/80">{item.label}</p>
                        <p className="mt-2 text-3xl font-extrabold text-white">{item.value}</p>
                        <p className="mt-1 text-xs text-emerald-200">{item.delta} vs. semana anterior</p>
                    </article>
                ))}
            </section>

            <section className="grid grid-cols-3 gap-4 lg:grid-cols-1">
                <article className="col-span-2 rounded-2xl border border-white/20 bg-white/[0.1] p-5 backdrop-blur">
                    <h3 className="text-lg font-semibold text-white">Rendimiento mensual</h3>
                    <p className="mt-1 text-sm text-slate-200/85">Simulación visual de productividad por semanas.</p>

                    <div className="mt-4 flex h-52 items-end gap-3 rounded-xl border border-white/10 bg-indigo-950/45 p-4">
                        {[55, 72, 48, 81, 66, 90, 74, 84].map((h, i) => (
                            <div key={i} className="flex flex-1 flex-col items-center gap-2">
                                <div
                                    className="w-full rounded-md bg-gradient-to-t from-cyan-400/70 to-pink-300/70"
                                    style={{ height: `${h}%` }}
                                />
                                <span className="text-[10px] text-slate-200/80">S{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="rounded-2xl border border-white/20 bg-white/[0.1] p-5 backdrop-blur">
                    <h3 className="text-lg font-semibold text-white">Progreso global</h3>
                    <p className="mt-1 text-sm text-slate-200/85">Estado acumulado del mes actual.</p>

                    <div className="mt-5 grid place-items-center">
                        <div className="relative h-40 w-40 rounded-full bg-[conic-gradient(#22d3ee_0deg,#22d3ee_240deg,#ffffff22_240deg,#ffffff22_360deg)] p-3">
                            <div className="grid h-full w-full place-items-center rounded-full bg-indigo-950/80 text-center">
                                <p className="text-3xl font-extrabold text-white">67%</p>
                                <p className="text-[11px] uppercase tracking-widest text-slate-300">Completado</p>
                            </div>
                        </div>
                    </div>
                </article>
            </section>

            <section className="rounded-2xl border border-white/20 bg-white/[0.1] p-5 backdrop-blur">
                <h3 className="text-lg font-semibold text-white">Actividad reciente</h3>
                <div className="mt-4 space-y-2">
                    {activity.map((item) => (
                        <div key={`${item.time}-${item.action}`} className="flex items-center justify-between rounded-xl border border-white/15 bg-indigo-950/40 px-3 py-2">
                            <div>
                                <p className="text-sm font-medium text-white">{item.action}</p>
                                <p className="text-xs text-slate-300/85">{item.time}</p>
                            </div>
                            <span className="rounded-full border border-amber-200/40 bg-amber-300/20 px-2 py-0.5 text-[11px] font-semibold text-amber-100">
                                {item.tag}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
