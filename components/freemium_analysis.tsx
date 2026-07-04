// 'use client'

// import { AnalysisData } from '@/types/analysis'
// import { Trophy, Goal, Shield, AlertTriangle, HelpCircle, Lock, Sparkles } from 'lucide-react'

// interface FreemiumAnalysisProps {
//   data: AnalysisData | null
//   onUpgradeClick?: () => void
// }

// export default function FreemiumAnalysis({ data, onUpgradeClick }: FreemiumAnalysisProps) {
  
//   // 🛡️ CONTROL ANTI-CRASH: Si no hay datos cargados, no rompe la app
//   if (!data) return null

//   // Helper seguro para extraer texto sin errores de lectura
//   const safeText = (field: any, defaultText: string = ''): string => {
//     if (!field) return defaultText
//     if (typeof field === 'object') {
//       return field.seleccion || field.explicacion || defaultText
//     }
//     return String(field)
//   }

//   // Variables principales extraídas de la data
//   const team1Name = safeText(data.team1, 'Local')
//   const team2Name = safeText(data.team2, 'Visita')
//   const confianzaIA = Number(data.confianza) || 50

//   // 1. Datos de Ganador
//   const ganadorSeleccion = safeText(data.ganador?.seleccion, 'Por definir')
//   const ganadorConfianza = Number(data.ganador?.confianza) || 50
//   const ganadorExplicacion = safeText(data.ganador?.explicacion, 'Análisis en proceso...')

//   // 2. Datos de Goles
//   const golesSeleccion = safeText(data.goles?.seleccion, 'Por definir')
//   const golesConfianza = Number(data.goles?.confianza) || 50
//   const golesExplicacion = safeText(data.goles?.explicacion, 'Calculando tendencias...')

//   // 3. Datos de Hándicap
//   const handicapSeleccion = safeText(data.handicap?.seleccion, 'Por definir')
//   const handicapConfianza = Number(data.handicap?.confianza) || 50
//   const handicapExplicacion = safeText(data.handicap?.explicacion, 'Estructurando hándicap...')

//   // 4. Datos de Tarjetas
//   const tarjetasSeleccion = safeText(data.tarjetas?.seleccion, 'Por definir')
//   const tarjetasConfianza = Number(data.tarjetas?.confianza) || 50
//   const tarjetasExplicacion = safeText(data.tarjetas?.explicacion, 'Procesando historial...')

//   const comentarioGeneral = data.comentario_general || 'Análisis táctico en desarrollo.'

//   return (
//     <div className="w-full max-w-4xl mx-auto mt-8 space-y-6">
      
//       {/* CARD PRINCIPAL DE ANÁLISIS ABIERTO */}
//       <div className="bg-bg-card rounded-3xl p-6 md:p-8 border border-border-custom shadow-xl">
        
//         {/* Encabezado de Estado */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-border-custom/50">
//           <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-black tracking-wide uppercase flex items-center gap-1.5">
//             <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
//             Predicción Finalizada
//           </span>
//           <span className="text-xs bg-bg-page border border-border-custom px-3 py-1.5 rounded-xl font-bold text-text-muted">
//             Confianza Global: <span className="text-accent font-black">{confianzaIA}%</span>
//           </span>
//         </div>

//         {/* Nombres de los equipos */}
//         <div className="flex justify-between items-center text-sm font-black text-text-muted px-2 mb-4">
//           <span>{team1Name}</span>
//           <span className="text-accent">VS</span>
//           <span>{team2Name}</span>
//         </div>

//         {/* Distribución de Probabilidades */}
//         <div className="space-y-2 mb-8">
//           <p className="text-xs font-black text-text-muted uppercase tracking-wider flex items-center gap-1.5">
//             <Sparkles className="w-4 h-4 text-accent" /> Distribución de Probabilidades
//           </p>
//           <div className="w-full bg-bg-page h-5 rounded-xl overflow-hidden flex text-[10px] font-black text-slate-950 border border-border-custom/50">
//             <div className="bg-accent h-full flex items-center justify-center transition-all duration-500" style={{ width: '50%' }}>50%</div>
//             <div className="bg-slate-500/40 h-full flex items-center justify-center text-text-main" style={{ width: '20%' }}>20%</div>
//             <div className="bg-blue-500 h-full flex items-center justify-center transition-all duration-500" style={{ width: '30%' }}>30%</div>
//           </div>
//         </div>

//         {/* Grid de los 4 análisis estándar abiertos con BARRAS DE CONFIANZA */}
//         <div className="grid md:grid-cols-2 gap-4">
          
//           {/* 1. GANADOR */}
//           <div className="bg-bg-page/50 p-5 rounded-2xl border border-border-custom/60 space-y-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl"><Trophy className="w-5 h-5" /></div>
//               <div>
//                 <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Ganador</p>
//                 <h4 className="text-base font-black text-text-main">{ganadorSeleccion}</h4>
//               </div>
//             </div>
            
//             {/* Barra de Confianza */}
//             <div className="space-y-1">
//               <div className="flex justify-between items-center text-[11px] font-bold">
//                 <span className="text-text-muted">Confianza</span>
//                 <span className="text-emerald-400">{ganadorConfianza}%</span>
//               </div>
//               <div className="w-full bg-bg-page h-2 rounded-full overflow-hidden border border-border-custom/30">
//                 <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${ganadorConfianza}%` }} />
//               </div>
//             </div>

//             <p className="text-xs text-text-muted leading-relaxed">{ganadorExplicacion}</p>
//           </div>

//           {/* 2. GOLES */}
//           <div className="bg-bg-page/50 p-5 rounded-2xl border border-border-custom/60 space-y-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl"><Goal className="w-5 h-5" /></div>
//               <div>
//                 <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Goles</p>
//                 <h4 className="text-base font-black text-text-main">{golesSeleccion}</h4>
//               </div>
//             </div>

//             {/* Barra de Confianza */}
//             <div className="space-y-1">
//               <div className="flex justify-between items-center text-[11px] font-bold">
//                 <span className="text-text-muted">Confianza</span>
//                 <span className="text-emerald-400">{golesConfianza}%</span>
//               </div>
//               <div className="w-full bg-bg-page h-2 rounded-full overflow-hidden border border-border-custom/30">
//                 <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${golesConfianza}%` }} />
//               </div>
//             </div>

//             <p className="text-xs text-text-muted leading-relaxed">{golesExplicacion}</p>
//           </div>

//           {/* 3. HÁNDICAP ASIÁTICO */}
//           <div className="bg-bg-page/50 p-5 rounded-2xl border border-border-custom/60 space-y-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl"><Shield className="w-5 h-5" /></div>
//               <div>
//                 <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Hándicap Asiático</p>
//                 <h4 className="text-base font-black text-text-main">{handicapSeleccion}</h4>
//               </div>
//             </div>

//             {/* Barra de Confianza */}
//             <div className="space-y-1">
//               <div className="flex justify-between items-center text-[11px] font-bold">
//                 <span className="text-text-muted">Confianza</span>
//                 <span className="text-emerald-400">{handicapConfianza}%</span>
//               </div>
//               <div className="w-full bg-bg-page h-2 rounded-full overflow-hidden border border-border-custom/30">
//                 <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${handicapConfianza}%` }} />
//               </div>
//             </div>

//             <p className="text-xs text-text-muted leading-relaxed">{handicapExplicacion}</p>
//           </div>

//           {/* 4. TARJETAS */}
//           <div className="bg-bg-page/50 p-5 rounded-2xl border border-border-custom/60 space-y-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl"><AlertTriangle className="w-5 h-5" /></div>
//               <div>
//                 <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Tarjetas</p>
//                 <h4 className="text-base font-black text-text-main">{tarjetasSeleccion}</h4>
//               </div>
//             </div>

//             {/* Barra de Confianza */}
//             <div className="space-y-1">
//               <div className="flex justify-between items-center text-[11px] font-bold">
//                 <span className="text-text-muted">Confianza</span>
//                 <span className="text-emerald-400">{tarjetasConfianza}%</span>
//               </div>
//               <div className="w-full bg-bg-page h-2 rounded-full overflow-hidden border border-border-custom/30">
//                 <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${tarjetasConfianza}%` }} />
//               </div>
//             </div>

//             <p className="text-xs text-text-muted leading-relaxed">{tarjetasExplicacion}</p>
//           </div>

//         </div>

//         {/* JUSTIFICACIÓN TÁCTICA */}
//         <div className="mt-6 p-5 bg-bg-page/40 rounded-2xl border border-border-custom/40 space-y-2">
//           <h5 className="text-xs font-black text-text-muted uppercase tracking-wider flex items-center gap-1.5">
//             <HelpCircle className="w-4 h-4 text-accent" /> Justificación Táctica de Sincler
//           </h5>
//           <p className="text-xs text-text-main font-medium leading-relaxed whitespace-pre-line">
//             {comentarioGeneral}
//           </p>
//         </div>

//       </div>

//       {/* 👑 SECCIÓN PREMIUM BLOQUEADA */}
//       <div className="bg-bg-card/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-amber-500/20 shadow-xl relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-card/5 to-bg-card/40 pointer-events-none" />

//         <div className="flex items-center justify-between mb-6 relative z-10">
//           <h4 className="text-sm font-black tracking-wider text-amber-400 uppercase flex items-center gap-2">
//             <Lock className="w-4 h-4" /> Disponible en Premium
//           </h4>
//           <button 
//             onClick={onUpgradeClick}
//             className="text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-500/10"
//           >
//             Mejorar Plan
//           </button>
//         </div>

//         {/* Grid de opciones bloqueadas */}
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
//           {['Corners', 'Ambos Anotan', 'Marcador Exacto', 'Jugador Anotador', 'Resultado Descanso', 'Análisis Táctico Avanzado'].map((item, index) => (
//             <div 
//               key={index} 
//               onClick={onUpgradeClick}
//               className="bg-bg-page/40 p-4 rounded-xl border border-border-custom/40 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer hover:border-amber-500/30 transition-all duration-300 min-h-[90px]"
//             >
//               <Lock className="w-4 h-4 text-text-muted group-hover:text-amber-400 transition-colors" />
//               <span className="text-xs font-bold text-text-muted group-hover:text-text-main transition-colors">{item}</span>
//             </div>
//           ))}
//         </div>

//       </div>

//     </div>
//   )
// }

'use client'

import { AnalysisData } from '@/types/analysis'
import { Trophy, Goal, Shield, AlertTriangle, HelpCircle, Lock, Sparkles } from 'lucide-react'

interface FreemiumAnalysisProps {
  data: AnalysisData | null
  onUpgradeClick?: () => void
}

export default function FreemiumAnalysis({ data, onUpgradeClick }: FreemiumAnalysisProps) {
  
  // 🛡️ CONTROL ANTI-CRASH: Si no hay datos cargados, no rompe la app
  if (!data) return null

  // Helper seguro para extraer texto sin errores de lectura
  const safeText = (field: any, defaultText: string = ''): string => {
    if (!field) return defaultText
    if (typeof field === 'object') {
      return field.seleccion || field.explicacion || defaultText
    }
    return String(field)
  }

  // Variables principales extraídas de la data
  const team1Name = safeText(data.team1, 'Local')
  const team2Name = safeText(data.team2, 'Visita')
  const confianzaIA = Number(data.confianza) || 50

  // 📊 Mapeo inteligente de la barra de Distribución de Probabilidades
  // Si la IA no la envía por algún motivo, usa un fallback balanceado (33%, 34%, 33%)
  const probLocal = data.probabilidades?.local ?? 33
  const probEmpate = data.probabilidades?.empate ?? 34
  const probVisita = data.probabilidades?.visita ?? 33

  // 1. Datos de Ganador
  const ganadorSeleccion = safeText(data.ganador?.seleccion, 'Por definir')
  const ganadorConfianza = Number(data.ganador?.confianza) || 50
  const ganadorExplicacion = safeText(data.ganador?.explicacion, 'Análisis en proceso...')

  // 2. Datos de Goles
  const golesSeleccion = safeText(data.goles?.seleccion, 'Por definir')
  const golesConfianza = Number(data.goles?.confianza) || 50
  const golesExplicacion = safeText(data.goles?.explicacion, 'Calculando tendencias...')

  // 3. Datos de Hándicap
  const handicapSeleccion = safeText(data.handicap?.seleccion, 'Por definir')
  const handicapConfianza = Number(data.handicap?.confianza) || 50
  const handicapExplicacion = safeText(data.handicap?.explicacion, 'Estructurando hándicap...')

  // 4. Datos de Tarjetas
  const tarjetasSeleccion = safeText(data.tarjetas?.seleccion, 'Por definir')
  const tarjetasConfianza = Number(data.tarjetas?.confianza) || 50
  const tarjetasExplicacion = safeText(data.tarjetas?.explicacion, 'Procesando historial...')

  const comentarioGeneral = data.comentario_general || 'Análisis táctico en desarrollo.'

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-6">
      
      {/* CARD PRINCIPAL DE ANÁLISIS ABIERTO */}
      <div className="bg-bg-card rounded-3xl p-6 md:p-8 border border-border-custom shadow-xl">
        
        {/* Encabezado de Estado */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-border-custom/50">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-black tracking-wide uppercase flex items-center gap-1.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Predicción Finalizada
          </span>
          <span className="text-xs bg-bg-page border border-border-custom px-3 py-1.5 rounded-xl font-bold text-text-muted">
            Confianza Global: <span className="text-accent font-black">{confianzaIA}%</span>
          </span>
        </div>

        {/* Nombres de los equipos */}
        <div className="flex justify-between items-center text-sm font-black text-text-muted px-2 mb-4">
          <span>{team1Name}</span>
          <span className="text-accent">VS</span>
          <span>{team2Name}</span>
        </div>

        {/* Distribución de Probabilidades AUTOMÁTICA */}
        <div className="space-y-2 mb-8">
          <p className="text-xs font-black text-text-muted uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent" /> Distribución de Probabilidades
          </p>
          
          <div className="w-full bg-bg-page h-6 rounded-xl overflow-hidden flex text-[10px] font-black text-slate-950 border border-border-custom/50 shadow-inner">
            {/* Barra Local */}
            <div 
              className="bg-accent h-full flex items-center justify-center transition-all duration-700 min-w-[35px]" 
              style={{ width: `${probLocal}%` }}
            >
              {probLocal}%
            </div>
            
            {/* Barra Empate */}
            <div 
              className="bg-slate-500/40 h-full flex items-center justify-center text-text-main transition-all duration-700 min-w-[35px]" 
              style={{ width: `${probEmpate}%` }}
            >
              {probEmpate}%
            </div>
            
            {/* Barra Visita */}
            <div 
              className="bg-blue-500 h-full flex items-center justify-center text-white transition-all duration-700 min-w-[35px]" 
              style={{ width: `${probVisita}%` }}
            >
              {probVisita}%
            </div>
          </div>

          {/* Ayuda visual inferior de equipos */}
          <div className="flex justify-between text-[10px] text-text-muted font-bold px-1">
            <span>{team1Name} ({probLocal}%)</span>
            <span>Empate ({probEmpate}%)</span>
            <span>{team2Name} ({probVisita}%)</span>
          </div>
        </div>

        {/* Grid de los 4 análisis estándar abiertos con BARRAS DE CONFIANZA */}
        <div className="grid md:grid-cols-2 gap-4">
          
          {/* 1. GANADOR */}
          <div className="bg-bg-page/50 p-5 rounded-2xl border border-border-custom/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl"><Trophy className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Ganador</p>
                <h4 className="text-base font-black text-text-main">{ganadorSeleccion}</h4>
              </div>
            </div>
            
            {/* Barra de Confianza */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-text-muted">Confianza</span>
                <span className="text-emerald-400">{ganadorConfianza}%</span>
              </div>
              <div className="w-full bg-bg-page h-2 rounded-full overflow-hidden border border-border-custom/30">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${ganadorConfianza}%` }} />
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">{ganadorExplicacion}</p>
          </div>

          {/* 2. GOLES */}
          <div className="bg-bg-page/50 p-5 rounded-2xl border border-border-custom/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl"><Goal className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Goles</p>
                <h4 className="text-base font-black text-text-main">{golesSeleccion}</h4>
              </div>
            </div>

            {/* Barra de Confianza */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-text-muted">Confianza</span>
                <span className="text-emerald-400">{golesConfianza}%</span>
              </div>
              <div className="w-full bg-bg-page h-2 rounded-full overflow-hidden border border-border-custom/30">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${golesConfianza}%` }} />
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">{golesExplicacion}</p>
          </div>

          {/* 3. HÁNDICAP ASIÁTICO */}
          <div className="bg-bg-page/50 p-5 rounded-2xl border border-border-custom/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl"><Shield className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Hándicap Asiático</p>
                <h4 className="text-base font-black text-text-main">{handicapSeleccion}</h4>
              </div>
            </div>

            {/* Barra de Confianza */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-text-muted">Confianza</span>
                <span className="text-emerald-400">{handicapConfianza}%</span>
              </div>
              <div className="w-full bg-bg-page h-2 rounded-full overflow-hidden border border-border-custom/30">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${handicapConfianza}%` }} />
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">{handicapExplicacion}</p>
          </div>

          {/* 4. TARJETAS */}
          <div className="bg-bg-page/50 p-5 rounded-2xl border border-border-custom/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl"><AlertTriangle className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Tarjetas</p>
                <h4 className="text-base font-black text-text-main">{tarjetasSeleccion}</h4>
              </div>
            </div>

            {/* Barra de Confianza */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-text-muted">Confianza</span>
                <span className="text-emerald-400">{tarjetasConfianza}%</span>
              </div>
              <div className="w-full bg-bg-page h-2 rounded-full overflow-hidden border border-border-custom/30">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${tarjetasConfianza}%` }} />
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">{tarjetasExplicacion}</p>
          </div>

        </div>

        {/* JUSTIFICACIÓN TÁCTICA */}
        <div className="mt-6 p-5 bg-bg-page/40 rounded-2xl border border-border-custom/40 space-y-2">
          <h5 className="text-xs font-black text-text-muted uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-accent" /> Justificación Táctica
          </h5>
          <p className="text-xs text-text-main font-medium leading-relaxed whitespace-pre-line">
            {comentarioGeneral}
          </p>
        </div>

      </div>

      {/* 👑 SECCIÓN PREMIUM BLOQUEADA */}
      <div className="bg-bg-card/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-card/5 to-bg-card/40 pointer-events-none" />

        <div className="flex items-center justify-between mb-6 relative z-10">
          <h4 className="text-sm font-black tracking-wider text-amber-400 uppercase flex items-center gap-2">
            <Lock className="w-4 h-4" /> Disponible en Premium
          </h4>
          <button 
            onClick={onUpgradeClick}
            className="text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-500/10"
          >
            Mejorar Plan
          </button>
        </div>

        {/* Grid de opciones bloqueadas */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
          {['Corners', 'Ambos Anotan', 'Marcador Exacto', 'Jugador Anotador', 'Resultado Descanso', 'Análisis Táctico Avanzado'].map((item, index) => (
            <div 
              key={index} 
              onClick={onUpgradeClick}
              className="bg-bg-page/40 p-4 rounded-xl border border-border-custom/40 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer hover:border-amber-500/30 transition-all duration-300 min-h-[90px]"
            >
              <Lock className="w-4 h-4 text-text-muted group-hover:text-amber-400 transition-colors" />
              <span className="text-xs font-bold text-text-muted group-hover:text-text-main transition-colors">{item}</span>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}