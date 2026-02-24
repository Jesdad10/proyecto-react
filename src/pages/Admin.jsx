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

    return (
        <div className="space-y-5 text-emerald-950">
            <section className="rounded-3xl border border-emerald-200 bg-white/90 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Panel de control</p>
                <h2 className="mt-1 text-2xl font-bold">Admin Center</h2>
                <p className="mt-2 text-emerald-900/90">
                    Bienvenido, <b>{user?.username}</b>. Aquí tienes un resumen visual del sistema para supervisar
                    actividad, rendimiento y estado de uso.
                </p>
            </section>

            <section className="grid grid-cols-4 gap-3 lg:grid-cols-2 sm:grid-cols-1">
                {quickStats.map((item) => (
                    <article key={item.label} className="rounded-2xl border border-emerald-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wider text-emerald-700/80">{item.label}</p>
                        <p className="mt-2 text-3xl font-extrabold text-emerald-950">{item.value}</p>
                        <p className="mt-1 text-xs text-emerald-700">{item.delta} vs. semana anterior</p>
                    </article>
                ))}
            </section>

            <section className="grid grid-cols-3 gap-4 lg:grid-cols-1">
                <article className="col-span-2 rounded-2xl border border-emerald-200 bg-white p-5">
                    <h3 className="text-lg font-semibold text-emerald-950">Rendimiento mensual</h3>
                    <p className="mt-1 text-sm text-emerald-900/85">Simulación visual de productividad por semanas.</p>

                    <div className="mt-4 flex h-52 items-end gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        {[55, 72, 48, 81, 66, 90, 74, 84].map((h, i) => (
                            <div key={i} className="flex flex-1 flex-col items-center gap-2">
                                <div
                                    className="w-full rounded-md bg-gradient-to-t from-emerald-500/70 to-lime-300/80"
                                    style={{ height: `${h}%` }}
                                />
                                <span className="text-[10px] text-emerald-700/80">S{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="rounded-2xl border border-emerald-200 bg-white p-5">
                    <h3 className="text-lg font-semibold text-emerald-950">Progreso global</h3>
                    <p className="mt-1 text-sm text-emerald-900/85">Estado acumulado del mes actual.</p>

                    <div className="mt-5 grid place-items-center">
                        <div className="relative h-40 w-40 rounded-full bg-[conic-gradient(#10b981_0deg,#10b981_240deg,#d1fae5_240deg,#d1fae5_360deg)] p-3">
                            <div className="grid h-full w-full place-items-center rounded-full bg-white text-center">
                                <p className="text-3xl font-extrabold text-emerald-950">67%</p>
                                <p className="text-[11px] uppercase tracking-widest text-emerald-700">Completado</p>
                            </div>
                        </div>
                    </div>
                </article>
            </section>

            <section className="rounded-2xl border border-emerald-200 bg-white p-5">
                <h3 className="text-lg font-semibold text-emerald-950">Actividad reciente</h3>
                <div className="mt-4 space-y-2">
                    {activity.map((item) => (
                        <div key={`${item.time}-${item.action}`} className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                            <div>
                                <p className="text-sm font-medium text-emerald-950">{item.action}</p>
                                <p className="text-xs text-emerald-700/85">{item.time}</p>
                            </div>
                            <span className="rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                                {item.tag}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
