import { useEffect, useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { useAppStore } from '../../store/useAppStore';
import type { DatosProducto, Producto } from '../../types/producto';

interface ProductModalProps {
  producto?: Producto;
  onCerrar: () => void;
  onGuardar: (mensaje: string) => void;
}

const datosVacios: DatosProducto = { nombre: '', categoria: '', sku: '', precio: '', stock: '' };

export function ProductModal({ producto, onCerrar, onGuardar }: ProductModalProps) {
  const productos = useAppStore((estado) => estado.productos);
  const agregarProducto = useAppStore((estado) => estado.agregarProducto);
  const actualizarProducto = useAppStore((estado) => estado.actualizarProducto);
  const [datos, setDatos] = useState<DatosProducto>(producto ? { ...producto, precio: String(producto.precio), stock: String(producto.stock) } : datosVacios);
  const [errores, setErrores] = useState<Partial<Record<keyof DatosProducto, string>>>({});

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
  function guardar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!validar()) return;
    const cambios = { nombre: datos.nombre.trim(), categoria: datos.categoria.trim(), sku: datos.sku.trim().toUpperCase(), precio: Number(datos.precio), stock: Number(datos.stock) };
    if (producto) { actualizarProducto(producto.id, cambios); onGuardar('Producto actualizado correctamente.'); } else { agregarProducto(cambios); onGuardar('Producto agregado correctamente.'); }
    onCerrar();
  }

  return <Modal titulo={producto ? 'Editar producto' : 'Nuevo producto'} onCerrar={onCerrar}>
    <form className="formulario" onSubmit={guardar} noValidate>
      <div className="formulario__rejilla">
        {(['nombre', 'categoria', 'sku', 'precio', 'stock'] as const).map((campo) => <label className="campo" key={campo}>{campo === 'nombre' ? 'Nombre' : campo === 'categoria' ? 'Categoría' : campo.toUpperCase()}
          <input type={campo === 'precio' || campo === 'stock' ? 'number' : 'text'} min={campo === 'precio' ? '0.01' : campo === 'stock' ? '0' : undefined} step={campo === 'precio' ? '0.01' : campo === 'stock' ? '1' : undefined} value={datos[campo]} onChange={(evento) => cambiarDato(campo, evento.target.value)} aria-invalid={Boolean(errores[campo])} />
          {errores[campo] && <small className="campo__error">{errores[campo]}</small>}
        </label>)}
      </div>
      <div className="formulario__acciones"><button className="boton boton--secundario" type="button" onClick={onCerrar}>Cancelar</button><button className="boton boton--principal" type="submit">Guardar producto</button></div>
    </form>
  </Modal>;
}
