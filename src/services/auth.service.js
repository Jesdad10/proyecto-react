import { http } from "./http";

export const authService = {
  // ✅ Endpoint actual recomendado por DummyJSON
  login: (username, password) =>
    http("/user/login", {
      method: "POST",
      body: { username, password, expiresInMins: 60 },
    }),

  // ✅ Endpoint actual para obtener el usuario autenticado
  me: () => http("/user/me", { auth: true }),
};