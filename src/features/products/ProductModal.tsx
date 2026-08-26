import { useEffect, useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import type { Producto } from '../../types/producto';
import type { DatosProducto, DatosProductoGuardados } from './useProductFeature';

interface ProductModalProps {
  producto?: Producto;
  productos: Producto[];
  onCerrar: () => void;
  onGuardar: (datos: DatosProductoGuardados, id?: string) => void;
  onNotificar: (mensaje: string) => void;
}

const datosVacios: DatosProducto = { nombre: '', categoria: '', sku: '', precio: '', stock: '' };

export function ProductModal({ producto, productos, onCerrar, onGuardar, onNotificar }: ProductModalProps) {
  const [datos, setDatos] = useState<DatosProducto>(producto ? { ...producto, precio: String(producto.precio), stock: String(producto.stock) } : datosVacios);
  const [errores, setErrores] = useState<Partial<Record<keyof DatosProducto, string>>>({});
  const [errorServidor, setErrorServidor] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { setDatos(producto ? { ...producto, precio: String(producto.precio), stock: String(producto.stock) } : datosVacios); }, [producto]);

  function validar(): boolean {
    const nuevosErrores: Partial<Record<keyof DatosProducto, string>> = {};
    if (!datos.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.';
    if (!datos.categoria.trim()) nuevosErrores.categoria = 'La categoría es obligatoria.';
    if (!datos.sku.trim()) nuevosErrores.sku = 'El SKU es obligatorio.';
    if (productos.some((item) => item.sku.toLowerCase() === datos.sku.trim().toLowerCase() && item.id !== producto?.id)) nuevosErrores.sku = 'El SKU ya está en uso.';
    if (!datos.precio || Number(datos.precio) <= 0) nuevosErrores.precio = 'Debe ser mayor que 0.';
    if (datos.stock === '' || Number(datos.stock) < 0 || !Number.isInteger(Number(datos.stock))) nuevosErrores.stock = 'Debe ser un entero igual o mayor que 0.';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function cambiarDato(campo: keyof DatosProducto, valor: string) { setDatos((actuales) => ({ ...actuales, [campo]: valor })); }
  async function guardar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!validar()) return;
    const cambios = { nombre: datos.nombre.trim(), categoria: datos.categoria.trim(), sku: datos.sku.trim().toUpperCase(), precio: Number(datos.precio), stock: Number(datos.stock) };
    setGuardando(true);
    setErrorServidor('');
    try {
      const respuesta = await fetch(producto ? `/api/products/${producto.id}` : '/api/products', {
        method: producto ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cambios)
      });
      const cuerpo: { mensaje?: string; errores?: string[] } = await respuesta.json();
      if (!respuesta.ok) {
        setErrorServidor(cuerpo.errores?.join(' ') || cuerpo.mensaje || 'No se pudo guardar el producto.');
        return;
      }
      onGuardar(cambios, producto?.id);
      onNotificar(producto ? 'Producto actualizado correctamente.' : 'Producto agregado correctamente.');
      onCerrar();
    } catch {
      setErrorServidor('No se pudo conectar con el servidor. Inténtalo nuevamente.');
    } finally {
      setGuardando(false);
    }
  }

  return <Modal titulo={producto ? 'Editar producto' : 'Nuevo producto'} onCerrar={onCerrar}>
    <form className="space-y-6" onSubmit={guardar} noValidate>
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        {(['nombre', 'categoria', 'sku', 'precio', 'stock'] as const).map((campo) => <label className={`text-[11px] font-bold uppercase text-suave ${campo === 'nombre' ? 'col-span-2 max-sm:col-span-1' : ''}`} key={campo}>{campo === 'nombre' ? 'Nombre' : campo === 'categoria' ? 'Categoría' : campo.toUpperCase()}
          <input className="mt-1.5 block min-h-[42px] w-full rounded border border-borde px-3 text-[13px] normal-case text-azul outline-none focus:border-azul-claro focus:ring-4 focus:ring-azul-claro/10 aria-[invalid=true]:border-[#b84d4d]" type={campo === 'precio' || campo === 'stock' ? 'number' : 'text'} min={campo === 'precio' ? '0.01' : campo === 'stock' ? '0' : undefined} step={campo === 'precio' ? '0.01' : campo === 'stock' ? '1' : undefined} value={datos[campo]} onChange={(evento) => cambiarDato(campo, evento.target.value)} aria-invalid={Boolean(errores[campo])} />
          {errores[campo] && <small className="mt-1 block text-[10px] normal-case text-[#a84242]">{errores[campo]}</small>}
        </label>)}
      </div>
      {errorServidor && <p className="rounded border border-[#efb4b4] bg-[#fff5f5] p-3 text-sm text-[#a84242]" role="alert">{errorServidor}</p>}
      <div className="mt-7 flex justify-end gap-2"><button className="inline-flex min-h-[42px] items-center justify-center rounded border border-borde bg-white px-4 text-xs font-bold text-azul" type="button" onClick={onCerrar} disabled={guardando}>Cancelar</button><button className="inline-flex min-h-[42px] items-center justify-center rounded bg-azul px-4 text-xs font-bold text-white hover:bg-azul-claro disabled:cursor-wait disabled:opacity-60" type="submit" disabled={guardando}>{guardando ? 'Validando...' : 'Guardar producto'}</button></div>
    </form>
  </Modal>;
}
