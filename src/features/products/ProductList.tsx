import { useMemo, useState } from 'react';
import { ArrowDownUp, ChevronLeft, ChevronRight, Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { useAppStore } from '../../store/useAppStore';
import type { Producto } from '../../types/producto';
import { ProductModal } from './ProductModal';

interface ProductListProps { onNotificar: (mensaje: string) => void; }
type ColumnaOrden = keyof Pick<Producto, 'nombre' | 'categoria' | 'sku' | 'precio' | 'stock'>;
const POR_PAGINA = 6;

export function ProductList({ onNotificar }: ProductListProps) {
  const productos = useAppStore((estado) => estado.productos);
  const eliminarProducto = useAppStore((estado) => estado.eliminarProducto);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [pagina, setPagina] = useState(1);
  const [orden, setOrden] = useState<{ columna: ColumnaOrden; ascendente: boolean }>({ columna: 'nombre', ascendente: true });
  const [productoEditado, setProductoEditado] = useState<Producto | null | undefined>();
  const [productoAEliminar, setProductoAEliminar] = useState<Producto>();
  const categorias = ['Todas', ...new Set(productos.map((producto) => producto.categoria))];
  const filtrados = useMemo(() => productos.filter((producto) => (categoria === 'Todas' || producto.categoria === categoria) && `${producto.nombre} ${producto.sku}`.toLowerCase().includes(busqueda.toLowerCase())).sort((a, b) => { const valorA = a[orden.columna]; const valorB = b[orden.columna]; const comparacion = typeof valorA === 'number' && typeof valorB === 'number' ? valorA - valorB : String(valorA).localeCompare(String(valorB), 'es'); return orden.ascendente ? comparacion : -comparacion; }), [productos, busqueda, categoria, orden]);
  const paginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const visibles = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  function ordenarPor(columna: ColumnaOrden) { setOrden((actual) => ({ columna, ascendente: actual.columna === columna ? !actual.ascendente : true })); setPagina(1); }
  function confirmarEliminacion() { if (!productoAEliminar) return; eliminarProducto(productoAEliminar.id); setProductoAEliminar(undefined); onNotificar('Producto eliminado correctamente.'); }
  function estadoStock(stock: number) { return stock === 0 ? ['Agotado', 'badge--rojo'] : stock <= 5 ? ['Stock bajo', 'badge--amarillo'] : ['Disponible', 'badge--verde']; }
  const columnas: Array<[ColumnaOrden, string]> = [['nombre', 'Producto'], ['categoria', 'Categoría'], ['sku', 'SKU'], ['precio', 'Precio'], ['stock', 'Stock']];

  return <section className="productos">
    <div className="encabezado-vista"><div><p className="sobretitulo">Catálogo</p><h1>Productos</h1><p className="subtitulo">Administra tu inventario en memoria.</p></div><button className="boton boton--principal" type="button" onClick={() => setProductoEditado(null)}><Plus size={17} /> Nuevo producto</button></div>
    <div className="barra-herramientas"><label className="buscador"><Search size={17} /><input value={busqueda} onChange={(evento) => { setBusqueda(evento.target.value); setPagina(1); }} placeholder="Buscar por nombre o SKU..." aria-label="Buscar productos" /></label><div className="filtros" role="group" aria-label="Filtrar por categoría">{categorias.map((item) => <button key={item} className={categoria === item ? 'filtro filtro--activo' : 'filtro'} type="button" onClick={() => { setCategoria(item); setPagina(1); }}>{item}</button>)}</div></div>
    <div className="tabla-panel"><div className="tabla-panel__cabecera"><strong>{filtrados.length} productos</strong><span>Inventario actualizado</span></div><div className="tabla-scroll"><table><thead><tr>{columnas.map(([columna, titulo]) => <th key={columna}><button className="orden" type="button" onClick={() => ordenarPor(columna)}>{titulo}<ArrowDownUp size={13} /></button></th>)}<th>Acciones</th></tr></thead><tbody>{visibles.map((producto) => { const [textoEstado, claseEstado] = estadoStock(producto.stock); return <tr key={producto.id}><td><strong>{producto.nombre}</strong></td><td>{producto.categoria}</td><td className="texto-suave">{producto.sku}</td><td>$ {producto.precio.toFixed(2)}</td><td><span className={`badge ${claseEstado}`}>{textoEstado}</span><small className="stock-numero">{producto.stock} unidades</small></td><td><div className="acciones"><button className="boton-icono" type="button" onClick={() => setProductoEditado(producto)} aria-label={`Editar ${producto.nombre}`}><Edit3 size={16} /></button><button className="boton-icono boton-icono--peligro" type="button" onClick={() => setProductoAEliminar(producto)} aria-label={`Eliminar ${producto.nombre}`}><Trash2 size={16} /></button></div></td></tr>; })}</tbody></table>{visibles.length === 0 && <div className="sin-resultados">No se encontraron productos con esos filtros.</div>}</div><div className="paginacion"><span>Página {pagina} de {paginas}</span><div><button className="boton-icono" disabled={pagina === 1} onClick={() => setPagina((actual) => actual - 1)} aria-label="Página anterior"><ChevronLeft size={17} /></button><button className="boton-icono" disabled={pagina === paginas} onClick={() => setPagina((actual) => actual + 1)} aria-label="Página siguiente"><ChevronRight size={17} /></button></div></div></div>
    {productoEditado !== undefined && <ProductModal producto={productoEditado || undefined} onCerrar={() => setProductoEditado(undefined)} onGuardar={onNotificar} />}
    {productoAEliminar && <Modal titulo="Eliminar producto" ancho="pequeno" onCerrar={() => setProductoAEliminar(undefined)}><div className="confirmacion"><p>¿Seguro que deseas eliminar <strong>{productoAEliminar.nombre}</strong>? Esta acción no se puede deshacer.</p><div className="formulario__acciones"><button className="boton boton--secundario" type="button" onClick={() => setProductoAEliminar(undefined)}>Cancelar</button><button className="boton boton--peligro" type="button" onClick={confirmarEliminacion}>Eliminar</button></div></div></Modal>}
  </section>;
}
