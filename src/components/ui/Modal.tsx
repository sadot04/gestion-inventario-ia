import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  titulo: string;
  children: ReactNode;
  onCerrar: () => void;
  ancho?: 'normal' | 'pequeno';
}

export function Modal({ titulo, children, onCerrar, ancho = 'normal' }: ModalProps) {
  return (
    <div className="fondo-modal" role="presentation" onMouseDown={(evento) => evento.target === evento.currentTarget && onCerrar()}>
      <section className={`modal modal--${ancho}`} role="dialog" aria-modal="true" aria-labelledby="titulo-modal">
        <div className="modal__cabecera">
          <h2 id="titulo-modal">{titulo}</h2>
          <button className="boton-icono" type="button" onClick={onCerrar} aria-label="Cerrar ventana"><X size={18} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}
