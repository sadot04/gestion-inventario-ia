import { useAppStore } from '../../store/useAppStore';
import type { DatosProducto, Producto } from '../../types/producto';

export type DatosProductoGuardados = Omit<Producto, 'id'>;

export interface ProductFeature {
  productos: Producto[];
  guardarProducto: (datos: DatosProductoGuardados, id?: string) => void;
  eliminarProducto: (id: string) => void;
  obtenerProductoPorId: (id: string) => Producto | undefined;
}

export function useProductFeature(): ProductFeature {
  const productos = useAppStore((estado) => estado.productos);
  const agregarProducto = useAppStore((estado) => estado.agregarProducto);
  const actualizarProducto = useAppStore((estado) => estado.actualizarProducto);
  const eliminarProducto = useAppStore((estado) => estado.eliminarProducto);
  const obtenerProductoPorId = useAppStore((estado) => estado.obtenerProductoPorId);

  function guardarProducto(datos: DatosProductoGuardados, id?: string) {
    if (id) {
      actualizarProducto(id, datos);
      return;
    }
    agregarProducto(datos);
  }

  return { productos, guardarProducto, eliminarProducto, obtenerProductoPorId };
}

export type { DatosProducto };
