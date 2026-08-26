export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  sku: string;
  precio: number;
  stock: number;
}

export interface DatosProducto {
  nombre: string;
  categoria: string;
  sku: string;
  precio: string;
  stock: string;
}

export interface Venta {
  id: string;
  productoId: string;
  cantidad: number;
  total: number;
}
