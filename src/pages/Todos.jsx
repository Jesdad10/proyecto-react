import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { todosService } from "../services/todos.service";
import { useAuthStore } from "../store/auth.store";

const UNDO_MS = 4000;

export default function Todos() {
    const qc = useQueryClient();
    const user = useAuthStore((s) => s.user);

    const [newTodo, setNewTodo] = useState("");
    const [q, setQ] = useState("");
    const [filter, setFilter] = useState("all");

    const [editOpen, setEditOpen] = useState(false);
    const [editValue, setEditValue] = useState("");
    const [editItem, setEditItem] = useState(null);

    const timersRef = useRef(new Map());
    const toastRef = useRef(new Map());

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["todos"],
        queryFn: () => todosService.list(30, 0),
    });

    const updateTodoLocal = (id, updater) => {
        qc.setQueryData(["todos"], (old) => {
            if (!old) return old;
            return {
                ...old,
                todos: (old.todos || []).map((t) => (t.id === id ? updater(t) : t)),
            };
        });
    };

    const addMutation = useMutation({
        mutationFn: (payload) => todosService.add(payload),
        onSuccess: (created) => {
            const createdNormalized = {
                ...created,
                completed: null,
                _localOnly: true,
                _localId: `${created.id}-${Date.now()}`,
            };

            qc.setQueryData(["todos"], (old) => {
                if (!old) return old;
                return { ...old, todos: [createdNormalized, ...(old.todos || [])], total: (old.total ?? 0) + 1 };
            });
        },
        onError: (e) => toast.error(e.message),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => todosService.remove(id),
        onError: (e) => toast.error(e.message),
    });

    const patchMutation = useMutation({
        mutationFn: ({ id, payload }) => todosService.patch(id, payload),
        onSuccess: (updated) => {
            qc.setQueryData(["todos"], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    todos: (old.todos || []).map((t) => (t.id === updated.id ? { ...t, ...updated } : t)),
                };
            });
            toast.success("Estado actualizado (PATCH)");
        },
        onError: (e) => toast.error(e.message),
    });

    const putMutation = useMutation({
        mutationFn: ({ id, payload }) => todosService.put(id, payload),
        onSuccess: (updated) => {
            qc.setQueryData(["todos"], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    todos: (old.todos || []).map((t) => (t.id === updated.id ? { ...t, ...updated } : t)),
                };
            });
            toast.success("Tarea editada (PUT)");
        },
        onError: (e) => toast.error(e.message),
    });

    const clearPending = (key) => {
        const t = timersRef.current.get(key);
        if (t) clearTimeout(t);
        timersRef.current.delete(key);

        const toastId = toastRef.current.get(key);
        if (toastId) toast.dismiss(toastId);
        toastRef.current.delete(key);
    };

    const showUndoToast = ({ key, message, onUndo, onCommit }) => {
        const toastId = toast(
            ({ closeToast }) => (
                <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                        <div className="font-semibold">{message}</div>
                        <div className="text-xs opacity-80">Se aplicará al terminar la barra.</div>
                    </div>

                    <button
                        className="rounded-lg border border-slate-500/40 bg-slate-500/10 px-3 py-1 text-xs font-semibold hover:bg-slate-500/20"
                        onClick={() => {
                            clearPending(key);
                            onUndo?.();
                            closeToast?.();
                        }}
                    >
                        Deshacer
                    </button>
                </div>
            ),
            {
                autoClose: UNDO_MS,
                pauseOnHover: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
            }
        );

        toastRef.current.set(key, toastId);

        const timeoutId = setTimeout(() => {
            timersRef.current.delete(key);
            toastRef.current.delete(key);
            onCommit?.();
        }, UNDO_MS);

        timersRef.current.set(key, timeoutId);
    };

    const requestAdd = () => {
        const text = newTodo.trim();
        if (!text) return;

        const key = `add-${Date.now()}`;
        setNewTodo("");

        showUndoToast({
            key,
            message: "Tarea añadida (POST)",
            onUndo: () => {
                setNewTodo(text);
                toast.info("Añadido cancelado");
            },
            onCommit: () => addMutation.mutate({ todo: text, userId: user?.id || 1 }),
        });
    };

    const requestDelete = (todoItem) => {
        const key = `del-${todoItem.id}-${Date.now()}`;

        qc.setQueryData(["todos"], (old) => {
            if (!old) return old;
            return {
                ...old,
                todos: (old.todos || []).filter((t) => t.id !== todoItem.id),
                total: Math.max(0, (old.total ?? 0) - 1),
            };
        });

        showUndoToast({
            key,
            message: "Tarea borrada (DELETE)",
            onUndo: () => {
                qc.setQueryData(["todos"], (old) => {
                    if (!old) return old;
                    return { ...old, todos: [todoItem, ...(old.todos || [])], total: (old.total ?? 0) + 1 };
                });
                toast.info("Borrado cancelado");
            },
            onCommit: () => {
                if (todoItem?._localOnly) {
                    toast.success("Tarea local borrada");
                    return;
                }
                deleteMutation.mutate(todoItem.id);
            },
        });
    };

    const toggleCompleted = (t) => {
        if (t?._localOnly) {
            const nextCompleted = t.completed === true ? false : true;
            updateTodoLocal(t.id, (old) => ({ ...old, completed: nextCompleted }));
            toast.success("Estado actualizado (local)");
            return;
        }

        patchMutation.mutate({ id: t.id, payload: { completed: !t.completed } });
    };

    const openEdit = (t) => {
        setEditItem(t);
        setEditValue(t.todo);
        setEditOpen(true);
    };

    const saveEdit = () => {
        const text = editValue.trim();
        if (!editItem || !text) return;

        if (editItem?._localOnly) {
            updateTodoLocal(editItem.id, (old) => ({ ...old, todo: text }));
            toast.success("Tarea local editada");
            setEditOpen(false);
            setEditItem(null);
            return;
        }

        putMutation.mutate({
            id: editItem.id,
            payload: { todo: text, completed: !!editItem.completed, userId: editItem.userId },
        });
        setEditOpen(false);
        setEditItem(null);
    };

    const todos = data?.todos || [];
    const stats = useMemo(() => {
        const total = todos.length;
        const done = todos.filter((t) => t.completed === true).length;
        const pending = todos.filter((t) => t.completed === false).length;
        return { total, done, pending };
    }, [todos]);

    const visible = useMemo(() => {
        const byText = q.trim().toLowerCase();
        return todos
            .filter((t) => {
                if (!byText) return true;
                return t.todo.toLowerCase().includes(byText);
            })
            .filter((t) => {
                if (filter === "all") return true;
                if (filter === "done") return t.completed === true;
                return t.completed === false;
            });
    }, [todos, q, filter]);

    if (isLoading) {
        return <div className="text-slate-300">Cargando tareas…</div>;
    }
    if (isError) {
        return <div className="text-red-300">{error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4 md:flex-col">
                    <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-sky-300/80">Panel de tareas</p>
                        <h2 className="mt-1 text-3xl font-bold tracking-tight">Tus recordatorios futuros</h2>
                        <p className="mt-2 text-sm text-slate-300">
                            Mantén el mismo flujo CRUD, ahora con una vista más clara para planificar lo que debes hacer.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 md:w-full">
                        <Stat label="Total" value={stats.total} />
                        <Stat label="Pendientes" value={stats.pending} />
                        <Stat label="Hechas" value={stats.done} />
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-12 gap-3">
                    <div className="col-span-6 md:col-span-12">
                        <div className="flex gap-2 md:flex-col">
                            <input
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                placeholder="Nueva tarea..."
                                className="flex-1 rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2.5 outline-none transition focus:border-sky-300/70 focus:ring-2 focus:ring-sky-500/20"
                            />
                            <button
                                onClick={requestAdd}
                                disabled={!newTodo.trim() || addMutation.isPending}
                                className="rounded-xl border border-sky-300/40 bg-sky-500/20 px-4 py-2.5 font-semibold transition hover:bg-sky-500/30 disabled:opacity-60 md:w-full"
                            >
                                Añadir
                            </button>
                        </div>
                    </div>

                    <div className="col-span-4 md:col-span-12">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Buscar..."
                            className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2.5 outline-none transition focus:border-sky-300/70 focus:ring-2 focus:ring-sky-500/20"
                        />
                    </div>

                    <div className="col-span-2 md:col-span-12">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2.5 outline-none transition focus:border-sky-300/70"
                        >
                            <option value="all">Todas</option>
                            <option value="pending">Pendientes</option>
                            <option value="done">Hechas</option>
                        </select>
                    </div>
                </div>
            </section>

            {visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-10 text-center text-slate-300">
                    No hay tareas con ese filtro.
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
                    {visible.map((t) => (
                        <article
                            key={t._localId || t.id}
                            className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur transition hover:bg-white/[0.07]"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-lg border border-white/15 px-2 py-0.5 text-xs text-slate-300">
                                            #{t.id}
                                        </span>
                                        <span
                                            className={[
                                                "rounded-lg border px-2 py-0.5 text-xs",
                                                t.completed === true
                                                    ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
                                                    : t.completed === false
                                                        ? "border-amber-400/40 bg-amber-500/15 text-amber-100"
                                                        : "border-slate-400/40 bg-slate-400/15 text-slate-200",
                                            ].join(" ")}
                                        >
                                            {t.completed === true ? "Hecha" : t.completed === false ? "Pendiente" : "Sin estado"}
                                        </span>
                                    </div>

                                    <p className="mt-2 break-words text-base font-semibold text-slate-100">{t.todo}</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => toggleCompleted(t)}
                                        disabled={patchMutation.isPending && !t?._localOnly}
                                        className="min-w-[150px] rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-center transition hover:bg-white/10"
                                    >
                                        {t.completed === true ? "Marcar pendiente" : "Completar"}
                                    </button>

                                    <button
                                        onClick={() => openEdit(t)}
                                        className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm transition hover:bg-white/10"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => requestDelete(t)}
                                        className="rounded-xl border border-red-300/40 bg-red-500/15 px-3 py-1.5 text-sm transition hover:bg-red-500/25"
                                    >
                                        Borrar
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {editOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
                    <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-slate-950/90 p-5 shadow-2xl backdrop-blur">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-bold">Editar tarea</h3>
                            <button
                                onClick={() => setEditOpen(false)}
                                className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 hover:bg-white/10"
                            >
                                Cerrar
                            </button>
                        </div>

                        <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="mt-3 min-h-[110px] w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2 outline-none transition focus:border-sky-300/70 focus:ring-2 focus:ring-sky-500/20"
                        />

                        <div className="mt-4 flex gap-2 md:flex-col">
                            <button
                                onClick={saveEdit}
                                disabled={!editValue.trim() || putMutation.isPending}
                                className="flex-1 rounded-xl border border-sky-300/40 bg-sky-500/20 px-4 py-2 font-semibold transition hover:bg-sky-500/30 disabled:opacity-60"
                            >
                                Guardar (PUT)
                            </button>
                            <button
                                onClick={() => setEditOpen(false)}
                                className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2 transition hover:bg-white/10"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Stat({ label, value }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-center">
            <div className="text-xs uppercase tracking-wider text-slate-300">{label}</div>
            <div className="text-lg font-bold text-slate-100">{value}</div>
        </div>
    );
}
