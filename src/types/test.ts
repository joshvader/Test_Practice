export interface Practicante {
  id: string;
  nombre: string;
  email: string;
  created_at: string;
}

export interface TestRespuesta {
  seccion_1: {
    [key: string]: string;
  };
  seccion_2: {
    [key: string]: string;
  };
  seccion_3: {
    [key: string]: string;
  };
}

export interface TestResultado {
  id: string;
  practicante_id: string;
  puntuacion_total: number;
  secciones: {
    seccion_1: number;
    seccion_2: number;
    seccion_3: number;
  };
  tiempo_minutos: number;
  completed_at: string;
  respuestas_completas: TestRespuesta;
}
