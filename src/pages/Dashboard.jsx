import { useAuthStore } from "../store/auth.store";
import "../styles/dashboard.css";

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
        <div className="dashboard-page">
            <section className="dashboard-hero">
                <p className="dashboard-kicker">Bienvenida</p>
                <h2 className="dashboard-title">Inicio</h2>
                <p className="dashboard-text">
                    Hola, <b>{user?.username}</b> {isAdmin ? "(Administrador)" : "(Usuario)"}. Este inicio está pensado para
                    que tengas una experiencia completa, visual y práctica para organizar tareas futuras y evitar olvidos.
                </p>
                <p className="dashboard-subtext">
                    Muchas familias conviven con desafíos de memoria, especialmente en adultos mayores o personas con deterioro
                    cognitivo como Alzheimer. Esta vista prioriza claridad, seguimiento y hábito diario.
                </p>

                <div className="dashboard-chip-list">
                    <span className="dashboard-chip">Recordar</span>
                    <span className="dashboard-chip dashboard-chip-alt">Organizar</span>
                    <span className="dashboard-chip dashboard-chip-soft">Acompañar</span>
                    <span className="dashboard-chip">Progresar</span>
                </div>
            </section>

            <section className="dashboard-card">
                <h3 className="dashboard-card-title">Video de apoyo</h3>
                <p className="dashboard-card-subtitle">Recurso visual sobre memoria y cuidado en adultos mayores.</p>
                <div className="dashboard-video-wrap">
                    <div className="dashboard-video-ratio">
                        <iframe
                            className="dashboard-video"
                            src="https://www.youtube.com/embed/8HLEr-zP3fc"
                            title="Video de YouTube sobre apoyo de memoria"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                </div>
            </section>

            <section className="dashboard-grid dashboard-grid-3">
                {pillars.map((item) => (
                    <article key={item.title} className="dashboard-card dashboard-hover">
                        <h4 className="dashboard-item-title">{item.title}</h4>
                        <p className="dashboard-item-text">{item.text}</p>
                    </article>
                ))}
            </section>

            <section className="dashboard-card dashboard-card-soft">
                <h3 className="dashboard-card-title">Guía rápida para usar Inicio</h3>
                <div className="dashboard-grid dashboard-grid-2">
                    {tips.map((tip) => (
                        <div key={tip} className="dashboard-tip-item">
                            • {tip}
                        </div>
                    ))}
                </div>
            </section>

            <section className="dashboard-grid dashboard-grid-2">
                <article className="dashboard-card">
                    <h3 className="dashboard-card-title">Rutina recomendada</h3>
                    <div className="dashboard-list">
                        {timeline.map((step) => (
                            <div key={step.hour} className="dashboard-list-item">
                                <span className="dashboard-time-pill">{step.hour}</span>
                                <span className="dashboard-list-text">{step.action}</span>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="dashboard-card">
                    <h3 className="dashboard-card-title">Preguntas frecuentes</h3>
                    <div className="dashboard-faq-list">
                        {faqs.map((item) => (
                            <div key={item.q} className="dashboard-faq-item">
                                <p className="dashboard-faq-question">{item.q}</p>
                                <p className="dashboard-faq-answer">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </article>
            </section>

            <section className="dashboard-cta">
                <h3 className="dashboard-cta-title">Sigue bajando: aquí siempre tendrás contexto útil</h3>
                <p className="dashboard-cta-text">
                    Este inicio ahora es más completo para que no solo veas una portada, sino también contenido práctico que
                    ayude a transformar tareas sueltas en hábitos y apoyo real para el día a día.
                </p>
            </section>
        </div>
    );
}
