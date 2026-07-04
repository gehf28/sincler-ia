// 'use client'
// import { useState } from 'react';
// import { X, ShieldCheck, Search, Clock, Target, AlertCircle, Bot, LineChart, Database, TrendingUp } from 'lucide-react';

// export function PremiumModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
//   const [paso, setPaso] = useState<'beneficios' | 'registro' | 'exito'>('beneficios');
//   const [enviando, setEnviando] = useState(false);
//   const API_URL = 'http://localhost:8000';

//   // Función para registrar solo cuando el usuario muestra interés real
//   const registrarInteres = async () => {
//     try {
//       await fetch(`${API_URL}/api/registro`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ tipo: 'Interés VIP', seccion: 'Premium' })
//       });
//     } catch (err) {
//       console.error("Error al registrar interés:", err);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setEnviando(true);
//     const formData = new FormData(e.currentTarget);
    
//     try {
//       const response = await fetch(`${API_URL}/api/registro`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           tipo: 'Registro Premium', 
//           seccion: 'Premium', 
//           nombre: formData.get('nombre'), 
//           correo: formData.get('correo') 
//         })
//       });

//       if (response.ok) {
//         setPaso('exito');
//       } else {
//         alert("Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.");
//       }
//     } catch (error) {
//       console.error("Error al conectar con el servidor:", error);
//       alert("No se pudo conectar con el servidor.");
//     } finally {
//       setEnviando(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">
//       <div className="w-full max-w-2xl bg-[#0b0f19] border border-slate-800 rounded-3xl p-8 shadow-2xl relative my-auto">
//         <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
//           <X className="w-6 h-6" />
//         </button>

//         {/* --- PASO 1: LISTA DE BENEFICIOS --- */}
//         {paso === 'beneficios' && (
//           <>
//             <div className="text-center mb-8">
//               <span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest text-indigo-400 uppercase">
//                 <ShieldCheck className="w-4 h-4" /> Membresía Exclusiva
//               </span>
//               <h2 className="text-3xl font-black text-white mt-4 uppercase tracking-tight">Sincler IA <span className="text-cyan-400">Premium Pro</span></h2>
//             </div>

//             <div className="space-y-3">
//               {[
//                 { title: "Detector de Valor (Cuota Justa)", desc: "Comparamos la probabilidad real de la IA vs las cuotas de mercado para hallar apuestas con valor a largo plazo.", icon: Target },
//                 { title: "Análisis de Valor y Tendencias", desc: "Identifica patrones históricos y rachas actuales que los algoritmos básicos ignoran, maximizando tu ventaja competitiva.", icon: TrendingUp },
//                 { title: "Backtesting de Rendimiento IA", desc: "Acceso total al historial de aciertos y efectividad de nuestros modelos en los últimos 30 días.", icon: Database },
//                 // { title: "Alertas Inteligentes en Tiempo Real", desc: "Recibe notificaciones automáticas cuando un partido cumpla tus criterios de alta probabilidad.", icon: AlertCircle },
//                 { title: "Mercados Avanzados: 1er Tiempo, Handicaps y más", desc: "Predicciones detalladas en 1er tiempo, handicaps asiáticos, conteo de tarjetas, goleadores y otros mercados especializados.", icon: LineChart },
//                 { title: "Análisis en Vivo (Live)", desc: "Monitoreo constante con actualizaciones tácticas sobre el momentum del equipo durante el encuentro.", icon: Clock },
//                 { title: "Filtro Pro: Líder vs Colista", desc: "Algoritmo especializado que detecta desequilibrios rentables en la tabla de posiciones.", icon: Search },
//                 { title: "Consultas Ilimitadas", desc: "Acceso total sin restricciones para analizar toda la jornada deportiva.", icon: Bot }
//               ].map((item, i) => (
//                 <div key={i} className="flex gap-4 p-4 rounded-2xl bg-[#131926] border border-slate-800 hover:border-indigo-500/30 transition-all">
//                   <div className="bg-indigo-500/10 p-2.5 rounded-xl h-fit">
//                     <item.icon className="w-5 h-5 text-cyan-400" />
//                   </div>
//                   <div>
//                     <h4 className="text-white font-black text-xs uppercase">{item.title}</h4>
//                     <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{item.desc}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button 
//               onClick={() => {
//                 registrarInteres();
//                 setPaso('registro');
//               }}
//               className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg hover:scale-[1.01] transition-all"
//             >
//               SOLICITAR ACCESO VIP AHORA
//             </button>
//           </>
//         )}

//         {/* --- PASO 2: FORMULARIO DE REGISTRO --- */}
//         {paso === 'registro' && (
//           <div className="py-12 text-center">
//             <h3 className="text-2xl font-black text-white mb-6">Completa tu registro</h3>
//             <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
//               <input name="nombre" placeholder="Tu nombre" required className="w-full bg-[#131926] p-4 rounded-xl border border-slate-800 text-white" />
//               <input name="correo" type="email" placeholder="Tu correo electrónico" required className="w-full bg-[#131926] p-4 rounded-xl border border-slate-800 text-white" />
//               <button type="submit" disabled={enviando} className="w-full bg-cyan-500 text-black font-black py-4 rounded-xl hover:bg-cyan-400 transition-all">
//                 {enviando ? "Procesando..." : "ENVIAR SOLICITUD"}
//               </button>
//             </form>
//           </div>
//         )}

//         {/* --- PASO 3: ÉXITO --- */}
//         {paso === 'exito' && (
//           <div className="py-20 text-center">
//             <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
//             <h3 className="text-2xl font-black text-white">¡Solicitud recibida!</h3>
//             <p className="text-slate-400 mt-2">Gracias por confiar en Sincler IA. Te contactaremos pronto para los siguientes pasos.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client'
import { useState } from 'react';
import { X, ShieldCheck, Search, Clock, Target, AlertCircle, Bot, LineChart, Database, TrendingUp, Zap, ZapOff } from 'lucide-react';

// Definición de la URL base
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function PremiumModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [paso, setPaso] = useState<'beneficios' | 'registro' | 'exito'>('beneficios');
  const [enviando, setEnviando] = useState(false);
  //const API_URL = 'http://localhost:8000';

  const registrarInteres = async () => {
    try {
      await fetch(`${apiUrl}/api/registro`, {
      //await fetch(`${API_URL}/api/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'Interés VIP', seccion: 'Premium' })
      });
    } catch (err) { console.error("Error al registrar interés:", err); }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviando(true);
    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch(`${apiUrl}/api/registro`, {
      //const response = await fetch(`${API_URL}/api/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'Registro Premium', seccion: 'Premium', nombre: formData.get('nombre'), correo: formData.get('correo') })
      });
      if (response.ok) setPaso('exito');
      else alert("Hubo un error al enviar tu solicitud.");
    } catch (error) { alert("No se pudo conectar con el servidor."); }
    finally { setEnviando(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#0b0f19] border border-slate-800 rounded-3xl p-8 shadow-2xl relative my-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        {paso === 'beneficios' && (
          <>
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest text-indigo-400 uppercase">
                <ShieldCheck className="w-4 h-4" /> Comparativa de Planes
              </span>
              <h2 className="text-3xl font-black text-white mt-4 uppercase tracking-tight">Sincler IA <span className="text-cyan-400">Free vs Pro</span></h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* PLAN FREE */}
              <div className="bg-indigo-500/5 border-2 border-indigo-500/30 rounded-3xl p-6 flex flex-col">
                <h3 className="text-indigo-400 font-black text-xs uppercase mb-6 text-center">Plan Gratuito</h3>
                <div className="space-y-3">
                  <div className="flex gap-4 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                    <Search className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h4 className="text-white font-black text-[10px] uppercase">Análisis estándar</h4>
                      <p className="text-slate-400 text-[10px]">Predicciones básicas en ligas principales.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                    <Clock className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h4 className="text-white font-black text-[10px] uppercase">Límite de Tiempo</h4>
                      <p className="text-slate-400 text-[10px]">Un análisis cada 15 minutos.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                    <ZapOff className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h4 className="text-white font-black text-[10px] uppercase">Acceso Limitado</h4>
                      <p className="text-slate-400 text-[10px]">Sin acceso a herramientas predictivas avanzadas.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PLAN PREMIUM */}
              <div className="space-y-3">
                <h3 className="text-cyan-400 font-black text-xs uppercase mb-6 text-center">Ventajas Premium Pro</h3>
                {[
                  { title: "Detector de Valor (Cuota Justa)", desc: "Comparamos la probabilidad real de la IA vs las cuotas de mercado.", icon: Target },
                  { title: "Análisis de Valor y Tendencias", desc: "Identifica patrones históricos y rachas actuales.", icon: TrendingUp },
                  { title: "Historial de Rendimiento IA", desc: "Acceso al historial de efectividad de 30 días.", icon: Database },
                  { title: "Mercados Avanzados", desc: "Handicaps, tarjetas, goleadores y más.", icon: LineChart },
                  { title: "Análisis en Vivo (Live)", desc: "Análisis táctico en tiempo real.", icon: Clock },
                  { title: "Filtro Pro: Líder vs Colista", desc: "Algoritmo especializado en desequilibrios de partidos.", icon: Search },
                  { title: "Consultas Ilimitadas", desc: "Sin tiempos de espera ni restricciones.", icon: Bot }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-3 rounded-2xl bg-[#131926] border border-slate-800 hover:border-indigo-500/30 transition-all">
                    <div className="bg-indigo-500/10 p-2 rounded-lg h-fit"><item.icon className="w-4 h-4 text-cyan-400" /></div>
                    <div>
                      <h4 className="text-white font-black text-[10px] uppercase">{item.title}</h4>
                      <p className="text-slate-400 text-[10px] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => { registrarInteres(); setPaso('registro'); }} className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg hover:scale-[1.01] transition-all">
              SOLICITAR ACCESO VIP AHORA
            </button>
          </>
        )}

        {paso === 'registro' && (
          <div className="py-12 text-center">
            <h3 className="text-2xl font-black text-white mb-6">Completa tu registro</h3>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
              <input name="nombre" placeholder="Tu nombre" required className="w-full bg-[#131926] p-4 rounded-xl border border-slate-800 text-white" />
              <input name="correo" type="email" placeholder="Tu correo electrónico" required className="w-full bg-[#131926] p-4 rounded-xl border border-slate-800 text-white" />
              <button type="submit" disabled={enviando} className="w-full bg-cyan-500 text-black font-black py-4 rounded-xl hover:bg-cyan-400 transition-all">
                {enviando ? "Procesando..." : "ENVIAR SOLICITUD"}
              </button>
            </form>
          </div>
        )}

        {paso === 'exito' && (
          <div className="py-20 text-center">
            <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white">¡Solicitud recibida!</h3>
            <p className="text-slate-400 mt-2">Gracias por confiar en Sincler IA. Te contactaremos pronto.</p>
          </div>
        )}
      </div>
    </div>
  );
}