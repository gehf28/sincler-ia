'use client'

import React, { useState, useEffect, useRef } from 'react' // 👈 Solo se añadió useRef
import { Trophy, ArrowLeft, AlertTriangle } from 'lucide-react' 
import Link from 'next/link'
import AnalysisResultsMundial from './analysis_results_mundial'

// Definición de la URL base
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function MundialPage() {
  const [team1, setTeam1] = useState('')
  const [team2, setTeam2] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultData, setResultData] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [historialRecientes, setHistorialRecientes] = useState<any[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(true);
  const [mostrarModalHistorial, setMostrarModalHistorial] = useState(false);
  
  const modalScrollRef = useRef<HTMLDivElement>(null); // 👈 Referencia para el scroll del modal

  const capitalizarPalabras = (texto: string) => {
    if (!texto) return "";
    return texto
      .trim()
      .toLowerCase()
      .split(" ")
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");
  };
  
  const cargarHistorial = async () => {
    try {
      setCargandoHistorial(true);
      const res = await fetch(`${apiUrl}/api/historial?tipo=mundial`);
      //const res = await fetch('http://localhost:8000/api/historial?tipo=mundial');
      if (res.ok) {
        const data = await res.json();
        setHistorialRecientes(data);
      }
    } catch (error) {
      console.error("Error cargando búsquedas recientes:", error);
      } finally {
      setCargandoHistorial(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []); 

  // const seleccionarPartidoPasado = (partido: any) => {
  //   setTeam1(partido.team1);
  //   setTeam2(partido.team2);
  //   setResultData(partido.resultado_json);
  // };

  const seleccionarPartidoPasado = (partido: any) => {
  setTeam1(partido.team1);
  setTeam2(partido.team2);
  
  // Usamos el operador spread (...) para combinar el JSON del resultado
  // con la fecha real del registro guardado en la base de datos.
  setResultData({
    ...partido.resultado_json,
    fecha_analisis: partido.fecha_consulta // Esta es la fecha que viene de tu base de datos
  });
};

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!team1 || !team2) return

    const equipo1Limpio = capitalizarPalabras(team1);
    const equipo2Limpio = capitalizarPalabras(team2);

    setTeam1(equipo1Limpio);
    setTeam2(equipo2Limpio);

    setLoading(true)
    setErrorMsg(null)
    
    setResultData({ 
      team1: equipo1Limpio, 
      team2: equipo2Limpio,
      comentario_general: '',
      probabilidades: { local: "%", empate: "%", visita: "%" },
      ganador: null,
      goles: null,
      dobleOportunidad: null,
      mejorApuesta: null,
      ambosAnotan: null,
      quienClasifica: null,
      razonesClave: []
    })

    try {
        const response = await fetch(`${apiUrl}/api/analyze/mundial`, {
      //const response = await fetch('http://localhost:8000/api/analyze/mundial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team1: equipo1Limpio,
          team2: equipo2Limpio,
          league: 'Copa Mundial 2026',
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
          setTimeout(() => {
            cargarHistorial();
          }, 600);
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
          
          if (missingBraces > 0) {
            testJson += '}'.repeat(missingBraces)
          } else {
            testJson += '}'
          }
        }

        try {
          const parsed = JSON.parse(testJson)
          setResultData((prev: any) => ({
            ...prev,
            ...parsed
          }))
        } catch (e) {
          const matchComment = cleanText.match(/"comentario_general"\s*:\s*"([^"]*)"?/)
          const matchFavorito = cleanText.match(/"favorito"\s*:\s*"([^"]*)"?/)
          const matchAmbos = cleanText.match(/"ambosAnotan"\s*:\s*"([^"]*)"?/)
          const matchClasifica = cleanText.match(/"quienClasifica"\s*:\s*"([^"]*)"?/)

          setResultData((prev: any) => ({
            ...prev,
            comentario_general: matchComment ? matchComment[1] : (prev?.comentario_general || ''),
            favorito: matchFavorito ? matchFavorito[1] : (prev?.favorito || ''),
            ambosAnotan: matchAmbos ? matchAmbos[1] : (prev?.ambosAnotan || null),
            quienClasifica: matchClasifica ? matchClasifica[1] : (prev?.quienClasifica || null),
          }))
        }
      }

    } catch (error: any) {
      console.error('Error de Análisis:', error)
      setErrorMsg(error.message || 'Ocurrió un error inesperado.')
      setResultData(null)
    } finally {
      setLoading(false)
    }
  }

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

      if (!grupos[etiquetaFecha]) {
        grupos[etiquetaFecha] = [];
      }
      grupos[etiquetaFecha].push(partido);
    });

    return grupos;
  };

  return (
    <div className="w-full min-h-screen bg-[#070a13] text-slate-100 flex flex-col antialiased relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute -top-32 left-1/4 w-[600px] h-[350px] bg-gradient-to-br from-cyan-500/15 via-cyan-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-32 right-1/4 w-[600px] h-[350px] bg-gradient-to-bl from-[#00ff87]/15 via-[#00ff87]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto px-4 pt-6 relative z-20">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
        </Link>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pb-16 flex flex-col items-center justify-center relative z-10">
        <div className="text-center mb-12 relative w-full mt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-black tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]" />
            Motor Inteligente • Mundial 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto leading-tight">
            Analiza tus apuestas con <br />
            <span className="bg-gradient-to-r from-[#00ff87] to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(0,255,135,0.15)]">
              Sincler IA Mundial
            </span>
          </h1>
          <p className="text-slate-400 mt-4 text-xs md:text-sm max-w-xl mx-auto leading-relaxed opacity-90">
            Algoritmo calibrado para cruzar datos masivos sobre sedes mundialistas, desgaste por vuelos intercontinentales y estadísticas en tiempo real.
          </p>
        </div>

        <div className="w-full max-w-3xl bg-[#131926]/85 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selección Local</label>
                  <span className="text-[10px] bg-[#0b0f19] text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase">Local</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Ej. Estados Unidos, México, Argentina..."
                  value={team1}
                  onChange={(e) => setTeam1(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-800 focus:border-cyan-400 text-white rounded-xl px-4 py-3.5 text-sm outline-none transition-all placeholder-slate-600"
                  disabled={loading}
                />
              </div>
              <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 md:flex hidden z-10 items-center justify-center w-9 h-9 rounded-full bg-cyan-400 text-slate-950 font-black text-xs border-4 border-[#131926]">
                VS
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selección Visitante</label>
                  <span className="text-[10px] bg-[#0b0f19] text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase">Visita</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Ej. Francia, España, Brasil..."
                  value={team2}
                  onChange={(e) => setTeam2(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-800 focus:border-cyan-400 text-white rounded-xl px-4 py-3.5 text-sm outline-none transition-all placeholder-slate-600"
                  disabled={loading}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !team1 || !team2}
              className="w-full bg-gradient-to-r from-[#00ff87] to-cyan-400 disabled:opacity-40 text-slate-950 font-black text-xs md:text-sm uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-slate-950" />
              {loading ? 'Sincronizando con Sincler Mundial...' : '¡Lanzar Predicción Mundialista!'}
            </button>
          </form>
        </div>

        {errorMsg && (
          <div className="w-full max-w-3xl mt-6 bg-rose-500/10 border-2 border-rose-500/30 text-rose-400 p-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {errorMsg}
          </div>
        )}

        <div className="w-full max-w-3xl mt-6 p-5 bg-[#131926]/60 backdrop-blur-md border border-slate-800/80 rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Análisis Recientes de la Comunidad
            </h3>
            {!cargandoHistorial && historialRecientes.length > 6 && !loading && (
              <button
                type="button"
                onClick={() => setMostrarModalHistorial(true)}
                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-all uppercase tracking-wider"
              >
                Ver todos los análisis →
              </button>
            )}
          </div>

          {cargandoHistorial ? (
            <div className="py-4 text-center">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 animate-pulse">
                Sincronizando historial con Supabase...
              </p>
            </div>
          ) : historialRecientes.length === 0 ? (
            <div className="py-2 text-center">
              <p className="text-xs text-slate-600">No hay análisis registrados aún.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {historialRecientes.slice(0, 6).map((partido) => {
                const fecha = new Date(partido.fecha_consulta).toLocaleDateString('es-ES', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <button
                    key={partido.id}
                    type="button"
                    onClick={() => seleccionarPartidoPasado(partido)}
                    disabled={loading}
                    className="flex flex-col items-start p-3 bg-[#0b0f19]/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                      {partido.team1} <span className="text-slate-500 font-normal">vs</span> {partido.team2}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {fecha}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {resultData && <AnalysisResultsMundial data={resultData} />}

        {mostrarModalHistorial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-xl bg-[#131926] border border-slate-800 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[80vh]">
              <div className="p-6 border-b border-slate-800/60 flex justify-between items-center bg-[#182032]/40">
                <div>
                  <h2 className="text-sm font-black uppercase text-white tracking-widest flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-cyan-400" />
                    Historial de Consultas
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Historial completo organizado cronológicamente</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMostrarModalHistorial(false)}
                  className="text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                >
                  CERRAR
                </button>
              </div>
              <div ref={modalScrollRef} className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#0d121f]/50 space-y-6">
                {(() => {
                  const historialAgrupado = agruparPorFecha(historialRecientes);
                  
                  return Object.keys(historialAgrupado).map((fechaEtiqueta) => (
                    <div key={fechaEtiqueta} className="space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-wider text-cyan-400/80 bg-cyan-500/5 border border-cyan-500/10 px-2.5 py-1 rounded-md inline-block">
                        {fechaEtiqueta}
                      </div>
                      <div className="space-y-2">
                        {historialAgrupado[fechaEtiqueta].map((partido) => {
                          const hora = new Date(partido.fecha_consulta).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          });

                          return (
                            <div 
                              key={partido.id}
                              className="flex sm:flex-row flex-col justify-between sm:items-center p-4 bg-[#131926]/90 border border-slate-800/60 rounded-2xl gap-3 hover:border-slate-700/60 transition-colors"
                            >
                              <div>
                                <div className="text-sm font-black text-slate-100">
                                  {partido.team1} <span className="text-slate-500 font-normal">vs</span> {partido.team2}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  Registrado a las {hora} hrs
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  seleccionarPartidoPasado(partido);
                                  setMostrarModalHistorial(false);
                                }}
                                className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-400 hover:text-slate-950 text-cyan-400 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap text-center"
                              >
                                Cargar Análisis
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}