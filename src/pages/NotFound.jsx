import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen grid place-items-center bg-slate-950 text-slate-100">
            <div className="text-center">
                <div className="text-6xl font-bold">404</div>
                <div className="mt-2 text-slate-300">Ruta no encontrada</div>
                <button
                    className="mt-6 rounded-xl border border-slate-700 px-4 py-2 hover:bg-slate-900"
                    onClick={() => navigate("/login", { replace: true })}
                >
                    Volver
                </button>
            </div>
        </div>
    );
}