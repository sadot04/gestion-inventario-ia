import { useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart } from 'lucide-react';
import { Toast } from './components/ui/Toast';
import { ProductList } from './features/products/ProductList';
import './styles.css';

export function App() {
  const [notificacion, setNotificacion] = useState('');
  return <div className="aplicacion"><header className="encabezado"><div className="contenedor encabezado__contenido"><a className="marca" href="/" aria-label="Inicio de gestión"><span className="marca__simbolo">GM</span><span><strong>Gestión</strong><small>en memoria</small></span></a><span className="sesion"><span /> Sesión local</span></div></header><main className="contenedor principal"><aside className="barra-lateral"><p className="navegacion__titulo">Espacio de trabajo</p><nav aria-label="Navegación principal"><a className="enlace-nav enlace-nav--activo" href="#productos"><Package size={18} /> Productos</a><a className="enlace-nav" href="#ventas"><ShoppingCart size={18} /> Ventas</a><a className="enlace-nav" href="#dashboard"><LayoutDashboard size={18} /> Dashboard</a></nav></aside><ProductList onNotificar={(mensaje) => { setNotificacion(mensaje); window.setTimeout(() => setNotificacion(''), 3500); }} /></main><footer className="pie"><div className="contenedor"><span>Sistema de gestión en memoria</span><span>Los datos viven en esta sesión</span></div></footer>{notificacion && <Toast mensaje={notificacion} onCerrar={() => setNotificacion('')} />}</div>;
}
