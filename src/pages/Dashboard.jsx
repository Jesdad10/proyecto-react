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
        <div className="space-y-6 pb-10 text-emerald-950">
            <section className="rounded-3xl border border-emerald-200 bg-white/90 p-6 shadow-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Bienvenida</p>
                <h2 className="mt-1 text-3xl font-bold tracking-tight">Inicio</h2>
                <p className="mt-3 text-emerald-950">
                    Hola, <b>{user?.username}</b>. Este inicio está pensado para que
                    tengas una experiencia completa, visual y práctica para organizar tareas futuras y evitar olvidos.
                </p>
                <p className="mt-3 text-sm text-emerald-900/90">
                    Muchas familias conviven con desafíos de memoria, especialmente en adultos mayores o personas con
                    deterioro cognitivo como Alzheimer. Esta vista prioriza claridad, seguimiento y hábito diario.
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-emerald-700">Recordar</span>
                    <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-green-800">Organizar</span>
                    <span className="rounded-full border border-lime-200 bg-lime-50 px-3 py-1 text-lime-800">Acompañar</span>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">Progresar</span>
                </div>
            </section>

            <section className="rounded-3xl border border-emerald-200 bg-white/90 p-5">
                <h3 className="text-xl font-semibold text-emerald-900">Video de apoyo</h3>
                <p className="mt-1 text-sm text-emerald-900/85">
                    Recurso visual sobre memoria y cuidado en adultos mayores.
                </p>
                <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 p-2">
                    <div className="aspect-video overflow-hidden rounded-xl">
                        <iframe
                            className="h-full w-full"
                            src="https://www.youtube.com/embed/b_zXEIe7Sys?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0"
                            title="Video"
                            loading="lazy"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />

                    </div>
                </div>
            </section>

            <section className="grid grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1">
                {pillars.map((item) => (
                    <article key={item.title} className="rounded-2xl border border-emerald-200 bg-white p-5 transition hover:-translate-y-0.5 hover:bg-emerald-50">
                        <h4 className="font-semibold text-emerald-900">{item.title}</h4>
                        <p className="mt-2 text-sm text-emerald-950/95">{item.text}</p>
                    </article>
                ))}
            </section>

            <section className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-5">
                <h3 className="text-xl font-semibold text-emerald-900">Guía rápida para usar Inicio</h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-1">
                    {tips.map((tip) => (
                        <div key={tip} className="rounded-2xl border border-emerald-200 bg-white p-3 text-sm text-emerald-950">
                            • {tip}
                        </div>
                    ))}
                </div>
            </section>

            <section className="grid grid-cols-2 gap-4 sm:grid-cols-1">
                <article className="rounded-2xl border border-emerald-200 bg-white p-5">
                    <h3 className="text-lg font-semibold text-emerald-900">Rutina recomendada</h3>
                    <div className="mt-4 space-y-2">
                        {timeline.map((step) => (
                            <div key={step.hour} className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                                <span className="rounded-md border border-emerald-300 bg-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-900">
                                    {step.hour}
                                </span>
                                <span className="ml-3 text-sm text-emerald-950">{step.action}</span>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="rounded-2xl border border-emerald-200 bg-white p-5">
                    <h3 className="text-lg font-semibold text-emerald-900">Preguntas frecuentes</h3>
                    <div className="mt-4 space-y-3">
                        {faqs.map((item) => (
                            <div key={item.q} className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                                <p className="text-sm font-semibold text-emerald-900">{item.q}</p>
                                <p className="mt-1 text-sm text-emerald-900/85">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </article>
            </section>

            <section className="rounded-3xl border border-emerald-300 bg-gradient-to-r from-emerald-100 to-lime-100 p-6">
                <h3 className="text-2xl font-bold text-emerald-900">Sigue bajando: aquí siempre tendrás contexto útil</h3>
                <p className="mt-2 max-w-3xl text-sm text-emerald-950/95">
                    Este inicio ahora es más completo para que no solo veas una portada, sino también contenido práctico
                    que ayude a transformar tareas sueltas en hábitos y apoyo real para el día a día.
                </p>
            </section>
        </div>
    );
}
