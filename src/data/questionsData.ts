import { CategoryInfo, Question } from '../types/quiz';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'python',
    name: 'Python Moderno',
    icon: '🐍',
    color: '#38bdf8',
    description: 'Sintaxis 3.12+, tipado, decoradores, asyncio y FastAPI/Pydantic.',
    tag: 'Python 3.12+',
  },
  {
    id: 'php',
    name: 'PHP 8+ & OOP',
    icon: '🐘',
    color: '#a855f7',
    description: 'PHP 8.2/8.3, constructor promotion, readonly classes y Laravel/Symfony.',
    tag: 'PHP 8.3',
  },
  {
    id: 'javascript',
    name: 'JavaScript Core',
    icon: '⚡',
    color: '#facc15',
    description: 'Event Loop, microtasks, closures, prototipos y ES2024+ features.',
    tag: 'ES2024',
  },
  {
    id: 'typescript',
    name: 'TypeScript Avanzado',
    icon: '🔷',
    color: '#3b82f6',
    description: 'Generics, conditional types, infer, mapped types y operador satisfies.',
    tag: 'TS 5.4+',
  },
  {
    id: 'react',
    name: 'React & Ecosystem',
    icon: '⚛️',
    color: '#06b6d4',
    description: 'React 19, Server Components, Hooks, reconciliación y optimización.',
    tag: 'React 19',
  },
  {
    id: 'modern_fundamentals',
    name: 'Fundamentos Modernos',
    icon: '🏛️',
    color: '#10b981',
    description: 'SOLID, Clean Architecture, Git internals, REST vs GraphQL y patrones.',
    tag: 'Architecture',
  },
  {
    id: 'ai_assistance',
    name: 'IA para Programadores',
    icon: '🤖',
    color: '#f43f5e',
    description: 'Técnicas de prompting, Cursor/Copilot, alucinaciones y seguridad en código.',
    tag: 'AI Dev Tools',
  },
];

export const QUESTIONS_DATA: Question[] = [
  // 1. PYTHON
  {
    id: 'py-01',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Mid',
    type: 'find_the_bug',
    title: '¿Cuál es el bug crítico de diseño en la siguiente función con parámetros por defecto?',
    codeLanguage: 'python',
    codeSnippet: `def registrar_evento(evento: str, log: list[str] = []) -> list[str]:
    log.append(evento)
    return log

print(registrar_evento("A")) # ['A']
print(registrar_evento("B")) # ¿Qué imprime?`,
    options: [
      "Lanza un TypeError porque list[str] no se puede instanciar como default.",
      "Imprime ['A', 'B'] en la segunda llamada porque la lista por defecto es mutable y compartida entre llamadas.",
      "Imprime ['B'] porque el default argument se reevalúa en cada invocación.",
      "Genera un MemoryLeak porque las listas no tienen garbage collection en Python 3."
    ],
    correctAnswerIndex: 1,
    explanation: "En Python, las expresiones de argumentos por defecto se evalúan una sola vez al definir la función, no en cada llamada. Si el valor por defecto es un objeto mutable (como una lista o diccionario), todas las invocaciones que no pasen el argumento compartirán la misma instancia en memoria.",
    proTip: "La solución canónica es usar 'log: list[str] | None = None' y hacer 'if log is None: log = []'."
  },
  {
    id: 'py-02',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En asyncio moderno de Python 3.11+, ¿cuál es la ventaja de `asyncio.TaskGroup` sobre `asyncio.gather`?',
    codeLanguage: 'python',
    codeSnippet: `async def main():
    async with asyncio.TaskGroup() as tg:
        t1 = tg.create_task(tarea_red())
        t2 = tg.create_task(tarea_disco())`,
    options: [
      "TaskGroup ejecuta las corrutinas en hilos nativos del sistema operativo sin el GIL.",
      "Implementa Structured Concurrency: si una tarea falla, cancela automáticamente las demás y agrupa excepciones en ExceptionGroup.",
      "Solo sirve para limitar el número de tareas concurrentes a un máximo estricto de 10.",
      "TaskGroup es síncrono y bloquea el event loop hasta que todas las tareas finalizan."
    ],
    correctAnswerIndex: 1,
    explanation: "Python 3.11 introdujo TaskGroup y ExceptionGroup para adoptar Structured Concurrency. Si una tarea dentro del bloque 'async with' lanza un error, todas las demás tareas pendientes se cancelan inmediatamente, evitando tareas huérfanas que sigan consumiendo recursos.",
    proTip: "Evita asyncio.gather en código nuevo si requieres manejo estricto de cancelación y errores encadenados."
  },
  {
    id: 'py-03',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'true_false',
    title: 'En Python 3.10+, la sintaxis de unión de tipos `int | str` reemplaza oficialmente la necesidad de importar `Union` de `typing`.',
    options: [
      "Verdadero (Syntactic Sugar soportado nativamente por el operador bitwise OR |).",
      "Falso (Solo funciona dentro de docstrings y no en tiempo de inspección)."
    ],
    correctAnswerIndex: 0,
    explanation: "PEP 604 introdujo el operador | para tipos de unión en Python 3.10. Permite escribir 'int | str' en lugar de 'Union[int, str]', siendo más legible y limpio sin requerir imports adicionales.",
    proTip: "Si necesitas compatibilidad con versiones previas, puedes usar 'from __future__ import annotations'."
  },

  // 2. PHP
  {
    id: 'php-01',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Mid',
    type: 'multiple_choice',
    title: '¿Qué característica moderna de PHP 8.0 simplifica la inicialización de propiedades en clases?',
    codeLanguage: 'php',
    codeSnippet: `class UsuarioDTO {
    public function __construct(
        public readonly string $id,
        public readonly string $email,
        public readonly int $edad = 18
    ) {}
}`,
    options: [
      "Property Promotion (Constructor Promotion) junto con propiedades readonly.",
      "Anonymous Classes con auto-getters generados por el motor Zend.",
      "Dynamic Attribute Binding introducido en PHP 7.4.",
      "Virtual Properties de Symfony Components."
    ],
    correctAnswerIndex: 0,
    explanation: "Constructor Property Promotion (PHP 8.0) permite declarar los modificadores de visibilidad (public/private/protected) y 'readonly' (PHP 8.1) directamente en la firma del constructor, asignándolos automáticamente sin necesidad de repetirlos como propiedades de clase ni en el cuerpo del constructor.",
    proTip: "En PHP 8.2 puedes declarar directamente 'readonly class UsuarioDTO' si todas sus propiedades son de solo lectura."
  },
  {
    id: 'php-02',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Cuál es la diferencia crítica entre la expresión `match` de PHP 8 y la estructura `switch` tradicional?',
    codeLanguage: 'php',
    codeSnippet: `$resultado = match($status) {
    200, 201 => 'OK',
    '404' => 'No Encontrado',
    default => 'Error'
};`,
    options: [
      "`match` realiza comparación estricta (===), no requiere 'break' para evitar fallthrough y retorna un valor como expresión.",
      "`match` realiza coerción de tipos débil (==) igual que `switch`, pero es más lento.",
      "`match` solo permite comparar enteros y falla si recibe strings.",
      "`match` no admite la rama 'default'."
    ],
    correctAnswerIndex: 0,
    explanation: "A diferencia de 'switch' (que usa comparación débil == y sufre de fallthrough sin 'break'), 'match' es una expresión que devuelve un valor, evalúa con identidad estricta (===) y lanza un UnhandledMatchError si no coincide ninguna rama y no hay 'default'.",
    proTip: "Usa 'match' en PHP moderno para evitar bugs sutiles donde 0 == 'texto' en switch arruinaba la lógica."
  },

  // 3. JAVASCRIPT
  {
    id: 'js-01',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es el orden exacto de salida en consola según la especificación del Event Loop de JavaScript?',
    codeLanguage: 'javascript',
    codeSnippet: `console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
queueMicrotask(() => console.log("4"));
console.log("5");`,
    options: [
      "1, 5, 2, 3, 4",
      "1, 5, 3, 4, 2",
      "1, 2, 3, 4, 5",
      "1, 3, 4, 5, 2"
    ],
    correctAnswerIndex: 1,
    explanation: "El código síncrono corre primero (1 y 5). Antes de atender cualquier macrotask (setTimeout callback), el motor vacía completamente la cola de Microtasks en orden FIFO (Promise.then '3' y queueMicrotask '4'). Finalmente se ejecuta la macrotask (2).",
    proTip: "Regla mnemotécnica: Código síncrono > Microtasks (Promise, queueMicrotask, MutationObserver) > Macrotasks/Tasks (setTimeout, setInterval, I/O)."
  },
  {
    id: 'js-02',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Mid',
    type: 'find_the_bug',
    title: '¿Qué problema clásico de closures y scope ocurre en este código con `var`?',
    codeLanguage: 'javascript',
    codeSnippet: `const callbacks = [];
for (var i = 0; i < 3; i++) {
  callbacks.push(() => console.log(i));
}
callbacks[0]();
callbacks[1]();
callbacks[2]();`,
    options: [
      "Imprime 0, 1, 2 normalmente.",
      "Imprime 3, 3, 3 porque `var` tiene function/global scope y todas las closures comparten la misma referencia a la variable `i` al terminar el ciclo.",
      "Lanza un ReferenceError porque `i` se destruye al salir del loop.",
      "Lanza un TypeError porque `callbacks` es const y no permite push."
    ],
    correctAnswerIndex: 1,
    explanation: "Debido a que 'var' no tiene block scope sino function scope, existe una única variable 'i' en memoria. Cuando los callbacks se ejecutan después del bucle, leen el valor final de 'i' que es 3. Con 'let', se crea un nuevo lexical binding por cada iteración del bucle.",
    proTip: "Reemplazar 'var' por 'let' soluciona el problema de inmediato gracias al block-scoping de ES6."
  },

  // 4. TYPESCRIPT
  {
    id: 'ts-01',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es el propósito del operador `satisfies` introducido en TypeScript 4.9?',
    codeLanguage: 'typescript',
    codeSnippet: `type Palette = Record<string, [number, number, number] | string>;

const theme = {
  primary: [255, 0, 0],
  secondary: "#00ff00",
} satisfies Palette;

// ¿Qué ventaja tiene theme.primary.map(...) vs escribir const theme: Palette?`,
    options: [
      "Valida que un objeto coincida con un tipo PERO preserva el tipo inferido exacto de sus propiedades sin ensancharlo (widening).",
      "Es un alias idéntico al type casting 'as Palette'.",
      "Convierte el objeto en inmutable en tiempo de compilación y runtime.",
      "Valida el tipo en tiempo de ejecución (runtime validation) mediante Zod automático."
    ],
    correctAnswerIndex: 0,
    explanation: "El operador 'satisfies' valida la compatibilidad estricta con una interfaz o tipo, pero conserva los tipos literales específicos inferidos. Si hubiéramos escrito ': Palette', theme.primary sería de tipo '[number, number, number] | string', impidiendo llamar a métodos de array como .map() sin antes hacer un narrowing.",
    proTip: "Usa 'satisfies' en configuraciones, temas y DTOs para tener validación estricta sin perder autocompletado específico."
  },
  {
    id: 'ts-02',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué técnica de TypeScript se utiliza en este snippet con la palabra clave `infer`?',
    codeLanguage: 'typescript',
    codeSnippet: `type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
type Resultado = UnpackPromise<Promise<number>>; // ¿Qué tipo es Resultado?`,
    options: [
      "Conditional Type con Type Inference: 'Resultado' es de tipo 'number'.",
      "Es un Generic Constraint inválido que no compila en TS.",
      "'Resultado' es de tipo 'Promise<number>' porque infer solo clona el tipo envolvente.",
      "'Resultado' es de tipo 'unknown' por pérdida de contexto."
    ],
    correctAnswerIndex: 0,
    explanation: "Dentro de la cláusula 'extends' de un tipo condicional, la palabra clave 'infer' introduce una variable de tipo que el compilador deduce automáticamente del tipo original. En este caso, deduce que U es 'number' y lo extrae.",
    proTip: "Así es como TypeScript implementa internamente utilidades como Awaited<T>, ReturnType<T> y Parameters<T>."
  },

  // 5. REACT
  {
    id: 'react-01',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Mid',
    type: 'find_the_bug',
    title: '¿Qué error sutil de concurrencia y closures existe en este contador al invocarlo múltiples veces?',
    codeLanguage: 'tsx',
    codeSnippet: `function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return <button onClick={handleClick}>+{count}</button>;
}`,
    options: [
      "El botón incrementará en 3 como se esperaría.",
      "El botón solo incrementa en 1 por clic, porque todas las llamadas leen el valor capturado de `count` en el render actual.",
      "Lanza un error de 'Too many re-renders'.",
      "Provoca un infinite loop en el ciclo de vida del componente."
    ],
    correctAnswerIndex: 1,
    explanation: "En cada render, 'count' es una constante con el valor de ese frame. Las tres llamadas 'setCount(count + 1)' ejecutan 'setCount(0 + 1)'. Para encadenar actualizaciones dependientes del estado previo en el mismo lote (batch), se debe usar la forma funcional: 'setCount(prev => prev + 1)'.",
    proTip: "Siempre que la nueva actualización dependa del valor anterior, utiliza un updater funcional: setCount(c => c + 1)."
  },
  {
    id: 'react-02',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En React Server Components (RSC), ¿cuál de las siguientes afirmaciones es CORRECTA?',
    codeLanguage: 'tsx',
    codeSnippet: `// ServerComponent.tsx
import db from '@/lib/db';

export default async function ProductList() {
  const products = await db.query('SELECT * FROM products');
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}`,
    options: [
      "Los Server Components se ejecutan exclusivamente en el servidor, su código fuente no se envía en el bundle de JavaScript al cliente y pueden ser funciones asíncronas con acceso directo a bases de datos.",
      "Los Server Components pueden utilizar hooks como useState y useEffect sin restricciones.",
      "Los Server Components reemplazan por completo a los Client Components y eliminan la necesidad de interactividad.",
      "Para convertir un componente en Server Component se debe agregar obligatoriamente la directiva 'use server' al inicio del archivo."
    ],
    correctAnswerIndex: 0,
    explanation: "Los React Server Components (RSC) se ejecutan únicamente en el servidor y renderizan hacia un formato serializado intermedio (no HTML estático puro, sino un árbol de componentes), con cero impacto en el tamaño del bundle JS del cliente. La directiva 'use server' define Server Actions, mientras que los Server Components son el comportamiento por defecto en frameworks modernos como Next.js App Router.",
    proTip: "'use client' marca el límite para Client Components (interactividad, hooks). 'use server' marca Server Actions (funciones ejecutables vía POST)."
  },

  // 6. FUNDAMENTOS MODERNOS
  {
    id: 'fund-01',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos Modernos',
    difficulty: 'Mid',
    type: 'multiple_choice',
    title: 'En Clean Architecture de Uncle Bob, ¿cuál es la regla sagrada e inquebrantable de Dependencia (Dependency Rule)?',
    options: [
      "Las dependencias del código fuente solo pueden apuntar hacia adentro, hacia las políticas de más alto nivel (Domain/Entities).",
      "Las capas internas (Domain) deben importar directamente las librerías de UI y bases de datos para acelerar el desarrollo.",
      "Los Use Cases deben conocer la implementación concreta de SQLite o Room para hacer transacciones directas.",
      "La base de datos debe ser el centro del sistema y definir los modelos de negocio."
    ],
    correctAnswerIndex: 0,
    explanation: "La Dependency Rule establece que el código de una capa interna no debe saber absolutamente nada de las capas externas. La capa de Dominio (Entidades y Casos de Uso) es pura y no tiene dependencias de frameworks, bases de datos (Room/SQL) ni UI (Jetpack Compose/React). La inversión de dependencias (DIP) se usa para conectar repositorios mediante interfaces.",
    proTip: "En Android: La capa 'domain' solo contiene Kotlin puro, sin android.* ni androidx.*."
  },
  {
    id: 'fund-02',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos Modernos',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En Git, ¿cuál es la diferencia conceptual entre `git merge` y `git rebase`?',
    options: [
      "`merge` preserva el historial cronológico exacto creando un commit de fusión de 2 ramas; `rebase` reescribe la historia linealizando los commits sobre la punta de la rama destino.",
      "`rebase` elimina permanentemente los commits viejos sin posibilidad de reflog.",
      "`merge` solo funciona si las ramas no tienen ningún conflicto de código.",
      "`rebase` es recomendado para ramas públicas compartidas como 'main' o 'production'."
    ],
    correctAnswerIndex: 0,
    explanation: "Git Merge combina historias creando un commit con dos padres, manteniendo intacta la topología original. Git Rebase toma los commits de la rama actual y los 'reaplica' uno a uno en la punta de la rama base, creando nuevos hashes SHA-1 y un historial lineal y limpio.",
    proTip: "Regla de oro de Git: ¡Nunca hagas rebase en una rama pública compartida que otros colaboradores estén utilizando!"
  },

  // 7. ASISTENCIA DE IA PARA PROGRAMADORES
  {
    id: 'ai-01',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Mid',
    type: 'multiple_choice',
    title: '¿Qué es un "Package Hallucination Attack" (Alucinación de Paquetes) y qué riesgo de seguridad implica al usar código generado por LLMs?',
    options: [
      "Un ataque donde atacantes publican paquetes maliciosos en npm o PyPI con nombres que los LLMs inventan (alucinan) con frecuencia en sus respuestas.",
      "Un bug del compilador que no encuentra librerías estándar en el disco local.",
      "Una técnica para optimizar el context window de los modelos de lenguaje.",
      "Una vulnerabilidad de inyección SQL en la interfaz de chat del LLM."
    ],
    correctAnswerIndex: 0,
    explanation: "Los modelos de lenguaje pueden alucinar paquetes ficticios con nombres verosímiles (ej: 'npm install react-safe-crypto-utils'). Investigadores de ciberseguridad han demostrado que actores maliciosos registran deliberadamente esos nombres alucinados en repositorios públicos con malware (Slingshot/Supply-chain attack) para infectar a desarrolladores descuidados que copian y pegan el comando sugerido.",
    proTip: "Siempre audita y verifica en npmjs.com o pypi.org la fecha de creación, estrellas, mantenedores y descargas de cualquier librería recomendada por IA."
  },
  {
    id: 'ai-02',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Al diseñar prompts para refactorización de código crítico con LLMs, ¿cuál es la técnica más efectiva para prevenir regresiones y degradación funcional?',
    options: [
      "Few-shot prompting combinando contratos de entrada/salida, tests unitarios existentes como invariantes y la regla explícita 'no modifiques la firma pública'.",
      "Pedirle 'por favor hazlo lo más rápido posible y con menos líneas de código'.",
      "No proporcionar el contexto de los tipos ni las excepciones esperadas.",
      "Usar temperaturas muy altas (1.5 - 2.0) para que el modelo sea más creativo."
    ],
    correctAnswerIndex: 0,
    explanation: "Proveer los tests unitarios o firmas de tipos como restricciones invariantes (Grounding) fuerza al modelo a verificar internamente que la nueva implementación sigue satisfaciendo el contrato. Mantener baja la temperatura (0.0 - 0.2) reduce la variabilidad y el riesgo de cambios inesperados.",
    proTip: "En herramientas como Cursor/Copilot: Incluye en el prompt los archivos de test (*.test.ts o *Test.kt) como contexto explícito."
  },
  {
    id: 'ai-03',
    categoryId: 'ai_assistance',
    categoryName: 'IA para Programadores',
    difficulty: 'Junior',
    type: 'true_false',
    title: 'El código generado por herramientas de IA como GitHub Copilot o Claude nunca infringe licencias de código abierto ni presenta vulnerabilidades OWASP comunes.',
    options: [
      "Falso: Los LLMs pueden reproducir vulnerabilidades (ej. inyecciones SQL, buffer overflows) y patrones inseguros si fueron entrenados con código público vulnerable.",
      "Verdadero: Los modelos cuentan con un filtro estricto que garantiza código 100% libre de vulnerabilidades y con certificación estática."
    ],
    correctAnswerIndex: 0,
    explanation: "Los modelos de IA reproducen patrones estadísticos de su corpus de entrenamiento, el cual incluye millones de repositorios con malas prácticas y vulnerabilidades conocidas. Por ello, el desarrollador humano sigue siendo legal y técnicamente el responsable de auditar, testear y validar cada línea antes de enviarla a producción.",
    proTip: "Trata la sugerencia del LLM como el PR de un pasante brillante pero descuidado: revísalo meticulosamente."
  }
];
