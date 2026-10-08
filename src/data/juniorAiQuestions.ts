import { Question } from '../types/quiz';

export const JUNIOR_AI_QUESTIONS: Question[] = [
  {
    id: 'ai-03',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es una "alucinación" en un modelo de lenguaje de Inteligencia Artificial (LLM)?',
    codeLanguage: 'text',
    codeSnippet: 'Alucinación de IA (Hallucination)',
    options: [
      'Cuando el modelo genera información falsa, inventa librerías o métodos que no existen con absoluta apariencia de seguridad y certeza.',
      'Cuando el servidor de la IA se queda sin memoria RAM y se reinicia.',
      'Cuando el modelo genera código en más de tres lenguajes simultáneamente.',
      'Un virus que altera los colores de la pantalla en el editor de código.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Los LLMs son modelos probabilísticos que predicen el siguiente token más probable, no bases de conocimiento infalibles. Pueden inventar paquetes de npm inexistentes, parámetros de funciones inventados o URLs ficticias.',
    proTip: 'Regla de oro: NUNCA copies y pegues ciegamente código de una IA en tu proyecto sin leerlo, entenderlo y verificar que las funciones realmente existan en la documentación oficial.'
  },
  {
    id: 'ai-04',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Cuál es el riesgo de seguridad más grave al interactuar con herramientas de IA públicas como ChatGPT o Claude?',
    codeLanguage: 'text',
    codeSnippet: 'Prompt: "Aquí está mi archivo config con la clave de producción AIzaSy... arréglame este error"',
    options: [
      'Enviar credenciales reales, claves de API privadas, datos confidenciales o código propietario de la empresa, ya que pueden ser almacenados o filtrados.',
      'Que la IA consuma todo el ancho de banda de internet de tu casa.',
      'Que el archivo de texto cambie de codificación a UTF-16.',
      'Que el teclado deje de responder.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Muchas empresas e ingenieros han sufrido filtraciones graves por pegar archivos de configuración con contraseñas o datos reales de clientes en chats de IA. Siempre anonimiza y reemplaza secretos con valores ficticios (`"MI_CLAVE_AQUI"`).',
    proTip: 'En el trabajo, consulta la política de IA de tu empresa antes de compartir código de repositorios privados.'
  },
  {
    id: 'ai-05',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo se formula un "Prompt" eficaz cuando le pides a una IA que te ayude a resolver un bug en tu código?',
    codeLanguage: 'text',
    codeSnippet: 'Estructura de Prompt Profesional',
    options: [
      'Proporcionar el lenguaje/framework exacto, el fragmento de código relevante, el mensaje de error completo y el comportamiento esperado.',
      'Escribir únicamente "no me funciona, arréglalo rápido".',
      'Copiar todo el proyecto entero de 50 archivos sin explicar qué pasa.',
      'Escribir el prompt todo en mayúsculas.'
    ],
    correctAnswerIndex: 0,
    explanation: 'La calidad de la respuesta de la IA depende del contexto proporcionado. Incluir el stack (ej. "React 19 + TypeScript"), el snippet exacto, el stacktrace del error y qué intentabas lograr produce respuestas precisas y útiles.',
    proTip: 'Fórmula ganadora: [Rol/Contexto] + [Código] + [Error exacto] + [Comportamiento esperado].'
  },
  {
    id: 'ai-06',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es la "Ventana de Contexto" (Context Window) de un modelo de IA generativa?',
    codeLanguage: 'text',
    codeSnippet: 'Tokens de entrada + Tokens de salida',
    options: [
      'La cantidad máxima de tokens (texto, código e instrucciones) que el modelo puede procesar y recordar en una sola conversación o solicitud.',
      'La ventana emergente que se abre en el navegador web.',
      'El tamaño en píxeles del monitor del programador.',
      'El tiempo en segundos que tarda en responder la API.'
    ],
    correctAnswerIndex: 0,
    explanation: 'La ventana de contexto mide el límite de memoria a corto plazo del modelo. Si una conversación o base de código es más larga que la ventana de contexto, el modelo olvidará los mensajes más antiguos o truncará la entrada.',
    proTip: 'Modelos modernos como Gemini 1.5/2.0 cuentan con ventanas de hasta 1 a 2 millones de tokens, capaces de analizar repositorios enteros de código.'
  },
  {
    id: 'ai-07',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo puede un programador junior usar la IA de forma inteligente para APRENDER en lugar de solo copiar código?',
    codeLanguage: 'text',
    codeSnippet: '"Explícame línea por línea qué hace esta función y por qué..."',
    options: [
      'Pidiéndole que explique conceptos difíciles con analogías sencillas, que desglose código línea por línea o que sugiera preguntas de entrevista sobre el tema.',
      'Pidiéndole que resuelva la prueba técnica y enviándola sin mirarla.',
      'Desactivando el editor de código para no escribir nunca más.',
      'Memorizando las respuestas textuales de la IA.'
    ],
    correctAnswerIndex: 0,
    explanation: 'La IA es un tutor personal paciente 24/7. Preguntas como "¿Por qué se usa un Set aquí en lugar de un Array?" o "¿Qué problemas de rendimiento tiene mi función?" aceleran el aprendizaje exponencialmente.',
    proTip: 'Prueba este prompt: "Actúa como un Tech Lead senior y hazme una revisión de código (code review) constructiva de este componente".'
  },
  {
    id: 'ai-08',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es un "Token" en el contexto de los modelos de procesamiento de lenguaje natural y código?',
    codeLanguage: 'text',
    codeSnippet: '1 Token ≈ 4 caracteres en inglés (~0.75 palabras)',
    options: [
      'La unidad básica de texto (trozo de palabra, carácter o símbolo de código) en la que los modelos dividen y procesan la información.',
      'Una moneda física para comprar computadoras.',
      'Un tipo de dato primitivo en TypeScript.',
      'Una contraseña de un solo uso por SMS.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Los LLMs no leen letras individuales ni palabras completas, sino "tokens". En código fuente, una palabra reservada como `function` o símbolos como `=>` suelen ser uno o más tokens según el tokenizador del modelo.',
    proTip: 'Las APIs de IA facturan tanto los tokens de entrada (tu prompt) como los tokens de salida generados.'
  },
  {
    id: 'ai-09',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué problema puede ocurrir si le pides a una IA que genere una librería para una tarea sencilla de dos líneas?',
    codeLanguage: 'json',
    codeSnippet: '// package.json\n"dependencies": {\n    "is-even-fast-ai": "^1.0.0"\n}',
    options: [
      'Riesgo de "Alucinación de Paquetes" (Package Hallucination / Slopsquatting), donde la IA recomienda un paquete inexistente que atacantes pueden registrar para inyectar malware.',
      'Que la computadora gaste el doble de electricidad.',
      'Que el código se vuelva automáticamente compatible con Python.',
      'Que npm borre tu cuenta de usuario.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Investigaciones de ciberseguridad han demostrado que las IAs a veces inventan nombres verosímiles de paquetes. Los atacantes registran esos paquetes en npm o PyPI con código malicioso esperando que desarrolladores los instalen.',
    proTip: 'Verifica siempre en npmjs.com o pypi.org la reputación, descargas semanales y autor de cualquier librería antes de hacer npm install.'
  },
  {
    id: 'ai-10',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Para qué tarea de desarrollo es especialmente útil y fiable la asistencia de IA para un programador?',
    codeLanguage: 'text',
    codeSnippet: 'Generación de Pruebas Unitarias (Unit Tests)',
    options: [
      'Escribir casos de prueba unitarios (tests con Jest, Vitest o Pytest) cubriendo casos límite (edge cases) como valores nulos o arrays vacíos.',
      'Tomar decisiones financieras críticas de la empresa.',
      'Reemplazar a los clientes en la definición de requisitos.',
      'Configurar la seguridad física de los servidores.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Escribir tests es ideal para IAs: la lógica esperada está bien acotada y los tests generados son verificables de inmediato por el framework de pruebas. La IA destaca encontrando casos bordes que al humano se le pasaron por alto.',
    proTip: 'Pídele a la IA: "Escribe pruebas unitarias con Vitest para esta función, incluyendo casos válidos, valores nulos y entradas inválidas".'
  },
  {
    id: 'ai-11',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es el "System Prompt" o Instrucción del Sistema en una aplicación basada en LLMs?',
    codeLanguage: 'text',
    codeSnippet: 'System: "Eres un tutor paciente de programación para principiantes..."',
    options: [
      'Una directiva previa que define la personalidad, restricciones, formato de salida y reglas de comportamiento del modelo antes de que el usuario hable.',
      'El sistema operativo Linux donde corre la IA.',
      'El comando de terminal para instalar Node.js.',
      'Un mensaje de error del BIOS.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El System Prompt establece el marco de referencia del modelo. Guía cómo debe responder, qué tono usar, qué tecnologías priorizar y qué temas o conductas tiene prohibido abordar.',
    proTip: 'En la API de Google Gemini o OpenAI se configura mediante el parámetro `systemInstruction`.'
  },
  {
    id: 'ai-12',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué significa "Few-Shot Prompting" en la técnica de formulación de prompts?',
    codeLanguage: 'text',
    codeSnippet: 'Ejemplo 1: Entrada -> Salida\nEjemplo 2: Entrada -> Salida\nAhora resuelve esto: Entrada -> ?',
    options: [
      'Proporcionar al modelo unos pocos ejemplos de entrada y salida deseada dentro del prompt para que comprenda el formato exacto requerido.',
      'Hacer una sola pregunta sin dar contexto alguno (Zero-Shot).',
      'Disparar varias peticiones simultáneas por HTTP.',
      'Entrenar el modelo desde cero con millones de datos.'
    ],
    correctAnswerIndex: 0,
    explanation: 'En lugar de solo explicar las reglas con palabras, darle 1 o 2 ejemplos concretos ("Entrada: ' + 'hola' + ' -> Salida: ' + 'HOLA' + '") aumenta drásticamente la precisión del resultado en tareas complejas.',
    proTip: 'Es la técnica más rápida para lograr que una IA responda en formatos estructurados como JSON estricto.'
  },
  {
    id: 'ai-13',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Por qué NUNCA se debe colocar una clave de API de Gemini u OpenAI directamente en el código frontend de una web pública?',
    codeLanguage: 'javascript',
    codeSnippet: '// src/App.tsx (Frontend público)\nconst apiKey = "AIzaSyD5f...MiClavePrivada";\nconst res = await fetch("https://generativelanguage.googleapis.com/...", ...);',
    options: [
      'Cualquier usuario puede ver el código fuente en su navegador, robar tu clave de API, agotar tu cuota o generar costos imprevistos a tu cuenta.',
      'Porque React no soporta llamadas a APIs de Google.',
      'Porque el navegador se apaga si detecta claves.',
      'Porque el compilador TypeScript cambia la clave a mayúsculas.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Todo el código que se envía al navegador del usuario (HTML, JS, bundle de Vite/Webpack) es público y legible en la pestaña Network o Sources de las DevTools. Las claves de API deben residir en un backend seguro (Node, Python, proxy /api/*).',
    proTip: 'Usa una ruta en tu servidor backend que actúe como intermediario y guarde la clave en variables de entorno seguras (.env en el servidor).'
  },
  {
    id: 'ai-14',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es RAG (Retrieval-Augmented Generation / Generación Aumentada por Recuperación)?',
    codeLanguage: 'text',
    codeSnippet: 'Base de Conocimiento -> Búsqueda -> Prompt con Contexto -> Respuesta IA',
    options: [
      'Una técnica que busca documentos relevantes en una base de datos propia y se los inyecta al modelo en el prompt para que responda con datos actualizados y verídicos.',
      'Un nuevo tipo de memoria RAM para ordenadores portátiles.',
      'Un algoritmo para comprimir imágenes PNG.',
      'Un framework de CSS similar a Tailwind.'
    ],
    correctAnswerIndex: 0,
    explanation: 'RAG permite que la IA responda sobre documentos internos de tu empresa (manuales, PDFs, bases de datos) sin necesidad de re-entrenar el modelo, evitando alucinaciones y garantizando datos vigentes.',
    proTip: 'RAG combina bases de datos vectoriales (como pgvector o Pinecone) con LLMs.'
  },
  {
    id: 'ai-15',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia entre "Temperatura 0.0" y "Temperatura 1.0" al configurar una API de IA generativa?',
    codeLanguage: 'json',
    codeSnippet: '{\n  "temperature": 0.0 // vs 1.0\n}',
    options: [
      'Temperatura 0 produce respuestas más deterministas, precisas y predecibles (ideal para código); temperatura alta (1.0) produce respuestas más creativas y variadas.',
      'Temperatura 0 mide el calor del ventilador de la tarjeta gráfica.',
      'Temperatura 1 hace que la respuesta tarde 1 hora en generarse.',
      'Son parámetros obsoletos que no afectan el resultado.'
    ],
    correctAnswerIndex: 0,
    explanation: 'La temperatura controla la aleatoriedad en la selección de tokens. Para tareas técnicas estrictas como escribir código o formatear JSON se recomienda temperatura baja (0.0 a 0.2) para evitar variaciones erráticas.',
    proTip: 'Para escribir código o resolver tests: mantén temperature en 0 o 0.1.'
  },
  {
    id: 'ai-16',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo puede un asistente de código (Cursor, GitHub Copilot) acelerar tareas repetitivas de un desarrollador?',
    codeLanguage: 'text',
    codeSnippet: 'Autocompletado inteligente & refactorización',
    options: [
      'Autocompletando código boilerplate repetitivo, generando interfaces a partir de datos JSON de ejemplo y proponiendo firmas de funciones.',
      'Asistiendo a reuniones de Scrum en lugar del programador.',
      'Firmando contratos laborales de forma autónoma.',
      'Comprando dominios web sin autorización.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Los asistentes de código son multiplicadores de productividad: ahorran tiempo escribiendo código rutinario (mapeos de DTOs, validaciones, comentarios JSDoc) permitiendo que el desarrollador se concentre en la arquitectura y la lógica de negocio.',
    proTip: 'Usa comentarios claros para guiar el autocompletado: `// Función para validar si un RFC mexicano es válido`.'
  },
  {
    id: 'ai-17',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es "Chain-of-Thought Prompting" (Cadena de Pensamiento)?',
    codeLanguage: 'text',
    codeSnippet: '"Paso 1: Analiza... Paso 2: Deduce... Paso 3: Concluye..."',
    options: [
      'Pedirle explícitamente a la IA que "piense paso a paso" antes de dar la respuesta final, lo cual mejora significativamente su razonamiento lógico y precisión matemática.',
      'Conectar varios servidores en cadena con cables de red.',
      'Un tipo de bucle for encadenado en JavaScript.',
      'Una cadena de bloques en criptomonedas.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Indicarle al modelo frases como "Piensa paso a paso y justifica cada conclusión" fuerza al LLM a generar tokens de razonamiento intermedio, reduciendo drásticamente los errores en problemas lógicos y de programación complejos.',
    proTip: 'Agregar "Explica tu razonamiento paso a paso antes de mostrar el código final" ayuda a descubrir falacias lógicas antes de implementar.'
  },
  {
    id: 'ai-18',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: 'En entrevistas para juniors: ¿Cómo debes abordar el uso de herramientas de IA durante tu desarrollo diario?',
    codeLanguage: 'text',
    codeSnippet: 'Mentalidad Profesional con IA',
    options: [
      'Presentar la IA como una herramienta de amplificación de productividad y aprendizaje, siendo tú el responsable final que valida, comprende, testea y asume la autoría del código.',
      'Ocultar que usas IA para que piensen que te sabes toda la sintaxis de memoria.',
      'Decir que la IA hace el 100% de tu trabajo y que tú no sabes programar.',
      'Prohibir que otros usen IA en la empresa.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Las empresas buscan desarrolladores que aprovechen las herramientas modernas para ser más ágiles, pero que posean el criterio técnico y los fundamentos sólidos para detectar errores, auditar seguridad y garantizar calidad.',
    proTip: 'Tú eres el piloto y la IA es el copiloto; la responsabilidad del vuelo siempre es tuya.'
  },
  {
    id: 'ai-19',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué significa que un LLM tenga una salida en formato "JSON Mode" o "Structured Outputs"?',
    codeLanguage: 'json',
    codeSnippet: '{\n  "status": "success",\n  "errorFound": false\n}',
    options: [
      'Garantiza por contrato sintáctico que el modelo responderá exclusivamente con un JSON válido y parseable, sin texto conversacional introductorio ni markdown.',
      'Que el modelo solo puede hablar en lenguaje binario.',
      'Que la salida se guarda en un disquete de 3.5 pulgadas.',
      'Que el navegador debe cerrar la sesión.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El modo JSON estructurado (Structured Outputs) obliga al decodificador del modelo a ceñirse a una gramática o esquema JSON Schema estricto. Esto previene que tus APIs crasheen con SyntaxError al parsear la respuesta con JSON.parse().',
    proTip: 'Tanto la API de Google Gemini como OpenAI permiten pasar `responseSchema` para forzar estructuras de datos estrictas.'
  },
  {
    id: 'ai-20',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué actitud o error de mentalidad puede frenar el crecimiento profesional de un programador junior que usa IA intensivamente?',
    codeLanguage: 'text',
    codeSnippet: 'Trampa del "Copy-Paste sin entendimiento"',
    options: [
      'Aceptar código que funciona por casualidad sin entender el "por qué" ni los conceptos subyacentes, creando una falsa sensación de competencia que colapsa ante problemas nuevos.',
      'Leer la documentación oficial de las librerías.',
      'Hacer preguntas técnicas a compañeros seniors.',
      'Escribir pruebas unitarias que verifiquen el código.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Si delegas el pensamiento y solo actúas como operador de copy-paste, nunca desarrollarás la intuición de depuración, la comprensión de arquitectura ni la capacidad de diseñar soluciones bajo presión. Usa la IA para entender profundamente, no solo para terminar rápido.',
    proTip: 'Siempre que una IA te dé una solución que no entiendas, pregúntale: "¿Por qué elegiste este enfoque en lugar de [alternativa] y qué desventajas tiene?".'
  }
];
