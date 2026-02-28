export interface Practicante {
  id: string;
  nombre: string;
  email: string;
  created_at: string;
}

export type TestRespuesta = Record<string, Record<string, string>>;

export interface TestResultado {
  id: string;
  practicante_id: string;
  puntuacion_total: number;
  secciones: Record<string, number>;
  tiempo_minutos: number;
  completed_at: string;
  respuestas_completas: TestRespuesta;
}
