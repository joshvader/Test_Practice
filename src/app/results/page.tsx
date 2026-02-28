import Link from 'next/link';
import { CheckCircle, XCircle, Clock, AlertTriangle, Terminal } from 'lucide-react';
import { getTestData, resolveBankId } from '@/lib/questions';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) return null;
  const key = serviceRoleKey || anonKey;
  if (!key) return null;

  return createClient(url, key);
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }> | { id?: string };
}) {
  const resolvedSearchParams =
    searchParams && typeof (searchParams as any).then === 'function'
      ? await (searchParams as Promise<{ id?: string }>)
      : (searchParams as { id?: string });
  const id = resolvedSearchParams?.id;

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] font-mono text-cyan-500">
        <p className="text-red-500 font-bold uppercase tracking-widest animate-pulse">ERROR: MISSING_ID // ACCESS_DENIED</p>
      </div>
    );
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] font-mono text-cyan-500">
        <p className="text-red-500 font-bold uppercase tracking-widest animate-pulse">ERROR: SERVER_CONFIG // ACCESS_DENIED</p>
      </div>
    );
  }

  const { data: result, error } = await supabase
    .from('test_results')
    .select('*, practicantes(*)')
    .eq('id', id)
    .single();

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] font-mono text-cyan-500">
        <p className="text-red-500 font-bold uppercase tracking-widest animate-pulse">ERROR: DATA_CORRUPTED // SYSTEM_FAILURE</p>
      </div>
    );
  }

  const { practicantes: practicante, puntuacion_total, tiempo_minutos, respuestas_completas } = result;
  const bankId = resolveBankId((respuestas_completas as any)?._meta?.bankId);
  const testData = getTestData(bankId);

  // Calculate breakdown
  const sectionScores: Record<string, { score: number; max: number }> = {};
  
  testData.forEach((section) => {
    let score = 0;
    let max = 0;
    section.questions.forEach((q) => {
      if (q.type === 'multiple_choice' && q.correctOption !== undefined) {
        max += 10;
        const answer = (respuestas_completas as any)[section.id]?.[q.id];
        if (answer !== undefined && parseInt(answer) === q.correctOption) {
          score += 10;
        }
      }
    });
    sectionScores[section.id] = { score, max };
  });

  const totalMaxScore = Object.values(sectionScores).reduce((acc, curr) => acc + curr.max, 0);
  const percentage = totalMaxScore > 0 ? Math.round((puntuacion_total / totalMaxScore) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#020617] font-mono text-cyan-500 py-12 px-4 relative overflow-hidden">
      {/* Decorative background grid/elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#22d3ee 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-[#0a0a0a]/90 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] relative overflow-hidden backdrop-blur-md">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

          <div className="bg-cyan-950/30 p-8 text-center border-b border-cyan-500/30">
            <h1 className="text-3xl md:text-4xl font-black mb-2 text-transparent bg-clip-text bg-linear-to-r from-cyan-300 to-cyan-600 tracking-tighter" style={{ textShadow: '0 0 20px rgba(6,182,212,0.5)' }}>
              RESULTADOS DE EVALUACIÓN
            </h1>
            <p className="text-xs text-fuchsia-500 font-bold uppercase tracking-[0.3em]">
              TARGET: {practicante.nombre} // COMPLETED
            </p>
          </div>

          <div className="p-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-cyan-950/20 border border-cyan-500/30 p-6 text-center relative group hover:bg-cyan-900/20 transition-all">
                <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-500"></div>
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-2">SCORE_TOTAL</p>
                <p className="text-4xl font-black text-white group-hover:text-cyan-300 transition-colors" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
                  {puntuacion_total} <span className="text-lg text-cyan-600 font-normal">/ {totalMaxScore}</span>
                </p>
              </div>
              
              <div className="bg-fuchsia-950/10 border border-fuchsia-500/30 p-6 text-center relative group hover:bg-fuchsia-900/20 transition-all">
                <div className="absolute top-0 right-0 w-2 h-2 bg-fuchsia-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-fuchsia-500"></div>
                <p className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-widest mb-2">ACCURACY_RATE</p>
                <p className="text-4xl font-black text-white group-hover:text-fuchsia-300 transition-colors" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
                  {percentage}%
                </p>
              </div>

              <div className="bg-cyan-950/20 border border-cyan-500/30 p-6 text-center relative group hover:bg-cyan-900/20 transition-all">
                <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-500"></div>
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-2">TIME_ELAPSED</p>
                <p className="text-4xl font-black text-white flex items-center justify-center gap-2 group-hover:text-cyan-300 transition-colors" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
                  <Clock className="w-6 h-6 text-cyan-600" />
                  {tiempo_minutos}'
                </p>
              </div>
            </div>

            {/* Section Breakdown */}
            <h2 className="text-sm font-bold text-cyan-300 mb-6 uppercase tracking-widest flex items-center">
              <Terminal className="w-4 h-4 mr-2" />
              SYSTEM_DIAGNOSTIC // SECTOR_ANALYSIS
            </h2>
            <div className="space-y-6 mb-12">
              {testData.map((section) => {
                const { score, max } = sectionScores[section.id] || { score: 0, max: 0 };
                const sectionPercentage = max > 0 ? (score / max) * 100 : 0;
                
                // Determine color based on score
                const colorClass = sectionPercentage >= 70 ? 'cyan' : sectionPercentage >= 40 ? 'yellow' : 'red';
                const borderColor = sectionPercentage >= 70 ? 'border-cyan-500/50' : sectionPercentage >= 40 ? 'border-yellow-500/50' : 'border-red-500/50';
                const textColor = sectionPercentage >= 70 ? 'text-cyan-400' : sectionPercentage >= 40 ? 'text-yellow-400' : 'text-red-400';
                const barColor = sectionPercentage >= 70 ? 'bg-cyan-500' : sectionPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500';
                const glowColor = sectionPercentage >= 70 ? 'rgba(6,182,212,0.5)' : sectionPercentage >= 40 ? 'rgba(234,179,8,0.5)' : 'rgba(239,68,68,0.5)';
                
                return (
                  <div key={section.id} className={`border ${borderColor} bg-black/40 p-5 relative overflow-hidden`}>
                    {/* Background scanline effect */}
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/5 to-transparent opacity-20 pointer-events-none"></div>

                    <div className="flex justify-between items-center mb-3 relative z-10">
                      <h3 className="font-bold text-gray-200 uppercase tracking-wider text-xs md:text-sm">{section.title}</h3>
                      <span className={`px-2 py-1 border ${borderColor} ${textColor} text-[10px] font-bold uppercase tracking-widest bg-black/50`}>
                        {score} / {max} PTS
                      </span>
                    </div>
                    <div className="w-full bg-gray-900 h-2 relative z-10 border border-gray-800">
                      <div 
                        className={`h-full ${barColor} relative`}
                        style={{ 
                          width: `${sectionPercentage}%`,
                          boxShadow: `0 0 10px ${glowColor}`
                        }}
                      ></div>
                    </div>
                    {max === 0 && (
                      <p className="text-[10px] text-fuchsia-400 mt-2 italic flex items-center uppercase tracking-wide">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        PENDING_MANUAL_REVIEW // DATA_WAITING
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Feedback */}
            <div className="bg-cyan-950/10 border border-cyan-500/30 p-6 mb-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
              <h3 className="text-sm font-bold text-cyan-300 mb-3 uppercase tracking-widest">EVALUATION_SUMMARY // FINAL_OUTPUT</h3>
              {percentage >= 80 ? (
                <p className="text-green-400 flex items-start text-sm md:text-base">
                  <CheckCircle className="w-5 h-5 mr-3 mt-0.5 shrink-0 text-green-500" />
                  <span className="font-mono">STATUS: EXCELLENT. System optimization levels nominal. Core competencies validated.</span>
                </p>
              ) : percentage >= 60 ? (
                <p className="text-cyan-400 flex items-start text-sm md:text-base">
                  <CheckCircle className="w-5 h-5 mr-3 mt-0.5 shrink-0 text-cyan-500" />
                  <span className="font-mono">STATUS: SATISFACTORY. Functional parameters within acceptable range. Minor optimizations recommended.</span>
                </p>
              ) : (
                <p className="text-red-400 flex items-start text-sm md:text-base">
                  <XCircle className="w-5 h-5 mr-3 mt-0.5 shrink-0 text-red-500" />
                  <span className="font-mono">STATUS: CRITICAL. System integrity below threshold. Immediate recalibration of core concepts required.</span>
                </p>
              )}
              <p className="text-[10px] text-cyan-700 mt-4 uppercase tracking-wider border-t border-cyan-900/30 pt-2">
                NOTE: Manual review pending for qualitative data modules. Final grade subject to adjustment.
              </p>
            </div>

            <div className="text-center">
              <Link 
                href="/"
                className="inline-flex items-center justify-center bg-cyan-950 hover:bg-cyan-900 text-cyan-400 font-bold py-4 px-10 uppercase tracking-[0.2em] transition-all border border-cyan-500/50 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] text-xs group"
                style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
              >
                <span className="mr-2 group-hover:-translate-x-1 transition-transform">&lt;</span>
                RETURN_TO_ROOT
              </Link>
            </div>
          </div>
          
          {/* Footer Data */}
          <div className="bg-cyan-950/30 px-8 py-4 border-t border-cyan-500/20 flex justify-between text-[8px] text-cyan-800 font-bold uppercase tracking-wider">
            <span>LOG_ID: {id.slice(0, 8)}</span>
            <span>SESSION_CLOSED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
