import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { usersService } from "../services/users.service";
import "../styles/admin.css";

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

    if (isLoading) return <div className="admin-loading">Cargando usuarios...</div>;
    if (isError) return <div className="admin-error">{error.message}</div>;

    return (
        <div className="admin-users-page">
            <div className="admin-users-filter-panel">
                <h2 className="admin-users-title">Usuarios (Admin)</h2>
                <p className="admin-users-subtitle">Listado de usuarios desde DummyJSON (sin contraseñas, como debe ser).</p>

                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar por nombre, username o email..."
                    className="admin-users-input"
                />

                <div className="admin-users-count">Mostrando {filtered.length} de {users.length}</div>
            </div>

            <div className="admin-users-grid">
                {filtered.map((u) => (
                    <div key={u.id} className="admin-users-card">
                        <div className="admin-users-card-row">
                            <div className="admin-users-content">
                                <div className="admin-users-name">
                                    {u.firstName} {u.lastName}
                                </div>
                                <div className="admin-users-username">@{u.username}</div>

                                <div className="admin-users-detail">
                                    <span className="admin-users-label">Email:</span> <span>{u.email}</span>
                                </div>

                                <div className="admin-users-detail">
                                    <span className="admin-users-label">Edad:</span> {u.age}
                                </div>

                                <div className="admin-users-detail">
                                    <span className="admin-users-label">Ciudad:</span> {u.address?.city || "-"}
                                </div>
                            </div>

                            <div className="admin-users-actions">
                                <span className="admin-users-id">ID {u.id}</span>
                                <button
                                    onClick={() => deleteMutation.mutate(u.id)}
                                    disabled={deleteMutation.isPending}
                                    className="admin-users-delete-btn"
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
