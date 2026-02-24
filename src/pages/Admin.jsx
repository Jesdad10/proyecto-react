import { useAuthStore } from "../store/auth.store";
import "../styles/admin.css";

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
        <div className="admin-page">
            <section className="admin-panel">
                <p className="admin-kicker">Panel de control</p>
                <h2 className="admin-heading">Admin Center</h2>
                <p className="admin-text">
                    Bienvenido, <b>{user?.username}</b>. Aquí tienes un resumen visual del sistema para supervisar actividad,
                    rendimiento y estado de uso.
                </p>
            </section>

            <section className="admin-stats-grid">
                {quickStats.map((item) => (
                    <article key={item.label} className="admin-stat-card">
                        <p className="admin-stat-label">{item.label}</p>
                        <p className="admin-stat-value">{item.value}</p>
                        <p className="admin-stat-delta">{item.delta} vs. semana anterior</p>
                    </article>
                ))}
            </section>

            <section className="admin-charts-grid">
                <article className="admin-chart-card admin-chart-card-wide">
                    <h3 className="admin-card-title">Rendimiento mensual</h3>
                    <p className="admin-card-subtitle">Simulación visual de productividad por semanas.</p>

                    <div className="admin-bars-wrap">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="admin-bar-item">
                                <div className={`admin-bar-fill admin-bar-fill-${i + 1}`} />
                                <span className="admin-bar-label">S{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="admin-chart-card">
                    <h3 className="admin-card-title">Progreso global</h3>
                    <p className="admin-card-subtitle">Estado acumulado del mes actual.</p>

                    <div className="admin-progress-wrap">
                        <div className="admin-progress-ring">
                            <div className="admin-progress-inner">
                                <p className="admin-progress-value">67%</p>
                                <p className="admin-progress-label">Completado</p>
                            </div>
                        </div>
                    </div>
                </article>
            </section>

            <section className="admin-panel">
                <h3 className="admin-card-title">Actividad reciente</h3>
                <div className="admin-activity-list">
                    {activity.map((item) => (
                        <div key={`${item.time}-${item.action}`} className="admin-activity-item">
                            <div>
                                <p className="admin-activity-action">{item.action}</p>
                                <p className="admin-activity-time">{item.time}</p>
                            </div>
                            <span className="admin-activity-tag">{item.tag}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
