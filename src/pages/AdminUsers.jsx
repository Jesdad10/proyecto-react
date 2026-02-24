import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { usersService } from "../services/users.service";

export default function AdminUsers() {
    const [q, setQ] = useState("");
    const qc = useQueryClient();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["admin-users", 30, 0],
        queryFn: () => usersService.list(30, 0),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => usersService.remove(id),
        onSuccess: (_deleted, id) => {
            qc.setQueryData(["admin-users", 30, 0], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    users: (old.users || []).filter((u) => u.id !== id),
                    total: Math.max(0, (old.total ?? 0) - 1),
                };
            });
            toast.success("Usuario borrado");
        },
        onError: (e) => toast.error(e.message),
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

    if (isLoading) return <div className="text-emerald-900">Cargando usuarios...</div>;
    if (isError) return <div className="text-red-700">{error.message}</div>;

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-white/90 p-5 backdrop-blur">
                <h2 className="text-2xl font-bold text-emerald-950">Usuarios (Admin)</h2>
                <p className="mt-1 text-sm text-emerald-900/80">
                    Listado de usuarios desde DummyJSON (sin contraseñas, como debe ser).
                </p>

                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar por nombre, username o email..."
                    className="mt-4 w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 outline-none transition focus:border-emerald-500"
                />

                <div className="mt-3 text-xs text-emerald-700">
                    Mostrando {filtered.length} de {users.length}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
                {filtered.map((u) => (
                    <div key={u.id} className="rounded-2xl border border-emerald-200 bg-white/90 p-4 backdrop-blur">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="break-words font-semibold text-emerald-950">
                                    {u.firstName} {u.lastName}
                                </div>
                                <div className="text-sm text-emerald-900/80">@{u.username}</div>

                                <div className="mt-3 text-sm text-emerald-900">
                                    <span className="text-emerald-900/80">Email:</span>{" "}
                                    <span className="break-words">{u.email}</span>
                                </div>

                                <div className="text-sm text-emerald-900">
                                    <span className="text-emerald-900/80">Edad:</span> {u.age}
                                </div>

                                <div className="text-sm text-emerald-900">
                                    <span className="text-emerald-900/80">Ciudad:</span> {u.address?.city || "-"}
                                </div>
                            </div>

                            <div className="flex shrink-0 flex-col items-end gap-2">
                                <span className="rounded-lg border border-emerald-200 bg-white/90 px-2 py-1 text-xs text-emerald-900">
                                    ID {u.id}
                                </span>
                                <button
                                    onClick={() => deleteMutation.mutate(u.id)}
                                    disabled={deleteMutation.isPending}
                                    className="rounded-lg border border-red-300 bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-200 disabled:opacity-60"
                                >
                                    Borrar usuario
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
