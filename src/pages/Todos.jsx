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
    const [filter, setFilter] = useState("all"); // all | pending | done

    const [editOpen, setEditOpen] = useState(false);
    const [editValue, setEditValue] = useState("");
    const [editItem, setEditItem] = useState(null);

    const timersRef = useRef(new Map());
    const toastRef = useRef(new Map());

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["todos"],
        queryFn: () => todosService.list(30, 0),
    });

    const addMutation = useMutation({
        mutationFn: (payload) => todosService.add(payload),
        onSuccess: (created) => {
            qc.setQueryData(["todos"], (old) => {
                if (!old) return old;
                return { ...old, todos: [created, ...(old.todos || [])], total: (old.total ?? 0) + 1 };
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

        // UI inmediata (se nota el borrado)
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
            onCommit: () => deleteMutation.mutate(todoItem.id),
        });
    };

    const toggleCompleted = (t) => {
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
        // PUT defendible: enviamos todo “lo importante”
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
        const done = todos.filter((t) => t.completed).length;
        const pending = total - done;
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
                if (filter === "done") return t.completed;
                return !t.completed;
            });
    }, [todos, q, filter]);

    if (isLoading) {
        return <div className="text-slate-300">Cargando tareas…</div>;
    }
    if (isError) {
        return <div className="text-red-400">{error.message}</div>;
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
                <div className="flex items-start justify-between gap-4 md:flex-col">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Tareas</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            CRUD completo con DummyJSON: <b>GET</b>, <b>POST</b>, <b>PUT</b>, <b>PATCH</b>, <b>DELETE</b>.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 md:w-full">
                        <Stat label="Total" value={stats.total} />
                        <Stat label="Pendientes" value={stats.pending} />
                        <Stat label="Hechas" value={stats.done} />
                    </div>
                </div>

                {/* Controls */}
                <div className="mt-4 grid grid-cols-12 gap-3">
                    <div className="col-span-6 md:col-span-12">
                        <div className="flex gap-2 md:flex-col">
                            <input
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                placeholder="Nueva tarea..."
                                className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-sky-400/60"
                            />
                            <button
                                onClick={requestAdd}
                                disabled={!newTodo.trim() || addMutation.isPending}
                                className="rounded-xl bg-sky-500/20 border border-sky-400/40 px-4 py-2 font-semibold hover:bg-sky-500/30 disabled:opacity-60 md:w-full"
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
                            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-sky-400/60"
                        />
                    </div>

                    <div className="col-span-2 md:col-span-12">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-sky-400/60"
                        >
                            <option value="all">Todas</option>
                            <option value="pending">Pendientes</option>
                            <option value="done">Hechas</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* List */}
            {visible.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-10 text-center text-slate-300">
                    No hay tareas con ese filtro.
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
                    {visible.map((t) => (
                        <div
                            key={t.id}
                            className="rounded-2xl border border-slate-800 bg-slate-900/20 p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs rounded-lg border border-slate-700 px-2 py-0.5 text-slate-300">
                                            #{t.id}
                                        </span>
                                        <span
                                            className={[
                                                "text-xs rounded-lg border px-2 py-0.5",
                                                t.completed
                                                    ? "border-green-500/40 bg-green-500/10 text-green-300"
                                                    : "border-yellow-500/40 bg-yellow-500/10 text-yellow-200",
                                            ].join(" ")}
                                        >
                                            {t.completed ? "Hecha" : "Pendiente"}
                                        </span>
                                    </div>

                                    <div className="mt-2 font-semibold break-words">
                                        {t.todo}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => toggleCompleted(t)}
                                        disabled={patchMutation.isPending}
                                        className="rounded-xl border border-slate-700 px-3 py-1.5 hover:bg-slate-900"
                                    >
                                        {t.completed ? "Marcar pendiente" : "Completar"}
                                    </button>

                                    <button
                                        onClick={() => openEdit(t)}
                                        className="rounded-xl border border-slate-700 px-3 py-1.5 hover:bg-slate-900"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => requestDelete(t)}
                                        className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-1.5 hover:bg-red-500/20"
                                    >
                                        Borrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Edit */}
            {editOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
                    <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-5">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-bold">Editar tarea</h3>
                            <button
                                onClick={() => setEditOpen(false)}
                                className="rounded-xl border border-slate-700 px-3 py-1.5 hover:bg-slate-900"
                            >
                                Cerrar
                            </button>
                        </div>

                        <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="mt-3 w-full min-h-[110px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-sky-400/60"
                        />

                        <div className="mt-4 flex gap-2 md:flex-col">
                            <button
                                onClick={saveEdit}
                                disabled={!editValue.trim() || putMutation.isPending}
                                className="flex-1 rounded-xl bg-sky-500/20 border border-sky-400/40 px-4 py-2 font-semibold hover:bg-sky-500/30 disabled:opacity-60"
                            >
                                Guardar (PUT)
                            </button>
                            <button
                                onClick={() => setEditOpen(false)}
                                className="flex-1 rounded-xl border border-slate-700 px-4 py-2 hover:bg-slate-900"
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
        <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-3">
            <div className="text-xs text-slate-400">{label}</div>
            <div className="text-lg font-bold">{value}</div>
        </div>
    );
}