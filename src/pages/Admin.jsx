import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function Admin() {
    const user = useAuthStore((s) => s.user);
    const navigate = useNavigate();

    return (
        <div className="space-y-4">
            <button
                onClick={() => navigate(-1)}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
            >
                ← Volver
            </button>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                <h2 className="text-xl font-bold">Panel Admin</h2>
                <p className="mt-2 text-slate-100">
                    Acceso permitido porque tu usuario es <b>{user?.username}</b> (admin simulado).
                </p>
                <p className="mt-2 text-sm text-slate-200/90">
                    En la defensa explicas: la API no define roles, así que el rol se gestiona por el usuario autenticado.
                </p>
            </div>
        </div>
    );
}
