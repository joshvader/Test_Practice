'use client';

import { type SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTest } from '../context/TestContext';
import { Loader2 } from 'lucide-react';
import { QUESTION_BANK_LABELS, type QuestionBankId } from '@/lib/questions';

export default function Home() {
  const router = useRouter();
  const { startTest, resetTest, setBankId } = useTest();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = (bankId: QuestionBankId) => async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      resetTest();
      setBankId(bankId);
      startTest();
      router.push(`/test?bank=${bankId}`);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al registrar. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#020617] font-mono relative overflow-hidden text-cyan-500">
      
      {/* Background Decorative Text */}
      <div className="absolute top-10 left-10 text-xs text-cyan-900/50 leading-relaxed select-none hidden md:block">
        <p>&gt; LOADING SYSTEM MODULES...</p>
        <p>&gt; INITIALIZING SEQUENCE [OK]</p>
        <p>&gt; BUFFER_READY</p>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Main Card Container */}
        <div 
          className="border border-cyan-500/50 bg-[#0a0a0a]/90 p-8 md:p-12 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 
              className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-b from-cyan-300 to-cyan-600 mb-4 tracking-tighter"
              style={{ textShadow: '0 0 20px rgba(6,182,212,0.5)' }}
            >
              EVALUACIÓN DE
              <br />
              PRACTICANTES
            </h1>
            <p className="text-fuchsia-500 text-[10px] md:text-xs tracking-[0.2em] font-bold uppercase">
              Sistema de Evaluación Técnica Final // V.2.0.4
            </p>
          </div>

          <div className="space-y-8">
            {/* Info Section */}
            <div>
              <h2 className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center">
                <span className="text-cyan-600 mr-2">◆</span> INFORMACIÓN DEL TEST
              </h2>
              <ul className="space-y-3 text-xs md:text-sm text-cyan-300/80">
                <li className="flex items-start">
                  <span className="mr-2 text-cyan-500">•</span>
                  <span>Duración estimada: <strong className="text-cyan-200">45-60 minutos</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-cyan-500">•</span>
                  <span>Secciones: <strong className="text-cyan-200">POO, Web Dev, Empleabilidad</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-cyan-500">•</span>
                  <span>Incluye <strong className="text-fuchsia-400 italic">ejercicios de codificación</strong> en vivo</span>
                </li>
              </ul>
            </div>

            {/* Form Section */}
            <div className="space-y-6 pt-4">
              <div className="text-xs text-cyan-300/80 border border-cyan-900/40 bg-black/30 p-4">
                Selecciona el tipo de preguntas. El test comienza de inmediato. Al finalizar, el sistema te pedirá tu nombre y correo para asociar el resultado.
              </div>

              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-xs font-bold">
                  ⚠ {error}
                </div>
              )}

              <a
                href="/test?bank=next"
                onClick={handleStart('next')}
                aria-disabled={loading}
                className="w-full inline-flex items-center justify-center bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black py-4 px-6 uppercase tracking-[0.2em] transition-all mt-6 relative group overflow-hidden disabled:opacity-50"
                style={loading ? { pointerEvents: 'none', opacity: 0.7 } : undefined}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      INITIALIZING...
                    </>
                  ) : (
                    `PREGUNTAS ${QUESTION_BANK_LABELS.next}`
                  )}
                </span>
              </a>

              <a
                href="/test?bank=html"
                onClick={handleStart('html')}
                aria-disabled={loading}
                className="w-full inline-flex items-center justify-center bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black py-4 px-6 uppercase tracking-[0.2em] transition-all relative group overflow-hidden disabled:opacity-50"
                style={loading ? { pointerEvents: 'none', opacity: 0.7 } : undefined}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      INITIALIZING...
                    </>
                  ) : (
                    `PREGUNTAS ${QUESTION_BANK_LABELS.html}`
                  )}
                </span>
              </a>

              <a
                href="/test?bank=db"
                onClick={handleStart('db')}
                aria-disabled={loading}
                className="w-full inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black py-4 px-6 uppercase tracking-[0.2em] transition-all relative group overflow-hidden disabled:opacity-50"
                style={loading ? { pointerEvents: 'none', opacity: 0.7 } : undefined}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      INITIALIZING...
                    </>
                  ) : (
                    `PREGUNTAS ${QUESTION_BANK_LABELS.db}`
                  )}
                </span>
              </a>
            </div>

            {/* Footer Data */}
            <div className="flex justify-between items-end pt-8 text-[8px] text-cyan-900 font-bold uppercase tracking-wider border-t border-cyan-900/30 mt-8">
              <div>
                <p>TERM: LOC-9509</p>
              </div>
              <div className="text-center">
                <p className="text-cyan-600">STATUS: ONLINE</p>
              </div>
              <div className="text-right">
                <p>CRYPT-KEY: 385-256</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
