import { useEffect, useRef, useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart } from 'lucide-react';
import { Toast } from './components/ui/Toast';
import { ProductList } from './features/products/ProductList';
import { useProductFeature } from './features/products/useProductFeature';
import './styles.css';

export function App() {
  const [notificacion, setNotificacion] = useState('');
  const temporizadorNotificacion = useRef<number | undefined>(undefined);
  const identidadNotificacion = useRef(0);
  const { productos, guardarProducto, eliminarProducto } = useProductFeature();

  useEffect(() => () => {
    if (temporizadorNotificacion.current !== undefined) window.clearTimeout(temporizadorNotificacion.current);
  }, []);

  function notificar(mensaje: string) {
    if (temporizadorNotificacion.current !== undefined) window.clearTimeout(temporizadorNotificacion.current);
    const identidadActual = identidadNotificacion.current + 1;
    identidadNotificacion.current = identidadActual;
    setNotificacion(mensaje);
    temporizadorNotificacion.current = window.setTimeout(() => {
      if (identidadNotificacion.current !== identidadActual) return;
      setNotificacion('');
      temporizadorNotificacion.current = undefined;
    }, 3500);
  }

  function cerrarNotificacion() {
    if (temporizadorNotificacion.current !== undefined) window.clearTimeout(temporizadorNotificacion.current);
    identidadNotificacion.current += 1;
    temporizadorNotificacion.current = undefined;
    setNotificacion('');
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-borde bg-white/80">
        <div className="mx-auto flex min-h-[76px] w-[calc(100%-48px)] max-w-[1180px] items-center justify-between max-sm:w-[calc(100%-28px)]">
          <a className="flex items-center gap-3 text-azul no-underline" href="/" aria-label="Inicio de gestión">
            <span className="grid size-[37px] place-items-center rounded-full bg-azul text-[11px] font-extrabold text-menta">GM</span>
            <span><strong className="block">Gestión</strong><small className="mt-0.5 block text-[10px] uppercase tracking-[.11em] text-suave">en memoria</small></span>
          </a>
          <span className="flex items-center gap-2 text-xs text-suave"><span className="size-1.5 rounded-full bg-[#4ba77c]" /> Sesión local</span>
        </div>
      </header>
      <main className="mx-auto grid w-[calc(100%-48px)] max-w-[1180px] grid-cols-[190px_1fr] gap-16 py-[58px] pb-[78px] max-[800px]:grid-cols-1 max-[800px]:gap-6 max-[800px]:py-9 max-sm:w-[calc(100%-28px)]">
        <aside className="pt-1.5">
          <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[.13em] text-azul-claro max-[800px]:mb-2">Espacio de trabajo</p>
          <nav className="max-[800px]:flex max-[800px]:gap-1 max-[800px]:overflow-x-auto" aria-label="Navegación principal">
            <a className="m-[3px_0] flex items-center gap-3 rounded px-3.5 py-3 text-[13px] text-suave no-underline hover:bg-menta hover:text-azul" href="#productos"><Package size={18} /> Productos</a>
            <a className="m-[3px_0] flex items-center gap-3 rounded px-3.5 py-3 text-[13px] text-suave no-underline hover:bg-menta hover:text-azul" href="#ventas"><ShoppingCart size={18} /> Ventas</a>
            <a className="m-[3px_0] flex items-center gap-3 rounded px-3.5 py-3 text-[13px] text-suave no-underline hover:bg-menta hover:text-azul" href="#dashboard"><LayoutDashboard size={18} /> Panel de control</a>
          </nav>
        </aside>
        <ProductList productos={productos} onGuardar={guardarProducto} onEliminar={eliminarProducto} onNotificar={notificar} />
      </main>
      <footer className="border-t border-borde text-[11px] text-suave"><div className="mx-auto flex w-[calc(100%-48px)] max-w-[1180px] justify-between py-[22px] max-sm:w-[calc(100%-28px)] max-sm:flex-col max-sm:gap-2"><span>Sistema de gestión en memoria</span><span>Los datos viven en esta sesión</span></div></footer>
      {notificacion && <Toast mensaje={notificacion} onCerrar={cerrarNotificacion} />}
    </div>
  );
}
