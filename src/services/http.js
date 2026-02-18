import { useAuthStore } from "../store/auth.store";

const BASE_URL = "https://dummyjson.com";

export async function http(path, { method = "GET", body, auth = false } = {}) {
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    if (auth) {
        const token = useAuthStore.getState().token;
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let data = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = { message: text };
    }

    if (!res.ok) {
        throw new Error(data?.message || `Error ${res.status}`);
    }

    return data;
}