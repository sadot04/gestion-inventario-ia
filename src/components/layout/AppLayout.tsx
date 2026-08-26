import type { ReactNode } from 'react'
import type { Pestana } from '../../types'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
interface Props { pestana: Pestana; cambiar: (pestana: Pestana) => void; menuAbierto: boolean; setMenuAbierto: (abierto: boolean) => void; children: ReactNode }
export function AppLayout({ pestana, cambiar, menuAbierto, setMenuAbierto, children }: Props) { return <div className="flex min-h-screen bg-papel"><Sidebar activa={pestana} cambiar={cambiar} abierta={menuAbierto} cerrar={() => setMenuAbierto(false)} /><div className="flex min-w-0 flex-1 flex-col"><Header pestana={pestana} abrirMenu={() => setMenuAbierto(true)} /><main className="flex-1 p-5 lg:p-8">{children}</main></div>{menuAbierto && <button className="fixed inset-0 z-30 bg-tinta/25 lg:hidden" onClick={() => setMenuAbierto(false)} aria-label="Cerrar menú" />}</div> }