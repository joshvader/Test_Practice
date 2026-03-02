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
  {
    id: 'db_seccion_1',
    title: 'I. FUNDAMENTOS DE BASE DE DATOS RELACIONALES',
    questions: [
      {
        id: '1',
        type: 'multiple_choice',
        question: '¿Qué es una base de datos relacional?',
        options: [
          'a) Un sistema para diseñar páginas web',
          'b) Un conjunto de tablas relacionadas entre sí',
          'c) Un archivo de texto plano',
          'd) Un servidor de aplicaciones',
        ],
        correctOption: 1,
      },
      {
        id: '2',
        type: 'multiple_choice',
        question: '¿Cuál es la función de una clave primaria (Primary Key)?',
        options: [
          'a) Permitir datos duplicados',
          'b) Identificar de manera única cada registro',
          'c) Crear relaciones automáticas',
          'd) Ordenar la tabla',
        ],
        correctOption: 1,
      },
      {
        id: '3',
        type: 'multiple_choice',
        question: '¿Qué es una clave foránea (Foreign Key)?',
        options: [
          'a) Una columna decorativa',
          'b) Un identificador externo sin relación',
          'c) Una columna que establece relación entre tablas',
          'd) Un índice de búsqueda',
        ],
        correctOption: 2,
      },
      {
        id: '4',
        type: 'text',
        question: 'Explique qué es un modelo entidad-relación y cuál es su importancia.',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '5',
        type: 'text',
        question: 'Describa cómo diseñó la estructura de tablas en su proyecto.',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '6',
        type: 'text',
        question: '¿Qué criterios utilizó para definir claves primarias y foráneas?',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '7',
        type: 'text',
        question: 'Explique qué es la normalización y hasta qué forma normal trabajó.',
        placeholder: 'Escriba su respuesta aquí...',
      },
    ],
  },
  {
    id: 'db_seccion_2',
    title: 'II. CONSULTAS Y MANIPULACIÓN DE DATOS (SQL)',
    questions: [
      {
        id: '8',
        type: 'multiple_choice',
        question: '¿Qué comando se utiliza para obtener datos de una tabla?',
        options: ['a) INSERT', 'b) SELECT', 'c) UPDATE', 'd) DELETE'],
        correctOption: 1,
      },
      {
        id: '9',
        type: 'multiple_choice',
        question: '¿Qué cláusula permite filtrar resultados?',
        options: ['a) ORDER BY', 'b) WHERE', 'c) GROUP', 'd) CREATE'],
        correctOption: 1,
      },
      {
        id: '10',
        type: 'multiple_choice',
        question: '¿Qué hace la instrucción JOIN?',
        options: [
          'a) Elimina tablas',
          'b) Une registros de dos o más tablas relacionadas',
          'c) Crea usuarios',
          'd) Borra registros duplicados',
        ],
        correctOption: 1,
      },
      {
        id: '11',
        type: 'text',
        question: 'Explique la diferencia entre INSERT, UPDATE y DELETE.',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '12',
        type: 'text',
        question: '¿Cómo implementó consultas para obtener información específica en su proyecto?',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '13',
        type: 'text',
        question: '¿Qué tipo de relaciones utilizó? (1:1, 1:N, N:M)',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '14',
        type: 'text',
        question: '¿Cómo aseguró la integridad de los datos?',
        placeholder: 'Escriba su respuesta aquí...',
      },
    ],
  },
  {
    id: 'db_seccion_3',
    title: 'III. ADMINISTRACIÓN Y BUENAS PRÁCTICAS',
    questions: [
      {
        id: '15',
        type: 'text',
        question: '¿Qué es un índice y para qué se utiliza?',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '16',
        type: 'text',
        question: '¿Qué medidas tomó para optimizar consultas SQL?',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '17',
        type: 'text',
        question: '¿Cómo protegió la base de datos frente a errores o ataques (ej: inyección SQL)?',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '18',
        type: 'text',
        question: '¿Qué sistema gestor de base de datos utilizó? (MySQL, PostgreSQL, etc.)',
        placeholder: 'Escriba su respuesta aquí...',
      },
      {
        id: '19',
        type: 'text',
        question: '¿Cómo conectó el backend con la base de datos?',
        placeholder: 'Escriba su respuesta aquí...',
      },
    ],
  },
  {
    id: 'db_seccion_4',
    title: 'IV. EJERCICIO PRÁCTICO',
    questions: [
      {
        id: '20',
        type: 'code',
        question:
          'Diseñe las tablas necesarias para un sistema simple de: Usuarios, Proyectos, y relación entre usuarios y proyectos. Incluya claves primarias, claves foráneas y tipo de relación.',
        codeLanguage: 'sql',
        placeholder:
          '-- Escriba su diseño aquí\n-- Sugerencia: defina tablas usuarios, proyectos y una tabla intermedia usuarios_proyectos\n',
      },
    ],
  },
];

export type QuestionBankId = 'next' | 'html' | 'db';

export const DEFAULT_BANK_ID: QuestionBankId = 'next';

const getSectionById = (id: string) => TEST_DATA.find((s) => s.id === id);

export const QUESTION_BANKS: Record<QuestionBankId, Section[]> = {
  next: [getSectionById('seccion_1'), getSectionById('seccion_3')].filter(Boolean) as Section[],
  html: [getSectionById('seccion_2'), getSectionById('seccion_3')].filter(Boolean) as Section[],
  db: [
    getSectionById('db_seccion_1'),
    getSectionById('db_seccion_2'),
    getSectionById('db_seccion_3'),
    getSectionById('db_seccion_4'),
    getSectionById('seccion_3'),
  ].filter(Boolean) as Section[],
};

export const QUESTION_BANK_LABELS: Record<QuestionBankId, string> = {
  next: 'Next.js',
  html: 'HTML/CSS/JS',
  db: 'Base de Datos',
};

export function resolveBankId(value: unknown): QuestionBankId {
  if (value === 'html') return 'html';
  if (value === 'db') return 'db';
  return 'next';
}

export function getTestData(bankId?: unknown): Section[] {
  const id = resolveBankId(bankId);
  return QUESTION_BANKS[id] || QUESTION_BANKS[DEFAULT_BANK_ID];
}
