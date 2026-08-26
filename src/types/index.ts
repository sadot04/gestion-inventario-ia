export interface Producto { id: number; nombre: string; categoria: string; precio: number; stock: number; stockMinimo: number; estado: 'Activo' | 'Agotado' }
export interface Cliente { id: number; nombre: string; email: string; telefono: string; compras: number; estado: 'Activo' | 'Inactivo' }
export interface Venta { id: string; cliente: string; productos: number; total: number; fecha: string; estado: 'Completada' | 'Pendiente' | 'Cancelada' }
export interface FiltrosBusqueda { termino: string; categoria: string; estado: string }
export type Pestana = 'Resumen' | 'Productos' | 'Ventas' | 'Clientes'