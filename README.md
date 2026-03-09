# Proyecto React Evaluación — Gestor de Tareas con Roles (Usuario/Admin)

Aplicación web desarrollada con **React + Vite** para la gestión de tareas y organización diaria.  
Incluye autenticación con API, control de acceso por roles, rutas protegidas, operaciones CRUD sobre tareas y paneles diferenciados para usuario y administrador.

---

## 📌 Descripción del proyecto

Este proyecto implementa una app de productividad enfocada en:

- **Autenticación de usuarios** mediante API (login).
- **Panel de usuario** para gestionar tareas (crear, listar, editar, completar y eliminar).
- **Panel de administrador** con vistas exclusivas y gestión de usuarios.
- **Navegación con rutas protegidas** y control por rol.
- **Diseño responsive** adaptado a distintos tamaños de pantalla.

La arquitectura se organiza por responsabilidades (`pages`, `components`, `services`, `store`, `router`, `styles`) para mantener un enfoque profesional y escalable.

---

## 🧱 Stack tecnológico

### Librerías principales
- **react-router-dom** `^7.13.0` → enrutado de la SPA
- **@tanstack/react-query** `^5.90.21` → gestión de estado servidor/cache
- **react-hook-form** `^7.71.1` → formularios
- **zod** `^4.3.6` + **@hookform/resolvers** `^5.2.2` → validación de formularios
- **zustand** `^5.0.11` → estado global de autenticación
- **react-toastify** `^11.0.5` → notificaciones
- **tailwindcss**  + PostCSS/Autoprefixer → base de estilos utilitarios

> Nota: **No se usa Axios**; las peticiones se realizan con `fetch`.

---

## ✅ Funcionalidades implementadas

- Login con API y persistencia de sesión.
- Rutas públicas y privadas.
- Control de acceso por rol (`admin` / `usuario`).
- CRUD de tareas:
  - `GET` listado
  - `POST` creación
  - `PATCH` actualización parcial
  - `PUT` edición completa
  - `DELETE` eliminación
- Gestión de usuarios para administrador.
- Diseño responsive con breakpoints de proyecto:
  - `990px`
  - `767px`
  - `510px`
  - `480px`

---

## Instalación Repositorio
- Clonar repositorio
`git clone <URL_DEL_REPO>`
`cd <NOMBRE_DEL_REPO>`

- Instalar dependencias
`npm install`

- Ejecutar en desarrollo
`npm run dev`

- Compilar para producción
`npm run build`

- Previsualizar build
`npm run preview`

## 📁 Estructura del proyecto

```bash
src/
  components/
    AppLayout.jsx
    ProtectedRoute.jsx
    RoleRoute.jsx
  pages/
    Login.jsx
    Dashboard.jsx
    Todos.jsx
    Admin.jsx
    AdminUsers.jsx
    NotFound.jsx
  router/
    AppRouter.jsx
  services/
    auth.service.js
    todos.service.js
    users.service.js
    http.js
  store/
    auth.store.js
  styles/
    admin.css
    dashboard.css
    todos.css
    login.css
    layout.css
  main.jsx
  App.jsx