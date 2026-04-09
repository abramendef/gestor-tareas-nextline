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

## Funcionalidades Principales

El sistema implementa la totalidad de los requerimientos exigidos en el plan del reto:

*   **Gestion de Tareas:** Creacion, edicion, visualizacion y eliminacion de registros.
*   **Validacion de Datos:** Control estricto de campos obligatorios (Titulo, Descripcion y Fecha de entrega).
*   **Control de Estado:** Sistema de checkbox para marcar tareas como completadas con feedback visual inmediato.
*   **Aislamiento de Datos:** Cada usuario gestiona su propio inventario mediante la firma en cabeceras.
*   **Interfaz Adaptativa:** Diseño responsivo garantizado para dispositivos moviles y escritorio.

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

*   **Estandarizacion de Fechas:** Uso del formato ISO para evitar discrepancias de zona horaria entre frontend y backend.
*   **Persistencia Local:** Uso de SQLite para garantizar una evaluacion rapida y sin dependencias de infraestructura externa.
*   **Optimizacion de UX:** Implementacion de estados de carga (spinners) y notificaciones de exito/error para una experiencia fluida.
*   **Manejo de Errores:** Control de excepciones tanto en el cliente como en el servidor para prevenir fallos criticos.
