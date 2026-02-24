//Username: michaelw
//Password: michaelwpass

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/auth.store";
import "../styles/login.css";

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
        <div className="login-page">
            <div className="login-orb login-orb-left" />
            <div className="login-orb login-orb-right" />

            <div className="login-card">
                <p className="login-kicker">MemoryCare</p>
                <h1 className="login-title">Iniciar sesión</h1>

                <p className="login-description">
                    Organiza tus tareas personales futuras y recibe un flujo claro para que siempre recuerdes qué hacer.
                </p>
                <p className="login-demo-text">
                    Demo DummyJSON:
                    <span className="login-demo-pill">emilys / emilyspass</span>
                </p>

                <form onSubmit={onSubmit} className="login-form">
                    <div>
                        <label className="login-label">Username</label>
                        <input className="login-input" {...form.register("username")} />
                        {form.formState.errors.username && (
                            <p className="login-error">{form.formState.errors.username.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="login-label">Password</label>
                        <input type="password" className="login-input" {...form.register("password")} />
                        {form.formState.errors.password && (
                            <p className="login-error">{form.formState.errors.password.message}</p>
                        )}
                    </div>

                    <button type="submit" disabled={loginMutation.isPending} className="login-submit">
                        {loginMutation.isPending ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
}
