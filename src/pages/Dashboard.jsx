import { useAuthStore } from "../store/auth.store";

export default function Dashboard() {
    const user = useAuthStore((s) => s.user);
    const isAdmin = useAuthStore((s) => s.isAdmin);

    return (
        <div className="space-y-5">
            <section className="grid gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-sky-300/70">Bienvenida</p>
                    <h2 className="mt-1 text-3xl font-bold tracking-tight">Inicio</h2>
                    <p className="mt-3 text-slate-200">
                        Hola, <b>{user?.username}</b> {isAdmin ? "(ADMIN)" : "(USER)"}. Este espacio está diseñado para
                        ayudarte a registrar tareas futuras, crear hábitos de memoria y mantener tus pendientes a la vista.
                    </p>
                    <p className="mt-3 text-sm text-slate-300/90">
                        Pensando en el cuidado de personas mayores y en la prevención del olvido por condiciones como el
                        Alzheimer, esta página busca ser una ayuda diaria: simple, clara y útil para recordar lo importante.
                    </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
                    <video
                        className="h-full max-h-[280px] w-full object-cover"
                        controls
                        muted
                        loop
                        playsInline
                        poster="https://images.pexels.com/photos/7551686/pexels-photo-7551686.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    >
                        <source
                            src="https://player.vimeo.com/external/447348800.sd.mp4?s=4b7f4f53df316f4fcb7614df6cf0ea438f6f0ea6&profile_id=164&oauth2_token_id=57447761"
                            type="video/mp4"
                        />
                        Tu navegador no soporta video HTML5.
                    </video>
                </div>
            </section>

            <div className="grid grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1">
                <Card title="Recuerda lo importante" text="Anota tareas futuras y evita que se te pasen actividades clave." />
                <Card title="Apoyo para la memoria" text="Una interfaz clara para acompañar rutinas y reforzar recordatorios diarios." />
                <Card title="Organización simple" text="Consulta, marca y edita pendientes de forma rápida en cualquier dispositivo." />
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
