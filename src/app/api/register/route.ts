import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

type RegisterBody = {
  nombre?: string;
  email?: string;
};

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

    const body = (await request.json()) as RegisterBody;
    const nombre = (body.nombre || '').trim();
    const email = (body.email || '').trim().toLowerCase();

    if (!nombre || !email) {
      return NextResponse.json(
        { error: 'Por favor completa todos los campos.' },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } = await supabase
      .from('practicantes')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { error: 'Error consultando el correo.', details: existingError.message },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: 'Este correo electrónico ya ha sido registrado.' },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from('practicantes')
      .insert([{ nombre, email }])
      .select()
      .single();

    if (error) {
      const status = error.code === '23505' ? 409 : 500;
      return NextResponse.json(
        { error: 'No se pudo registrar el usuario.', details: error.message },
        { status }
      );
    }

    return NextResponse.json({ practicante: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Error interno del servidor.', details: e?.message || String(e) },
      { status: 500 }
    );
  }
}
