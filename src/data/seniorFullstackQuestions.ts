import { Question } from '../types/quiz';

export const SENIOR_FULLSTACK_QUESTIONS: Question[] = [
  // ==================== REACT 19 & MODERN FRONTEND (15 Preguntas) ====================
  {
    id: 'fs-01',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué ventaja arquitectónica clave aporta el hook useActionState de React 19 frente a useState para mutaciones asíncronas?',
    codeLanguage: 'typescript',
    codeSnippet: `const [state, formAction, isPending] = useActionState(
  async (prevState, formData) => {
    return await updateUserProfile(formData);
  },
  initialState
);`,
    options: [
      'Ejecuta la mutación en un Web Worker en segundo plano.',
      'Maneja automáticamente el pending state, transiciones concurrentes y progressive enhancement.',
      'Sustituye completamente la necesidad de usar TanStack Query o Redux.',
      'Sincroniza el estado del formulario con IndexedDB de forma nativa.'
    ],
    correctAnswerIndex: 1,
    explanation: 'useActionState en React 19 integra transiciones concurrentes, expone el estado isPending durante la acción asíncrona, gestiona el retorno de estado acumulado y soporta progressive enhancement en formularios HTML sin JavaScript inicial.',
    proTip: 'Combina useActionState con useOptimistic para actualizar la interfaz antes de que la promesa de red se resuelva.'
  },
  {
    id: 'fs-02',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Por qué la siguiente comunicación entre un Server Component y un Client Component falla en React Server Components (RSC)?',
    codeLanguage: 'typescript',
    codeSnippet: `// ServerComponent.tsx
import { ClientFilterModal } from './ClientFilterModal';

export default async function ProductCatalog() {
  const filterCallback = (item: Product) => item.stock > 0;
  return <ClientFilterModal onFilter={filterCallback} />;
}`,
    options: [
      'Los Server Components no pueden importar Client Components directamente.',
      'No se pueden pasar funciones o callbacks como props a través de la frontera Server-to-Client porque no son serializables.',
      'Las props de Client Components deben definirse exclusivamente como string o number.',
      'Falta la directiva "use server" en la cabecera de la función filterCallback.'
    ],
    correctAnswerIndex: 1,
    explanation: 'En la arquitectura RSC, las props que cruzan la frontera entre el servidor y el cliente se serializan mediante el protocolo de streaming de React (JSON-like wire format). Las funciones (closures) no pueden serializarse por la red; solo pueden pasarse Server Actions con referencias válidas.',
    proTip: 'Si necesitas lógica interactiva o callbacks, traslada el estado y los manejadores de eventos al Client Component.'
  },
  {
    id: 'fs-03',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En React 19, ¿cómo gestiona useOptimistic la reversión (rollback) si la mutación en el backend falla con error 500?',
    codeLanguage: 'typescript',
    codeSnippet: `const [optimisticLikes, setOptimisticLikes] = useOptimistic(
  likes,
  (current, delta: number) => current + delta
);`,
    options: [
      'Es obligatorio llamar explícitamente a setOptimisticLikes.rollback() en el catch.',
      'React revierte automáticamente el estado optimista cuando finaliza la transición asíncrona si el estado real no cambió.',
      'Invoca automáticamente una recarga completa de la página (window.location.reload).',
      'Guarda una instantánea en localStorage y revierte desde la caché del navegador.'
    ],
    correctAnswerIndex: 1,
    explanation: 'useOptimistic está vinculado a una transición asíncrona (startTransition o action). Cuando la transición concluye, React descarta el valor temporal optimista y refleja el estado real retornado por el servidor o mantenido en el estado base.',
    proTip: 'Asegúrate de ejecutar la mutación que actualiza useOptimistic dentro de una Transition para que el ciclo de vida del estado sea seguro.'
  },
  {
    id: 'fs-04',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Con la llegada del React Compiler (React Forget), ¿cuál es el nuevo paradigma respecto al uso de useMemo y useCallback?',
    options: [
      'useMemo y useCallback quedan deprecados con advertencias en consola.',
      'El compilador auto-memoriza componentes y hooks a nivel de AST, reduciendo el código boilerplate manual.',
      'El compilador convierte todos los hooks en funciones generadoras de WebAssembly.',
      'Los hooks de memorización son obligatorios en todas las funciones con más de dos parámetros.'
    ],
    correctAnswerIndex: 1,
    explanation: 'React Compiler analiza el flujo de datos del código en tiempo de compilación y aplica memorización granular automática sin requerir arreglos de dependencias manuales propensos a bugs humanos.',
    proTip: 'El código debe respetar estrictamente las "Reglas de React" (inmutabilidad, funciones puras sin efectos secundarios en render) para que el compilador optimice con éxito.'
  },
  {
    id: 'fs-05',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia fundamental entre useTransition y useDeferredValue en la gestión de prioridades de concurrencia?',
    options: [
      'useTransition se usa para actualizar código CSS, mientras useDeferredValue maneja animaciones SVG.',
      'useTransition envuelve la función que despacha la actualización de estado; useDeferredValue difiere el valor derivado recibido por props.',
      'useDeferredValue se ejecuta en un Service Worker, y useTransition se ejecuta en el hilo principal.',
      'No existe ninguna diferencia; son alias intercambiables.'
    ],
    correctAnswerIndex: 1,
    explanation: 'useTransition permite marcar una invocación de setState como no bloqueante (baja prioridad). useDeferredValue se usa cuando no controlas el setState (por ejemplo, si recibes un valor vía props) y necesitas diferir el re-render de un subárbol pesado.',
    proTip: 'Combina useDeferredValue con React.memo en componentes hijos para evitar renders prematuros mientras el nuevo valor se procesa.'
  },
  {
    id: 'fs-06',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Por qué este código genera un error crítico de Hydration Mismatch en frameworks como Next.js o Remix?',
    codeLanguage: 'typescript',
    codeSnippet: `export function UserBanner() {
  const isOnline = typeof window !== 'undefined' ? navigator.onLine : false;
  return <div>Estado: {isOnline ? 'En línea' : 'Desconectado'}</div>;
}`,
    options: [
      'navigator.onLine es una API exclusiva de Electron.',
      'El árbol HTML generado en el servidor difiere del primer render en el cliente durante la hidratación.',
      'La función no devuelve un elemento con etiqueta <main>.',
      'TypeScript no permite evaluar typeof window en tiempo de compilación.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Durante la hidratación, React exige que el DOM generado por el servidor sea idéntico al primer render del cliente. Al consultar window o navigator en render, el servidor renderiza "Desconectado" y el cliente "En línea", disparando un Hydration Mismatch.',
    proTip: 'Usa useEffect para actualizar estados dependientes del cliente tras el montaje o usa supresión selectiva con suppressHydrationWarning solo si es estrictamente necesario.'
  },
  {
    id: 'fs-07',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En TanStack Query v5, ¿cuál es la mejor práctica para evitar condiciones de carrera (race conditions) y claves inconsistentes?',
    codeLanguage: 'typescript',
    codeSnippet: `// Consulta A
queryKey: ['users', id, { filter }]
// Consulta B
queryKey: ['users', { filter }, id]`,
    options: [
      'Usar siempre strings planos como claves de consulta sin objetos.',
      'Implementar un Query Key Factory pattern que estructure jerárquicamente tuplas ordenadas.',
      'Desactivar la caché con gcTime: 0 en todas las consultas del cliente.',
      'Llamar a queryClient.clear() antes de cada navegación de ruta.'
    ],
    correctAnswerIndex: 1,
    explanation: 'TanStack Query compara los elementos del array de queryKey por orden de índices. Si los argumentos no tienen una estructura uniforme generada por un Query Key Factory, las consultas se tratan como claves distintas, provocando duplicación de caché e invalidaciones rotas.',
    proTip: 'Un patrón: const userKeys = { all: ["users"] as const, detail: (id: string) => [...userKeys.all, "detail", id] as const }.'
  },
  {
    id: 'fs-08',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En Zustand, ¿cómo se implementan actualizaciones transitorias (transient updates) para estados de alta frecuencia (como 60fps o coordenadas)?',
    options: [
      'Usando useStore.getState() y suscribiéndose con store.subscribe sin forzar re-render de componentes de React.',
      'Aumentando el debounce de React a 16 milisegundos en el Root.',
      'Invocando ReactDOM.flushSync() dentro del evento mousemove.',
      'Moviendo el estado de Zustand a variables globales en el objeto window.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Para eventos de 60 FPS (cursores en tiempo real, sliders, canvas), provocar re-renders en React satura el hilo principal. Con transient updates te suscribes directamente a la mutación en el DOM sin que el componente vuelva a renderizarse.',
    proTip: 'Usa el middleware subscribeWithSelector para escuchar cambios de atributos específicos y modificar las propiedades del DOM por referencia (refs).'
  },
  {
    id: 'fs-09',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es el riesgo de seguridad más común al exponer Server Actions de React en frameworks fullstack si no se audita adecuadamente?',
    options: [
      'Que el archivo fuente de TypeScript se descargue al navegador del usuario.',
      'Tratar las Server Actions como funciones internas privadas en vez de endpoints HTTP públicos que requieren autenticación y autorización explícita.',
      'Inyección de dependencias cíclicas en el bundler Vite o Webpack.',
      'Bloqueo permanente del Garbage Collector en el worker de Node.js.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Cada Server Action exportada se convierte en un endpoint HTTP POST invocable por cualquier cliente. Si un atacante descubre el identificador de la acción, puede invocarla directamente; por eso debe validar sesión, RBAC y esquemas Pydantic/Zod internamente.',
    proTip: 'Nunca asumas que un Server Action solo será llamado desde el botón de la UI que lo renderiza; valida permisos en la primera línea de la función.'
  },
  {
    id: 'fs-10',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Dónde delega React los manejadores de eventos sintéticos (SyntheticEvent) a partir de React 17 y 18?',
    options: [
      'En el objeto global document del navegador.',
      'En el nodo raíz contenedor donde se monta el root de React (root DOM container).',
      'En cada elemento DOM individual usando addEventListener.',
      'En el objeto window de la ventana activa.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Antes de React 17, los eventos se delegaban en document. A partir de React 17/18/19 se delegan en el contenedor raíz donde se monta createRoot, permitiendo anidar múltiples aplicaciones React o micro-frontends sin colisiones de e.stopPropagation().',
    proTip: 'Esto resolvió la incompatibilidad histórica al combinar aplicaciones legacy con versiones modernas de React en una misma página.'
  },
  {
    id: 'fs-11',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En optimización de Core Web Vitals, ¿cómo se soluciona una métrica deficiente de INP (Interaction to Next Paint) provocada por tareas largas en React?',
    options: [
      'Reemplazando todas las imágenes por vectores SVG.',
      'Dividiendo las tareas largas (Long Tasks > 50ms) y cediendo el hilo principal con scheduler.yield() o setTimeout.',
      'Desactivando el soporte para dispositivos táctiles en el viewport.',
      'Aumentando el tamaño de memoria caché del navegador con Service Workers.'
    ],
    correctAnswerIndex: 1,
    explanation: 'INP mide la latencia de respuesta ante interacciones del usuario. Si un manejador de eventos ejecuta código JavaScript síncrono durante más de 50ms, bloquea el hilo principal impidiendo pintar el siguiente frame. Ceder el hilo con scheduler.yield() permite actualizar la pantalla oportunamente.',
    proTip: 'scheduler.yield() es la API nativa moderna estandarizada para cooperar con el planificador del navegador sin la penalización de 4ms de setTimeout.'
  },
  {
    id: 'fs-12',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Cómo evita este patrón con AbortController condiciones de carrera y fugas de memoria al desmontar componentes en React 18+?',
    codeLanguage: 'typescript',
    codeSnippet: `useEffect(() => {
  const controller = new AbortController();
  fetchData(id, { signal: controller.signal })
    .then(data => setData(data))
    .catch(err => {
      if (err.name !== 'AbortError') setError(err);
    });
  return () => controller.abort();
}, [id]);`,
    options: [
      'AbortController suspende la pestaña del navegador hasta que el componente vuelve a montarse.',
      'Cancela la petición de red HTTP en vuelo si id cambia o el componente se desmonta antes de recibir la respuesta.',
      'Reemplaza la promesa nativa por un hilo pthread de POSIX.',
      'Obliga a React a ignorar el ciclo de vida StrictMode.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Al abortar la señal en la función de limpieza, el navegador descarta la conexión y previene que una respuesta retrasada intente actualizar el estado de un componente con datos obsoletos o ya desmontado.',
    proTip: 'Verifica siempre if (err.name !== "AbortError") en el catch para no reportar cancelaciones intencionales como errores de aplicación.'
  },
  {
    id: 'fs-13',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En arquitecturas de Micro-frontends con Module Federation, ¿cuál es la configuración obligatoria para evitar el error "Invalid hook call: Hooks can only be called inside the body of a function component"?',
    options: [
      'Desactivar el strict mode de TypeScript en el build.',
      'Configurar react y react-dom en la sección shared como singleton: true y requiredVersion estricto.',
      'Compilar cada microfrontend como un archivo .html independiente sin Webpack.',
      'Exponer los componentes únicamente mediante iframes.'
    ],
    correctAnswerIndex: 1,
    explanation: 'React almacena el despachador de hooks en una variable interna del módulo. Si el host y el remote cargan dos instancias físicas separadas de react.js, los hooks se invocan contra el despachador incorrecto, arrojando el error de hooks inválidos.',
    proTip: 'Usa shared: { react: { singleton: true, eager: false, requiredVersion: deps.react } } en tu archivo federation.config.'
  },
  {
    id: 'fs-14',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué capacidad inédita introduce la función use() en React 19 que ningún otro hook previo permitía?',
    options: [
      'Permite ser invocada condicionalmente dentro de bloques if y bucles para resolver Promesas o Contextos.',
      'Permite escribir código SQL directo dentro del archivo JSX.',
      'Permite conectar a bases de datos PostgreSQL sin servidor intermedio.',
      'Sustituye a todos los tags HTML por canvas optimizados.'
    ],
    correctAnswerIndex: 0,
    explanation: 'A diferencia de los hooks convencionales que deben ejecutarse incondicionalmente al nivel superior, use() puede llamarse dentro de condicionales y bucles para leer un Context o suspender el render hasta que una Promesa se resuelva.',
    proTip: 'Si usas use(promise), asegúrate de que la promesa se cree fuera del render o se memorice para no reiniciar la petición en cada ciclo de render.'
  },
  {
    id: 'fs-15',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Para notificaciones y streaming unidireccional de IA en tiempo real, ¿por qué Server-Sent Events (SSE) suele preferirse a WebSockets?',
    options: [
      'SSE utiliza UDP puro sin control de congestión.',
      'SSE opera sobre HTTP/2 estándar, ofrece reconexión automática nativa con Last-Event-ID y atraviesa proxies corporativos sin upgrade de protocolo.',
      'WebSockets no soporta transmisión de texto UTF-8.',
      'SSE no consume conexiones en el servidor backend.'
    ],
    correctAnswerIndex: 1,
    explanation: 'SSE es unidireccional y utiliza HTTP estándar, lo que facilita el balanceo de carga, multiplexación en HTTP/2, compresión y reconexión automática con el header Last-Event-ID, a diferencia de WebSockets que requiere handshake bidireccional con estado.',
    proTip: 'En backends FastAPI o Laravel, un endpoint de streaming SSE es significativamente más sencillo de proteger con cabeceras de autorización Bearer que WebSockets.'
  },

  // ==================== PYTHON 3.12+ & BACKEND (13 Preguntas) ====================
  {
    id: 'fs-16',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Con la implementación de PEP 703 (Free-threaded Python / Desactivación del GIL en Python 3.13+), ¿cuál es el impacto en la concurrencia multihilo?',
    options: [
      'El código Python existente ya no requiere sincronización manual (Locks/Semaphores) para datos compartidos.',
      'Los hilos de Python pueden ejecutar bytecode simultáneamente en múltiples núcleos de CPU, pero las estructuras mutables compartidas exigen mecanismos de sincronización explícitos.',
      'Se elimina el soporte para asyncio y corrutinas.',
      'Se prohíbe el uso de bibliotecas escritas en C o Rust como NumPy.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Sin el GIL, múltiples hilos de Python pueden aprovechar paralelismo real de hardware para tareas de CPU. Sin embargo, esto traslada la responsabilidad de race conditions al desarrollador: mutar diccionarios o listas compartidas entre hilos sin Locks puede corromper datos.',
    proTip: 'Para tareas I/O-bound, asyncio sigue siendo más ligero en memoria; el modo free-threaded brilla en procesamiento de datos y algoritmos intensivos de CPU.'
  },
  {
    id: 'fs-17',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Cuál es el bug crítico al escribir un decorador de funciones si se omite functools.wraps?',
    codeLanguage: 'python',
    codeSnippet: `def medir_tiempo(func):
    def wrapper(*args, **kwargs):
        inicio = time.perf_counter()
        res = func(*args, **kwargs)
        print(f"Duración: {time.perf_counter() - inicio}")
        return res
    return wrapper

@medir_tiempo
def calcular_orden(orden_id: int) -> bool:
    """Calcula impuestos de la orden."""
    return True`,
    options: [
      'La función wrapper siempre arroja un SyntaxError en Python 3.12.',
      'Se pierden los metadatos de la función original (__name__, __doc__, __annotations__), rompiendo frameworks como FastAPI y librerías de introspección.',
      'La función decorada solo puede recibir un argumento posicional.',
      'Se duplica el consumo de memoria en cada invocación.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Sin @functools.wraps(func), calcular_orden.__name__ se convierte en "wrapper" y sus anotaciones de tipos se borran. En FastAPI o Pydantic, esto destruye la validación automática de rutas y la documentación Swagger.',
    proTip: 'Aplica siempre @wraps(func) en el wrapper de cualquier decorador para preservar la firma y metadatos originales.'
  },
  {
    id: 'fs-18',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En Python, ¿qué ventaja operativa ofrece la expresión yield from frente a un bucle for item in sub_generator: yield item?',
    codeLanguage: 'python',
    codeSnippet: `def procesar_lotes(generadores):
    for gen in generadores:
        yield from gen`,
    options: [
      'Convierte el generador en una tupla inmutable en memoria RAM.',
      'Establece un canal bidireccional transparente que delega excepciones (.throw()), envíos (.send()) y el valor de retorno final (.return).',
      'Ejecuta los generadores en subprocesos aislados del sistema operativo.',
      'Impide que se levanten excepciones de tipo StopIteration.'
    ],
    correctAnswerIndex: 1,
    explanation: 'yield from no solo delega valores; actúa como un túnel completo donde gen.send(val) y gen.throw(exc) viajan directamente entre el caller y el subgenerador, además de capturar automáticamente el valor devuelto en un return del generador.',
    proTip: 'Esta característica fue la base fundacional de las corrutinas en Python antes de la sintaxis nativa async/await.'
  },
  {
    id: 'fs-19',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Por qué en arquitecturas de plugins modernos en Python 3.10+ se prefiere __init_subclass__ sobre Metaclases complejas?',
    codeLanguage: 'python',
    codeSnippet: `class BasePlugin:
    registry = {}
    def __init_subclass__(cls, plugin_name: str, **kwargs):
        super().__init_subclass__(**kwargs)
        cls.registry[plugin_name] = cls`,
    options: [
      'Porque __init_subclass__ compila el código en bytecode de Cython.',
      'Proporciona un hook limpio y declarativo que se ejecuta al heredar de la clase base sin los conflictos de metaclases múltiples (metaclass conflicts).',
      'Porque las metaclases quedaron deprecadas a partir de Python 3.11.',
      'Garantiza que todas las subclases sean singletons obligatorios.'
    ],
    correctAnswerIndex: 1,
    explanation: '__init_subclass__ permite personalizar la creación de subclases de manera intuitiva y sin colisiones de jerarquía de metaclases, pasando argumentos con nombre directamente en la definición de la clase.',
    proTip: 'Ideal para construir registros de servicios o transformadores ETL de manera desacoplada.'
  },
  {
    id: 'fs-20',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En un servidor backend FastAPI bajo asyncio, ¿cuál es la consecuencia de ejecutar una operación de hashing criptográfico pesado (bcrypt) directamente dentro de una ruta async def?',
    codeLanguage: 'python',
    codeSnippet: `@app.post("/login")
async def login(data: LoginSchema):
    # bcrypt.checkpw es intensivo en CPU y síncrono
    valido = bcrypt.checkpw(data.password.encode(), hash_db)
    return {"ok": valido}`,
    options: [
      'FastAPI lanza automáticamente un aviso en consola y crea un nuevo worker.',
      'Bloquea el Event Loop del worker completo, congelando la atención de todas las demás peticiones I/O concurrentes durante el cálculo.',
      'El sistema operativo aborta el proceso por violación de segmentación.',
      'La operación falla silenciosamente retornando False.'
    ],
    correctAnswerIndex: 1,
    explanation: 'asyncio corre en un único hilo. Una función intensiva en CPU o con llamadas I/O bloqueantes monopoliza el hilo y congela el event loop, disparando los tiempos de respuesta del resto de clientes concurrentes.',
    proTip: 'Usa `await asyncio.to_thread(bcrypt.checkpw, ...)` para delegar tareas pesadas de CPU al thread pool sin bloquear el event loop.'
  },
  {
    id: 'fs-21',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En Python 3.11+, ¿cómo se capturan y manejan excepciones concurrentes emitidas por un asyncio.TaskGroup?',
    codeLanguage: 'python',
    codeSnippet: `try:
    async with asyncio.TaskGroup() as tg:
        tg.create_task(tarea_a())
        tg.create_task(tarea_b())
except* ValueError as eg:
    print("Capturada una o varias ValueError")`,
    options: [
      'Con bloques except ValueError estándar usando comas.',
      'Con la nueva cláusula except* que permite capturar subtipos específicos de un ExceptionGroup de forma granular.',
      'TaskGroup no propaga excepciones; las escribe únicamente en sys.stderr.',
      'Llamando a tg.get_exceptions() dentro de un bloque finally.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Cuando múltiples tareas fallan en un TaskGroup, sus errores se agrupan en un ExceptionGroup. La sintaxis `except* TipoError` permite filtrar y manejar múltiples excepciones concurrentes sin romper la captura de las restantes.',
    proTip: 'Recuerda que una sola ejecución de except* puede procesar múltiples excepciones si varias tareas lanzaron el mismo tipo de error.'
  },
  {
    id: 'fs-22',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cómo funciona la recolección de basura (Garbage Collector) en CPython frente a referencias circulares?',
    options: [
      'CPython solo utiliza conteo de referencias; las referencias circulares nunca se liberan hasta reiniciar el proceso.',
      'El conteo de referencias libera objetos inmediatamente cuando llega a 0; un GC generacional cíclico secundario detecta y recolecta grafos aislados de referencias circulares.',
      'CPython utiliza un recolector Stop-The-World mark-and-sweep idéntico a la JVM de Java.',
      'Las referencias circulares están prohibidas a nivel de compilador en Python 3.'
    ],
    correctAnswerIndex: 1,
    explanation: 'El mecanismo principal es Reference Counting (inmediato y determinista). Para ciclos donde A apunta a B y B a A (que nunca llegan a 0 solos), CPython tiene un Garbage Collector generacional con 3 generaciones (0, 1, 2) que busca grafos inalcanzables.',
    proTip: 'Usa el módulo weakref (referencias débiles) en estructuras de datos como cachés y grafos para no crear referencias cíclicas.'
  },
  {
    id: 'fs-23',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Por qué Pydantic v2 ofrece una mejora de rendimiento de entre 5x y 20x respecto a Pydantic v1?',
    options: [
      'Porque reescribió todo el motor de validación y serialización en Rust (pydantic-core).',
      'Porque desactivó la coerción de tipos por defecto.',
      'Porque compila los modelos a binarios estáticos con GCC.',
      'Porque omite la validación de campos opcionales en producción.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Pydantic v2 delegó toda la validación lógica, parsing y serialización JSON a pydantic-core, una librería interna implementada en Rust compilada como extensión nativa de CPython.',
    proTip: 'En endpoints de alto tráfico con FastAPI, usar model_validate y model_dump de Pydantic v2 reduce drásticamente el consumo de CPU.'
  },
  {
    id: 'fs-24',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: 'En FastAPI, ¿qué garantía de ciclo de vida ofrece una dependencia construida con generador (yield)?',
    codeLanguage: 'python',
    codeSnippet: `async def get_db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        await session.close()`,
    options: [
      'La sesión de base de datos se mantiene abierta indefinidamente en memoria.',
      'El código posterior al yield (bloque finally) se ejecuta garantizadamente al terminar la petición HTTP, incluso si la ruta lanzó una excepción HTTP o un error 500.',
      'El generador solo se ejecuta una vez al arrancar la aplicación y se comparte entre todos los usuarios.',
      'Requiere una llamada manual a session.close() en el controlador.'
    ],
    correctAnswerIndex: 1,
    explanation: 'FastAPI ejecuta las dependencias con yield dentro de un gestor de contexto asíncrono. La parte previa al yield se ejecuta antes del endpoint, y la parte posterior (finally) se ejecuta después de que la respuesta ha sido enviada o si se produjo un error, garantizando el cierre de conexiones.',
    proTip: 'Nunca olvides el bloque try/finally alrededor del yield para evitar fugas de conexiones en el pool de base de datos.'
  },
  {
    id: 'fs-25',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En sistemas con colas distribuidas (Celery / RabbitMQ / Redis), ¿cómo se previene la ejecución duplicada debido a la semántica "at-least-once delivery"?',
    options: [
      'Configurando el worker con concurrencia 1.',
      'Diseñando tareas idempotentes mediante claves de deduplicación atómicas (Idempotency Key con Redis SETNX o constraint único en SQL).',
      'Eliminando las políticas de reintento de la cola.',
      'Cambiando el broker por un archivo local de SQLite.'
    ],
    correctAnswerIndex: 1,
    explanation: 'En colas distribuidas, un fallo de red durante el ack puede hacer que el broker reenvíe el mensaje a otro worker. Cada tarea debe ser idempotente: antes de procesar el pago o acción, verifica y adquiere un lock/clave única con expiración TTL.',
    proTip: 'En pagos o cobros: guarda el idempotency_key en la tabla de transacciones con un índice UNIQUE para que la base de datos rechace duplicados a nivel ACID.'
  },
  {
    id: 'fs-26',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Al implementar un gestor de contexto asíncrono con @contextlib.asynccontextmanager, ¿qué ocurre si el bloque interno lanza una excepción y no la relanzas?',
    codeLanguage: 'python',
    codeSnippet: `@asynccontextmanager
async def transaccion():
    await db.start()
    try:
        yield
        await db.commit()
    except Exception:
        await db.rollback()
        # No hay 'raise'`,
    options: [
      'La excepción se relanza automáticamente por el intérprete de Python.',
      'La excepción queda suprimida silenciosamente y el código que invocó el "async with" continúa su ejecución como si nada hubiera fallado.',
      'Python arroja un RuntimeError: generator didn\'t yield.',
      'El event loop se cierra inmediatamente.'
    ],
    correctAnswerIndex: 1,
    explanation: 'En generadores usados como context managers, atrapar una excepción en el bloque except sin hacer `raise` le indica a Python que la excepción ha sido manejada y suprimida. Esto oculta errores críticos al llamador.',
    proTip: 'Si solo necesitas hacer limpieza o rollback ante un fallo, incluye siempre `raise` al final del bloque except.'
  },
  {
    id: 'fs-27',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En el sistema de tipos de Python (typing), ¿para qué se utilizan ParamSpec y Concatenate?',
    codeLanguage: 'python',
    codeSnippet: `P = ParamSpec("P")
R = TypeVar("R")

def con_usuario(f: Callable[Concatenate[User, P], R]) -> Callable[P, R]:
    ...`,
    options: [
      'Para concatenar strings en tiempo de compilación con alta velocidad.',
      'Para tipar decoradores de orden superior preservando exactamente los tipos y nombres de los argumentos originales de la función.',
      'Para validar estructuras JSON sin usar Pydantic.',
      'Para transformar funciones síncronas en asíncronas automáticamente.'
    ],
    correctAnswerIndex: 1,
    explanation: 'ParamSpec captura los tipos de parámetros de una función genérica. Concatenate permite anteponer o remover parámetros específicos (como inyectar un usuario autenticado) sin perder el tipado estricto del resto de argumentos.',
    proTip: 'Crucial para que herramientas como Mypy y Pyright ofrezcan autocompletado y detección de errores en decoradores complejos.'
  },
  {
    id: 'fs-28',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es la fórmula recomendada para calcular el número de workers en un servidor Gunicorn + Uvicorn en producción?',
    options: [
      'Número de workers = Cantidad de peticiones por segundo esperadas / 10.',
      'Número de workers = (2 * CPU Cores) + 1 para workers síncronos; de 1 a 2 workers por CPU core para aplicaciones puramente asíncronas con Uvicorn.',
      'Siempre 1 worker con 10,000 hilos de sistema operativo.',
      'Número de workers = Memoria RAM en GB multiplicada por 10.'
    ],
    correctAnswerIndex: 1,
    explanation: 'En aplicaciones asíncronas (asyncio/uvicorn), un solo proceso puede gestionar miles de conexiones concurrentes en I/O. Asignar 1-2 workers por core físico aprovecha la CPU sin provocar saturación por cambios de contexto del kernel.',
    proTip: 'En Kubernetes, a menudo es preferible 1 worker por contenedor y escalar horizontalmente mediante réplicas de pods (HPA).'
  },

  // ==================== LARAVEL 11 & MODERN PHP (11 Preguntas) ====================
  {
    id: 'fs-29',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En la arquitectura simplificada de Laravel 11, ¿dónde se configuran ahora los Middlewares y el enrutamiento que antes residían en Http/Kernel.php?',
    codeLanguage: 'php',
    codeSnippet: `// bootstrap/app.php
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(web: __DIR__.'/../routes/web.php', commands: __DIR__.'/../routes/console.php')
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append(SecurityHeaders::class);
    })
    ->create();`,
    options: [
      'En el archivo public/index.php.',
      'En bootstrap/app.php usando la API fluida de configuración de la aplicación.',
      'En config/middleware.php mediante un array asociativo.',
      'En el archivo composer.json en la clave "extra".'
    ],
    correctAnswerIndex: 1,
    explanation: 'Laravel 11 eliminó los archivos Http/Kernel.php, Console/Kernel.php y carpetas innecesarias de middleware por defecto, centralizando el registro de middleware, excepciones y rutas en bootstrap/app.php con métodos fluidos.',
    proTip: 'Esto simplifica drásticamente las actualizaciones de versión y reduce la cantidad de código repetitivo en proyectos nuevos.'
  },
  {
    id: 'fs-30',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Cómo evita un equipo senior de Laravel que el problema de N+1 queries llegue a producción?',
    codeLanguage: 'php',
    codeSnippet: `// En AppServiceProvider::boot()
Model::preventLazyLoading(! app()->isProduction());`,
    options: [
      'Convierte automáticamente todas las consultas a Redis en desarrollo.',
      'Lanza una excepción LazyLoadingViolationException en entornos locales y de testing cada vez que un modelo intenta cargar una relación perezosa sin eager loading (with()).',
      'Desactiva todas las relaciones de Eloquent en producción.',
      'Fuerza el uso de PDO sin pasar por el ORM.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Al activar preventLazyLoading, cualquier acceso a una relación no precargada (con with()) dispara una excepción de inmediato en desarrollo y CI, garantizando que nadie despliegue código con consultas N+1 inadvertidas.',
    proTip: 'Combínalo con Model::preventSilentlyDiscardingAttributes() para evitar pérdidas de datos al asignar atributos no definidos en $fillable.'
  },
  {
    id: 'fs-31',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Al procesar millones de registros en Laravel, ¿cuál es la diferencia de consumo de memoria entre chunk() y cursor()?',
    codeLanguage: 'php',
    codeSnippet: `// Opción A: Order::chunk(1000, function ($orders) { ... });
// Opción B: foreach (Order::cursor() as $order) { ... }`,
    options: [
      'chunk() no usa la base de datos; cursor() sí.',
      'chunk() realiza múltiples consultas paginadas con OFFSET; cursor() utiliza un cursor PDO (unbuffered query) manteniendo solo 1 modelo en memoria en cada iteración.',
      'cursor() carga toda la tabla en un array de PHP antes de iniciar el bucle.',
      'Son idénticos en consumo de memoria y tiempo de CPU.'
    ],
    correctAnswerIndex: 1,
    explanation: 'cursor() aprovecha las consultas sin búfer de PDO para transmitir los registros uno a uno sin instanciar colecciones masivas en memoria, reduciendo el consumo a un solo modelo por ciclo.',
    proTip: 'Ten cuidado con chunk() tradicional en tablas activas donde se actualizan registros procesados, ya que el OFFSET puede provocar que registros se salten. Usa chunkById() en esos casos.'
  },
  {
    id: 'fs-32',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En Laravel, ¿por qué es crucial despachar emails o eventos con afterCommit() dentro de una transacción de base de datos?',
    codeLanguage: 'php',
    codeSnippet: `DB::transaction(function () {
    $orden = Order::create([...]);
    SendOrderInvoice::dispatch($orden)->afterCommit();
});`,
    options: [
      'Porque si no se usa afterCommit, el job de la cola se despacha antes de confirmarse la transacción y el worker puede leer la base de datos antes del commit (registro no encontrado).',
      'Porque afterCommit encripta el payload del email con OpenSSL.',
      'Para forzar al worker a usar la misma conexión de base de datos del cliente HTTP.',
      'Para evitar que Redis guarde logs en disco.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Si un worker rápido de la cola consume el evento antes de que el comando COMMIT de MySQL/PostgreSQL finalice, el worker consultará la BD y fallará con ModelNotFoundException o leerá datos desactualizados. afterCommit() retrasa el encolado hasta que el commit sea 100% exitoso.',
    proTip: 'En Laravel 11, puedes configurar la opción `after_commit => true` a nivel de conexión en config/queue.php.'
  },
  {
    id: 'fs-33',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cómo implementa Laravel bloqueos atómicos distribuidos (Atomic Locks) en Redis para prevenir doble gasto o race conditions?',
    codeLanguage: 'php',
    codeSnippet: `$lock = Cache::lock('procesar-pago-'.$userId, 10);
if ($lock->get()) {
    try {
        // Operación crítica de débito
    } finally {
        $lock->release();
    }
}`,
    options: [
      'Poniendo la aplicación en modo de mantenimiento con php artisan down.',
      'Usando el comando SET con opciones NX (not exists) y EX (expiración TTL) de Redis para adquirir el lock de manera atómica.',
      'Creando una tabla temporal en MySQL que bloquea toda la base de datos.',
      'Deteniendo temporalmente los procesos PHP-FPM.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Cache::lock aprovecha las primitivas atómicas de Redis (SET resource_name my_random_value NX PX 10000). Si otro proceso intenta adquirirlo mientras el lock está activo, falla de inmediato sin carreras de condición.',
    proTip: 'También puedes usar $lock->block(5, function () { ... }) para esperar hasta 5 segundos a que el lock se libere en vez de fallar inmediatamente.'
  },
  {
    id: 'fs-34',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En el Service Container de Laravel, ¿cuándo se debe utilizar el método scoped() en lugar de singleton() al correr sobre Laravel Octane?',
    options: [
      'scoped() solo funciona para rutas que devuelven respuestas JSON.',
      'singleton() persiste la instancia durante toda la vida útil del proceso de Octane (fuga de datos entre usuarios), mientras que scoped() se resetea al finalizar cada petición HTTP.',
      'scoped() compila la clase a código bytecode protegido.',
      'singleton() está deprecado a partir de PHP 8.3.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Laravel Octane mantiene la aplicación en memoria RAM viva entre múltiples peticiones para lograr máxima velocidad. Un singleton() persistirá sus propiedades entre diferentes usuarios y solicitudes, provocando fugas de seguridad o memoria. scoped() vincula la instancia al ciclo de vida de una sola petición.',
    proTip: 'Regla de oro en Octane: nunca almacenes datos específicos de un usuario en propiedades de clases registradas como singleton.'
  },
  {
    id: 'fs-35',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué método de un Middleware de Laravel se ejecuta DESPUÉS de que la respuesta HTTP ya fue enviada al navegador del cliente?',
    codeLanguage: 'php',
    codeSnippet: `class RegistrarMetricas {
    public function handle($request, Closure $next) {
        return $next($request);
    }
    public function terminate($request, $response) {
        // ¿Cuándo corre este método?
    }
}`,
    options: [
      'handleAsync()',
      'terminate()',
      'afterSend()',
      'shutdown()'
    ],
    correctAnswerIndex: 1,
    explanation: 'El método terminate() de un Terminable Middleware se invoca tras enviar el contenido de la respuesta al cliente (vía fastcgi_finish_request en FPM). Es ideal para registrar analíticas, métricas o tareas que no deben demorar el tiempo de respuesta percibido por el usuario.',
    proTip: 'Mantén terminate() rápido o delegalo a colas; aunque el cliente ya recibió datos, el proceso FPM sigue ocupado hasta que terminate() concluya.'
  },
  {
    id: 'fs-36',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En PHP 8.2 y 8.3, ¿cuál es una restricción estricta de las clases declaradas como readonly class?',
    codeLanguage: 'php',
    codeSnippet: `readonly class InvoiceDTO {
    public string $id;
    public DateTimeImmutable $created;
}`,
    options: [
      'No pueden implementar interfaces ni usar traits.',
      'Todas las propiedades deben tener un tipo declarado explícito y no se permite el uso de propiedades estáticas (static properties).',
      'No pueden tener métodos públicos ni constructor.',
      'Las instancias se destruyen obligatoriamente tras 1 segundo.'
    ],
    correctAnswerIndex: 1,
    explanation: 'En PHP 8.2+, una readonly class exige que cada propiedad sea tipada explícitamente (no se admite propiedades sin tipo). Además, no puede contener propiedades estáticas porque la inmutabilidad aplica a instancias de objetos.',
    proTip: 'Ten en cuenta que clonar una readonly class permite modificar propiedades dentro del método mágico __clone() en PHP 8.3.'
  },
  {
    id: 'fs-37',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Cuál es la vulnerabilidad de seguridad en esta consulta Eloquent con whereRaw?',
    codeLanguage: 'php',
    codeSnippet: `$categoria = $request->input('category');
$productos = Product::whereRaw("category = '{$categoria}'")->get();`,
    options: [
      'whereRaw solo funciona con números enteros.',
      'Es vulnerable a Inyección SQL (SQL Injection) de segundo orden o directa porque concatena un input no saneado directamente en el query raw.',
      'Lanza un error de PDO porque falta el método toSql().',
      'Eloquent bloquea automáticamente cualquier uso de whereRaw en Laravel 11.'
    ],
    correctAnswerIndex: 1,
    explanation: 'whereRaw no parametriza automáticamente variables interpoladas en la cadena. Un atacante puede enviar `cat\' OR 1=1 --` y extraer toda la base de datos.',
    proTip: 'Pasa siempre los parámetros como segundo argumento para que PDO use sentencias preparadas: `whereRaw("category = ?", [$categoria])`.'
  },
  {
    id: 'fs-38',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En un Form Request de Laravel, ¿cuál es la diferencia de seguridad entre $request->all() y $request->validated() al persistir en base de datos?',
    options: [
      '$request->all() elimina los campos nulos.',
      '$request->validated() devuelve única y exclusivamente los atributos que pasaron con éxito las reglas de validación definidas, evitando la inyección de campos no esperados.',
      '$request->validated() encripta automáticamente los datos con bcrypt.',
      'No hay diferencia si el modelo tiene la propiedad $guarded vacía.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Usar $request->all() expone la aplicación a vulnerabilidades de Mass Assignment si un usuario malicioso inyecta atributos como "is_admin" o "balance". $request->validated() solo incluye los campos explícitamente auditados en rules().',
    proTip: 'Nunca uses Model::create($request->all()); usa siempre Model::create($request->validated()).'
  },
  {
    id: 'fs-39',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Cuando un Evento o Job de Laravel usa el trait SerializesModels, ¿qué se almacena realmente en la carga útil (payload) de Redis?',
    codeLanguage: 'php',
    codeSnippet: `class NotificarUsuario implements ShouldQueue {
    use SerializesModels;
    public function __construct(public User $user) {}
}`,
    options: [
      'Todo el objeto de PHP serializado con serialize(), incluyendo relaciones y métodos en memoria.',
      'Solo la clase del modelo y su clave primaria ID (ej. com.models.User y ID 42), que el worker re-consulta de la base de datos al ejecutarse.',
      'Una copia en formato JSON del registro en el momento exacto del despacho.',
      'El token de sesión del usuario en texto plano.'
    ],
    correctAnswerIndex: 1,
    explanation: 'SerializesModels serializa únicamente el identificador y la clase del modelo. Cuando el worker en la cola procesa el trabajo, vuelve a buscar el modelo en la base de datos, garantizando que trabaje con el estado más fresco del registro.',
    proTip: 'Si el registro fue eliminado de la base de datos antes de que el worker lo procese, el job fallará con ModelNotFoundException a menos que configures $deleteWhenMissingModels = true.'
  },

  // ==================== SQL & DATABASE ARCHITECTURE (11 Preguntas) ====================
  {
    id: 'fs-40',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Dado un índice compuesto en PostgreSQL: CREATE INDEX idx_ordenes ON ordenes (tenant_id, created_at, status); ¿cuál de estas consultas NO podrá aprovechar el índice eficientemente?',
    options: [
      'SELECT * FROM ordenes WHERE tenant_id = 5 AND created_at > \'2026-01-01\';',
      'SELECT * FROM ordenes WHERE tenant_id = 5 AND status = \'PAGADO\';',
      'SELECT * FROM ordenes WHERE created_at > \'2026-01-01\' AND status = \'PAGADO\';',
      'SELECT * FROM ordenes WHERE tenant_id = 5;'
    ],
    correctAnswerIndex: 2,
    explanation: 'Los índices B-Tree compuestos siguen la "Regla del Prefijo Izquierdo" (Leftmost Prefix Rule). Si la consulta no incluye la primera columna del índice (tenant_id), el motor no puede navegar por las ramas del árbol y recurre a un Sequential Scan.',
    proTip: 'El orden de las columnas en un índice compuesto debe priorizar igualdad (filtros exactos de alta cardinalidad) al principio y rangos (> o <) al final.'
  },
  {
    id: 'fs-41',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Al analizar un plan con EXPLAIN ANALYZE en PostgreSQL, ¿cuál es la diferencia entre un Index Scan y un Index Only Scan?',
    options: [
      'Index Scan solo lee índices de tipo Hash; Index Only Scan lee índices GiST.',
      'Index Only Scan satisface la consulta leyendo exclusivamente las páginas del índice sin tocar la tabla en disco (heap), siempre que la Visibility Map confirme que las tuplas son visibles.',
      'Index Scan no usa memoria compartida (shared buffers).',
      'Index Only Scan se aplica únicamente a tablas con menos de 100 registros.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Cuando todas las columnas seleccionadas y filtradas en el query están incluidas en el índice (o mediante la cláusula INCLUDE), PostgreSQL evita acceder a los bloques de datos de la tabla (heap), logrando la máxima velocidad posible de I/O.',
    proTip: 'Ejecuta VACUUM regularmente para mantener la Visibility Map actualizada y maximizar los Index Only Scans.'
  },
  {
    id: 'fs-42',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En el estándar SQL y niveles de aislamiento ACID, ¿qué anomalía de concurrencia puede ocurrir en el nivel "Repeatable Read" que solo se previene en "Serializable"?',
    options: [
      'Dirty Reads (Lecturas Sucias).',
      'Non-repeatable Reads (Lecturas no repetibles).',
      'Write Skew (Sesgo de escritura) y anomalías de serialización.',
      'Table Corruption.'
    ],
    correctAnswerIndex: 2,
    explanation: 'En Repeatable Read, una transacción ve siempre la misma instantánea de filas individuales. Sin embargo, dos transacciones concurrentes pueden leer datos superpuestos y modificar conjuntos disjuntos violando una restricción de negocio global (ej. dos doctores que están de guardia y ambos cancelan su turno simultáneamente creyendo que el otro sigue activo). Solo Serializable previene el Write Skew.',
    proTip: 'En PostgreSQL, Serializable usa SSI (Serializable Snapshot Isolation), que detecta dependencias rw-antidependency sin bloquear lecturas.'
  },
  {
    id: 'fs-43',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En un sistema de colas de tareas implementado en PostgreSQL, ¿por qué es indispensable usar FOR UPDATE SKIP LOCKED?',
    codeLanguage: 'sql',
    codeSnippet: `SELECT id FROM tasks 
WHERE status = 'PENDING' 
ORDER BY priority DESC 
LIMIT 1 
FOR UPDATE SKIP LOCKED;`,
    options: [
      'Para evitar que las transacciones guarden entradas en el log WAL.',
      'Permite a múltiples workers concurrentes seleccionar y bloquear tareas inmediatamente sin bloquearse entre sí esperando el lock de la misma fila.',
      'Obliga a PostgreSQL a eliminar la fila de forma física e inmediata.',
      'Desactiva el límite de conexiones concurrentes en pg_hba.conf.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Sin SKIP LOCKED, múltiples workers intentarían bloquear la misma fila número 1 y entrarían en contención esperando a que la transacción del primer worker termine. Con SKIP LOCKED, los workers omiten de forma transparente las filas ya bloqueadas y toman la siguiente tarea libre al instante.',
    proTip: 'Esta técnica permite construir colas de mensajería altamente concurrentes directamente sobre PostgreSQL sin colapsar el motor.'
  },
  {
    id: 'fs-44',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es la principal ventaja del Bloqueo Optimista (Optimistic Locking con columna version) sobre el Bloqueo Pesimista (FOR UPDATE)?',
    codeLanguage: 'sql',
    codeSnippet: `UPDATE productos 
SET stock = stock - 1, version = version + 1 
WHERE id = 42 AND version = 3;`,
    options: [
      'Garantiza que la consulta tarde menos de 1 milisegundo independientemente del volumen de datos.',
      'No retiene locks de base de datos durante el tiempo de pensamiento del usuario o llamadas de red lentas, escalando mucho mejor en sistemas con baja o moderada contención.',
      'Elimina la necesidad de definir claves primarias.',
      'Convierte la base de datos a NoSQL en tiempo de ejecución.'
    ],
    correctAnswerIndex: 1,
    explanation: 'El bloqueo optimista asume que los conflictos son raros. Comprueba si la versión cambió en el momento del UPDATE sin retener bloqueos de fila durante segundos mientras una API externa responde o el cliente llena un formulario.',
    proTip: 'Si rows affected es 0, significa que otro proceso modificó el registro primero y la aplicación puede abortar o reintentar limpiamente.'
  },
  {
    id: 'fs-45',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Al utilizar PgBouncer en modo Transaction Pooling frente a PostgreSQL, ¿cuál de las siguientes características de SQL deja de funcionar correctamente?',
    options: [
      'Las consultas SELECT con JOIN.',
      'Prepared statements a nivel de sesión, variables de sesión (SET timezone), y tablas temporales (TEMPORARY TABLE).',
      'Los índices B-Tree.',
      'Las restricciones de clave foránea (Foreign Keys).'
    ],
    correctAnswerIndex: 1,
    explanation: 'En Transaction Pooling, la conexión física de base de datos se devuelve al pool tan pronto como la transacción actual termina. Como la siguiente transacción del mismo cliente puede asignarse a un proceso backend de Postgres diferente, cualquier estado residual de la sesión (como tablas temporales o prepared statements nombrados) se pierde o contamina.',
    proTip: 'Si usas PgBouncer en Transaction Pooling, habilita el protocolo de sentencias preparadas de nivel extendido o usa Session Pooling para procesos que requieran estado de sesión persistente.'
  },
  {
    id: 'fs-46',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Para realizar migraciones de esquemas en bases de datos masivas sin tiempo de inactividad (Zero-Downtime), ¿en qué consiste el patrón Expand and Contract?',
    options: [
      'Apagar el servidor de base de datos durante 5 minutos y aplicar todos los cambios en un solo script.',
      'Fase Expand: agregar la nueva columna o tabla sin eliminar la anterior y soportar lectura/escritura dual en código. Fase Contract: migrar datos históricos y eliminar el esquema obsoleto.',
      'Reemplazar todas las tablas por colecciones JSON en una sola transacción.',
      'Hacer backup del archivo .sql y restaurarlo en un puerto alternativo.'
    ],
    correctAnswerIndex: 1,
    explanation: 'El patrón Expand/Contract permite que versiones antiguas y nuevas de la aplicación coexistan durante el despliegue. Primero se amplía el esquema de forma no destructiva (adición de columnas nullable), se actualiza el código para escribir en ambos lugares, se sincronizan los datos y finalmente se retira el código y columna antigua.',
    proTip: 'Nunca renombres una columna directamente con ALTER TABLE RENAME en producción activa; siempre usa Expand/Contract.'
  },
  {
    id: 'fs-47',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En la arquitectura MVCC de PostgreSQL, ¿por qué una transacción abierta de larga duración (long-running transaction) puede degradar gravemente el rendimiento del motor?',
    options: [
      'Consume todo el ancho de banda de la tarjeta de red del servidor.',
      'Impide que autovacuum limpie tuplas muertas (dead tuples) generadas después del snapshot más antiguo, provocando hinchazón masiva (table bloat) y consumo desmedido de disco.',
      'Apaga el planificador de consultas de forma permanente.',
      'Bloquea los checkpoints de PostgreSQL hasta que la memoria RAM se agote.'
    ],
    correctAnswerIndex: 1,
    explanation: 'PostgreSQL no sobrescribe filas al hacer UPDATE o DELETE; crea nuevas versiones de la tupla. Autovacuum solo puede eliminar las versiones antiguas si ninguna transacción activa puede verlas. Si una transacción se queda abierta, ninguna tupla posterior puede ser limpiada, inflando las tablas e índices.',
    proTip: 'Configura siempre `idle_in_transaction_session_timeout = 60000` (1 minuto) en postgresql.conf para matar transacciones colgadas.'
  },
  {
    id: 'fs-48',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En arquitecturas con réplicas de lectura (Read Replicas), ¿cómo se soluciona el problema de consistencia "Read-Your-Own-Writes" tras una mutación del usuario?',
    options: [
      'Eliminando las réplicas de lectura por completo.',
      'Enrutando las lecturas subsiguientes del usuario al nodo primario (Primary/Writer) durante unos segundos mediante una ventana de gracia o token de versión.',
      'Desactivando el caching de DNS en el cliente web.',
      'Esperando 10 segundos con un setTimeout en el frontend antes de redirigir.'
    ],
    correctAnswerIndex: 1,
    explanation: 'La replicación en bases de datos relacionales suele ser asíncrona. Si un usuario crea un post y es redirigido inmediatamente a leerlo desde una réplica rezagada por milisegundos, experimentará un error de "no encontrado". Forzar la lectura en el primario tras escribir garantiza consistencia causal para ese cliente.',
    proTip: 'Frameworks como Laravel y Django soportan esta configuración de forma nativa mediante la directiva `sticky` en la conexión de base de datos.'
  },
  {
    id: 'fs-49',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En sistemas distribuidos, ¿cuál es la limitación arquitectónica del protocolo Two-Phase Commit (2PC) frente al patrón Saga?',
    options: [
      '2PC no soporta números de punto flotante en las transacciones.',
      '2PC es un protocolo síncrono bloqueante: si el coordinador falla tras la fase de preparación, los participantes retienen locks de recursos indefinidamente, afectando la disponibilidad.',
      'El patrón Saga solo puede utilizarse en bases de datos orientadas a grafos.',
      '2PC no requiere red de comunicación entre nodos.'
    ],
    correctAnswerIndex: 1,
    explanation: '2PC prioriza consistencia estricta a costa de disponibilidad (bloqueos distribuidos). El patrón Saga divide la transacción distribuida en pasos locales asíncronos desacoplados, implementando transacciones de compensación en caso de fallo, alineado con alta disponibilidad y resiliencia.',
    proTip: 'En arquitecturas de microservicios modernas, el patrón Saga (Coreografiado u Orquestado) es el estándar de facto.'
  },
  {
    id: 'fs-50',
    categoryId: 'senior_fullstack',
    categoryName: 'Fullstack Senior (React, Python, Laravel)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En funciones de ventana SQL (Window Functions), ¿cuál es la diferencia entre RANK() y DENSE_RANK() ante valores duplicados en el ordenamiento?',
    codeLanguage: 'sql',
    codeSnippet: `SELECT score,
       RANK() OVER (ORDER BY score DESC) as rk,
       DENSE_RANK() OVER (ORDER BY score DESC) as drk
FROM jugadores;
-- Si los puntajes son: 100, 100, 90...`,
    options: [
      'RANK() produce: 1, 1, 3 (deja huecos en la secuencia); DENSE_RANK() produce: 1, 1, 2 (sin saltos numéricos).',
      'DENSE_RANK() redondea los puntajes al entero más cercano.',
      'RANK() solo funciona con particiones por fecha.',
      'DENSE_RANK() produce: 1, 2, 3 sin importar que haya empates.'
    ],
    correctAnswerIndex: 0,
    explanation: 'RANK() asigna el mismo rango a valores empatados y salta los puestos siguientes según el número de duplicados (1, 1, 3). DENSE_RANK() asigna el mismo rango a los empates pero continúa la numeración sin saltos en el siguiente valor distinto (1, 1, 2).',
    proTip: 'Usa ROW_NUMBER() si necesitas garantizar números estrictamente secuenciales únicos e irrepetibles por fila (1, 2, 3).'
  }
];
