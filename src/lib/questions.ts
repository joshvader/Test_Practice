export type QuestionType = 'multiple_choice' | 'text' | 'code';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For multiple choice
  correctOption?: number; // Index of correct option (0-3)
  codeLanguage?: string; // For code editor
  placeholder?: string;
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export const TEST_DATA: Section[] = [
  {
    id: 'seccion_1',
    title: 'I. PROGRAMACIÓN ORIENTADA A OBJETOS (TypeScript – Next.js)',
    questions: [
      {
        id: '1',
        type: 'multiple_choice',
        question: '¿Cuál es el propósito principal de una interface en TypeScript?',
        options: [
          'a) Crear estilos CSS',
          'b) Definir la estructura de un objeto',
          'c) Ejecutar consultas SQL',
          'd) Crear rutas en Next.js',
        ],
        correctOption: 1,
      },
      {
        id: '2',
        type: 'multiple_choice',
        question: '¿Qué ventaja aporta TypeScript en un proyecto Next.js?',
        options: [
          'a) Hace el código más rápido en ejecución',
          'b) Permite tipado estático y detección temprana de errores',
          'c) Elimina la necesidad de backend',
          'd) Reemplaza completamente JavaScript',
        ],
        correctOption: 1,
      },
      {
        id: '3',
        type: 'multiple_choice',
        question: 'En programación orientada a objetos, ¿qué principio permite reutilizar código?',
        options: [
          'a) Encapsulamiento',
          'b) Herencia',
          'c) Comentarios',
          'd) Compilación',
        ],
        correctOption: 1,
      },
      {
        id: '4',
        type: 'text',
        question: 'Explique qué es una interfaz en TypeScript y cómo la utilizó en su proyecto.',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '5',
        type: 'text',
        question: 'Describa cómo organizó las entidades o modelos dentro del proyecto Next.js.',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '6',
        type: 'text',
        question: '¿Cómo se conecta la capa de presentación (frontend) con los datos en una aplicación web moderna?',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '7',
        type: 'text',
        question: '¿Qué buenas prácticas aplicó en el desarrollo del proyecto?',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '8',
        type: 'code',
        question: 'Cree una interfaz en TypeScript para representar un “Usuario” con: id, nombre, email, rol. Explique cómo la usaría dentro de un componente.',
        codeLanguage: 'typescript',
        placeholder: '// Escriba su código aquí\n',
      },
    ],
  },
  {
    id: 'seccion_2',
    title: 'II. DESARROLLO DE APLICACIONES WEB (HTML, CSS, JavaScript)',
    questions: [
      {
        id: '9',
        type: 'multiple_choice',
        question: '¿Cuál es la función principal de HTML?',
        options: [
          'a) Dar estilo visual',
          'b) Crear lógica dinámica',
          'c) Estructurar el contenido',
          'd) Conectar bases de datos',
        ],
        correctOption: 2,
      },
      {
        id: '10',
        type: 'multiple_choice',
        question: '¿Qué propiedad de CSS permite trabajar con diseño flexible?',
        options: [
          'a) float',
          'b) flexbox',
          'c) script',
          'd) database',
        ],
        correctOption: 1,
      },
      {
        id: '11',
        type: 'multiple_choice',
        question: '¿Qué permite hacer JavaScript en una página web?',
        options: [
          'a) Crear estructura semántica',
          'b) Aplicar estilos visuales',
          'c) Agregar interactividad',
          'd) Diseñar bases de datos',
        ],
        correctOption: 2,
      },
      {
        id: '12',
        type: 'text',
        question: 'Explique la diferencia entre HTML, CSS y JavaScript.',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '13',
        type: 'text',
        question: '¿Cómo implementó elementos dinámicos en su proyecto con JavaScript?',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '14',
        type: 'text',
        question: '¿Qué buenas prácticas consideró en el diseño web?',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '15',
        type: 'code',
        question: 'Cree un pequeño ejemplo donde: HTML tenga un botón, JavaScript capture el evento click, CSS le dé estilo al botón. Explique qué hace cada parte del código.',
        codeLanguage: 'html',
        placeholder: '<!-- Escriba su código HTML, CSS y JS aquí -->\n',
      },
    ],
  },
  {
    id: 'seccion_3',
    title: 'III. COMPETENCIAS DE EMPLEABILIDAD',
    questions: [
      {
        id: '16',
        type: 'text',
        question: '¿Cómo gestionó el trabajo en equipo durante el desarrollo del proyecto?',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '17',
        type: 'text',
        question: '¿Cómo resolvió errores técnicos durante la programación?',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '18',
        type: 'text',
        question: '¿Qué herramientas tecnológicas utilizó?',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '19',
        type: 'text',
        question: '¿Cómo asegura la calidad y cumplimiento de plazos en sus proyectos?',
        placeholder: 'Escriba su respuesta aquí...',
      },
    ],
  },
];

export type QuestionBankId = 'next' | 'html';

export const DEFAULT_BANK_ID: QuestionBankId = 'next';

const getSectionById = (id: string) => TEST_DATA.find((s) => s.id === id);

export const QUESTION_BANKS: Record<QuestionBankId, Section[]> = {
  next: [getSectionById('seccion_1'), getSectionById('seccion_3')].filter(Boolean) as Section[],
  html: [getSectionById('seccion_2'), getSectionById('seccion_3')].filter(Boolean) as Section[],
};

export const QUESTION_BANK_LABELS: Record<QuestionBankId, string> = {
  next: 'Next.js',
  html: 'HTML/CSS/JS',
};

export function resolveBankId(value: unknown): QuestionBankId {
  return value === 'html' ? 'html' : 'next';
}

export function getTestData(bankId?: unknown): Section[] {
  const id = resolveBankId(bankId);
  return QUESTION_BANKS[id] || QUESTION_BANKS[DEFAULT_BANK_ID];
}
