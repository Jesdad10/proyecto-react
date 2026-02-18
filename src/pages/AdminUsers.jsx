import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const BASE = "https://dummyjson.com";

async function fetchUsers(limit = 30, skip = 0) {
    const r = await fetch(`${BASE}/users?limit=${limit}&skip=${skip}`);
    const data = await r.json();
    if (!r.ok) throw new Error(data?.message || "Error cargando usuarios");
    return data;
}

export default function AdminUsers() {
    const [q, setQ] = useState("");
    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["admin-users", 30, 0],
        queryFn: () => fetchUsers(30, 0),
    });

    const users = data?.users || [];

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return users;

        return users.filter((u) => {
            const full = `${u.firstName} ${u.lastName} ${u.username} ${u.email}`.toLowerCase();
            return full.includes(s);
        });
    }, [users, q]);

    if (isLoading) return <div className="text-slate-100">Cargando usuarios...</div>;
    if (isError) return <div className="text-red-300">{error.message}</div>;

    return (
        <div className="space-y-4">
            <button
                onClick={() => navigate(-1)}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
            >
                ← Volver
            </button>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                <h2 className="text-2xl font-bold">Usuarios (Admin)</h2>
                <p className="mt-1 text-sm text-slate-200/90">
                    Listado de usuarios desde DummyJSON (sin contraseñas, como debe ser).
                </p>

                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar por nombre, username o email..."
                    className="mt-4 w-full rounded-xl border border-white/20 bg-indigo-950/70 px-3 py-2 outline-none transition focus:border-amber-200/80"
                />

                <div className="mt-3 text-xs text-slate-200/80">
                    Mostrando {filtered.length} de {users.length}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
                {filtered.map((u) => (
                    <div key={u.id} className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="break-words font-semibold text-white">
                                    {u.firstName} {u.lastName}
                                </div>
                                <div className="text-sm text-slate-200/90">@{u.username}</div>

                                <div className="mt-3 text-sm text-slate-100">
                                    <span className="text-slate-200/90">Email:</span>{" "}
                                    <span className="break-words">{u.email}</span>
                                </div>

                                <div className="text-sm text-slate-100">
                                    <span className="text-slate-200/90">Edad:</span> {u.age}
                                </div>

                                <div className="text-sm text-slate-100">
                                    <span className="text-slate-200/90">Ciudad:</span> {u.address?.city || "-"}
                                </div>
                            </div>

                            <span className="shrink-0 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-slate-100">
                                ID {u.id}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
