'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/navbar'
import AnalysisResults from './analysis_results'
import { Bot, Trophy, ShieldAlert } from 'lucide-react'

// Definición de la URL base
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Función de capitalización automática limpia
const capitalizarPalabras = (texto: string) => {
  if (!texto) return "";
  return texto
    .trim()
    .toLowerCase()
    .split(" ")
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
};

export default function HomePage() {
  // Estados principales del Formulario
  const [team1, setTeam1] = useState('')
  const [team2, setTeam2] = useState('')

  // Control de Suscripción Premium para habilitar casillas especiales (Corners)
  const [isPremiumUser, setIsPremiumUser] = useState(true) // Cambiar a false para probar el estado bloqueado

  // Estados de carga, streaming y errores
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [resultData, setResultData] = useState<any>(null)

  // Estados para el Historial Reciente y Pop-up Pro
  const [historialRecientes, setHistorialRecientes] = useState<any[]>([])
  const [cargandoHistorial, setCargandoHistorial] = useState(true)
  const [mostrarModalHistorial, setMostrarModalHistorial] = useState(false)
  

  // Cargar historial desde el backend al montar el componente
  const cargarHistorial = async () => {
    try {
      //const res = await fetch('http://localhost:8000/api/historial?tipo=general')
      const res = await fetch(`${apiUrl}/api/historial?tipo=general`)
      if (res.ok) {
        const data = await res.json()
        setHistorialRecientes(data)
      }
    } catch (e) {
      console.error("Error cargando historial general:", e)
    } finally {
      setCargandoHistorial(false)
    }
  }

  useEffect(() => {
    cargarHistorial()
  }, [])

  // Función para agrupar las consultas pasadas por fechas legibles
  const agruparPorFecha = (partidos: any[]) => {
    const grupos: { [key: string]: any[] } = {};
    partidos.forEach((partido) => {
      const fechaPartido = new Date(partido.fecha_consulta);
      const hoy = new Date();
      const ayer = new Date();
      ayer.setDate(hoy.getDate() - 1);

      let etiquetaFecha = "";
      if (fechaPartido.toDateString() === hoy.toDateString()) {
        etiquetaFecha = "Hoy";
      } else if (fechaPartido.toDateString() === ayer.toDateString()) {
        etiquetaFecha = "Ayer";
      } else {
        etiquetaFecha = fechaPartido.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }

      if (!grupos[etiquetaFecha]) grupos[etiquetaFecha] = [];
      grupos[etiquetaFecha].push(partido);
    });
    return grupos;
  };

  // Cargar un análisis antiguo mapeado correctamente al nuevo componente
  const seleccionarPartidoPasado = (partido: any) => {
    const js = partido.resultado_json || {};
    setTeam1(partido.team1)
    setTeam2(partido.team2)
    
    setResultData({
      fecha: partido.fecha_consulta,
      team1: partido.team1,
      team2: partido.team2,
      favorito: js.favorito || partido.team1,
      probabilidades: js.probabilidades || { local: 34, empate: 33, visita: 33 },
      ganador: js.ganador || { seleccion: partido.team1, oportunidad: 'Alta', explicacion: '' },
      goles: js.goles || { seleccion: 'Procesando...', oportunidad: 'Media', explicacion: '' },
      dobleOportunidad: js.dobleOportunidad || { seleccion: 'Local o Empate', oportunidad: 'Alta', explicacion: '' },
      mejorApuesta: js.mejorApuesta || { seleccion: 'Procesando...', oportunidad: 'Alta', explicacion: '' },
      ambosAnotan: js.ambosAnotan || 'Procesando...',
      lineaCorners: js.lineaCorners || 'Calculando...',
      razonesClave: js.razonesClave || js.razones || [],
      comentario_general: js.comentario_general || ''
    })
  };

  // Enviar el formulario usando el Streaming de Sincler IA
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!team1 || !team2) return

    const equipo1Limpio = capitalizarPalabras(team1);
    const equipo2Limpio = capitalizarPalabras(team2);

    setTeam1(equipo1Limpio);
    setTeam2(equipo2Limpio);
    loading ? null : setLoading(true)
    setErrorMsg(null)

    // Estructura completa inicializada para recibir el stream limpio
    setResultData({
      team1: equipo1Limpio,
      team2: equipo2Limpio,
      favorito: '',
      probabilidades: { local: 34, empate: 33, visita: 33 },
      ganador: null,
      goles: null,
      dobleOportunidad: null,
      mejorApuesta: null,
      ambosAnotan: '',
      lineaCorners: '',
      razonesClave: [],
      comentario_general: ''
    })

    try {
        const response = await fetch(`${apiUrl}/api/analyze/general`,{
      //const response = await fetch('http://localhost:8000/api/analyze/general', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team1: equipo1Limpio,
          team2: equipo2Limpio,
          date: new Date().toISOString().split('T')[0]
        }),
      })

      if (!response.ok) {
        if (response.status === 429) {
          const errData = await response.json()
          throw new Error(errData.detail || 'Límite de tiempo alcanzado.')
        }
        throw new Error('Error al conectar con el servidor de Sincler.')
      }

      if (!response.body) throw new Error('El flujo de datos no está disponible.')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) {
          setTimeout(() => { cargarHistorial(); }, 600);
          break;
        }

        const chunk = decoder.decode(value, { stream: true })
        accumulatedText += chunk
        let cleanText = accumulatedText.trim()

        let testJson = cleanText
        if (!testJson.endsWith('}')) {
          const openBraces = (testJson.match(/\{/g) || []).length
          const closeBraces = (testJson.match(/\}/g) || []).length
          const missingBraces = openBraces - closeBraces
          if (missingBraces > 0) testJson += '}'.repeat(missingBraces)
          else testJson += '}'
        }

        try {
          const parsed = JSON.parse(testJson)
          setResultData((prev: any) => ({
            ...prev,
            favorito: parsed.favorito || prev.favorito,
            probabilidades: parsed.probabilidades || prev.probabilidades,
            ganador: parsed.ganador || prev.ganador,
            goles: parsed.goles || prev.goles,
            dobleOportunidad: parsed.dobleOportunidad || prev.dobleOportunidad,
            mejorApuesta: parsed.mejorApuesta || prev.mejorApuesta,
            ambosAnotan: parsed.ambosAnotan || prev.ambosAnotan,
            lineaCorners: parsed.lineaCorners || prev.lineaCorners,
            razonesClave: parsed.razonesClave || parsed.razones || prev.razonesClave,
            comentario_general: parsed.comentario_general || prev.comentario_general
          }))
        } catch (e) {
          // Fragmentos incompletos intermedios del stream
        }
      }

    } catch (error: any) {
      console.error('Error General:', error)
      setErrorMsg(error.message || 'Ocurrió un error inesperado.')
      setResultData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#090d16] text-slate-100 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Luz ambiental sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-indigo-500/5 dark:bg-indigo-600/10 blur-[140px] pointer-events-none" />

      <Navbar />

      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16 relative z-10">
        
        {/* Badge superior */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#131926]/90 border border-indigo-500/20 text-indigo-400 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.2)]">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_13px_rgba(79,70,229,1)]" />
            <p className="text-[10px] font-black tracking-widest text-slate-300 uppercase flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-indigo-400" /> MOTOR INTELIGENTE • MULTILIGAS
            </p>
          </div>
        </div>

        {/* Título e introducción */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-white">
            Analiza tus apuestas con{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
              Sincler IA
            </span>
          </h1>
          <p className="mt-3 text-slate-400 text-sm md:text-base font-medium max-w-md mx-auto">
            Algoritmo calibrado para cruzar datos masivos sobre clubes, ligas internacionales, copas y estadísticas en tiempo real.
          </p>
        </div>

        {/* Formulario de Análisis */}
        <div className="bg-[#131926]/60 border border-slate-800/80 p-6 md:p-8 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-sm">
          <form onSubmit={handleAnalyze} className="space-y-6">
            
            <div className="grid md:grid-cols-2 gap-4 relative">
              <div className="absolute left-1/2 top-[42%] md:top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0b0f19] border border-slate-800 flex items-center justify-center text-[10px] font-black text-indigo-400 z-10 shadow-md">
                VS
              </div>

              {/* Selección Local */}
              <div className="bg-[#0b0f19]/60 border border-slate-800/70 p-4 rounded-2xl relative">
                <span className="absolute right-3 top-3 text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-800/40 px-2 py-0.5 rounded-md">LOCAL</span>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Club Local</label>
                <input
                  type="text"
                  placeholder="Ej. Real Madrid, Arsenal..."
                  value={team1}
                  onChange={(e) => setTeam1(e.target.value)}
                  disabled={loading}
                  className="w-full bg-transparent text-sm font-bold text-white focus:outline-none placeholder-slate-600"
                />
              </div>

              {/* Selección Visitante */}
              <div className="bg-[#0b0f19]/60 border border-slate-800/70 p-4 rounded-2xl relative">
                <span className="absolute right-3 top-3 text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-800/40 px-2 py-0.5 rounded-md">VISITA</span>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Club Visitante</label>
                <input
                  type="text"
                  placeholder="Ej. Barcelona, Bayern..."
                  value={team2}
                  onChange={(e) => setTeam2(e.target.value)}
                  disabled={loading}
                  className="w-full bg-transparent text-sm font-bold text-white focus:outline-none placeholder-slate-600"
                />
              </div>
            </div>

            {/* Botón de Envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-widest py-4 px-6 rounded-2xl transition-all shadow-[0_4px_20px_rgba(79,70,229,0.3)] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              {loading ? 'PROCESANDO MÉTRICAS DE CLUBES...' : '¡LANZAR PREDICCIÓN GENERAL!'}
            </button>
          </form>
        </div>

        {/* Sección de Errores */}
        {errorMsg && (
          <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" /> {errorMsg}
          </div>
        )}

        {/* Bloque de Resultados con Inyección del estado Premium */}
        {resultData && <AnalysisResults data={resultData} isPremium={isPremiumUser} />}

        {/* Sección Inferior: Historial Reducido */}
        <div className="mt-8 border-t border-slate-800/60 pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Análisis recientes de la comunidad</h3>
            </div>
            {!cargandoHistorial && historialRecientes.length > 6 && !loading && (
              <button
                type="button"
                onClick={() => setMostrarModalHistorial(true)}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-all uppercase tracking-wider"
              >
                Ver todos los análisis →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {cargandoHistorial ? (
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Cargando consultas pasadas...</div>
            ) : (
              historialRecientes.slice(0, 6).map((partido) => {
                const fecha = new Date(partido.fecha_consulta).toLocaleDateString('es-ES', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                });
                return (
                  <button
                    key={partido.id}
                    type="button"
                    onClick={() => seleccionarPartidoPasado(partido)}
                    disabled={loading}
                    className="flex flex-col items-start p-3 bg-[#131926]/40 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-left transition-all group disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                      {partido.team1} <span className="text-slate-500 font-normal">vs</span> {partido.team2}
                    </div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase mt-1">{fecha}</div>
                  </button>
                )
              })
            )}
          </div>
        </div>

      </section>

      {/* POP-UP PREMIUM: HISTORIAL AGRUPADO POR FECHAS */}
      {mostrarModalHistorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#131926] border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-800/80 flex justify-between items-center bg-[#182032]/40">
              <div>
                <h2 className="text-sm font-black uppercase text-white tracking-widest flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-indigo-400" /> Historial General
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Consultas organizadas por días</p>
              </div>
              <button
                type="button"
                onClick={() => setMostrarModalHistorial(false)}
                className="text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              >
                CERRAR
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-[#090d16]/30 space-y-6">
              {(() => {
                const historialAgrupado = agruparPorFecha(historialRecientes);
                return Object.keys(historialAgrupado).map((fechaEtiqueta) => (
                  <div key={fechaEtiqueta} className="space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2.5 py-1 rounded-md inline-block">
                      {fechaEtiqueta}
                    </div>
                    <div className="space-y-2">
                      {historialAgrupado[fechaEtiqueta].map((partido) => {
                        const hora = new Date(partido.fecha_consulta).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                        return (
                          <div key={partido.id} className="flex sm:flex-row flex-col justify-between sm:items-center p-4 bg-[#131926]/90 border border-slate-800/60 rounded-2xl gap-3">
                            <div>
                              <div className="text-sm font-black text-slate-100">{partido.team1} <span className="text-slate-500 font-normal">vs</span> {partido.team2}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">A las {hora} hrs</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => { seleccionarPartidoPasado(partido); setMostrarModalHistorial(false); }}
                              className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all text-center"
                            >
                              Cargar
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              })()}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}