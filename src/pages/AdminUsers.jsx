import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const BASE = "https://dummyjson.com";

async function fetchUsers(limit = 30, skip = 0) {
    const r = await fetch(`${BASE}/users?limit=${limit}&skip=${skip}`);
    const data = await r.json();
    if (!r.ok) throw new Error(data?.message || "Error cargando usuarios");
    return data; // { users, total, limit, skip }
}

export default function AdminUsers() {
    const [q, setQ] = useState("");

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

    if (isLoading) return <div className="text-slate-300">Cargando usuarios...</div>;
    if (isError) return <div className="text-red-400">{error.message}</div>;

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
                <h2 className="text-2xl font-bold">Usuarios (Admin)</h2>
                <p className="mt-1 text-sm text-slate-400">
                    Listado de usuarios desde DummyJSON (sin contraseñas, como debe ser).
                </p>

                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar por nombre, username o email..."
                    className="mt-4 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-sky-400/60"
                />

                <div className="mt-3 text-xs text-slate-500">
                    Mostrando {filtered.length} de {users.length}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
                {filtered.map((u) => (
                    <div
                        key={u.id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/20 p-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="font-semibold break-words">
                                    {u.firstName} {u.lastName}
                                </div>
                                <div className="text-sm text-slate-400">@{u.username}</div>

                                <div className="mt-3 text-sm">
                                    <span className="text-slate-400">Email:</span>{" "}
                                    <span className="break-words">{u.email}</span>
                                </div>

                                <div className="text-sm">
                                    <span className="text-slate-400">Edad:</span> {u.age}
                                </div>

                                <div className="text-sm">
                                    <span className="text-slate-400">Ciudad:</span> {u.address?.city || "-"}
                                </div>
                            </div>

                            <span className="shrink-0 text-xs rounded-lg border border-slate-700 px-2 py-1 text-slate-300">
                                ID {u.id}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}