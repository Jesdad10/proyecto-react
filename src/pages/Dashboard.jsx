import { useAuthStore } from "../store/auth.store";

const tips = [
    "Crea tareas cortas y claras para recordar mejor.",
    "Marca como hecha cada actividad para reforzar rutina.",
    "Revisa tus pendientes al inicio y al final del día.",
    "Usa títulos simples: medicación, llamada, cita, etc.",
];

export default function Dashboard() {
    const user = useAuthStore((s) => s.user);
    const isAdmin = useAuthStore((s) => s.isAdmin);

    return (
        <div className="space-y-6">
            <section className="grid gap-5 rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur lg:grid-cols-[1.02fr_0.98fr]">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-200/90">Bienvenida</p>
                    <h2 className="mt-1 text-3xl font-bold tracking-tight">Inicio</h2>
                    <p className="mt-3 text-slate-100">
                        Hola, <b>{user?.username}</b> {isAdmin ? "(ADMIN)" : "(USER)"}. Esta página está pensada para
                        acompañarte en tus tareas del día a día y evitar olvidos importantes.
                    </p>
                    <p className="mt-3 text-sm text-slate-200/95">
                        Muchas familias cuidan de adultos mayores y personas con problemas de memoria como el Alzheimer.
                        Por eso este inicio pone foco en la organización, en recordatorios claros y en una experiencia
                        amigable que facilite cada acción.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full border border-amber-200/50 bg-amber-300/20 px-3 py-1 text-amber-100">Recordar</span>
                        <span className="rounded-full border border-cyan-200/50 bg-cyan-300/20 px-3 py-1 text-cyan-100">Organizar</span>
                        <span className="rounded-full border border-pink-200/50 bg-pink-300/20 px-3 py-1 text-pink-100">Acompañar</span>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/20 bg-indigo-950/70 p-2">
                    <div className="aspect-video overflow-hidden rounded-xl">
                        <iframe
                            className="h-full w-full"
                            src="https://www.youtube.com/embed/8I4WvQzJ4l4"
                            title="Video informativo sobre memoria y adultos mayores"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                    <p className="mt-2 text-xs text-slate-300/90">
                        Video de apoyo sobre cuidado de la memoria en adultos mayores.
                    </p>
                </div>
            </section>

            <section className="rounded-3xl border border-white/20 bg-white/[0.08] p-5 backdrop-blur">
                <h3 className="text-xl font-semibold text-white">¿Cómo te ayuda este organizador?</h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-1">
                    {tips.map((tip) => (
                        <div key={tip} className="rounded-2xl border border-white/20 bg-white/10 p-3 text-sm text-slate-100">
                            • {tip}
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1">
                <Card title="Recordatorios claros" text="Anota tareas futuras y evita que se te pasen actividades importantes." />
                <Card title="Apoyo diario" text="Una interfaz amigable para reforzar memoria y hábitos en la rutina." />
                <Card title="Control rápido" text="Consulta, marca y edita pendientes de manera fácil desde cualquier dispositivo." />
            </div>
        </div>
    );
}

function Card({ title, text }) {
    return (
        <article className="rounded-2xl border border-white/20 bg-white/[0.1] p-5 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/[0.16]">
            <div className="font-semibold text-white">{title}</div>
            <div className="mt-2 text-sm text-slate-100/95">{text}</div>
        </article>
    );
}
