# Instrucciones del Proyecto - Enterprise In-Memory ERP/Dashboard

## Stack Tecnológico y Arquitectura
- **Framework:** React 18 / Vite con TypeScript estricto.
- **Estilos & UI:** Tailwind CSS, Lucide React (iconos), componentes modulares y accesibles.
- **Gestión de Estado:** Zustand (o React Context API modular) manejando el estado 100% en memoria con seed data inicial.
- **Estructura de Directorios:**
  - `src/components/ui/` (Componentes reutilizables: Botones, Modales, Inputs, Tablas).
  - `src/features/` (Módulos de dominio: `products`, `sales`, `dashboard`).
  - `src/types/` (Definición de interfaces TypeScript).
  - `src/store/` (Manejadores de estado en memoria).

## Principios de Calidad
- Tipado estricto sin uso de `any`.
- Separación estricta entre capa visual (UI) y capa de lógica/estado.
- Validaciones robustas de entrada, manejo de stock transaccional y alertas visuales.
- Interfaz en español con diseño limpio, tipo dashboard empresarial responsivo.