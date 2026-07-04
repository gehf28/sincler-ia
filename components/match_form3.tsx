'use client'

import { useState } from 'react'
import { api } from '@/services/api'

import {
  Loader2,
  Sparkles,
  ChevronDown,
  Calendar,
  Trophy
} from 'lucide-react'

import FreemiumAnalysis from './freemium_analysis'
import { AnalysisData } from '@/types/analysis'

export default function MatchForm() {
  const [team1, setTeam1] = useState('')
  const [team2, setTeam2] = useState('')

  const [league, setLeague] = useState('')
  const [matchDate, setMatchDate] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)

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
    setAnalysis(null)

    try {
      const response = await api.post('/analyze', {
        team1,
        team2,
        league,
        date: matchDate
      })

      setAnalysis(response.data)
    } catch (error) {
      console.error('Error analizando partido:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">

      <div className="bg-bg-card rounded-3xl p-6 md:p-8 border border-border-custom shadow-xl dark:shadow-[0_0_50px_rgba(0,245,118,0.05)] transition-all duration-300">

        <div className="flex flex-col md:flex-row items-center gap-4">

          <div className="w-full relative">
            <input
              type="text"
              placeholder="Ej. Real Madrid 👑"
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              className="w-full bg-bg-page text-text-main rounded-2xl border-2 border-border-custom focus:border-accent focus:outline-none px-5 py-4 font-semibold transition-all placeholder:text-text-muted/50"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-text-muted bg-bg-card border border-border-custom px-2 py-0.5 rounded-md uppercase">
              Local
            </span>
          </div>

          <div className="bg-accent text-slate-950 font-black text-lg w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md md:rotate-3">
            VS
          </div>

          <div className="w-full relative">
            <input
              type="text"
              placeholder="Ej. Barcelona ⚽"
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              className="w-full bg-bg-page text-text-main rounded-2xl border-2 border-border-custom focus:border-accent focus:outline-none px-5 py-4 font-semibold transition-all placeholder:text-text-muted/50"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-text-muted bg-bg-card border border-border-custom px-2 py-0.5 rounded-md uppercase">
              Visita
            </span>
          </div>

        </div>

        <div className="mt-4 flex justify-start">

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-accent transition-colors cursor-pointer select-none bg-bg-page/50 px-3 py-2 rounded-xl border border-border-custom/60"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                showAdvanced ? 'rotate-180 text-accent' : ''
              }`}
            />

            <span>
              {showAdvanced
                ? 'Ocultar campos opcionales'
                : 'Añadir competencia y fecha (Opcional)'}
            </span>

          </button>

        </div>

        <div
          className={`grid md:grid-cols-2 gap-4 transition-all duration-300 overflow-hidden ${
            showAdvanced
              ? 'mt-4 max-h-40 opacity-100'
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >

          <div className="relative">

            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              <Trophy className="w-4 h-4" />
            </div>

            <input
              type="text"
              placeholder="Competencia (Champions, Liga 1, Premier League...)"
              value={league}
              onChange={(e) => setLeague(e.target.value)}
              className="w-full bg-bg-page text-text-main rounded-xl border border-border-custom focus:border-accent focus:outline-none pl-11 pr-4 py-3.5 text-sm font-semibold"
            />

          </div>

          <div className="relative">

            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              <Calendar className="w-4 h-4" />
            </div>

            <input
              type="date"
              min={getTodayDateString()}
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="w-full bg-bg-page text-text-main rounded-xl border border-border-custom focus:border-accent focus:outline-none pl-11 pr-4 py-3.5 text-sm font-semibold"
            />

          </div>

        </div>

        <button
          onClick={analyzeMatch}
          disabled={loading || !team1 || !team2}
          className="mt-6 w-full bg-accent hover:bg-accent-hover text-slate-950 disabled:opacity-30 disabled:pointer-events-none transition-all py-4 rounded-2xl font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
        >

          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Calculando probabilidades...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>¡Lanzar Análisis Completo!</span>
            </>
          )}

        </button>

      </div>

      {analysis && (
        <FreemiumAnalysis data={analysis} />
      )}

    </div>
  )
}