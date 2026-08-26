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
      <section className={`modal rounded-md bg-white p-6 shadow-2xl ${ancho === 'pequeno' ? 'max-w-[430px]' : ''}`} role="dialog" aria-modal="true" aria-labelledby="titulo-modal">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="m-0 font-display text-[26px] font-normal" id="titulo-modal">{titulo}</h2>
          <button className="grid size-8 place-items-center rounded border border-borde bg-white text-azul-claro hover:bg-menta" type="button" onClick={onCerrar} aria-label="Cerrar ventana"><X size={18} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}
