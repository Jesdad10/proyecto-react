import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { todosService } from "../services/todos.service";
import { useAuthStore } from "../store/auth.store";
import "../styles/todos.css";

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

    const getTodoIdentity = (todo) => todo?._localId || `remote-${todo?.id}`;

    const updateTodoLocal = (todoIdentity, updater) => {
        qc.setQueryData(["todos"], (old) => {
            if (!old) return old;
            return {
                ...old,
                todos: (old.todos || []).map((t) => (getTodoIdentity(t) === todoIdentity ? updater(t) : t)),
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
            toast.success("Estado actualizado");
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
            toast.success("Tarea editada");
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
                <div className="todos-toast-row">
                    <div className="todos-toast-text-wrap">
                        <div className="todos-toast-title">{message}</div>
                        <div className="todos-toast-subtitle">Se aplicará al terminar la barra.</div>
                    </div>

                    <button
                        className="todos-toast-undo"
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
            message: "Tarea añadida",
            onUndo: () => {
                setNewTodo(text);
                toast.info("Añadido cancelado");
            },
            onCommit: () => addMutation.mutate({ todo: text, userId: user?.id || 1 }),
        });
    };

    const requestDelete = (todoItem) => {
        const todoIdentity = getTodoIdentity(todoItem);
        const key = `del-${todoIdentity}-${Date.now()}`;

        qc.setQueryData(["todos"], (old) => {
            if (!old) return old;
            return {
                ...old,
                todos: (old.todos || []).filter((t) => getTodoIdentity(t) !== todoIdentity),
                total: Math.max(0, (old.total ?? 0) - 1),
            };
        });

        showUndoToast({
            key,
            message: "Tarea borrada",
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
            updateTodoLocal(getTodoIdentity(t), (old) => ({ ...old, completed: nextCompleted }));
            toast.success("Estado actualizado");
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
            updateTodoLocal(getTodoIdentity(editItem), (old) => ({ ...old, todo: text }));
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
        return <div className="todos-loading">Cargando tareas…</div>;
    }
    if (isError) {
        return <div className="todos-error">{error.message}</div>;
    }

    return (
        <div className="todos-page">
            <section className="todos-header-card">
                <div className="todos-header-row">
                    <div>
                        <p className="todos-kicker">Panel de tareas</p>
                        <h2 className="todos-title">Tus recordatorios futuros</h2>
                        <p className="todos-description">
                            Mantén el mismo flujo CRUD, ahora con una vista más clara para planificar lo que debes hacer.
                        </p>
                    </div>

                    <div className="todos-stats-grid">
                        <Stat label="Total" value={stats.total} />
                        <Stat label="Pendientes" value={stats.pending} />
                        <Stat label="Hechas" value={stats.done} />
                    </div>
                </div>

                <div className="todos-controls-grid">
                    <div className="todos-controls-span-6">
                        <div className="todos-add-wrap">
                            <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Nueva tarea..." className="todos-input" />
                            <button onClick={requestAdd} disabled={!newTodo.trim() || addMutation.isPending} className="todos-add-btn">
                                Añadir
                            </button>
                        </div>
                    </div>

                    <div className="todos-controls-span-4">
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." className="todos-input" />
                    </div>

                    <div className="todos-controls-span-2">
                        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="todos-select">
                            <option value="all">Todas</option>
                            <option value="pending">Pendientes</option>
                            <option value="done">Hechas</option>
                        </select>
                    </div>
                </div>
            </section>

            {visible.length === 0 ? (
                <div className="todos-empty">No hay tareas con ese filtro.</div>
            ) : (
                <div className="todos-grid">
                    {visible.map((t) => (
                        <article key={t._localId || t.id} className="todos-item-card">
                            <div className="todos-item-row">
                                <div className="todos-item-main">
                                    <div className="todos-item-badges">
                                        <span className="todos-id-badge">#{t.id}</span>
                                        <span className={statusClassName(t.completed)}>{statusLabel(t.completed)}</span>
                                    </div>

                                    <p className="todos-item-text">{t.todo}</p>
                                </div>

                                <div className="todos-item-actions">
                                    <button
                                        onClick={() => toggleCompleted(t)}
                                        disabled={patchMutation.isPending && !t?._localOnly}
                                        className="todos-action-btn todos-action-btn-wide"
                                    >
                                        {t.completed === true ? "Marcar pendiente" : "Completar"}
                                    </button>

                                    <button onClick={() => openEdit(t)} className="todos-action-btn">
                                        Editar
                                    </button>

                                    <button onClick={() => requestDelete(t)} className="todos-delete-btn">
                                        Borrar
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {editOpen &&
                createPortal(
                    <div className="todos-modal-overlay">
                        <div className="todos-modal-card">
                            <div className="todos-modal-header">
                                <h3 className="todos-modal-title">Editar tarea</h3>
                                <button onClick={() => setEditOpen(false)} className="todos-modal-close-btn">
                                    Cerrar
                                </button>
                            </div>

                            <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} className="todos-modal-textarea" />

                            <div className="todos-modal-actions">
                                <button onClick={saveEdit} disabled={!editValue.trim() || putMutation.isPending} className="todos-modal-save-btn">
                                    Guardar
                                </button>
                                <button onClick={() => setEditOpen(false)} className="todos-modal-cancel-btn">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}

function Stat({ label, value }) {
    return (
        <div className="todos-stat-card">
            <div className="todos-stat-label">{label}</div>
            <div className="todos-stat-value">{value}</div>
        </div>
    );
}

function statusLabel(completed) {
    if (completed === true) return "Hecha";
    if (completed === false) return "Pendiente";
    return "Sin estado";
}

function statusClassName(completed) {
    if (completed === true) return "todos-status-badge todos-status-done";
    if (completed === false) return "todos-status-badge todos-status-pending";
    return "todos-status-badge todos-status-neutral";
}
