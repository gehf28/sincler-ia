// src/app/page.tsx
import Link from 'next/link'
import { Trophy, Globe, Zap, BarChart3 } from 'lucide-react'

export default function DashboardPage() {
  return (
    // 👑 REPARACIÓN DEL FONDO: Agregamos min-h-screen, el fondo oscuro profundo de tu app, y centrado
    <div className="w-full min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-center items-center px-4 py-12">
      
      <div className="w-full max-w-5xl mx-auto">
        
        {/* Cabecera */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Sincler <span className="text-[#00ff87]">IA</span>
          </h1>
          <p className="text-slate-400 mt-3 text-sm md:text-base max-w-md mx-auto">
            Selecciona un módulo especializado para iniciar el análisis predictivo en tiempo real.
          </p>
        </div>

        {/* Grid de Módulos Ordenados */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Tarjeta: Mundial 2026 */}
          <Link href="/mundial" className="group bg-[#131926] border-2 border-slate-800 hover:border-[#00ff87] p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[200px]">
            <div>
              <div className="p-3 bg-[#00ff87]/10 rounded-2xl w-fit text-[#00ff87] mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Copa Mundial 2026</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Activa el motor especializado en la Copa del Mundo. Olvídate de las corazonadas: Sincler cruza al instante datos complejos de todos los países como reportes médicos de última hora y pizarras tácticas. Convierte los datos más masivos en tu mayor ventaja predictiva.
              </p>
            </div>
            <span className="text-[#00ff87] text-xs font-black uppercase tracking-wider mt-6 inline-flex items-center gap-1">
              ANALIZAR MUNDIAL 2026 →
            </span>
          </Link>

          {/* Tarjeta: Partidos Generales */}
          <Link href="/analisis-general" className="group bg-[#131926] border-2 border-slate-800 hover:border-blue-500 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[200px]">
            <div>
              <div className="p-3 bg-blue-500/10 rounded-2xl w-fit text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Partidos en General (Clubs y Ligas)</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Analiza cualquier partido de clubes o selecciones del planeta. Ideal para Premier League, LaLiga, Champions, Libertadores, entre otras ligas locales.
              </p>
            </div>
            <span className="text-blue-400 text-xs font-black uppercase tracking-wider mt-6 inline-flex items-center gap-1">
              ANALIZAR CUALQUIER LIGA →
            </span>
          </Link>

          {/* Tarjeta 3: Bloqueada Minimalista */}
          <div className="relative bg-[#131926] border-2 border-dashed border-slate-800 p-6 rounded-3xl min-h-[200px] flex items-center justify-center">
            <div className="text-center">
              <Zap className="w-8 h-8 text-slate-700 mx-auto mb-3" />
              <span className="text-slate-600 text-xs font-bold uppercase tracking-widest">
                🚧 EN DESARROLLO 🚧
              </span>
            </div>
          </div>

          {/* Tarjeta 4: Bloqueada Minimalista */}
          <div className="relative bg-[#131926] border-2 border-dashed border-slate-800 p-6 rounded-3xl min-h-[200px] flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-slate-700 mx-auto mb-3" />
              <span className="text-slate-600 text-xs font-bold uppercase tracking-widest">
                🚧 EN DESARROLLO 🚧
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}