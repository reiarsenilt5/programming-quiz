import { Question } from '../types/quiz';

export const JUNIOR_JAVASCRIPT_QUESTIONS: Question[] = [
  {
    id: 'js-03',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia de alcance (scope) entre `var`, `let` y `const` en JavaScript moderno?',
    codeLanguage: 'javascript',
    codeSnippet: 'if (true) {\n    var x = 1;\n    let y = 2;\n    const z = 3;\n}\nconsole.log(x); // ¿Qué ocurre aquí?',
    options: [
      '`x` es accesible (scope de función/global), mientras que `let` y `const` tienen scope de bloque ({}) y no existen fuera del if.',
      'Ninguna de las tres variables existe fuera del if.',
      'Las tres variables son siempre globales en cualquier situación.',
      '`const` puede ser reasignada pero `let` no.'
    ],
    correctAnswerIndex: 0,
    explanation: '`var` tiene scope de función o global e ignora bloques if/for. `let` y `const` tienen block scope (ámbito léxico dentro de las llaves {} donde fueron declaradas), evitando fugas de variables.',
    proTip: 'Regla de oro moderna: usa siempre `const` por defecto; si necesitas reasignar el valor, usa `let`; nunca uses `var`.'
  },
  {
    id: 'js-04',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué imprime este clásico caso de coerción de tipos en JavaScript?',
    codeLanguage: 'javascript',
    codeSnippet: 'console.log("5" + 2);\nconsole.log("5" - 2);',
    options: [
      '"52" y 3',
      '7 y 3',
      '"52" y NaN',
      '7 y NaN'
    ],
    correctAnswerIndex: 0,
    explanation: 'Con el operador `+`, si uno de los operandos es string, JavaScript realiza concatenación ("5" + 2 = "52"). Con el operador `-`, la única operación válida es matemática, por lo que convierte "5" al número 5 (5 - 2 = 3).',
    proTip: 'Para sumar números asegurando el tipo, convierte explícitamente: Number("5") + 2 o +"5" + 2.'
  },
  {
    id: 'js-05',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué método de Array crea un nuevo array transformando cada elemento según una función dada?',
    codeLanguage: 'javascript',
    codeSnippet: 'const numeros = [1, 2, 3];\nconst dobles = numeros.map(n => n * 2);',
    options: [
      'forEach()',
      'filter()',
      'map()',
      'push()'
    ],
    correctAnswerIndex: 2,
    explanation: '`.map()` itera sobre el array original y retorna un NUEVO array con los resultados de aplicar la función a cada elemento. `.forEach()` solo itera pero no devuelve nada (retorna undefined).',
    proTip: 'Nunca uses .map() si no vas a usar el array resultante; usa .forEach() o for...of para efectos secundarios.'
  },
  {
    id: 'js-06',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué método de Array filtra elementos y retorna solo aquellos que cumplan una condición booleana?',
    codeLanguage: 'javascript',
    codeSnippet: 'const edades = [12, 18, 25, 15, 30];\nconst adultos = edades.filter(edad => edad >= 18);',
    options: [
      'find()',
      'filter()',
      'some()',
      'slice()'
    ],
    correctAnswerIndex: 1,
    explanation: '`.filter()` evalúa cada elemento y devuelve un nuevo array conteniendo únicamente los elementos donde el callback devuelve true ([18, 25, 30]).',
    proTip: 'Si solo necesitas el PRIMER elemento que coincida, usa .find(), que se detiene en la primera coincidencia.'
  },
  {
    id: 'js-07',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Por qué reasignar una propiedad a un objeto declarado con `const` NO lanza un error?',
    codeLanguage: 'javascript',
    codeSnippet: 'const usuario = { nombre: "Leo" };\nusuario.nombre = "Marta"; // ¿Funciona?',
    options: [
      'Porque const solo protege la referencia en memoria del objeto, no la mutación de sus propiedades internas.',
      'Porque los objetos en JavaScript son inmutables por defecto.',
      'Lanza un TypeError inmediato en la segunda línea.',
      'Porque const solo aplica a números y strings.'
    ],
    correctAnswerIndex: 0,
    explanation: '`const` impide reasignar la variable a otro objeto (ej. usuario = {} daría error), pero el objeto al que apunta sigue siendo mutable. Para congelar propiedades se usa Object.freeze(usuario).',
    proTip: 'En entrevistas para junior: Recuerda siempre que const = referencia constante, no valor inmutable.'
  },
  {
    id: 'js-08',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo funciona la desestructuración (destructuring) de objetos en JavaScript?',
    codeLanguage: 'javascript',
    codeSnippet: 'const persona = { nombre: "Sofía", pais: "Colombia", edad: 25 };\nconst { nombre, pais } = persona;',
    options: [
      'Elimina esas propiedades del objeto persona original.',
      'Crea variables locales con los nombres de las propiedades y sus valores correspondientes extraídos del objeto.',
      'Convierte el objeto en un array indexado.',
      'Copia el objeto en el LocalStorage.'
    ],
    correctAnswerIndex: 1,
    explanation: 'El destructuring extrae propiedades de un objeto y las asigna a variables independientes del mismo nombre de forma limpia y directa.',
    proTip: 'También puedes renombrar variables: const { nombre: alias } = persona; y asignar valores por defecto.'
  },
  {
    id: 'js-09',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es el operador Spread (`...`) y para qué se usa comúnmente al clonar arrays?',
    codeLanguage: 'javascript',
    codeSnippet: 'const lista1 = [1, 2, 3];\nconst copia = [...lista1, 4];',
    options: [
      'Expande los elementos de una colección iterable en un nuevo array sin mutar el original.',
      'Une dos arrays modificando destructivamente lista1.',
      'Es un operador de comparación que evalúa si un array contiene 3 elementos.',
      'Convierte un array en una promesa asíncrona.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El operador spread (...) "desempaqueta" los elementos de un array existente. Permite crear copias superficiales (shallow copies) y agregar nuevos elementos de manera inmutable.',
    proTip: 'Evita lista1.push(4) si trabajas con React o arquitectura inmutable; prefiere [...lista1, 4].'
  },
  {
    id: 'js-10',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué diferencia clave tienen las funciones flecha (arrow functions) respecto al valor de `this`?',
    codeLanguage: 'javascript',
    codeSnippet: 'const obj = {\n    valor: 42,\n    normal: function() { return this.valor; },\n    flecha: () => this.valor\n};',
    options: [
      'Las arrow functions tienen su propio `this` dinámico según quién las llama.',
      'Las arrow functions heredan léxicamente el `this` del contexto en el que fueron creadas y no tienen su propio `this`.',
      'Las funciones tradicionales no permiten el uso de `this`.',
      'No hay ninguna diferencia en el manejo de `this`.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Las funciones flecha no enlazan su propio `this`, `arguments` ni `super`. Capturan el valor de `this` del entorno léxico contenedor.',
    proTip: 'Por esta razón, nunca uses una arrow function como método de un objeto si necesitas acceder a las propiedades del propio objeto con this.'
  },
  {
    id: 'js-11',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué valor devuelve una función `async` en JavaScript de forma obligatoria y garantizada?',
    codeLanguage: 'javascript',
    codeSnippet: 'async function obtenerDato() {\n    return "Hola";\n}',
    options: [
      'El string directo "Hola"',
      'Una Promesa (Promise) que se resuelve con "Hola"',
      'undefined',
      'Un objeto XMLHttpRequest'
    ],
    correctAnswerIndex: 1,
    explanation: 'Cualquier función declarada con `async` siempre devuelve automáticamente una Promesa. Si retornas un valor no promesa, JavaScript lo envuelve en Promise.resolve(valor).',
    proTip: 'Para consumir su resultado debes usar `await obtenerDato()` o `.then(res => console.log(res))`. '
  },
  {
    id: 'js-12',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué ocurre al intentar usar la palabra clave `await` fuera de una función `async` (en entornos sin top-level await)?',
    codeLanguage: 'javascript',
    codeSnippet: 'function cargar() {\n    const res = await fetch("/api/datos");\n    return res.json();\n}',
    options: [
      'Funciona perfectamente sin advertencias.',
      'Lanza un SyntaxError indicando que `await` solo es válido en funciones async.',
      'Convierte automáticamente la función a un bucle infinito.',
      'Pausa la CPU del ordenador durante 5 segundos.'
    ],
    correctAnswerIndex: 1,
    explanation: '`await` solo puede utilizarse dentro de funciones declaradas con la palabra reservada `async` (o en el nivel superior de módulos ES modernos que soporten top-level await).',
    proTip: 'La solución es declarar la función como: `async function cargar() { ... }`.'
  },
  {
    id: 'js-13',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es el Operador de Encadenamiento Opcional (`?.`) y cómo evita errores?',
    codeLanguage: 'javascript',
    codeSnippet: 'const calle = usuario?.direccion?.calle;',
    options: [
      'Si usuario o direccion es null o undefined, devuelve undefined inmediatamente sin lanzar un TypeError.',
      'Crea automáticamente el objeto direccion si no existía.',
      'Lanza un error personalizado en la consola.',
      'Es un operador para buscar en la base de datos.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El optional chaining (?.) evalúa la propiedad de forma segura: si la referencia antes del ?. es null o undefined, la expresión se cortocircuita y devuelve undefined en lugar de romper la app con "Cannot read property of undefined".',
    proTip: 'Combínalo con nullish coalescing: usuario?.direccion?.calle ?? "Sin calle".'
  },
  {
    id: 'js-14',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia entre el operador `||` y el operador `??` (Nullish Coalescing)?',
    codeLanguage: 'javascript',
    codeSnippet: 'const a = 0 || 10;\nconst b = 0 ?? 10;\nconsole.log(a, b);',
    options: [
      '`||` evalúa falsy (0, "", false son falsy y devuelven 10), mientras que `??` solo evalúa null o undefined (0 es un número válido y se preserva).',
      'Ambos devuelven 10 en las dos variables.',
      'Ambos devuelven 0 en las dos variables.',
      '`??` solo funciona con booleanos.'
    ],
    correctAnswerIndex: 0,
    explanation: '`||` comprueba valores "falsy" (0, false, "", NaN, null, undefined). `??` solo actúa si el valor es estrictamente `null` o `undefined`. Por tanto: 0 || 10 es 10, pero 0 ?? 10 es 0.',
    proTip: 'Usa siempre `??` cuando manejes números (ej. cantidad: 0) o cadenas de texto vacías que son valores válidos.'
  },
  {
    id: 'js-15',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué error causa olvidar llamar a `event.preventDefault()` en el handler de envío (`onSubmit`) de un formulario en el navegador?',
    codeLanguage: 'javascript',
    codeSnippet: 'formulario.addEventListener("submit", (e) => {\n    // ¿Qué ocurre si no ponemos e.preventDefault()?\n    enviarPorAjax();\n});',
    options: [
      'El navegador recarga la página por defecto y cancela la petición asíncrona.',
      'El formulario se borra del DOM inmediatamente.',
      'La función enviarPorAjax() se ejecuta 10 veces en paralelo.',
      'El botón de submit se desactiva permanentemente.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El comportamiento por defecto del evento submit en navegadores web es recargar la página o navegar a la URL del atributo action. `e.preventDefault()` previene esa recarga permitiendo manejar el formulario por JavaScript/SPA.',
    proTip: 'En SPAs (React, Vue, vanilla JS) la primera línea de tu handleSubmit casi siempre debe ser e.preventDefault().'
  },
  {
    id: 'js-16',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué método moderno de `fetch()` convierte el cuerpo de una respuesta HTTP en un objeto JavaScript utilizable?',
    codeLanguage: 'javascript',
    codeSnippet: 'const res = await fetch("/api/productos");\nconst datos = await res.json();',
    options: [
      'res.parse()',
      'res.json()',
      'JSON.stringify(res)',
      'res.toObject()'
    ],
    correctAnswerIndex: 1,
    explanation: '`res.json()` es un método asíncrono que lee el flujo del cuerpo de la respuesta HTTP hasta el final y lo parsea como JSON, devolviendo una promesa con los datos.',
    proTip: 'Recuerda que res.json() es asíncrono y requiere await: "const datos = await res.json();".'
  },
  {
    id: 'js-17',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es el hoisting en JavaScript y cómo afecta a las declaraciones con `var` frente a `let`/`const`?',
    codeLanguage: 'javascript',
    codeSnippet: 'console.log(a); // ¿Qué pasa?\nvar a = 5;',
    options: [
      'Lanza ReferenceError inmediato.',
      'Imprime `undefined` porque la declaración de `var` es elevada (hoisted) e inicializada como undefined.',
      'Imprime 5 directamente.',
      'El código no compila.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Con `var`, la declaración se eleva al inicio del ámbito y se inicializa con undefined. Con `let` y `const`, también se elevan pero permanecen en la Zona Muerta Temporal (TDZ), por lo que acceder a ellas antes lanza ReferenceError.',
    proTip: 'El hoisting con var era fuente constante de bugs; la TDZ de let/const ayuda a detectar variables usadas antes de su declaración.'
  },
  {
    id: 'js-18',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo se comprueba si un array contiene al menos un elemento que cumpla una condición determinada?',
    codeLanguage: 'javascript',
    codeSnippet: 'const notas = [4, 7, 2, 9];\nconst haySobresaliente = notas.some(nota => nota >= 9);',
    options: [
      'notas.every(...)',
      'notas.some(...)',
      'notas.includes(...)',
      'notas.has(...)'
    ],
    correctAnswerIndex: 1,
    explanation: '`.some()` devuelve `true` si al menos un elemento satisface la condición del callback (y se detiene de inmediato). `.every()` exige que TODOS los elementos la cumplan.',
    proTip: '`.includes(valor)` busca por igualdad directa de valor, mientras que `.some(callback)` evalúa una expresión lógica.'
  },
  {
    id: 'js-19',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Por qué la comparación `[] == []` y `{} == {}` devuelve `false` en JavaScript?',
    codeLanguage: 'javascript',
    codeSnippet: 'console.log([] == []); // false\nconsole.log({} == {}); // false',
    options: [
      'Porque los arrays y objetos son tipos por referencia, y cada literal crea una nueva dirección distinta en memoria.',
      'Porque los arrays vacíos se consideran NaN.',
      'Porque JavaScript prohíbe comparar objetos vacíos.',
      'Porque falta usar triple igual ===.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Los tipos complejos (objetos, arrays) se comparan por referencia en memoria, no por valor estructural. Dos objetos creados por separado tienen direcciones de memoria diferentes, por lo que nunca son iguales.',
    proTip: 'Para comparar arrays o estructuras por contenido, se recorren sus elementos o se usa una función como isEqual() de utilidades.'
  },
  {
    id: 'js-20',
    categoryId: 'javascript',
    categoryName: 'JavaScript Core',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Para qué sirve el almacenamiento local `localStorage` del navegador y qué tipo de datos guarda?',
    codeLanguage: 'javascript',
    codeSnippet: 'localStorage.setItem("tema", "oscuro");\nconst tema = localStorage.getItem("tema");',
    options: [
      'Almacena datos en el servidor de base de datos MySQL.',
      'Almacena pares clave-valor de forma persistente en el navegador del usuario en formato string.',
      'Almacena archivos multimedia pesados hasta 50 GB.',
      'Borra los datos automáticamente al cerrar la pestaña.'
    ],
    correctAnswerIndex: 1,
    explanation: 'localStorage guarda hasta ~5MB de datos por dominio que persisten incluso tras reiniciar el navegador. Guarda únicamente cadenas (strings), por lo que para guardar objetos se usa JSON.stringify().',
    proTip: 'Si quieres que los datos se borren al cerrar la pestaña o ventana, usa sessionStorage en lugar de localStorage.'
  }
];
