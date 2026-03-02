import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getTestData, resolveBankId } from '@/lib/questions';
import { maxPointsForQuestion, pointsForQuestionAnswer } from '@/lib/scoring';

function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) return null;
  const key = serviceRoleKey || anonKey;
  if (!key) return null;

  return createClient(url, key);
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase no está configurado en el servidor.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { bankId, practicante_id, respuestas, tiempo_minutos, nombre, email } = body;
    const resolvedBankId = resolveBankId(bankId);
    const testData = getTestData(resolvedBankId);

    if (!respuestas) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let practicanteId = practicante_id as string | undefined;

    if (!practicanteId) {
      const nombreStr = String(nombre || '').trim();
      const emailStr = String(email || '').trim().toLowerCase();

      if (!nombreStr || !emailStr) {
        return NextResponse.json(
          { error: 'Faltan nombre y/o correo para asociar el resultado.' },
          { status: 400 }
        );
      }

      const { data: existing, error: existingError } = await supabase
        .from('practicantes')
        .select('id')
        .eq('email', emailStr)
        .maybeSingle();

      if (existingError) {
        return NextResponse.json(
          { error: 'Error consultando el correo.', details: existingError.message },
          { status: 500 }
        );
      }

      if (existing?.id) {
        practicanteId = existing.id;
      } else {
        const { data: created, error: createError } = await supabase
          .from('practicantes')
          .insert([{ nombre: nombreStr, email: emailStr }])
          .select()
          .single();

        if (createError) {
          const message = String(createError.message || '');
          if (createError.code === '42501' || message.toLowerCase().includes('row-level security')) {
            return NextResponse.json(
              {
                error: 'Permisos insuficientes para registrar el usuario (RLS).',
                details:
                  'Configura SUPABASE_SERVICE_ROLE_KEY en el servidor o crea una policy de INSERT/SELECT para anon en la tabla practicantes.',
              },
              { status: 403 }
            );
          }
          const status = createError.code === '23505' ? 409 : 500;
          return NextResponse.json(
            { error: 'No se pudo registrar el usuario.', details: createError.message },
            { status }
          );
        }

        practicanteId = created.id;
      }
    }

    // Calculate score
    let totalScore = 0;
    let maxScore = 0;
    const sectionScores: Record<string, number> = {};

    testData.forEach((section) => {
      let sectionScore = 0;
      let sectionMax = 0;

      section.questions.forEach((q) => {
        const questionMax = maxPointsForQuestion(q);
        sectionMax += questionMax;
        const userAnswer = respuestas?.[section.id]?.[q.id];
        sectionScore += pointsForQuestionAnswer(q, userAnswer);
      });

      sectionScores[section.id] = sectionScore;
      totalScore += sectionScore;
      maxScore += sectionMax;
    });

    const scorePercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    
    // Save to DB
    const { data, error } = await supabase
      .from('test_results')
      .insert([
        {
          practicante_id: practicanteId,
          puntuacion_total: scorePercent,
          tiempo_minutos,
          respuestas_completas: {
            ...(respuestas || {}),
            _meta: {
              bankId: resolvedBankId,
              score: { raw: totalScore, max: maxScore, percent: scorePercent },
            },
          },
        },
      ])
      .select()
      .single();

    if (error) {
      const message = String(error.message || '');
      if (error.code === '42501' || message.toLowerCase().includes('row-level security')) {
        return NextResponse.json(
          {
            error: 'Permisos insuficientes para guardar el resultado (RLS).',
            details:
              'Configura SUPABASE_SERVICE_ROLE_KEY en el servidor o crea una policy de INSERT para anon en la tabla test_results.',
          },
          { status: 403 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      test_id: data.id,
      score_percent: scorePercent,
      score_raw: totalScore,
      score_max: maxScore,
      sectionScores,
    });

  } catch (error: any) {
    console.error('Error submitting test:', error);
    return NextResponse.json(
      { error: 'Error al enviar el test', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
