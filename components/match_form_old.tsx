'use client'

import { useState } from 'react'
import { api } from '@/services/api'
import { Loader2, Sparkles, ChevronDown, Calendar, Trophy, Activity, Goal, AlertTriangle, HelpCircle, Sparkle} from 'lucide-react'
import FreemiumAnalysis from './freemium_analysis'
import AnalysisResults from '@/app/analisis-general/analysis_results'
//import { AnalysisData } from '@/types/analysis'

// Interfaz para tipar los datos estructurados que procesará el componente visual
interface AnalysisData {
   team1: string
   team2: string
   favorito: string
   probabilidadFavorito: number
   over25: boolean
   ambosAnotan: boolean
   riesgo: 'Bajo' | 'Medio' | 'Alto'
   comentario: string
 }

export default function MatchForm() {
  const [team1, setTeam1] = useState('')
  const [team2, setTeam2] = useState('')
  
  // Estados opcionales avanzados
  const [league, setLeague] = useState('')
  const [matchDate, setMatchDate] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)

  // Función para obtener la fecha actual en formato YYYY-MM-DD y bloquear días anteriores
  const getTodayDateString = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

   async function analyzeMatch() {
     if (!team1 || !team2) return
     setLoading(true)
     setAnalysis(null) // Resetea el resultado anterior al hacer una nueva búsqueda

     try {
       // Petición real a tu API enviando todos los parámetros reunidos
       const response = await api.post('/analyze', {
         team1,
         team2,
         league: league || undefined,
         date: matchDate || undefined
       })

       // Aquí asumimos que tu backend ya te devuelve el objeto JSON estructurado.
       // Si tu backend aún devuelve texto plano, puedes usar esta estructura temporal para pruebas:
       if (response.data && response.data.analysis && typeof response.data.analysis === 'object') {
         setAnalysis(response.data.analysis)
       } else {
         // Fallback simulación interactiva en lo que adaptas tu prompt del backend a formato JSON:
         setAnalysis({
           team1: team1,
           team2: team2,
           favorito: team1,
           probabilidadFavorito: 70,
           over25: true,
           ambosAnotan: true,
           riesgo: 'Medio',
           comentario: response.data.analysis || 'Análisis completado de forma exitosa.'
         })
       }

     } catch (error) {
       console.error("Error al conectar con el backend:", error)
     } finally {
       setLoading(false)
     }
   }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* TARJETA DEL FORMULARIO PRINCIPAL */}
      <div className="bg-bg-card rounded-3xl p-6 md:p-8 border border-border-custom shadow-xl dark:shadow-[0_0_50px_rgba(0,245,118,0.05)] transition-all duration-300">
        
        {/* Bloque Versus de Equipos */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Input Local */}
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Ej. Real Madrid 👑"
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              className="w-full bg-bg-page text-text-main rounded-2xl border-2 border-border-custom focus:border-accent focus:outline-none px-5 py-4 font-semibold transition-all placeholder:text-text-muted/50 text-base"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-text-muted bg-bg-card border border-border-custom px-2 py-0.5 rounded-md uppercase tracking-wider">Local</span>
          </div>

          {/* Badge Central VS */}
          <div className="bg-accent text-slate-950 font-black text-lg w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md md:rotate-3 select-none">
            VS
          </div>

          {/* Input Visitante */}
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Ej. Barcelona ⚽"
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              className="w-full bg-bg-page text-text-main rounded-2xl border-2 border-border-custom focus:border-accent focus:outline-none px-5 py-4 font-semibold transition-all placeholder:text-text-muted/50 text-base"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-text-muted bg-bg-card border border-border-custom px-2 py-0.5 rounded-md uppercase tracking-wider">Visita</span>
          </div>

        </div>

        {/* Botón para desplegar opciones extras */}
        <div className="mt-4 flex justify-start">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-accent transition-colors cursor-pointer select-none bg-bg-page/50 px-3 py-2 rounded-xl border border-border-custom/60"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAdvanced ? 'rotate-180 text-accent' : ''}`} />
            <span>{showAdvanced ? 'Ocultar campos opcionales' : 'Añadir competencia y fecha (Opcional)'}</span>
          </button>
        </div>

        {/* Contenedor de Campos Avanzados Animados */}
        <div className={`grid md:grid-cols-2 gap-4 transition-all duration-300 overflow-hidden ${showAdvanced ? 'mt-4 max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          
          {/* Campo Competencia */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              <Trophy className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Competencia (Ej: Champions League, Liga 1)"
              value={league}
              onChange={(e) => setLeague(e.target.value)}
              className="w-full bg-bg-page text-text-main rounded-xl border border-border-custom focus:border-accent focus:outline-none pl-11 pr-4 py-3.5 text-sm font-semibold transition-all placeholder:text-text-muted/50"
            />
          </div>

          {/* Campo Fecha (Filtra de hoy en adelante de forma nativa) */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="date"
              min={getTodayDateString()}
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="w-full bg-bg-page text-text-main rounded-xl border border-border-custom focus:border-accent focus:outline-none pl-11 pr-4 py-3.5 text-sm font-semibold transition-all text-left cursor-pointer"
            />
          </div>

        </div>

        {/* Botón de Acción Principal */}
        <button
          onClick={analyzeMatch}
          disabled={loading || !team1 || !team2}
          className="mt-6 w-full bg-accent hover:bg-accent-hover text-slate-950 disabled:opacity-30 disabled:pointer-events-none transition-all py-4 rounded-2xl font-black text-md uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-accent/20 active:scale-[0.99]"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Calculando probabilidades con IA...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 fill-current" />
              <span>¡Lanzar Análisis Completo!</span>
            </>
          )}
        </button>
      </div>

      {/* RENDERIZADO DINÁMICO DE LOS RESULTADOS (Reemplaza al texto aburrido) */}
      {analysis && (
        <AnalysisResults data={analysis} />
      )}
    </div>
  )
}

/* ==========================================================================
   COMPONENTE SUB-VISTA: Renderizador Visual de Resultados Dinámicos
   ========================================================================== */
function AnalysisResultsView({ data }: { data: AnalysisData }) {
   // Configuración de porcentajes dinámicos según el favorito determinado por tu IA
   const probTeam1 = data.favorito === data.team1 ? data.probabilidadFavorito : Math.floor((100 - data.probabilidadFavorito) / 2)
   const probTeam2 = data.favorito === data.team2 ? data.probabilidadFavorito : Math.floor((100 - data.probabilidadFavorito) / 2)
   const probEmpate = 100 - probTeam1 - probTeam2

   // Estilos de riesgo dinámicos para los Badges
   const riesgoEstilos = {
     Bajo: 'bg-green-500/10 text-green-500 dark:text-green-400 border-green-500/20',
     Medio: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
     Alto: 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20',
   }

   return (
     <div className="mt-8 bg-bg-card rounded-3xl p-6 md:p-8 border-2 border-accent/20 shadow-2xl animate-fade-in relative overflow-hidden transition-colors duration-300">
      
       {/* Barra superior de Estados */}
       <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-custom pb-5 mb-6">
         <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-accent/20">
           <Sparkle className="w-3.5 h-3.5 fill-current" /> Predicción Sincler Finalizada
         </div>
         <div className={`text-xs font-black uppercase px-3 py-1.5 rounded-xl border ${riesgoEstilos[data.riesgo] || riesgoEstilos.Medio} flex items-center gap-1.5`}>
           <AlertTriangle className="w-4 h-4" /> Riesgo: {data.riesgo}
         </div>
       </div>

       {/* 📊 SECCIÓN DE BARRAS PORCENTUALES (Estilo Gaming / Sportcenter) */}
       <div className="bg-bg-page/60 border border-border-custom p-5 rounded-2xl mb-6">
         <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-4 flex items-center gap-1.5">
           <Activity className="w-4 h-4 text-accent" /> Distribución de Probabilidades
         </p>
        
         {/* Nombres y porcentajes flotantes */}
         <div className="flex justify-between font-black text-xs md:text-sm mb-2.5">
           <span className={data.favorito === data.team1 ? 'text-accent' : 'text-text-main'}>
             {data.team1} ({probTeam1}%)
           </span>
           <span className="text-text-muted">Empate ({probEmpate}%)</span>
           <span className={data.favorito === data.team2 ? 'text-accent' : 'text-text-main'}>
             {data.team2} ({probTeam2}%)
           </span>
         </div>

         {/* Contenedor de la barra segmentada */}
         <div className="w-full h-3.5 rounded-full bg-border-custom/80 overflow-hidden flex shadow-inner">
           <div 
             style={{ width: `${probTeam1}%` }} 
             className="h-full bg-gradient-to-r from-emerald-500 to-accent transition-all duration-1000 ease-out" 
           />
           <div 
             style={{ width: `${probEmpate}%` }} 
             className="h-full bg-slate-400 dark:bg-slate-600 transition-all duration-1000 ease-out" 
           />
           <div 
             style={{ width: `${probTeam2}%` }} 
             className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-out" 
           />
         </div>
       </div>

       {/* ⚡ GRID DE MERCADOS Y PRONÓSTICOS RÁPIDOS */}
       <div className="grid sm:grid-cols-2 gap-4 mb-6">
        
         {/* Bloque Over 2.5 goles */}
         <div className="bg-bg-page/40 border border-border-custom p-4 rounded-2xl flex items-center justify-between group hover:border-accent/30 transition-colors">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
               <Goal className="w-5 h-5" />
             </div>
             <div>
               <p className="text-xs font-black text-text-muted uppercase tracking-tight">Mercado Over 2.5</p>
               <p className="text-[11px] text-text-muted/80">¿Suman 3 goles o más?</p>
             </div>
           </div>
           <span className={`text-xs font-black uppercase px-2.5 py-1.5 rounded-lg border tracking-wider ${data.over25 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-slate-500/10 text-text-muted border-border-custom'}`}>
             {data.over25 ? 'SÍ 🔥' : 'NO ❌'}
           </span>
         </div>

         {/* Bloque Ambos Anotan */}
         <div className="bg-bg-page/40 border border-border-custom p-4 rounded-2xl flex items-center justify-between group hover:border-accent/30 transition-colors">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 dark:text-blue-400 shrink-0">
               <Trophy className="w-5 h-5" />
             </div>
             <div>
               <p className="text-xs font-black text-text-muted uppercase tracking-tight">Ambos Anotan</p>
               <p className="text-[11px] text-text-muted/80">¿Marcan los dos clubes?</p>
             </div>
           </div>
           <span className={`text-xs font-black uppercase px-2.5 py-1.5 rounded-lg border tracking-wider ${data.ambosAnotan ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-slate-500/10 text-text-muted border-border-custom'}`}>
             {data.ambosAnotan ? 'SÍ 🔥' : 'NO ❌'}
           </span>
         </div>

       </div>

       {/* 📝 COMENTARIO DE EXPERTO / SUSTENTO DE LA IA */}
       <div className="bg-bg-page/90 border border-border-custom rounded-2xl p-5">
         <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-2 flex items-center gap-1.5">
           <HelpCircle className="w-4 h-4 text-accent" /> Justificación Táctica de Sincler
         </p>
         <p className="text-sm font-medium leading-relaxed text-text-main/90">
           {data.comentario}
         </p>
       </div>

     </div>
   )
 }