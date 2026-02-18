const BASE = "https://dummyjson.com";

export const todosService = {
    list: async (limit = 20, skip = 0) => {
        const r = await fetch(`${BASE}/todos?limit=${limit}&skip=${skip}`);
        const data = await r.json();
        if (!r.ok) throw new Error(data?.message || "Error cargando tareas");
        return data;
    },

    add: async ({ todo, userId }) => {
        const r = await fetch(`${BASE}/todos/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ todo, completed: false, userId }),
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data?.message || "Error creando tarea");
        return data;
    },

    patch: async (id, payload) => {
        const r = await fetch(`${BASE}/todos/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data?.message || "Error actualizando (PATCH)");
        return data;
    },

    put: async (id, payload) => {
        const r = await fetch(`${BASE}/todos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data?.message || "Error actualizando (PUT)");
        return data;
    },

    remove: async (id) => {
        const r = await fetch(`${BASE}/todos/${id}`, { method: "DELETE" });
        const data = await r.json();
        if (!r.ok) throw new Error(data?.message || "Error borrando tarea");
        return data;
    },
};