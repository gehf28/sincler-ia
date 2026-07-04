'use client'
import { useState } from 'react';
import { X } from 'lucide-react';

// Definición de la URL base
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface FakeDoorModalProps {
  isOpen: boolean;
  onClose: () => void;
  seccion: string;
}

export function FakeDoorModal({ isOpen, onClose, seccion }: FakeDoorModalProps) {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  if (!isOpen) return null;

  const handleSubscribir = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Cambiamos a la ruta correcta /api/registro
    // Y ajustamos el objeto para que coincida con lo que espera tu base de datos
    await fetch(`${apiUrl}/api/registro`, {
    //await fetch('http://localhost:8000/api/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        tipo: 'Lista de Espera', 
        seccion: seccion, // Aquí usas la prop que ya recibes
        correo: email 
      })
    });
    setEnviado(true);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#131926] border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-base font-black uppercase text-white tracking-widest flex items-center gap-2">
          🚀 ¡Muy pronto!
        </h3>
        <p className="text-xs text-slate-300 mt-3 leading-relaxed">
        El módulo <span className="text-cyan-400 font-bold capitalize">{seccion}</span> está en desarrollo. Estamos calibrando el algoritmo para darte la mayor precisión.
        </p>

        {!enviado ? (
          <form onSubmit={handleSubscribir} className="mt-5 space-y-3">
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Únete a la lista de espera</label>
            <input 
              type="email" required placeholder="tu@correo.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600"
            />
            <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-[11px] font-black uppercase tracking-widest py-3 rounded-xl shadow-lg hover:opacity-90">
              Ser el primero en enterarme
            </button>
          </form>
        ) : (
          <p className="mt-5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-center">
            ¡Listo! Te avisaremos apenas esté disponible.
          </p>
        )}
      </div>
    </div>
  );
}