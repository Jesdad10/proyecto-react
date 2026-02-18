import { create } from "zustand";

const STORAGE_KEY = "dj_auth";

// ✅ Admins permitidos (DummyJSON login funciona con emilys)
const ADMIN_USERS = ["emilys"];

function load() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch {
        return null;
    }
}

export const useAuthStore = create((set, get) => {
    const saved = load();

    const savedToken = saved?.token || null;
    const savedUser = saved?.user || null;

    return {
        token: savedToken,
        user: savedUser,
        isAdmin: savedUser ? ADMIN_USERS.includes(savedUser.username) : false,

        setSession: ({ token, user }) => {
            const isAdmin = user ? ADMIN_USERS.includes(user.username) : false;

            const next = { token, user };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

            set({ token, user, isAdmin });
        },

        logout: () => {
            localStorage.removeItem(STORAGE_KEY);
            set({ token: null, user: null, isAdmin: false });
        },

        isLoggedIn: () => !!get().token,
    };
});