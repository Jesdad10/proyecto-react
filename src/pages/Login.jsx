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
            const token = data.token || data.accessToken;

            if (!token) {
                toast.error("Login OK pero no llegó token/accessToken");
                return;
            }

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
        <div className="relative grid min-h-screen place-items-center overflow-hidden p-4 text-slate-100">
            <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-10 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />

            <div className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/65 p-7 shadow-2xl backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.25em] text-sky-300/80">Recordatorios inteligentes</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">Iniciar sesión</h1>

                <p className="mt-3 text-sm text-slate-300">
                    Organiza tus tareas personales futuras y recibe un flujo claro para que siempre recuerdes qué hacer.
                </p>
                <p className="mt-2 text-xs text-slate-400">
                    Demo DummyJSON:
                    <span className="ml-2 rounded-md border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-slate-200">
                        emilys / emilyspass
                    </span>
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm text-slate-200">Username</label>
                        <input
                            className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2.5 outline-none transition focus:border-sky-300/70 focus:ring-2 focus:ring-sky-500/20"
                            {...form.register("username")}
                        />
                        {form.formState.errors.username && (
                            <p className="mt-1 text-sm text-red-300">
                                {form.formState.errors.username.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-slate-200">Password</label>
                        <input
                            type="password"
                            className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2.5 outline-none transition focus:border-sky-300/70 focus:ring-2 focus:ring-sky-500/20"
                            {...form.register("password")}
                        />
                        {form.formState.errors.password && (
                            <p className="mt-1 text-sm text-red-300">
                                {form.formState.errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full rounded-xl border border-sky-300/40 bg-sky-500/20 px-3 py-2.5 font-semibold transition hover:bg-sky-500/30 disabled:opacity-60"
                    >
                        {loginMutation.isPending ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
}
