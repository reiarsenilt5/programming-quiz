import { Question } from '../types/quiz';

export const JUNIOR_TYPESCRIPT_QUESTIONS: Question[] = [
  {
    id: 'ts-03',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia fundamental entre el tipo `any` y el tipo `unknown` en TypeScript?',
    codeLanguage: 'typescript',
    codeSnippet: 'let v1: any;\nlet v2: unknown;\n\nv1.hacerAlgo(); // ¿Permitido?\nv2.hacerAlgo(); // ¿Permitido?',
    options: [
      '`any` desactiva completamente el chequeo de tipos, mientras que `unknown` es tipo-seguro y obliga a comprobar el tipo antes de usarlo.',
      'Son idénticos y solo cambia el nombre por compatibilidad.',
      '`unknown` solo acepta valores null o undefined.',
      '`any` lanza errores en tiempo de compilación si se llama a un método inexistente.'
    ],
    correctAnswerIndex: 0,
    explanation: '`any` desactiva el compilador de TypeScript permitiendo cualquier operación. `unknown` indica que el tipo es desconocido, pero TypeScript exige verificar el tipo (Type Narrowing) mediante typeof o comprobaciones lógicas antes de invocar métodos.',
    proTip: 'Evita `any` siempre que puedas; si recibes datos dinámicos de una API externa, tipa como `unknown` y valida con zod o typeof.'
  },
  {
    id: 'ts-04',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo se indica que una propiedad en una `interface` o `type` es opcional?',
    codeLanguage: 'typescript',
    codeSnippet: 'interface Usuario {\n    id: number;\n    nombre: string;\n    // ¿Cómo hacer que edad sea opcional?\n}',
    options: [
      'edad: number | null',
      'edad?: number',
      'optional edad: number',
      'edad: optional<number>'
    ],
    correctAnswerIndex: 1,
    explanation: 'El signo de interrogación `?` después del nombre de la propiedad (`edad?: number`) indica que la propiedad puede estar ausente o ser `undefined`.',
    proTip: '`edad?: number` es equivalente a `edad?: number | undefined`.'
  },
  {
    id: 'ts-05',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es una Unión de Tipos (Union Type) con el operador `|` en TypeScript?',
    codeLanguage: 'typescript',
    codeSnippet: 'type Estado = "cargando" | "exito" | "error";\nlet e: Estado = "cargando";',
    options: [
      'Permite que una variable acepte uno de varios tipos o valores literales especificados.',
      'Combina dos tipos sumando todas sus propiedades obligatorias.',
      'Convierte el tipo a un booleano bit a bit.',
      'Crea una clase abstracta.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Una Unión (`A | B`) significa que el valor puede ser del tipo A o del tipo B. En este caso, restringe la variable a ser exclusivamente una de esas tres cadenas literales.',
    proTip: 'Las uniones de cadenas literales son una alternativa moderna, más limpia y más liviana que los `enum` numéricos tradicionales.'
  },
  {
    id: 'ts-06',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué error detecta el compilador de TypeScript en la siguiente función?',
    codeLanguage: 'typescript',
    codeSnippet: 'function multiplicar(a: number, b: number): number {\n    if (a === 0) return 0;\n    // Falta retornar cuando a != 0\n}',
    options: [
      'No hay error, devolverá undefined automáticamente.',
      'Error: Not all code paths return a value (no todos los caminos devuelven un número).',
      'Error: if no admite comparaciones con number.',
      'Error: number no es un tipo primitivo válido.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Si la firma indica que la función retorna un `number`, TypeScript verifica exhaustivamente que todos los caminos de ejecución devuelvan un `number`, no permitiendo retornos implícitos de `undefined`.',
    proTip: 'Esta verificación estricta previene bugs comunes donde ciertas ramas de lógica olvidaban devolver datos.'
  },
  {
    id: 'ts-07',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo funciona el "Type Narrowing" (estrechamiento de tipos) con `typeof`?',
    codeLanguage: 'typescript',
    codeSnippet: 'function imprimir(valor: string | number) {\n    if (typeof valor === "string") {\n        console.log(valor.toUpperCase()); // ¿Qué tipo tiene valor aquí?\n    }\n}',
    options: [
      'Dentro del bloque if, TypeScript sabe con certeza que `valor` es de tipo `string` y habilita métodos de string.',
      '`valor` sigue siendo string | number y da error de compilación.',
      '`typeof` solo existe en JavaScript y TypeScript lo ignora.',
      'Convierte automáticamente cualquier número a mayúsculas.'
    ],
    correctAnswerIndex: 0,
    explanation: 'TypeScript analiza el flujo de control (Control Flow Analysis). Al ver una comprobación con `typeof valor === "string"`, reduce el tipo dentro de esa rama a `string`.',
    proTip: 'Type Narrowing también funciona con `instanceof`, comprobaciones de igualdad (===) o comprobación de propiedades ("clave" in objeto).'
  },
  {
    id: 'ts-08',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia más común en proyectos entre `interface` y `type` para modelar objetos?',
    codeLanguage: 'typescript',
    codeSnippet: 'interface Persona { nombre: string; }\ntype Empleado = { salario: number; };',
    options: [
      'Las `interface` se pueden extender re-declarando el mismo nombre (declaration merging), mientras que `type` es más flexible para uniones y tipos primitivos.',
      '`interface` genera código en JavaScript compilado y `type` no.',
      '`type` es exclusivo de React y no funciona en Node.js.',
      '`interface` no admite propiedades obligatorias.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Ambos sirven para describir la forma de objetos. Las interfaces son ideales para POO extensible y librerías públicas (merging), mientras que `type` permite uniones (`A | B`), tuplas y tipos primitivos.',
    proTip: 'En la práctica la mayoría de equipos usan uno u otro por convención; lo importante es ser consistente en tu base de código.'
  },
  {
    id: 'ts-09',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Para qué sirve la aserción de tipos no nulos (Non-null assertion operator `!`)?',
    codeLanguage: 'typescript',
    codeSnippet: 'const elemento = document.getElementById("mi-boton")!;\nelemento.addEventListener("click", () => {});',
    options: [
      'Invierte la lógica booleana del elemento.',
      'Le asegura al compilador de TypeScript: "garantizo que este valor NO es null ni undefined en tiempo de ejecución".',
      'Crea el elemento en el DOM si no existe.',
      'Desactiva el recolector de basura para esa variable.'
    ],
    correctAnswerIndex: 1,
    explanation: 'El operador `!` al final de una expresión le indica a TypeScript que confíe en que el valor existe. Si en tiempo de ejecución es null, la app lanzará un TypeError.',
    proTip: 'Úsalo con cautela. Es más seguro comprobar con un `if (!elemento) return;` que arriesgarte a un crash con `!`.'
  },
  {
    id: 'ts-10',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es un Genérico básico (`<T>`) en TypeScript?',
    codeLanguage: 'typescript',
    codeSnippet: 'function envolverEnArray<T>(elemento: T): T[] {\n    return [elemento];\n}\nconst nums = envolverEnArray(5); // ¿Qué tipo es nums?',
    options: [
      'nums es de tipo number[], preservando el tipo exacto que se le pasó como argumento.',
      'nums es de tipo any[].',
      'nums es de tipo unknown.',
      'T representa una variable temporal global de JavaScript.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Los genéricos permiten escribir funciones y clases reutilizables que funcionan con múltiples tipos mientras capturan y preservan la información exacta del tipo suministrado.',
    proTip: 'Piensa en `<T>` como una "variable para tipos": igual que pasas argumentos de datos, pasas tipos a la función.'
  },
  {
    id: 'ts-11',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué ocurre al compilar el siguiente código con propiedades `readonly`?',
    codeLanguage: 'typescript',
    codeSnippet: 'interface Configuracion {\n    readonly apiUrl: string;\n}\nconst config: Configuracion = { apiUrl: "https://api.com" };\nconfig.apiUrl = "https://otra.com";',
    options: [
      'Compila perfectamente sin quejas.',
      'TypeScript genera un error de compilación: Cannot assign to "apiUrl" because it is a read-only property.',
      'La variable se elimina automáticamente de memoria.',
      'Se reemplaza solo si es un entorno de desarrollo.'
    ],
    correctAnswerIndex: 1,
    explanation: 'El modificador `readonly` marca una propiedad como inmutable después de la inicialización en tiempo de compilación de TypeScript.',
    proTip: '`readonly` solo es una garantía en tiempo de compilación; en tiempo de ejecución compilado a JS normal, el código se ejecutaría si no se usara Object.freeze().'
  },
  {
    id: 'ts-12',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué tipo especial representa una función que nunca retorna porque lanza un error o entra en un bucle infinito?',
    codeLanguage: 'typescript',
    codeSnippet: 'function lanzarError(mensaje: string): never {\n    throw new Error(mensaje);\n}',
    options: [
      'void',
      'never',
      'undefined',
      'null'
    ],
    correctAnswerIndex: 1,
    explanation: '`void` significa que la función termina y no devuelve ningún valor útil (devuelve undefined). `never` significa que la función JAMÁS llega al final de su ejecución (lanza excepción o bucle infinito).',
    proTip: '`never` también se utiliza en TypeScript para verificaciones de exhaustividad en bloques switch.'
  },
  {
    id: 'ts-13',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué utilidad de tipo convierte todas las propiedades de una interfaz en opcionales?',
    codeLanguage: 'typescript',
    codeSnippet: 'interface Perfil {\n    nombre: string;\n    edad: number;\n}\ntype PerfilParcial = Partial<Perfil>;',
    options: [
      'Required<Perfil>',
      'Partial<Perfil>',
      'Readonly<Perfil>',
      'Omit<Perfil>'
    ],
    correctAnswerIndex: 1,
    explanation: '`Partial<T>` es una Utility Type estándar de TypeScript que devuelve un nuevo tipo donde todas las propiedades de T se convierten en opcionales (?): { nombre?: string; edad?: number; }.',
    proTip: 'Ideal para funciones de actualización/patch donde el usuario solo envía los campos que quiere modificar.'
  },
  {
    id: 'ts-14',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué hace la Utility Type `Pick<T, Keys>` en TypeScript?',
    codeLanguage: 'typescript',
    codeSnippet: 'interface Producto {\n    id: number;\n    nombre: string;\n    precio: number;\n    stock: number;\n}\ntype ResumenProducto = Pick<Producto, "id" | "nombre">;',
    options: [
      'Elimina las propiedades seleccionadas de la interfaz.',
      'Crea un nuevo tipo seleccionando únicamente las claves indicadas ("id" y "nombre") de Producto.',
      'Convierte el producto en un array de dos posiciones.',
      'Hace que las propiedades seleccionadas sean obligatorias.'
    ],
    correctAnswerIndex: 1,
    explanation: '`Pick<T, K>` construye un tipo escogiendo un conjunto de propiedades K de T. Para hacer lo opuesto (omitir propiedades), se utiliza `Omit<T, K>`.',
    proTip: '`Pick` y `Omit` son las herramientas más comunes para reutilizar interfaces de backend en componentes frontend.'
  },
  {
    id: 'ts-15',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué error ocurre al intentar tipar un array con dos tipos sin envolverlos adecuadamente?',
    codeLanguage: 'typescript',
    codeSnippet: 'let lista: string | number[] = ["hola", 1, 2]; // ¿Es correcto para un array mixto?',
    options: [
      'No, porque `string | number[]` significa: "o bien es un solo string, o bien es un array de números". Para array mixto debe ser `(string | number)[]`.',
      'Sí, compila perfectamente y permite arrays mixtos.',
      'En TypeScript los arrays nunca pueden mezclar tipos bajo ninguna circunstancia.',
      'Falta la palabra clave `array`.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Por precedencia de operadores, `string | number[]` es la unión entre el tipo string y el tipo array de números. Para denotar un array de elementos que pueden ser string o number se debe agrupar: `(string | number)[]`.',
    proTip: 'Ten cuidado con los paréntesis al combinar operadores de unión con la notación de array [].'
  },
  {
    id: 'ts-16',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué archivo de configuración define las reglas del compilador de TypeScript en un proyecto?',
    codeLanguage: 'json',
    codeSnippet: '{\n  "compilerOptions": {\n    "target": "ES2022",\n    "strict": true\n  }\n}',
    options: [
      'package.json',
      'tsconfig.json',
      'tsrules.yaml',
      'vite.config.ts'
    ],
    correctAnswerIndex: 1,
    explanation: '`tsconfig.json` es el archivo raíz donde se especifican las opciones del compilador (`tsc`), niveles de rigurosidad (`strict: true`), rutas (`paths`) y versiones de destino ECMAScript.',
    proTip: 'Mantén `"strict": true` siempre activado en nuevos proyectos para aprovechar al 100% las garantías de seguridad de TypeScript.'
  },
  {
    id: 'ts-17',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué ocurre con los tipos, interfaces y genéricos de TypeScript cuando el proyecto se compila a JavaScript?',
    codeLanguage: 'typescript',
    codeSnippet: 'interface Mensaje { texto: string; }\nconst m: Mensaje = { texto: "Hola" };',
    options: [
      'Se convierten en clases de JavaScript en tiempo de ejecución.',
      'Se eliminan completamente (type erasure) y no queda rastro de ellos en el JavaScript final producido.',
      'Se guardan en una base de datos local SQLite.',
      'Aumentan el peso del archivo bundle final en 500 KB.'
    ],
    correctAnswerIndex: 1,
    explanation: 'TypeScript solo existe en tiempo de desarrollo y compilación. Todo el sistema de tipos se elimina (type erasure) al compilar, produciendo código JavaScript limpio y ligero.',
    proTip: 'Por eso TypeScript NO puede realizar validaciones en tiempo de ejecución de datos que vienen de un servidor o usuario sin librerías como Zod.'
  },
  {
    id: 'ts-18',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo se define una tupla con longitud y tipos fijos por posición en TypeScript?',
    codeLanguage: 'typescript',
    codeSnippet: 'const respuestaHTTP: [number, string] = [200, "OK"];',
    options: [
      'Es un array de tamaño fijo donde la posición 0 siempre es `number` y la posición 1 siempre es `string`.',
      'Es un objeto con claves numéricas aleatorias.',
      'Solo admite strings de hasta 200 caracteres.',
      'Es idéntico a `(number | string)[]` y admite cualquier cantidad de elementos.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Una tupla en TypeScript define un array de longitud fija donde cada posición tiene un tipo específico garantizado por el compilador.',
    proTip: 'Un ejemplo muy común de tupla es el valor retornado por `useState` en React: `[estado, setEstado]`.'
  },
  {
    id: 'ts-19',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué es el Type Assertion (`as string`) y cuándo puede ser peligroso si se abusa de él?',
    codeLanguage: 'typescript',
    codeSnippet: 'const entrada: any = 12345;\nconst texto = entrada as string;\nconsole.log(texto.toUpperCase()); // ¿Qué ocurre en ejecución?',
    options: [
      'Compila sin errores, pero en tiempo de ejecución lanza un TypeError porque "as" no convierte el valor real de number a string.',
      'Convierte el número 12345 en la cadena "12345" automáticamente.',
      'Lanza un error de compilación inmediato.',
      'Imprime "12345" en mayúsculas.'
    ],
    correctAnswerIndex: 0,
    explanation: '`as` es solo una aserción para decirle al compilador "confía en mí, sé qué tipo es". No realiza ninguna conversión de datos en tiempo de ejecución. Al ejecutarse, entrada sigue siendo un número y no tiene método toUpperCase().',
    proTip: 'Nunca uses "as Tipo" para forzar tipos si no has comprobado el valor real antes.'
  },
  {
    id: 'ts-20',
    categoryId: 'typescript',
    categoryName: 'TypeScript Avanzado',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es el tipo de retorno implícito de una función flecha que no retorna ningún valor?',
    codeLanguage: 'typescript',
    codeSnippet: 'const registrar = (msg: string) => {\n    console.log(msg);\n};',
    options: [
      'any',
      'void',
      'never',
      'null'
    ],
    correctAnswerIndex: 1,
    explanation: 'En TypeScript, una función que ejecuta acciones secundarias pero no tiene una sentencia `return` (o hace `return;`) tiene un tipo de retorno `void`.',
    proTip: 'Tipar callbacks como `() => void` indica claramente a otros desarrolladores que el retorno no será utilizado.'
  }
];
