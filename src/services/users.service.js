const BASE = "https://dummyjson.com";

export const usersService = {
    list: async (limit = 30, skip = 0) => {
        const r = await fetch(`${BASE}/users?limit=${limit}&skip=${skip}`);
        const data = await r.json();
        if (!r.ok) throw new Error(data?.message || "Error cargando usuarios");
        return data; // { users: [...], total, skip, limit }
    },

    get: async (id) => {
        const r = await fetch(`${BASE}/users/${id}`);
        const data = await r.json();
        if (!r.ok) throw new Error(data?.message || "Error cargando usuario");
        return data;
    },
};