import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  mensaje: string;
  onCerrar: () => void;
}

export function Toast({ mensaje, onCerrar }: ToastProps) {
  return <div className="fixed bottom-6 right-6 z-20 flex items-center gap-2.5 rounded border-l-4 border-[#4ba77c] bg-azul px-4 py-3 text-sm text-white shadow-xl max-sm:right-3.5 max-sm:bottom-3.5 max-sm:left-3.5" role="status"><CheckCircle2 size={19} /><span>{mensaje}</span><button className="ml-2 grid size-6 place-items-center border-0 bg-transparent text-white" type="button" onClick={onCerrar} aria-label="Cerrar notificación"><X size={16} /></button></div>;
}
