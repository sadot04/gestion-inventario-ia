import { useEffect, useMemo, useState } from 'react';
import { ArrowDownUp, ChevronLeft, ChevronRight, Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import type { Producto } from '../../types/producto';
import { ProductModal } from './ProductModal';
import type { DatosProductoGuardados } from './useProductFeature';

interface ProductListProps { productos: Producto[]; onGuardar: (datos: DatosProductoGuardados, id?: string) => void; onEliminar: (id: string) => void; onNotificar: (mensaje: string) => void; }
type ColumnaOrden = keyof Pick<Producto, 'nombre' | 'categoria' | 'sku' | 'precio' | 'stock'>;
const POR_PAGINA = 6;

export function ProductList({ productos, onGuardar, onEliminar, onNotificar }: ProductListProps) {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [pagina, setPagina] = useState(1);
  const [orden, setOrden] = useState<{ columna: ColumnaOrden; ascendente: boolean }>({ columna: 'nombre', ascendente: true });
  const [productoEditado, setProductoEditado] = useState<Producto | null | undefined>();
  const [productoAEliminar, setProductoAEliminar] = useState<Producto>();
  const categorias = ['Todas', ...new Set(productos.map((producto) => producto.categoria))];
  const filtrados = useMemo(() => productos.filter((producto) => (categoria === 'Todas' || producto.categoria === categoria) && `${producto.nombre} ${producto.sku}`.toLowerCase().includes(busqueda.toLowerCase())).sort((a, b) => { const valorA = a[orden.columna]; const valorB = b[orden.columna]; const comparacion = typeof valorA === 'number' && typeof valorB === 'number' ? valorA - valorB : String(valorA).localeCompare(String(valorB), 'es'); return orden.ascendente ? comparacion : -comparacion; }), [productos, busqueda, categoria, orden]);
  const paginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  useEffect(() => {
    setPagina((paginaActual) => Math.min(paginaActual, paginas));
  }, [paginas]);
  const visibles = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  function ordenarPor(columna: ColumnaOrden) { setOrden((actual) => ({ columna, ascendente: actual.columna === columna ? !actual.ascendente : true })); setPagina(1); }
  function confirmarEliminacion() {
    if (!productoAEliminar) return;
    const totalFiltradoTrasEliminar = filtrados.length - 1;
    const paginasTrasEliminar = Math.max(1, Math.ceil(totalFiltradoTrasEliminar / POR_PAGINA));
    onEliminar(productoAEliminar.id);
    setPagina((paginaActual) => Math.min(paginaActual, paginasTrasEliminar));
    setProductoAEliminar(undefined);
    onNotificar('Producto eliminado correctamente.');
  }
  function estadoStock(stock: number) { return stock === 0 ? ['Agotado', 'badge--rojo'] : stock <= 5 ? ['Stock bajo', 'badge--amarillo'] : ['Disponible', 'badge--verde']; }
  const columnas: Array<[ColumnaOrden, string]> = [['nombre', 'Producto'], ['categoria', 'Categoría'], ['sku', 'SKU'], ['precio', 'Precio'], ['stock', 'Stock']];

  return <section>
    <div className="mb-7 flex items-end justify-between gap-5 max-[560px]:items-start max-[560px]:flex-col"><div><p className="mb-4 text-[11px] font-extrabold uppercase tracking-[.13em] text-azul-claro">Catálogo</p><h1 className="mb-2 font-display text-[44px] font-normal max-[560px]:text-[37px]">Productos</h1><p className="m-0 text-sm text-suave">Administra tu inventario en memoria.</p></div><button className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded bg-azul px-4 text-xs font-bold text-white hover:bg-azul-claro" type="button" onClick={() => setProductoEditado(null)}><Plus size={17} /> Nuevo producto</button></div>
    <div className="mb-4 flex items-center justify-between gap-5 max-[800px]:items-stretch max-[800px]:flex-col"><label className="flex min-w-[260px] flex-1 items-center gap-2.5 rounded border border-borde bg-white px-3 text-suave"><Search size={17} /><input className="min-h-[43px] w-full border-0 text-azul outline-0" value={busqueda} onChange={(evento) => { setBusqueda(evento.target.value); setPagina(1); }} placeholder="Buscar por nombre o SKU..." aria-label="Buscar productos" /></label><div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por categoría">{categorias.map((item) => <button key={item} className={`rounded px-3 py-2 text-xs text-suave hover:bg-menta hover:text-azul ${categoria === item ? 'bg-menta text-azul' : ''}`} type="button" onClick={() => { setCategoria(item); setPagina(1); }}>{item}</button>)}</div></div>
    <div className="overflow-hidden rounded border border-borde bg-white/85 shadow-xl"><div className="flex items-center justify-between border-b border-borde px-5 py-4 text-[13px] text-suave"><strong className="text-azul">{filtrados.length} productos</strong><span>Inventario actualizado</span></div><div className="tabla-scroll"><table className="w-full min-w-[720px] border-collapse text-[13px]"><thead><tr>{columnas.map(([columna, titulo]) => <th className="border-b border-borde px-5 py-3 text-left text-[10px] uppercase text-suave" key={columna}><button className="inline-flex items-center gap-1 border-0 bg-transparent text-[inherit] font-[inherit]" type="button" onClick={() => ordenarPor(columna)}>{titulo}<ArrowDownUp size={13} /></button></th>)}<th className="border-b border-borde px-5 py-3 text-left text-[10px] uppercase text-suave">Acciones</th></tr></thead><tbody>{visibles.map((producto) => { const [textoEstado, claseEstado] = estadoStock(producto.stock); return <tr className="hover:bg-[#f8fbf9]" key={producto.id}><td className="border-b border-[#e9eeeb] px-5 py-[18px]"><strong>{producto.nombre}</strong></td><td className="border-b border-[#e9eeeb] px-5 py-[18px]">{producto.categoria}</td><td className="border-b border-[#e9eeeb] px-5 py-[18px] text-suave">{producto.sku}</td><td className="border-b border-[#e9eeeb] px-5 py-[18px]">$ {producto.precio.toFixed(2)}</td><td className="border-b border-[#e9eeeb] px-5 py-[18px]"><span className={`inline-block rounded-full px-2 py-1 text-[10px] font-extrabold ${claseEstado === 'badge--rojo' ? 'bg-[#f7dada] text-[#994141]' : claseEstado === 'badge--amarillo' ? 'bg-[#fff0c7] text-[#896713]' : 'bg-[#d8f0df] text-[#26704a]'}`}>{textoEstado}</span><small className="mt-1 block text-[10px] text-suave">{producto.stock} unidades</small></td><td className="border-b border-[#e9eeeb] px-5 py-[18px]"><div className="flex gap-1"><button className="grid size-8 place-items-center rounded border border-borde bg-white text-azul-claro hover:bg-menta" type="button" onClick={() => setProductoEditado(producto)} aria-label={`Editar ${producto.nombre}`}><Edit3 size={16} /></button><button className="grid size-8 place-items-center rounded border border-borde bg-white text-azul-claro hover:bg-[#f7dada] hover:text-[#994141]" type="button" onClick={() => setProductoAEliminar(producto)} aria-label={`Eliminar ${producto.nombre}`}><Trash2 size={16} /></button></div></td></tr>; })}</tbody></table>{visibles.length === 0 && <div className="p-12 text-center text-suave">No se encontraron productos con esos filtros.</div>}</div><div className="flex items-center justify-between border-t border-borde px-5 py-4 text-xs text-suave"><span>Página {pagina} de {paginas}</span><div className="flex gap-1.5"><button className="grid size-8 place-items-center rounded border border-borde bg-white text-azul-claro" disabled={pagina === 1} onClick={() => setPagina((actual) => actual - 1)} aria-label="Página anterior"><ChevronLeft size={17} /></button><button className="grid size-8 place-items-center rounded border border-borde bg-white text-azul-claro" disabled={pagina === paginas} onClick={() => setPagina((actual) => actual + 1)} aria-label="Página siguiente"><ChevronRight size={17} /></button></div></div></div>
    {productoEditado !== undefined && <ProductModal producto={productoEditado || undefined} productos={productos} onCerrar={() => setProductoEditado(undefined)} onGuardar={onGuardar} onNotificar={onNotificar} />}
    {productoAEliminar && <Modal titulo="Eliminar producto" ancho="pequeno" onCerrar={() => setProductoAEliminar(undefined)}><div><p className="text-sm leading-6 text-suave">¿Seguro que deseas eliminar <strong>{productoAEliminar.nombre}</strong>? Esta acción no se puede deshacer.</p><div className="mt-7 flex justify-end gap-2"><button className="inline-flex min-h-[42px] items-center justify-center rounded border border-borde bg-white px-4 text-xs font-bold text-azul" type="button" onClick={() => setProductoAEliminar(undefined)}>Cancelar</button><button className="inline-flex min-h-[42px] items-center justify-center rounded bg-[#a84242] px-4 text-xs font-bold text-white" type="button" onClick={confirmarEliminacion}>Eliminar</button></div></div></Modal>}
  </section>;
}
