import { useAuthStore } from "../store/auth.store";

const tips = [
    "Crea tareas cortas y específicas para recordar mejor.",
    "Define prioridades cada mañana para no saturarte.",
    "Revisa pendientes al mediodía y al final del día.",
    "Usa palabras simples: medicación, llamada, cita, compra.",
];

const pillars = [
    {
        title: "Memoria diaria",
        text: "Transforma pendientes en rutinas visibles para reducir olvidos cotidianos.",
    },
    {
        title: "Apoyo familiar",
        text: "Comparte una lista clara de tareas y facilita el acompañamiento de personas mayores.",
    },
    {
        title: "Seguimiento constante",
        text: "Visualiza progreso y mantén foco en lo importante con acciones simples.",
    },
];

const timeline = [
    { hour: "08:00", action: "Revisar tareas médicas y medicación" },
    { hour: "10:30", action: "Confirmar citas o llamadas importantes" },
    { hour: "14:00", action: "Actualizar pendientes completados" },
    { hour: "18:30", action: "Planificar tareas del día siguiente" },
];

const faqs = [
    {
        q: "¿Para quién está pensada esta app?",
        a: "Para cualquier persona que quiera organizar mejor su día, incluyendo familias que acompañan a adultos mayores.",
    },
    {
        q: "¿Necesito conocimientos técnicos?",
        a: "No. Está diseñada para ser directa: crear, editar, completar y borrar tareas sin complicaciones.",
    },
    {
        q: "¿Puedo usarla como apoyo para memoria?",
        a: "Sí, la idea principal es facilitar recordatorios frecuentes y mantener actividades importantes siempre visibles.",
    },
];

export default function Dashboard() {
    const user = useAuthStore((s) => s.user);
    const isAdmin = useAuthStore((s) => s.isAdmin);

    return (
        <div className="space-y-6 pb-10">
            <section className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-200/90">Bienvenida</p>
                <h2 className="mt-1 text-3xl font-bold tracking-tight">Inicio</h2>
                <p className="mt-3 text-slate-100">
                    Hola, <b>{user?.username}</b> {isAdmin ? "(Administrador)" : "(Usuario)"}. Este inicio está pensado para que
                    tengas una experiencia completa, visual y práctica para organizar tareas futuras y evitar olvidos.
                </p>
                <p className="mt-3 text-sm text-slate-200/95">
                    Muchas familias conviven con desafíos de memoria, especialmente en adultos mayores o personas con
                    deterioro cognitivo como Alzheimer. Esta vista prioriza claridad, seguimiento y hábito diario.
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-amber-200/50 bg-amber-300/20 px-3 py-1 text-amber-100">Recordar</span>
                    <span className="rounded-full border border-cyan-200/50 bg-cyan-300/20 px-3 py-1 text-cyan-100">Organizar</span>
                    <span className="rounded-full border border-pink-200/50 bg-pink-300/20 px-3 py-1 text-pink-100">Acompañar</span>
                    <span className="rounded-full border border-emerald-200/50 bg-emerald-300/20 px-3 py-1 text-emerald-100">Progresar</span>
                </div>
            </section>

            <section className="rounded-3xl border border-white/20 bg-white/[0.1] p-5 backdrop-blur">
                <h3 className="text-xl font-semibold text-white">Día Mundial del Alzheimer</h3>
                <p className="mt-1 text-sm text-slate-200/90">
                    Recurso visual sobre memoria y cuidado en adultos mayores.
                </p>
                <div className="mt-4 overflow-hidden rounded-2xl border border-white/20 bg-indigo-950/60 p-2">
                    <div className="aspect-video overflow-hidden rounded-xl">
                        <iframe
                            className="h-full w-full"
                            src="https://www.youtube.com/embed/b_zXEIe7Sys?autoplay=1&mute=1&rel=0"
                            title="Video de YouTube sobre apoyo de memoria"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />

                    </div>
                </div>
            </section>

            <section className="grid grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1">
                {pillars.map((item) => (
                    <article key={item.title} className="rounded-2xl border border-white/20 bg-white/[0.1] p-5 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/[0.16]">
                        <h4 className="font-semibold text-white">{item.title}</h4>
                        <p className="mt-2 text-sm text-slate-100/95">{item.text}</p>
                    </article>
                ))}
            </section>

            <section className="rounded-3xl border border-white/20 bg-white/[0.08] p-5 backdrop-blur">
                <h3 className="text-xl font-semibold text-white">Guía rápida para usar Inicio</h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-1">
                    {tips.map((tip) => (
                        <div key={tip} className="rounded-2xl border border-white/20 bg-white/10 p-3 text-sm text-slate-100">
                            • {tip}
                        </div>
                    ))}
                </div>
            </section>

            <section className="grid grid-cols-2 gap-4 sm:grid-cols-1">
                <article className="rounded-2xl border border-white/20 bg-white/[0.1] p-5 backdrop-blur">
                    <h3 className="text-lg font-semibold text-white">Rutina recomendada</h3>
                    <div className="mt-4 space-y-2">
                        {timeline.map((step) => (
                            <div key={step.hour} className="flex items-center justify-between rounded-xl border border-white/15 bg-indigo-950/40 px-3 py-2">
                                <span className="rounded-md border border-cyan-200/40 bg-cyan-300/20 px-2 py-0.5 text-xs font-semibold text-cyan-100">
                                    {step.hour}
                                </span>
                                <span className="ml-3 text-sm text-slate-100">{step.action}</span>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="rounded-2xl border border-white/20 bg-white/[0.1] p-5 backdrop-blur">
                    <h3 className="text-lg font-semibold text-white">Preguntas frecuentes</h3>
                    <div className="mt-4 space-y-3">
                        {faqs.map((item) => (
                            <div key={item.q} className="rounded-xl border border-white/15 bg-indigo-950/40 p-3">
                                <p className="text-sm font-semibold text-white">{item.q}</p>
                                <p className="mt-1 text-sm text-slate-200/90">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </article>
            </section>

            <section className="rounded-3xl border border-white/20 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 p-6">
                <h3 className="text-2xl font-bold text-white">Sigue bajando: aquí siempre tendrás contexto útil</h3>
                <p className="mt-2 max-w-3xl text-sm text-slate-100/95">
                    Este inicio ahora es más completo para que no solo veas una portada, sino también contenido práctico
                    que ayude a transformar tareas sueltas en hábitos y apoyo real para el día a día.
                </p>
            </section>
        </div>
    );
}