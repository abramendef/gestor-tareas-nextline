# Sinergia - Sistema de Gestion de Tareas

Sinergia es una solucion full-stack diseñada para la gestion eficiente de tareas corporativas. El sistema permite el control total del ciclo de vida de las tareas (CRUD) bajo una arquitectura robusta, segura y escalable.

## Stack Tecnologico

El proyecto esta construido utilizando las siguientes tecnologias:

*   **Backend:** NestJS (Framework progresivo de Node.js).
*   **Base de Datos:** SQLite con Prisma ORM.
*   **Frontend:** Vue 3 (Composition API) con Vite.
*   **Interfaz de Usuario:** Vuetify 3 (Material Design Framework).
*   **Lenguajes:** TypeScript (Backend) y JavaScript (Frontend).

## Requisitos Previos

*   Node.js (Version 18 o superior).
*   NPM (Version 9 o superior).

## Instalacion y Ejecucion

### 1. Servidor (Backend)

Navegar a la carpeta del backend e instalar dependencias:
```bash
cd backend
npm install
```

Configurar la base de datos y levantar el servidor:
```bash
npx prisma generate
npx prisma db push
npm run start:dev
```
El servidor estara disponible en `http://localhost:3000`.

### 2. Cliente (Frontend)

Navegar a la carpeta del frontend e instalar dependencias:
```bash
cd ../frontend
npm install
npm run dev
```
La aplicacion estara disponible en `http://localhost:5173`.

## Arquitectura del Sistema

El desarrollo se basa en los siguientes principios arquitectonicos:

### Visualizacion bajo demanda (Navegacion Eficiente)
Siguiendo los requerimientos de optimizacion, la interfaz principal muestra una "lista breve" de las tareas para minimizar el consumo de recursos. La informacion detallada (descripciones, responsables y comentarios) se consulta al servidor de forma individual cuando el usuario interactua con una tarea especifica.

### Seguridad y Contexto de Usuario
Todas las operaciones de la API requieren la identificacion del usuario mediante la cabecera `x-user-id`. El sistema garantiza el aislamiento de datos, permitiendo que cada usuario gestione exclusivamente sus propias tareas.

## Documentacion de la API

Endpoints implementados en el modulo de tareas:

*   `GET /tasks`: Obtiene la lista breve de tareas filtradas por usuario.
*   `GET /tasks/:id`: Obtiene el detalle completo de una tarea especifica.
*   `POST /tasks`: Registra una nueva tarea en el sistema.
*   `PUT /tasks/:id`: Actualiza la informacion de una tarea existente.
*   `DELETE /tasks/:id`: Elimina una tarea de forma permanente.

## Decisiones Tecnicas

*   **Estandarizacion de Fechas:** Se utiliza el formato ISO para garantizar la compatibilidad entre el motor de base de datos y el selector de fechas del frontend.
*   **Persistencia Ligera:** Se opto por SQLite para facilitar la portabilidad y evaluacion rapida del reto sin necesidad de configurar servidores de base de datos externos.
*   **Estetica Profesional:** Se implemento un diseño sobrio basado en modo oscuro para mejorar la legibilidad y reducir la fatiga visual.
