import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  mensaje: string;
  onCerrar: () => void;
}

export function Toast({ mensaje, onCerrar }: ToastProps) {
  return <div className="toast" role="status"><CheckCircle2 size={19} /><span>{mensaje}</span><button className="boton-icono" type="button" onClick={onCerrar} aria-label="Cerrar notificación"><X size={16} /></button></div>;
}
