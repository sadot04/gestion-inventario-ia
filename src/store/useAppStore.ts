import { create } from 'zustand';
import type { Producto, Venta } from '../types/producto';

interface EstadoAplicacion {
  productos: Producto[];
  ventas: Venta[];
  agregarProducto: (producto: Omit<Producto, 'id'>) => Producto;
  actualizarProducto: (id: string, cambios: Omit<Producto, 'id'>) => void;
  eliminarProducto: (id: string) => void;
  obtenerProductoPorId: (id: string) => Producto | undefined;
}

const productosIniciales: Producto[] = [
  { id: 'prod-1', nombre: 'Cuaderno rayado', categoria: 'Papelería', sku: 'PAP-001', precio: 8.5, stock: 24 },
  { id: 'prod-2', nombre: 'Botella térmica', categoria: 'Hogar', sku: 'HOG-014', precio: 32, stock: 5 },
  { id: 'prod-3', nombre: 'Auriculares inalámbricos', categoria: 'Tecnología', sku: 'TEC-008', precio: 74.9, stock: 0 }
];

export const useAppStore = create<EstadoAplicacion>((set, get) => ({
  productos: productosIniciales,
  ventas: [],
  agregarProducto: (datos) => {
    const producto: Producto = { ...datos, id: `prod-${crypto.randomUUID()}` };
    set((estado) => ({ productos: [...estado.productos, producto] }));
    return producto;
  },
  actualizarProducto: (id, cambios) => set((estado) => ({
    productos: estado.productos.map((producto) => producto.id === id ? { ...producto, ...cambios } : producto)
  })),
  eliminarProducto: (id) => set((estado) => ({ productos: estado.productos.filter((producto) => producto.id !== id) })),
  obtenerProductoPorId: (id) => get().productos.find((producto) => producto.id === id)
}));
