'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTest } from '../../context/TestContext';
import { TEST_DATA } from '../../lib/questions';
import Timer from '../../components/Timer';
import MultipleChoice from '../../components/MultipleChoice';
import TextQuestion from '../../components/TextQuestion';
import CodeEditor from '../../components/CodeEditor';
import { Loader2, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TestPage() {
  const router = useRouter();
  const { practicante, respuestas, setRespuesta, startTime, startTest, resetTest } = useTest();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [identityError, setIdentityError] = useState<string | null>(null);
  const [identity, setIdentity] = useState({ nombre: '', email: '' });

  useEffect(() => {
    if (!startTime) {
      startTest();
    }
  }, [startTime, startTest]);

  if (!startTime) {
    return null; // Or loading spinner
  }

  const currentSection = TEST_DATA[currentSectionIndex];
  const isLastSection = currentSectionIndex === TEST_DATA.length - 1;

  const handleNext = () => {
    if (isLastSection) {
      handleSubmit();
    } else {
      setCurrentSectionIndex((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    // Custom cyberpunk confirm
    if (!window.confirm('¿CONFIRMAR ENVÍO FINAL? Una vez enviado, la secuencia de datos se bloqueará.')) {
      return;
    }

    if (!practicante) {
      setShowIdentity(true);
      return;
    }

    await submitTest();
  };

  const handleTimeUp = async () => {
    alert('TIEMPO AGOTADO. Enviando datos automáticamente...');
    if (!practicante) {
      setShowIdentity(true);
      return;
    }
    await submitTest();
  };

  const submitTest = async (overrideIdentity?: { nombre: string; email: string }) => {
    setSubmitting(true);
    try {
      const endTime = Date.now();
      const durationMinutes = Math.round((endTime - startTime) / 60000);

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          practicante_id: practicante?.id,
          nombre: overrideIdentity?.nombre,
          email: overrideIdentity?.email,
          respuestas,
          tiempo_minutos: durationMinutes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const details = result?.details ? `: ${result.details}` : '';
        throw new Error((result?.error || 'Error al enviar el test') + details);
      }

      router.push(`/results?id=${result.test_id}`);
      resetTest();
    } catch (error: any) {
      console.error('Error submitting:', error);
      alert(error.message || 'Error en el enlace de datos. Reintente o contacte soporte.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] font-mono text-cyan-500 pb-20 relative overflow-hidden">
      {/* Decorative background grid/elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#22d3ee 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

      {showIdentity && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md bg-[#0a0a0a]/95 border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.2)] backdrop-blur-md relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

            <div className="p-6 border-b border-cyan-500/20">
              <h2 className="text-sm font-black uppercase tracking-widest text-cyan-300">IDENTIFICACIÓN FINAL</h2>
              <p className="text-[10px] text-cyan-700 font-bold uppercase tracking-wider mt-2">
                Ingresa tus datos para asociar el resultado.
              </p>
            </div>

            <form
              className="p-6 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setIdentityError(null);
                const nombre = identity.nombre.trim();
                const email = identity.email.trim().toLowerCase();
                if (!nombre || !email) {
                  setIdentityError('Completa nombre y correo.');
                  return;
                }
                setShowIdentity(false);
                await submitTest({ nombre, email });
              }}
            >
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-cyan-600 mb-2 font-bold">
                  Nombre Completo
                </label>
                <input
                  value={identity.nombre}
                  onChange={(e) => setIdentity((prev) => ({ ...prev, nombre: e.target.value }))}
                  required
                  className="w-full bg-white text-slate-900 px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all rounded-sm placeholder:text-slate-400"
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-cyan-600 mb-2 font-bold">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={identity.email}
                  onChange={(e) => setIdentity((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full bg-white text-slate-900 px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all rounded-sm placeholder:text-slate-400"
                  placeholder="Ej. juan@ejemplo.com"
                />
              </div>

              {identityError && (
                <div className="p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-xs font-bold">
                  ⚠ {identityError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  className="flex-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 font-bold py-3 px-4 uppercase tracking-[0.2em] transition-all border border-cyan-500/40 text-[10px]"
                  onClick={() => {
                    setShowIdentity(false);
                  }}
                  disabled={submitting}
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black py-3 px-4 uppercase tracking-[0.2em] transition-all text-[10px] disabled:opacity-50"
                >
                  {submitting ? 'ENVIANDO...' : 'ENVIAR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-[#0a0a0a]/90 border-b border-cyan-500/30 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-fuchsia-500 animate-pulse"></span>
              <h1 className="text-sm font-black tracking-widest text-cyan-400 uppercase">SISTEMA_EVALUACIÓN</h1>
            </div>
            <p className="text-[10px] text-cyan-700 font-bold uppercase tracking-tighter">
              USER: {practicante?.nombre || 'ANÓNIMO'} // ID: {practicante?.id?.slice(0, 8) || 'UNREGISTERED'}
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <Timer 
              startTime={startTime} 
              durationMinutes={60} 
              onTimeUp={handleTimeUp} 
            />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-6 py-2 text-xs font-black uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(217,70,239,0.5)] disabled:opacity-50"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)' }}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>FINALIZAR</span>
                </div>
              )}
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-0.5 bg-cyan-900/30 w-full relative overflow-hidden">
          <div 
            className="h-full bg-linear-to-r from-cyan-600 to-cyan-400 transition-all duration-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
            style={{ width: `${((currentSectionIndex + 1) / TEST_DATA.length) * 100}%` }}
          />
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 flex overflow-x-auto bg-[#0a0a0a]/50">
          {TEST_DATA.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setCurrentSectionIndex(index)}
              className={`px-6 py-3 text-[10px] font-bold whitespace-nowrap border-b-2 transition-all duration-300 uppercase tracking-widest ${
                index === currentSectionIndex
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5'
                  : 'border-transparent text-cyan-900 hover:text-cyan-600 hover:bg-cyan-900/5'
              }`}
            >
              SEC_{index + 1}: {section.title.split(' ')[1] || 'GENERAL'}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <div className="bg-[#0a0a0a]/80 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-400"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan-400"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-400"></div>

          <div className="bg-cyan-950/20 px-8 py-5 border-b border-cyan-500/20 flex justify-between items-center">
            <h2 className="text-lg font-black text-cyan-300 tracking-widest uppercase">{currentSection.title}</h2>
            <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-tighter">MODULE_INDEX: 0{currentSectionIndex + 1}</span>
          </div>
          
          <div className="p-8 space-y-12">
            {currentSection.questions.map((question) => {
              const currentValue = respuestas[currentSection.id as keyof typeof respuestas]?.[question.id];
              
              return (
                <div key={question.id} className="pb-10 border-b border-cyan-900/30 last:border-0">
                  {question.type === 'multiple_choice' && (
                    <MultipleChoice
                      question={question}
                      value={currentValue}
                      onChange={(val) => setRespuesta(currentSection.id as any, question.id, val)}
                    />
                  )}
                  {question.type === 'text' && (
                    <TextQuestion
                      question={{
                        ...question,
                        type: question.type
                      }}
                      value={currentValue}
                      onChange={(val) => setRespuesta(currentSection.id as any, question.id, val)}
                    />
                  )}
                  {question.type === 'code' && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-cyan-100 uppercase tracking-wide flex items-center gap-3">
                        <span className="text-fuchsia-500">&gt;</span>
                        {question.question}
                      </h3>
                      <div className="border border-cyan-500/30 rounded-sm overflow-hidden">
                        <CodeEditor
                          value={currentValue || question.placeholder || ''}
                          onChange={(val) => setRespuesta(currentSection.id as any, question.id, val || '')}
                          language={question.codeLanguage}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-cyan-950/10 px-8 py-6 border-t border-cyan-500/20 flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentSectionIndex === 0}
              className={`flex items-center px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                currentSectionIndex === 0
                  ? 'border-cyan-950 text-cyan-950 cursor-not-allowed'
                  : 'border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10 hover:border-cyan-500'
              }`}
              style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%, 0 30%)' }}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              ANTERIOR
            </button>
            
            <button
              onClick={handleNext}
              className="flex items-center px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
              style={{ clipPath: 'polygon(0 0, 85% 0, 100% 30%, 100% 100%, 0 100%)' }}
            >
              {isLastSection ? 'FINALIZAR TEST' : 'SIGUIENTE SECCIÓN'}
              {!isLastSection && <ChevronRight className="w-4 h-4 ml-2" />}
            </button>
          </div>
        </div>
      </main>

      {/* Decorative footer elements */}
      <div className="fixed bottom-4 left-4 text-[8px] text-cyan-900 font-bold uppercase tracking-widest pointer-events-none">
        ENCRYPTED_LINK: ACTIVE // SECURE_HANDSHAKE: OK
      </div>
    </div>
  );
}
