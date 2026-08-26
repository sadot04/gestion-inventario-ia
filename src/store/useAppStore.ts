import { create } from 'zustand'
import type { Cliente, FiltrosBusqueda, Producto, Venta } from '../types'
interface EstadoApp { productos: Producto[]; ventas: Venta[]; clientes: Cliente[]; filtros: FiltrosBusqueda; actualizarFiltros: (cambios: Partial<FiltrosBusqueda>) => void; agregarProducto: (producto: Omit<Producto, 'id' | 'estado'>) => void }
const productosIniciales: Producto[] = [
  { id: 1, nombre: 'Auriculares Pro X', categoria: 'Tecnología', precio: 129.99, stock: 42, stockMinimo: 10, estado: 'Activo' },
  { id: 2, nombre: 'Teclado mecánico K2', categoria: 'Tecnología', precio: 89.5, stock: 8, stockMinimo: 10, estado: 'Activo' },
  { id: 3, nombre: 'Mochila urbana', categoria: 'Accesorios', precio: 54, stock: 25, stockMinimo: 8, estado: 'Activo' },
  { id: 4, nombre: 'Lámpara de escritorio', categoria: 'Hogar', precio: 42.75, stock: 0, stockMinimo: 5, estado: 'Agotado' },
]
export const useAppStore = create<EstadoApp>((set) => ({
  productos: productosIniciales,
  ventas: [
    { id: 'V-1048', cliente: 'Sofía Ramírez', productos: 3, total: 289.49, fecha: 'Hoy, 10:42', estado: 'Completada' },
    { id: 'V-1047', cliente: 'Diego Molina', productos: 1, total: 54, fecha: 'Hoy, 09:18', estado: 'Completada' },
    { id: 'V-1046', cliente: 'Valentina Cruz', productos: 2, total: 132.25, fecha: 'Ayer, 17:36', estado: 'Pendiente' },
    { id: 'V-1045', cliente: 'Martín Vega', productos: 1, total: 89.5, fecha: 'Ayer, 15:10', estado: 'Cancelada' },
  ],
  clientes: [
    { id: 1, nombre: 'Sofía Ramírez', email: 'sofia@northstar.co', telefono: '+51 987 123 456', compras: 18, estado: 'Activo' },
    { id: 2, nombre: 'Diego Molina', email: 'diego@northstar.co', telefono: '+51 945 442 180', compras: 7, estado: 'Activo' },
    { id: 3, nombre: 'Valentina Cruz', email: 'valentina@correo.com', telefono: '+51 996 221 045', compras: 4, estado: 'Activo' },
  ],
  filtros: { termino: '', categoria: 'Todas', estado: 'Todos' },
  actualizarFiltros: (cambios) => set((state) => ({ filtros: { ...state.filtros, ...cambios } })),
  agregarProducto: (producto) => set((state) => ({ productos: [...state.productos, { ...producto, id: Date.now(), estado: producto.stock > 0 ? 'Activo' : 'Agotado' }] })),
}))