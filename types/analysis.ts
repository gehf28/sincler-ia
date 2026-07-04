export interface AnalysisData {

  team1:string
  team2:string

  team1_logo?: string
  team2_logo?: string

  favorito:string
  riesgo: string
  confianza:number

  probabilidades?: {
    local: number;  // Ej: 15
    empate: number; // Ej: 20
    visita: number; // Ej: 65
  };

  ganador:{
    seleccion:string
    confianza:number
    explicacion:string
  }

  goles:{
    seleccion:string
    confianza:number
    explicacion:string
  }

  handicap:{
    seleccion:string
    confianza:number
    explicacion:string
  }

  tarjetas:{
    seleccion:string
    confianza:number
    explicacion:string
  }

  comentario_general:string
}

export interface TeamInfo {
  logo?: string
}