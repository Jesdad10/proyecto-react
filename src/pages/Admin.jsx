import { useAuthStore } from "../store/auth.store";

export default function Admin() {
    const user = useAuthStore((s) => s.user);

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-xl font-bold">Panel Admin</h2>
            <p className="mt-2 text-slate-300">
                Acceso permitido porque tu usuario es <b>{user?.username}</b> (admin simulado).
            </p>
            <p className="mt-2 text-sm text-slate-400">
                En la defensa explicas: la API no define roles, así que el rol se gestiona por el usuario autenticado.
            </p>
        </div>
    );
}