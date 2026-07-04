// src/app/components/analysis_results.tsx
'use client'

import { Trophy, Goal, Activity, Sparkles, HelpCircle, ShieldCheck, Star, RefreshCw, Flag, CheckCircle2, Lock, Share2 } from 'lucide-react'
import { toPng } from 'html-to-image';

interface AnalysisResultsProps {
  data: any;
  isPremium?: boolean;
}

export default function AnalysisResults({ data, isPremium = false }: AnalysisResultsProps) {
  const probTeam1 = data.probabilidades?.local ?? 34
  const probEmpate = data.probabilidades?.empate ?? 33
  const probTeam2 = data.probabilidades?.visita ?? 33

  const handleShareTicket = async () => {
    const node = document.getElementById('ticket-container');
    if (node) {
      try {
        const dataUrl = await toPng(node, { backgroundColor: '#0b0f19' });
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'analisis-sincler.png', { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Análisis Sincler IA', text: 'Mira este análisis' });
        } else {
          const link = document.createElement('a');
          link.download = 'analisis-sincler.png';
          link.href = dataUrl;
          link.click();
        }
      } catch (err) { console.error('Error al generar:', err); }
    }
  };
  
  return (
    <div className="flex flex-col gap-4 w-full mt-8">
      <div id="ticket-container" className="bg-[#0b0f19] rounded-3xl p-6 md:p-8 border-2 border-cyan-500/30 shadow-2xl animate-fade-in relative overflow-hidden text-slate-100">
        
        {/* Encabezado con Fecha Integrada */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
          <div className="flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-cyan-500/20">
            <Sparkles className="w-4 h-4 fill-current" /> Algoritmo de Predicción General
          </div>
          
          <div className="flex items-center gap-3">
            {/* Fecha con estilo resaltado y borde luminoso */}
            {data.fecha && (
              <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                {new Date(data.fecha).toLocaleString('es-ES', { 
                  day: 'numeric', 
                  month: 'short', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            )}
            
            <div className="text-xs font-black uppercase px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Análisis Procesado
            </div>
          </div>
        </div>

        {/* Probabilidades Dinámicas */}
        <div className="bg-[#131926]/40 border border-slate-800/80 p-6 rounded-2xl mb-6">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" /> Probabilidades de Victoria
          </p>
          <div className="flex justify-between font-black text-sm md:text-base mb-2">
            <span className={data.favorito === data.team1 ? 'text-cyan-400' : 'text-white'}>
              {data.team1} ({probTeam1}%)
            </span>
            <span className="text-slate-400 text-xs md:text-sm">Empate ({probEmpate}%)</span>
            <span className={data.favorito === data.team2 ? 'text-cyan-400' : 'text-white'}>
              {data.team2} ({probTeam2}%)
            </span>
          </div>
          <div className="w-full h-4 rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
            <div style={{ width: `${probTeam1}%` }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all" />
            <div style={{ width: `${probEmpate}%` }} className="h-full bg-slate-600 transition-all" />
            <div style={{ width: `${probTeam2}%` }} className="h-full bg-gradient-to-r from-emerald-500 to-[#00ff87] transition-all" />
          </div>
        </div>

        {/* Grid de Tarjetas Principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-[#131926]/60 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
            <div className="flex items-start justify-between w-full mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Predicción Principal</p>
                  {data.ganador?.oportunidad && <p className="text-[11px] text-slate-500 font-medium">Oportunidad: {data.ganador.oportunidad}</p>}
                </div>
              </div>
              {data.ganador?.seleccion && <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400">{data.ganador.seleccion}</span>}
            </div>
            <p className="text-xs text-slate-300 italic mt-1 leading-snug">{data.ganador?.explicacion ? `"${data.ganador.explicacion}"` : 'Procesando...'}</p>
          </div>

          <div className="bg-[#131926]/60 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
            <div className="flex items-start justify-between w-full mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#00ff87]/10 flex items-center justify-center text-[#00ff87]">
                  <Goal className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Mercado de Goles</p>
                  {data.goles?.oportunidad && <p className="text-[11px] text-slate-500 font-medium">Oportunidad: {data.goles.oportunidad}</p>}
                </div>
              </div>
              {data.goles?.seleccion && <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-[#00ff87]/20 text-[#00ff87]">{data.goles.seleccion}</span>}
            </div>
            <p className="text-xs text-slate-300 italic mt-1 leading-snug">{data.goles?.explicacion ? `"${data.goles.explicacion}"` : 'Procesando...'}</p>
          </div>
        </div>

        {/* Grid de Tarjetas (Fila 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#131926]/60 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
            <div className="flex items-start justify-between w-full mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400"><ShieldCheck className="w-4 h-4" /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Doble Oportunidad</p>
                  {data.dobleOportunidad?.oportunidad && <p className="text-[11px] text-slate-500 font-medium">Oportunidad: {data.dobleOportunidad.oportunidad}</p>}
                </div>
              </div>
              {data.dobleOportunidad?.seleccion && <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400">{data.dobleOportunidad.seleccion}</span>}
            </div>
            <p className="text-xs text-slate-300 italic mt-1 leading-snug">"{data.dobleOportunidad?.explicacion || 'Procesando...'}"</p>
          </div>

          <div className="bg-[#131926]/60 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
            <div className="flex items-start justify-between w-full mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400"><Star className="w-4 h-4" /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Mejor Apuesta</p>
                  {data.mejorApuesta?.oportunidad && <p className="text-[11px] text-slate-500 font-medium">Oportunidad: {data.mejorApuesta.oportunidad}</p>}
                </div>
              </div>
              {data.mejorApuesta?.seleccion && <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400">{data.mejorApuesta.seleccion}</span>}
            </div>
            <p className="text-xs text-slate-300 italic mt-1 leading-snug">"{data.mejorApuesta?.explicacion || 'Procesando...'}"</p>
          </div>
        </div>

        {/* Métricas Avanzadas */}
        <div className="border-t border-slate-800 pt-6 mb-6">
          <p className="text-[11px] font-black text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse" />
            Métricas Avanzadas
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#131926]/50 border border-slate-800/60 p-5 rounded-2xl flex flex-col min-h-[160px]">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2"><RefreshCw className="w-4 h-4 text-cyan-400" /> Ambos Anotan</div>
              <div className="flex-1 flex items-center justify-center"><p className="text-2xl font-black text-white text-center">{data.ambosAnotan || "Procesando..."}</p></div>
            </div>
            <div className="bg-[#131926]/50 border border-slate-800/60 p-5 rounded-2xl flex flex-col min-h-[160px] relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2"><Flag className="w-4 h-4 text-[#00ff87]" /> Línea de Corners</div>
              {isPremium ? <div className="flex-1 flex items-center justify-center"><p className="text-xl font-black text-white text-center">{data.lineaCorners || "Calculando..."}</p></div> : <div className="absolute inset-0 bg-[#0b0f19]/90 backdrop-blur-sm flex flex-col items-center justify-center"><Lock className="w-5 h-5 text-amber-400 mb-1.5" /><p className="text-[11px] font-black uppercase text-amber-400">Premium</p></div>}
            </div>
            <div className="bg-[#131926]/50 border border-slate-800/60 p-5 rounded-2xl min-h-[160px]">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Pilares del Pronóstico</div>
              <div className="space-y-2">{data.razonesClave?.map((razon: string, idx: number) => (<p key={idx} className="text-xs font-semibold text-slate-300 leading-tight">{razon}</p>))}</div>
            </div>
          </div>
        </div>

        <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><HelpCircle className="w-4 h-4" /> Dictamen Estratégico</p>
          <p className="text-sm font-medium leading-relaxed text-slate-200">{data.comentario_general || 'Redactando el veredicto...'}</p>
        </div>
      </div>

      <button onClick={handleShareTicket} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:scale-[1.01] transition-all">
        <Share2 className="w-5 h-5" /> Compartir Ticket
      </button>
    </div>
  )
}