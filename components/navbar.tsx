'use client'

import { useState } from 'react'
import { Zap } from 'lucide-react'
import { FakeDoorModal } from './modals/fake-door-modal'
import { PremiumModal } from './modals/premium-modal'

// Definición de la URL base
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Navbar() {
  const [modalFakeOpen, setModalFakeOpen] = useState(false)
  const [modalPremiumOpen, setModalPremiumOpen] = useState(false)
  const [seccion, setSeccion] = useState('')

  // Función para registrar interacciones y preparar el modal "Fake Door"
  const handleFakeClick = async (nombreSeccion: string) => {
    setSeccion(nombreSeccion)
    setModalFakeOpen(true)
    
    // Registro de interacción en tu backend
    try {
      await fetch(`${apiUrl}/api/interacciones`, {
      //await fetch('http://localhost:8000/api/interacciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tipo: 'click_menu', 
          seccion: nombreSeccion,
          timestamp: new Date().toISOString() 
        })
      })
    } catch (e) {
      console.error("Error registrando click:", e)
    }
  }

  return (
    <>
      <nav className="w-full border-b border-slate-900 bg-[#070a13]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <div className="text-2xl font-black tracking-tighter bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent flex items-center gap-1">
            Sincler<span className="text-white font-light text-xl">IA</span>
          </div>

          {/* Navegación */}
          <div className="flex items-center gap-1 md:gap-6 font-bold text-xs md:text-sm">
            <button 
              onClick={() => handleFakeClick('Partidos Recomendados')} 
              className="text-slate-400 hover:text-white px-2 md:px-3 py-2 rounded-xl transition-all hover:bg-slate-900 cursor-pointer whitespace-nowrap"
            >
              <span className="hidden md:inline">Partidos Recomendados</span>
              <span className="md:hidden">Partidos</span>
            </button>
            
            <button 
              onClick={() => handleFakeClick('Rankings')} 
              className="text-slate-400 hover:text-white px-3 py-2 rounded-xl transition-all hover:bg-slate-900 cursor-pointer"
            >
              Rankings
            </button>

            {/* Botón CTA Destacado */}
            <button 
              onClick={() => setModalPremiumOpen(true)}
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 px-3 md:px-4 py-2 rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              <Zap className="w-4 h-4 fill-current animate-pulse" />
              <span className="md:hidden">Pro</span>
              <span className="hidden md:inline">Premium</span>
            </button>
          </div>

        </div>
      </nav>

      {/* Modales fuera del flujo del nav para asegurar que cubran toda la pantalla */}
      {modalFakeOpen && (
        <FakeDoorModal 
          isOpen={modalFakeOpen} 
          onClose={() => setModalFakeOpen(false)} 
          seccion={seccion} 
        />
      )}

      {modalPremiumOpen && (
        <PremiumModal 
          isOpen={modalPremiumOpen} 
          onClose={() => setModalPremiumOpen(false)} 
        />
      )}
    </>
  )
}