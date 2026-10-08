import { Question } from '../types/quiz';

export const JUNIOR_REACT_QUESTIONS: Question[] = [
  {
    id: 'react-02',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Por qué no se debe mutar el estado directamente en React con `contador++` o `items.push()`?',
    codeLanguage: 'tsx',
    codeSnippet: 'const [contador, setContador] = useState(0);\n\nfunction handleClick() {\n    contador++; // ¿Por qué esto es un bug grave?\n}',
    options: [
      'Porque React no detecta la mutación directa y el componente NO se volverá a renderizar con el nuevo valor en la pantalla.',
      'Porque JavaScript no permite el operador ++ en variables numéricas.',
      'Porque el navegador se bloquea por falta de memoria.',
      'Porque contador se convierte en un string.'
    ],
    correctAnswerIndex: 0,
    explanation: 'React depende de la inmutabilidad para detectar cambios mediante comparación superficial (shallow equality). Si mutas la variable directamente sin llamar a la función de actualización `setContador(contador + 1)`, React no sabe que hubo un cambio y la interfaz visual no se actualiza.',
    proTip: 'Siempre trata el estado como de solo lectura y actualízalo usando la función `setEstado` proporcionada por useState.'
  },
  {
    id: 'react-03',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Por qué es obligatorio asignar una prop `key` única al renderizar una lista con `.map()` en React?',
    codeLanguage: 'tsx',
    codeSnippet: '<ul>\n  {usuarios.map(u => (\n    <li key={u.id}>{u.nombre}</li>\n  ))}\n</ul>',
    options: [
      'Para que React identifique qué elementos cambiaron, se agregaron o eliminaron durante la reconciliación del Virtual DOM de forma eficiente.',
      'Para darle estilos CSS automáticos a cada ítem de la lista.',
      'Porque el navegador HTML exige una etiqueta key en todas las etiquetas <li>.',
      'Para ordenar alfabéticamente los elementos.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Las keys ayudan a React a identificar qué ítems han cambiado o se han reordenado. Permite reutilizar nodos del DOM existentes en lugar de re-renderizar la lista entera desde cero.',
    proTip: 'Evita usar el índice del array (`key={index}`) si los elementos pueden reordenarse, filtrarse o eliminarse; usa siempre un ID único estable (ej. `u.id`).'
  },
  {
    id: 'react-04',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué ocurre si ejecutas `useEffect` sin pasarle un array de dependencias (segundo argumento)?',
    codeLanguage: 'tsx',
    codeSnippet: 'useEffect(() => {\n    console.log("Efecto ejecutado");\n    // Sin segundo argumento\n});',
    options: [
      'El efecto se ejecutará únicamente una sola vez cuando el componente se monte.',
      'El efecto se ejecutará en CADA render del componente (en el montaje y en cada actualización de cualquier estado o prop).',
      'Lanza un SyntaxError inmediato.',
      'Nunca se ejecuta a menos que se invoque manualmente.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Sin array de dependencias, `useEffect` corre tras cada renderizado del componente. Si dentro de ese efecto actualizas estado, provocarás un bucle infinito de re-renders.',
    proTip: 'Usa `[]` (array vacío) si solo quieres que se ejecute una vez al montar, o `[variable]` si quieres que corra solo cuando esa variable cambie.'
  },
  {
    id: 'react-05',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es la regla fundamental sobre DÓNDE se pueden llamar los Hooks en React?',
    codeLanguage: 'tsx',
    codeSnippet: 'function MiComponente({ activo }) {\n    if (activo) {\n        const [dato, setDato] = useState(0); // ¿Es válido?\n    }\n}',
    options: [
      'No es válido; los Hooks solo deben llamarse en el nivel superior del componente, nunca dentro de condicionales, bucles o funciones anidadas.',
      'Es completamente válido siempre que activo sea un booleano.',
      'Los Hooks solo pueden llamarse dentro de bloques try/catch.',
      'Solo useEffect tiene restricciones, useState puede ir en cualquier lugar.'
    ],
    correctAnswerIndex: 0,
    explanation: 'React depende del orden exacto en que se llaman los Hooks en cada render. Si los envuelves en un if o bucle, el orden cambiaría entre renders, corrompiendo el estado interno de React.',
    proTip: 'Instala y respeta siempre el plugin `eslint-plugin-react-hooks` para detectar estas violaciones en tiempo de escritura.'
  },
  {
    id: 'react-06',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Por qué este botón no espera al clic y ejecuta la función inmediatamente durante el render?',
    codeLanguage: 'tsx',
    codeSnippet: 'function Boton() {\n    function handleClick() { alert("Clic!"); }\n    return <button onClick={handleClick()}>Púlsame</button>;\n}',
    options: [
      'Porque se pusieron paréntesis `handleClick()`, invocando la función durante el render en vez de pasar la referencia `onClick={handleClick}`.',
      'Porque React prohíbe el uso de alert().',
      'Porque el botón debe llevar el tipo type="submit".',
      'Porque onClick debe escribirse en minúsculas onclick.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Escribir `onClick={handleClick()}` con paréntesis ejecuta la función en el instante en que el JSX se evalúa. Para pasar el manejador se pasa la referencia: `onClick={handleClick}` o una función flecha `onClick={() => handleClick()}`.',
    proTip: 'Este es uno de los 3 errores más comunes en entrevistas y pruebas técnicas de React para juniors.'
  },
  {
    id: 'react-07',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es un Fragmento en React (`<React.Fragment>` o `<>...</>`) y para qué se usa?',
    codeLanguage: 'tsx',
    codeSnippet: 'function Lista() {\n    return (\n        <>\n            <h1>Título</h1>\n            <p>Descripción</p>\n        </>\n    );\n}',
    options: [
      'Permite agrupar una lista de elementos hijos sin añadir un nodo extra innecesario (como un <div>) al DOM HTML final.',
      'Es un componente para cargar animaciones CSS complejas.',
      'Sirve para crear hilos en segundo plano (Web Workers).',
      'Obliga a que el contenido se renderice en el servidor.'
    ],
    correctAnswerIndex: 0,
    explanation: 'En React, un componente debe retornar un único elemento raíz. Los fragmentos (`<>...</>`) cumplen esa regla sintáctica sin ensuciar el árbol del DOM con divs adicionales.',
    proTip: 'Si necesitas pasar una prop `key` al fragmento (por ejemplo en un map), usa la sintaxis explícita `<React.Fragment key={id}>`.'
  },
  {
    id: 'react-08',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo se pasa y se recibe información desde un componente padre a un componente hijo en React?',
    codeLanguage: 'tsx',
    codeSnippet: '// Padre:\n<Tarjeta titulo="Perfil" edad={25} />\n\n// Hijo:\nfunction Tarjeta({ titulo, edad }) { ... }',
    options: [
      'A través de las Props (propiedades), que viajan en una sola dirección (unidireccional) de padre a hijo.',
      'A través de variables globales en la ventana window.',
      'Usando cookies del navegador.',
      'A través de eventos de sockets WebSocket.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El flujo de datos en React es unidireccional. Los componentes padres pasan datos a sus hijos a través de props, las cuales son de solo lectura (inmutables) para el hijo.',
    proTip: 'Nunca intentes modificar una prop recibida (`props.titulo = "otro"`); si el hijo necesita cambiar el valor, el padre debe pasarle una función callback.'
  },
  {
    id: 'react-09',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es un Input Controlado (Controlled Component) en React?',
    codeLanguage: 'tsx',
    codeSnippet: '<input\n    type="text"\n    value={nombre}\n    onChange={(e) => setNombre(e.target.value)}\n/>',
    options: [
      'Un campo de entrada cuyo valor está controlado directamente por el estado de React (`value`) y se actualiza mediante un evento (`onChange`).',
      'Un campo que solo permite caracteres numéricos controlados.',
      'Un input que no puede ser modificado por el usuario bajo ninguna circunstancia.',
      'Un input que se valida exclusivamente en el servidor backend.'
    ],
    correctAnswerIndex: 0,
    explanation: 'En un componente controlado, el estado de React es la "única fuente de la verdad" (Single Source of Truth). El valor mostrado en pantalla refleja exactamente el estado actual de React.',
    proTip: 'Esto permite validar datos en tiempo real (ej. caracteres restantes, formato de email) a medida que el usuario escribe.'
  },
  {
    id: 'react-10',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Por qué actualizar el estado 3 veces consecutivas con el mismo valor previo solo incrementa en 1?',
    codeLanguage: 'tsx',
    codeSnippet: 'const [conteo, setConteo] = useState(0);\n\nfunction sumarTres() {\n    setConteo(conteo + 1);\n    setConteo(conteo + 1);\n    setConteo(conteo + 1);\n}',
    options: [
      'Porque React agrupa las actualizaciones (batching) y en todas las llamadas `conteo` sigue valiendo 0 durante ese render; para encadenar se debe usar la forma funcional `setConteo(prev => prev + 1)`.',
      'Porque useState tiene un límite de una actualización por función.',
      'Porque el navegador omite funciones repetidas.',
      'Porque conteo es una variable global.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Las actualizaciones de estado son asíncronas y se procesan por lotes. Todas las llamadas usan el valor de `conteo` del render actual (0). Usando la función actualizadora `setConteo(prev => prev + 1)` garantizas trabajar con el estado más reciente.',
    proTip: 'Siempre que el nuevo estado dependa del valor anterior, usa la forma de función de actualización `prev => prev + 1`.'
  },
  {
    id: 'react-11',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo se limpia un temporizador o suscripción en `useEffect` cuando el componente se desmonta?',
    codeLanguage: 'tsx',
    codeSnippet: 'useEffect(() => {\n    const timer = setInterval(() => console.log("Tick"), 1000);\n    // ¿Cómo limpiarlo?\n    return () => clearInterval(timer);\n}, []);',
    options: [
      'Retornando una función de limpieza (cleanup function) dentro del callback de useEffect.',
      'Llamando a stopEffect() al final del archivo.',
      'No hace falta, React destruye los intervalos automáticamente.',
      'Usando la etiqueta <clearTimer /> en el JSX.'
    ],
    correctAnswerIndex: 0,
    explanation: 'La función devuelta por `useEffect` es la función de limpieza (cleanup). React la ejecuta cuando el componente se desmonta o antes de re-ejecutar el efecto si las dependencias cambiaron.',
    proTip: 'Olvidar limpiar intervalos o eventListeners genera fugas de memoria (memory leaks) graves en aplicaciones de producción.'
  },
  {
    id: 'react-12',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Para qué sirve el Hook `useRef` en React y qué lo diferencia de `useState`?',
    codeLanguage: 'tsx',
    codeSnippet: 'const miInputRef = useRef<HTMLInputElement>(null);\nconst clicsRef = useRef(0);',
    options: [
      'Guarda una referencia mutable que persiste entre renders pero NO provoca un re-render del componente al ser modificada.',
      'Hace que el componente sea más rápido comprimiendo el HTML.',
      'Es idéntico a useState pero exclusivo para strings.',
      'Se usa para hacer llamadas HTTP fetch.'
    ],
    correctAnswerIndex: 0,
    explanation: '`useRef` devuelve un objeto `{ current: valor }`. Cambiar `ref.current` no desencadena un re-renderizado. Se usa para acceder a elementos reales del DOM o guardar valores mutables como IDs de temporizadores.',
    proTip: 'Para poner el foco en un input automáticamente: `miInputRef.current?.focus()`.'
  },
  {
    id: 'react-13',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es el "Levantamiento de Estado" (Lifting State Up) en la arquitectura de React?',
    codeLanguage: 'tsx',
    codeSnippet: '// Componente Padre almacena el estado común y pasa callbacks a HijoA y HijoB',
    options: [
      'Mover el estado al ancestro común más cercano de dos componentes hijos que necesitan compartir y sincronizar esa información.',
      'Subir el estado a un servidor en la nube con GraphQL.',
      'Convertir el estado en una variable global en el index.html.',
      'Eliminar los componentes hijos y juntar todo en un solo archivo de 3000 líneas.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Cuando dos componentes hermanos necesitan compartir datos o sincronizarse, la solución idónea en React es mover el estado al componente padre común y pasárselo a los hijos vía props y callbacks.',
    proTip: 'Esta técnica resuelve la gran mayoría de necesidades de comunicación entre componentes sin necesitar Redux o Zustand al inicio.'
  },
  {
    id: 'react-14',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué error visual puede provocar usar el operador `&&` para renderizado condicional con números?',
    codeLanguage: 'tsx',
    codeSnippet: 'const [total, setTotal] = useState(0);\nreturn (\n    <div>\n        {total && <p>Tienes {total} mensajes</p>}\n    </div>\n);',
    options: [
      'Imprime un "0" visible en la pantalla cuando total vale 0, porque 0 es falsy y JavaScript evalúa la expresión devolviendo 0.',
      'Lanza un TypeError en tiempo de ejecución.',
      'Borra el div contenedor del DOM.',
      'El componente se niega a compilar.'
    ],
    correctAnswerIndex: 0,
    explanation: 'En JavaScript, la expresión `0 && <Componente />` devuelve `0`. React renderiza el número 0 como texto visible en la pantalla. Para evitarlo, usa un booleano explícito: `{total > 0 && ...}` o un ternario `{total ? ... : null}`.',
    proTip: 'Usa siempre una condición booleana explícita con `&&` (ej. `mensajes.length > 0 && ...` en vez de `mensajes.length && ...`).'
  },
  {
    id: 'react-15',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es la forma correcta de renderizar contenido condicional (mostrar un botón u otro según si el usuario está autenticado)?',
    codeLanguage: 'tsx',
    codeSnippet: 'return (\n    <div>\n        {estaAutenticado ? <BotonSalir /> : <BotonEntrar />}\n    </div>\n);',
    options: [
      'Usando el operador ternario `condicion ? <Verdadero /> : <Falso />`.',
      'Usando un bucle while dentro del JSX.',
      'Creando dos archivos de componentes separados obligatoriamente.',
      'Declarando una etiqueta <if> en el HTML.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El operador ternario es la forma más limpia y idiomática de renderizar una de dos alternativas visuales en JSX.',
    proTip: 'Para condicionales complejos con más de 2 estados, es más limpio separar la lógica en una función auxiliar o usar switch fuera del JSX.'
  },
  {
    id: 'react-16',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Para qué sirve la prop especial `children` en un componente de React?',
    codeLanguage: 'tsx',
    codeSnippet: 'function Contenedor({ children }) {\n    return <div className="caja">{children}</div>;\n}\n// Uso:\n<Contenedor><p>Texto adentro</p></Contenedor>',
    options: [
      'Permite pasar cualquier elemento, componente o texto anidado dentro de las etiquetas de apertura y cierre del componente (composición de componentes).',
      'Indica la edad del usuario si la aplicación es para niños.',
      'Es un contador de subcomponentes en memoria.',
      'Se usa exclusivamente para renderizar listas.'
    ],
    correctAnswerIndex: 0,
    explanation: '`props.children` es la base del patrón de composición en React. Permite crear componentes envoltorios reutilizables como Modales, Tarjetas o Layouts que no necesitan saber de antemano qué contenido mostrarán dentro.',
    proTip: 'Favorece la composición usando `children` frente a herencia de componentes.'
  },
  {
    id: 'react-17',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué herramienta moderna de bundling y servidor de desarrollo es ampliamente utilizada por su extrema velocidad en lugar de Create React App?',
    codeLanguage: 'bash',
    codeSnippet: 'npm create vite@latest mi-app -- --template react-ts',
    options: [
      'Vite',
      'jQuery',
      'Apache Struts',
      'Flash Player'
    ],
    correctAnswerIndex: 0,
    explanation: 'Vite es la herramienta de desarrollo moderna recomendada oficialmente por la comunidad de React. Utiliza ES Modules nativos y Rollup/esbuild para proporcionar arranques instantáneos y Hot Module Replacement (HMR) ultrarrápido.',
    proTip: 'Create React App (CRA) está deprecado y obsoleto; Vite y Next.js son los estándares actuales.'
  },
  {
    id: 'react-18',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo se pasan argumentos a una función manejadora de eventos en JSX?',
    codeLanguage: 'tsx',
    codeSnippet: '// ¿Cuál es la sintaxis correcta para pasar el id del usuario?',
    options: [
      '<button onClick={() => eliminarUsuario(u.id)}>Eliminar</button>',
      '<button onClick={eliminarUsuario(u.id)}>Eliminar</button>',
      '<button onClick=eliminarUsuario(u.id)>Eliminar</button>',
      '<button onClick="{() => eliminarUsuario(u.id)}">Eliminar</button>'
    ],
    correctAnswerIndex: 0,
    explanation: 'Para pasar argumentos personalizados al hacer clic, se debe envolver la llamada en una función flecha: `() => eliminarUsuario(u.id)`. De lo contrario, se ejecutaría inmediatamente durante el renderizado.',
    proTip: 'Si solo necesitas el evento sintético sin argumentos adicionales, puedes pasar la referencia directa: `onClick={manejarClick}`.'
  },
  {
    id: 'react-19',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es el Context API (`createContext` y `useContext`) en React y cuándo es útil para un junior?',
    codeLanguage: 'tsx',
    codeSnippet: 'const TemaContext = createContext("claro");\n// En cualquier componente hijo profundo:\nconst tema = useContext(TemaContext);',
    options: [
      'Permite compartir datos globales (como tema claro/oscuro o usuario autenticado) a través del árbol de componentes sin tener que pasar props manualmente por cada nivel (prop drilling).',
      'Sirve para reemplazar todas las bases de datos SQL.',
      'Es un método para compilar código C en el navegador.',
      'Controla la velocidad del procesador en dispositivos móviles.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Context resuelve el problema de "prop drilling" (pasar una prop a través de 5 componentes intermedios que no la necesitan solo para que llegue al sexto).',
    proTip: 'No uses Context para todo el estado de la app; úsalo para datos verdaderamente globales como autenticación, idioma o preferencias de tema.'
  },
  {
    id: 'react-20',
    categoryId: 'react',
    categoryName: 'React & Ecosystem',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué problema ocurre si actualizas un array en el estado usando `items.push(nuevoItem)` antes de llamar a `setItems`?',
    codeLanguage: 'tsx',
    codeSnippet: 'const [tareas, setTareas] = useState(["A", "B"]);\nfunction agregar() {\n    tareas.push("C");\n    setTareas(tareas);\n}',
    options: [
      'React no detectará el cambio porque `tareas` sigue apuntando exactamente a la misma referencia del array en memoria, y el componente podría no re-renderizar.',
      'Lanza un SyntaxError inmediato.',
      'El array se reinicia a vacío.',
      'Los elementos se añaden en orden inverso.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Al hacer `tareas.push()`, estás mutando el array existente. Cuando haces `setTareas(tareas)`, React compara la referencia anterior con la nueva: son el mismo array en memoria, por lo que asume que nada cambió. La solución correcta e inmutable es: `setTareas([...tareas, "C"])`.',
    proTip: 'Regla de oro: con arrays en el estado usa siempre `[...items, nuevo]` para agregar, y `.filter(...)` para eliminar.'
  }
];
