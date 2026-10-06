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
    id: 'sql',
    name: 'SQL & Bases de Datos',
    icon: '🗄️',
    color: '#3b82f6',
    description: 'PostgreSQL/MySQL, índices B-Tree, transacciones ACID, JOINs y EXPLAIN.',
    tag: 'SQL Moderno',
  },
  {
    id: 'solid',
    name: 'Principios SOLID',
    icon: '📐',
    color: '#ec4899',
    description: 'SRP, Open/Closed, Liskov, Interface Segregation y Dependency Inversion.',
    tag: 'Clean Code',
  },
  {
    id: 'modern_fundamentals',
    name: 'Fundamentos & Git',
    icon: '🏛️',
    color: '#10b981',
    description: 'Git internals (rebase/merge), REST vs GraphQL, Clean Architecture y patrones.',
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

  // 6. SQL & BASES DE DATOS (NUEVO QUIZ SEPARADO)
  {
    id: 'sql-01',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Mid',
    type: 'multiple_choice',
    title: 'En un índice compuesto B-Tree sobre `(user_id, created_at)`, ¿cuál de las siguientes consultas NO puede utilizar el índice eficientemente?',
    codeLanguage: 'sql',
    codeSnippet: `-- Tabla: pedidos (id, user_id, total, created_at)
-- Índice creado: CREATE INDEX idx_pedidos_user_created ON pedidos(user_id, created_at);`,
    options: [
      "SELECT * FROM pedidos WHERE created_at > '2024-01-01';",
      "SELECT * FROM pedidos WHERE user_id = 42 AND created_at > '2024-01-01';",
      "SELECT * FROM pedidos WHERE user_id = 42 ORDER BY created_at DESC;",
      "SELECT * FROM pedidos WHERE user_id = 42;"
    ],
    correctAnswerIndex: 0,
    explanation: "Regla del Prefijo Más a la Izquierda (Leftmost Prefix Rule): Un índice compuesto ordenado por (A, B) está organizado primero por A, y para valores idénticos de A, por B. Si filtras solo por B ('created_at') sin especificar A ('user_id'), el motor debe hacer un Full Table Scan o Full Index Scan porque no puede saltar directamente a los nodos relevantes.",
    proTip: "El orden de las columnas en un índice compuesto es crítico: coloca primero la columna de mayor cardinalidad y filtro común."
  },
  {
    id: 'sql-02',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué anomalía de concurrencia ACID previene el nivel de aislamiento `REPEATABLE READ` que `READ COMMITTED` permite?',
    codeLanguage: 'sql',
    codeSnippet: `-- Transacción 1:
BEGIN;
SELECT saldo FROM cuentas WHERE id = 1; -- Retorna 100
-- [En este punto, la Transacción 2 actualiza a 150 y hace COMMIT]
SELECT saldo FROM cuentas WHERE id = 1; -- ¿Qué ve T1?`,
    options: [
      "Lectura No Repetible (Non-Repeatable Read): en REPEATABLE READ, T1 verá siempre 100 mediante MVCC / Snapshot Isolation.",
      "Lectura Sucia (Dirty Read): leer datos de una transacción que aún no ha hecho commit.",
      "Deadlock total entre conexiones simultáneas.",
      "Pérdida de la clave primaria por truncado de página."
    ],
    correctAnswerIndex: 0,
    explanation: "Bajo 'READ COMMITTED', cada SELECT toma una nueva instantánea, por lo que si otra transacción modifica el registro y hace commit, la segunda lectura arrojará un valor diferente (Non-Repeatable Read). 'REPEATABLE READ' mantiene la misma vista consistente de datos durante toda la duración de la transacción.",
    proTip: "En PostgreSQL, REPEATABLE READ también previene lecturas fantasma (Phantom Reads) gracias a su motor MVCC basado en snapshots."
  },
  {
    id: 'sql-03',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Mid',
    type: 'multiple_choice',
    title: '¿Cuál es la función analítica (Window Function) recomendada para obtener el salario más alto de cada departamento sin agrupar todas las filas?',
    codeLanguage: 'sql',
    codeSnippet: `SELECT id, departamento_id, salario,
       ROW_NUMBER() OVER (
           PARTITION BY departamento_id 
           ORDER BY salario DESC
       ) as ranking
FROM empleados;`,
    options: [
      "Asigna un número secuencial del 1 al N a cada empleado dentro de su propio departamento, ordenado de mayor a menor salario.",
      "Elimina físicamente las filas duplicadas de la tabla empleados.",
      "Calcula la suma acumulada del salario en la empresa.",
      "Es una cláusula GROUP BY que solo retorna una única fila por departamento."
    ],
    correctAnswerIndex: 0,
    explanation: "Las Window Functions operan sobre particiones de datos calculadas en tiempo de consulta sin colapsar las filas como un GROUP BY. 'PARTITION BY departamento_id ORDER BY salario DESC' reinicia el contador 'ranking' en 1 para el empleado con mayor salario de cada departamento.",
    proTip: "Para obtener solo el top 1, envuelve esta consulta en un CTE ('WITH ranked AS (...) SELECT * FROM ranked WHERE ranking = 1')."
  },

  // 7. PRINCIPIOS SOLID (NUEVO QUIZ SEPARADO)
  {
    id: 'solid-01',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Mid',
    type: 'find_the_bug',
    title: '¿Qué principio SOLID se está violando flagrantemente en esta clase `ProcesadorFacturas`?',
    codeLanguage: 'typescript',
    codeSnippet: `class ProcesadorFacturas {
  calcularTotal(factura: Factura): number { /* calcula total */ }
  imprimirFacturaPDF(factura: Factura): void { /* genera PDF */ }
  guardarEnBaseDeDatos(factura: Factura): void { /* inserta en MySQL */ }
  enviarEmailAlCliente(factura: Factura): void { /* conecta a SMTP */ }
}`,
    options: [
      "Single Responsibility Principle (SRP): La clase tiene múltiples razones para cambiar (lógica financiera, formato de renderizado, persistencia y envío de red).",
      "Open/Closed Principle (OCP): No permite heredar de Factura.",
      "Liskov Substitution Principle (LSP): Porque no implementa una interfaz.",
      "Interface Segregation Principle (ISP): Porque tiene más de 3 métodos."
    ],
    correctAnswerIndex: 0,
    explanation: "El Principio de Responsabilidad Única (SRP) estipula que una clase o módulo debe tener una, y solo una, razón para cambiar (estar acoplado a un único actor de negocio). Esta clase cambiará si cambia la regla impositiva, si cambia el diseño del PDF, si se migra de base de datos o si cambia el proveedor de email.",
    proTip: "Separa en: CalculadorFactura (Core), GeneradorFacturaPdf, RepositorioFacturas y NotificadorFacturas."
  },
  {
    id: 'solid-02',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Por qué la relación clásica entre `Rectangulo` y `Cuadrado` viola el Principio de Sustitución de Liskov (LSP)?',
    codeLanguage: 'typescript',
    codeSnippet: `class Rectangulo {
  setWidth(w: number) { this.w = w; }
  setHeight(h: number) { this.h = h; }
  getArea(): number { return this.w * this.h; }
}

class Cuadrado extends Rectangulo {
  setWidth(w: number) { this.w = w; this.h = w; } // Modifica ambos
  setHeight(h: number) { this.w = h; this.h = h; }
}

function cambiarDimensiones(r: Rectangulo) {
  r.setWidth(5);
  r.setHeight(4);
  assert(r.getArea() === 20); // ¡Falla si r es Cuadrado (dará 16)!
}`,
    options: [
      "Liskov Substitution Principle (LSP): Los subtipos deben ser sustituibles por sus tipos base sin alterar la corrección del programa ni violar invariantes.",
      "Dependency Inversion: No usa inyección de dependencias en el constructor.",
      "Interface Segregation: Cuadrado debería tener más métodos que Rectángulo.",
      "No hay error; las matemáticas demuestran que un cuadrado es un rectángulo."
    ],
    correctAnswerIndex: 0,
    explanation: "Aunque en geometría todo cuadrado es un rectángulo, en programación orientada a objetos conductual (LSP de Barbara Liskov), el comportamiento observable importa más que la taxonomía. La postcondición de 'setWidth(5)' en Rectángulo es que el alto no se altere; Cuadrado rompe ese invariante, haciendo que el código cliente falle.",
    proTip: "LSP regla práctica: Si una subclase sobrescribe un método lanzando excepciones no soportadas o alterando efectos colaterales esperados, es una violación de LSP."
  },
  {
    id: 'solid-03',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Mid',
    type: 'multiple_choice',
    title: '¿Cuál es la definición exacta del Principio de Inversión de Dependencias (DIP)?',
    options: [
      "Los módulos de alto nivel no deben depender de módulos de bajo nivel; ambos deben depender de abstracciones. Las abstracciones no deben depender de los detalles.",
      "Toda clase debe recibir sus dependencias exclusivamente a través de variables globales.",
      "Siempre se debe usar un framework de inversión de control como Spring o Dagger/Hilt.",
      "Las clases deben derivar siempre de una clase base abstracta única."
    ],
    correctAnswerIndex: 0,
    explanation: "El Principio de Inversión de Dependencias (la 'D' de SOLID) establece que la lógica de negocio nuclear (alto nivel) no debe importar drivers de bases de datos o clientes HTTP concretos (bajo nivel), sino interfaces abstractas (ej: RepositorioUsuarios). Los detalles de implementación dependen de la interfaz definida por el dominio.",
    proTip: "DIP es la base de la Dependency Inversion que permite la Clean Architecture y la arquitectura hexagonal."
  },

  // 8. FUNDAMENTOS MODERNOS & GIT
  {
    id: 'fund-01',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Mid',
    type: 'multiple_choice',
    title: 'En Clean Architecture de Uncle Bob, ¿cuál es la regla sagrada de Dependencia (Dependency Rule)?',
    options: [
      "Las dependencias del código fuente solo pueden apuntar hacia adentro, hacia las políticas de más alto nivel (Domain/Entities).",
      "Las capas internas (Domain) deben importar directamente las librerías de UI y bases de datos para acelerar el desarrollo.",
      "Los Use Cases deben conocer la implementación concreta de SQLite o Room para hacer transacciones directas.",
      "La base de datos debe ser el centro del sistema y definir los modelos de negocio."
    ],
    correctAnswerIndex: 0,
    explanation: "La Dependency Rule establece que el código de una capa interna no debe saber absolutamente nada de las capas externas. La capa de Dominio (Entidades y Casos de Uso) es pura y no tiene dependencias de frameworks ni persistencia.",
    proTip: "En Android: La capa 'domain' solo contiene Kotlin puro, sin android.* ni androidx.*."
  },
  {
    id: 'fund-02',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
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

  // 9. ASISTENCIA DE IA PARA PROGRAMADORES
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
    explanation: "Los modelos de lenguaje pueden alucinar paquetes ficticios con nombres verosímiles. Investigadores han demostrado que actores maliciosos registran deliberadamente esos nombres alucinados en repositorios públicos con malware para infectar a desarrolladores descuidados que copian el comando sugerido.",
    proTip: "Siempre audita y verifica en npmjs.com o pypi.org la fecha de creación, estrellas y mantenedores de cualquier librería recomendada por IA."
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
    explanation: "Proveer los tests unitarios o firmas de tipos como restricciones invariantes (Grounding) fuerza al modelo a verificar internamente que la nueva implementación sigue satisfaciendo el contrato. Mantener baja la temperatura (0.0 - 0.2) reduce la variabilidad.",
    proTip: "En herramientas como Cursor/Copilot: Incluye en el prompt los archivos de test (*.test.ts o *Test.kt) como contexto explícito."
  }
];
