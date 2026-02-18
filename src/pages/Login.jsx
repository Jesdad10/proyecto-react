//Username: michaelw
//Password: michaelwpass

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/auth.store";

const schema = z.object({
    username: z.string().min(2, "Username obligatorio"),
    password: z.string().min(2, "Password obligatoria"),
});

async function loginRequest({ username, password }) {
    const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            username,
            password,
            expiresInMins: 60,
        }),
        // ✅ IMPORTANTE: NO usar credentials: "include" (CORS)
        // credentials: "omit",
    });

    const text = await res.text();
    let data = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = { message: text };
    }

    if (!res.ok) {
        throw new Error(data?.message || `Login falló (${res.status})`);
    }

    return data;
}

export default function Login() {
    const navigate = useNavigate();
    const setSession = useAuthStore((s) => s.setSession);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            username: "emilys",
            password: "emilyspass",
        },
    });

    const loginMutation = useMutation({
        mutationFn: loginRequest,
        onSuccess: (data) => {
            // En DummyJSON puede venir como token o accessToken (según endpoint/version)
            const token = data.token || data.accessToken;

            if (!token) {
                toast.error("Login OK pero no llegó token/accessToken");
                return;
            }

            // Guardamos el usuario sin tokens
            const { token: _t, accessToken, refreshToken, ...user } = data;

            setSession({ token, user });
            toast.success("Login correcto");
            navigate("/dashboard", { replace: true });
        },
        onError: (e) => toast.error(e.message),
    });

    const onSubmit = form.handleSubmit((values) => {
        loginMutation.mutate({
            username: values.username.trim(),
            password: values.password.trim(),
        });
    });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 grid place-items-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl">
                <h1 className="text-2xl font-bold">Iniciar sesión</h1>

                <p className="mt-2 text-slate-300 text-sm">
                    DummyJSON (demo). Prueba:
                    <span className="ml-2 font-mono">emilys / emilyspass</span>
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm text-slate-300">Username</label>
                        <input
                            className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-sky-400/60"
                            {...form.register("username")}
                        />
                        {form.formState.errors.username && (
                            <p className="mt-1 text-sm text-red-400">
                                {form.formState.errors.username.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-slate-300">Password</label>
                        <input
                            type="password"
                            className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:border-sky-400/60"
                            {...form.register("password")}
                        />
                        {form.formState.errors.password && (
                            <p className="mt-1 text-sm text-red-400">
                                {form.formState.errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full rounded-xl bg-sky-500/20 border border-sky-400/40 px-3 py-2 font-semibold hover:bg-sky-500/30 disabled:opacity-60 transition"
                    >
                        {loginMutation.isPending ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
}