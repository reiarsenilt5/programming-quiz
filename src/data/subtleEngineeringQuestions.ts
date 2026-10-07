import { Question } from '../types/quiz';

export const SUBTLE_ENGINEERING_QUESTIONS: Question[] = [
  // ==================== 1. CI / CD & GITHUB ACTIONS SUTILEZAS ====================
  {
    id: 'sub-01',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cómo se evita que múltiples commits rápidos a un Pull Request saturen la cola de runners de GitHub Actions consumiendo minutos innecesarios?',
    codeSnippet: `concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true`,
    codeLanguage: 'yaml',
    options: [
      'Configurando "cancel-in-progress: true" dentro del bloque "concurrency" asociado al branch o PR.',
      'Añadiendo una directiva "timeout-minutes: 1" en cada step del workflow.',
      'Usando "runs-on: ubuntu-latest-single-threaded" para forzar ejecución secuencial.',
      'GitHub Actions lo cancela por defecto automáticamente si hay un push posterior.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El bloque "concurrency" agrupado por workflow y ref/PR con "cancel-in-progress: true" le indica a GitHub Actions que si llega un nuevo commit mientras el job anterior sigue corriendo, cancele inmediatamente la ejecución en curso para liberar runners y ahorrar minutos de CI.',
    proTip: 'En ramas principales protegidas (main/production) suele usarse cancel-in-progress: false para no abortar despliegues críticos a mitad de camino, pero en ramas de PR siempre debe activarse cancel-in-progress: true.'
  },
  {
    id: 'sub-02',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Cuál es el bug crítico en esta clave de caché de dependencias en GitHub Actions?',
    codeSnippet: `- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: \${{ runner.os }}-node-\${{ hashFiles('package.json') }}
    restore-keys: |
      \${{ runner.os }}-node-`,
    codeLanguage: 'yaml',
    options: [
      'Usa "package.json" en vez del lockfile ("package-lock.json" o "pnpm-lock.yaml"), permitiendo que versiones compatibles cambien sin invalidar la caché.',
      'La ruta "~/.npm" es inválida en entornos Linux de GitHub Actions.',
      'El campo "restore-keys" no admite saltos de línea ni sintaxis multilínea.',
      'La acción actions/cache@v4 requiere obligatoriamente privilegios de administrador.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Al calcular el hash sobre "package.json", si un rango dependiente (ej. ^1.2.0) se actualiza en el registro pero package.json no cambia su texto, la clave de caché no varía y el CI reutiliza dependencias desactualizadas. Debe calcularse sobre el lockfile ("package-lock.json", "yarn.lock" o "pnpm-lock.yaml").',
    proTip: 'Siempre incluye el hash del lockfile exacto. Para monorepos, usa patterns como hashFiles(\'**/pnpm-lock.yaml\').'
  },
  {
    id: 'sub-03',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En Docker Buildx dentro de un pipeline de CI, ¿cuál es el mecanismo moderno más eficiente para reutilizar la caché de capas entre ejecuciones efímeras de runners?',
    codeSnippet: `docker buildx build \\
  --cache-from=type=gha \\
  --cache-to=type=gha,mode=max \\
  -t mi-app:latest .`,
    codeLanguage: 'bash',
    options: [
      'El backend de caché de GitHub Actions (type=gha) con mode=max para cachear todas las capas intermedias en el servicio de caché nativo del runner.',
      'Hacer "docker commit" del contenedor anterior y descargarlo vía SSH.',
      'Montar una carpeta compartida en el host mediante "-v /var/run/docker.sock".',
      'Configurar "DOCKER_BUILDKIT=0" para deshabilitar BuildKit y usar la caché de Docker clásica.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Buildx soporta backends de caché externos. "--cache-from=type=gha" y "--cache-to=type=gha,mode=max" transfieren las capas cacheadas directamente hacia el GitHub Actions Cache API, eliminando la necesidad de registry dedicado solo para capas.',
    proTip: 'Usa "mode=max" en tus ramas principales para que todas las etapas multi-stage se almacenen en caché; en PRs puedes usar el modo por defecto (min) para no saturar los 10GB de límite de GitHub Actions.'
  },

  // ==================== 2. CONSULTAS N+1 Y OPTIMIZACIÓN ORM ====================
  {
    id: 'sub-04',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: 'En un endpoint de Django REST Framework, ¿por qué este código sufre el problema de N+1 queries a pesar de usar select_related?',
    codeSnippet: `# Models: Post tiene ForeignKey a Author, y ManyToMany a Tag
posts = Post.objects.select_related('tags').all()
for p in posts:
    print([t.name for t in p.tags.all()])`,
    codeLanguage: 'python',
    options: [
      '"select_related" solo funciona en relaciones One-to-One y ForeignKey (JOIN simple); para Many-to-Many o Reverse FKs se debe usar "prefetch_related".',
      'Django no permite llamar a ".all()" después de aplicar "select_related".',
      '"tags" debe llamarse con "tags_set" obligatoriamente.',
      'El problema se soluciona únicamente desactivando el lazy evaluation de Django ORM.'
    ],
    correctAnswerIndex: 0,
    explanation: '"select_related" genera un SQL JOIN estándar, lo cual solo es válido para relaciones donde una fila de la tabla origen corresponde a máximo una fila de la tabla destino (ForeignKey o OneToOne). Para colecciones o Many-to-Many, "select_related" falla o no precarga la colección; la solución es "prefetch_related(\'tags\')", que ejecuta una segunda consulta con "IN (...)" y empareja en memoria en Python.',
    proTip: 'Regla mnemotécnica en Django: select_related para objetos singulares (1:1 o N:1 con JOIN en SQL); prefetch_related para colecciones múltiples (1:N o N:M mediante 2 consultas optimizadas).'
  },
  {
    id: 'sub-05',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En Laravel 10+, ¿cómo proteges a todo el equipo de desarrollo para que nunca suban a producción una consulta N+1 accidental?',
    codeSnippet: `// En AppServiceProvider::boot()
Model::preventLazyLoading(! app()->isProduction());`,
    codeLanguage: 'php',
    options: [
      'Activando "Model::preventLazyLoading(! app()->isProduction())", lo que lanza una LazyLoadingViolationException durante tests y desarrollo local.',
      'Eliminando las relaciones belongsTo de todos los modelos Eloquent.',
      'Configurando DB::disableQueryLog() en el archivo .env.',
      'Laravel previene N+1 automáticamente por defecto mediante su motor JIT.'
    ],
    correctAnswerIndex: 0,
    explanation: '"Model::preventLazyLoading(! app()->isProduction())" detiene la ejecución arrojando una excepción inmediata si algún desarrollador accede a una relación no precargada (eager loaded) fuera de producción. En producción, simplemente se registra en logs sin tumbar la petición.',
    proTip: 'Combina "preventLazyLoading" con "preventSilentlyDiscardingAttributes" y "preventAccessingMissingAttributes" dentro de tu AppServiceProvider en entornos locales y CI.'
  },
  {
    id: 'sub-06',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cómo resuelve GraphQL el problema N+1 cuando clientes anidados consultan relaciones profundamente estructuradas?',
    codeSnippet: `const authorLoader = new DataLoader(async (authorIds) => {
  const authors = await db.authors.findMany({ where: { id: { in: authorIds } } });
  return authorIds.map(id => authors.find(a => a.id === id));
});`,
    codeLanguage: 'typescript',
    options: [
      'Mediante el patrón DataLoader, agrupando (batching) todas las solicitudes de claves en un solo tick del event loop y memoizando los resultados.',
      'Limitando la profundidad máxima de las consultas a 2 niveles.',
      'Convirtiendo automáticamente todas las consultas GraphQL a vistas materializadas en Postgres.',
      'Obligando al cliente a enviar la consulta como un payload REST con JOINs.'
    ],
    correctAnswerIndex: 0,
    explanation: 'DataLoader recolecta todas las invocaciones individuales de resolución durante la misma fase del bucle de eventos (process.nextTick / microtask), ejecuta una única consulta por lotes ("SELECT ... WHERE id IN (...)") y mapea los resultados en el orden exacto de las claves solicitadas.',
    proTip: 'Crea una nueva instancia de DataLoader por cada petición HTTP para evitar fugas de memoria y contaminación de datos entre diferentes usuarios autenticados.'
  },

  // ==================== 3. CACHE, INVALIDACIÓN Y CONCURRENCIA ====================
  {
    id: 'sub-07',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué es el fenómeno de "Cache Stampede" (Dogpiling) y cuál es la solución probabilística más elegante para resolverlo?',
    codeSnippet: `// Probabilistic Early Expiration (Algoritmo XFetch)
function shouldRecompute(cachedAt, ttl, beta = 1.0, computeDeltaMs) {
  const timeRemaining = (cachedAt + ttl) - Date.now();
  return -beta * computeDeltaMs * Math.log(Math.random()) > timeRemaining;
}`,
    codeLanguage: 'javascript',
    options: [
      'Ocurre cuando una clave muy solicitada expira y cientos de peticiones concurrentes golpean la base de datos simultáneamente. Se resuelve con XFetch (expiración temprana probabilística) o un Distributed Lock (Mutex).',
      'Ocurre cuando Redis se queda sin memoria RAM y se resuelve aumentando la swap del sistema operativo.',
      'Es un ataque DDoS contra la capa de caché y se mitiga activando un firewall WAF.',
      'Ocurre cuando dos claves tienen el mismo hash MD5 y se resuelve cambiando el algoritmo a SHA-256.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El Cache Stampede ocurre cuando una entrada caliente expira, provocando que miles de hilos concurrentes no encuentren la clave e intenten recalcularla en la base de datos a la vez. El algoritmo XFetch (Vattani et al.) recalcula el valor de forma probabilística justo antes de que expire según el tiempo que toma computarlo, de modo que solo un proceso refresca la caché de forma transparente.',
    proTip: 'Si no implementas XFetch, utiliza un Mutex Distribuido (ej. "SET key:lock uuid NX PX 5000"): el primer hilo adquiere el lock y computa, los demás esperan 50ms y leen la caché fresca.'
  },
  {
    id: 'sub-08',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En Redis configurado como LRU Cache, ¿cuál es la diferencia crítica entre "allkeys-lru" y "volatile-lru" al llenarse la memoria (maxmemory)?',
    codeSnippet: `# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru # vs volatile-lru`,
    codeLanguage: 'text',
    options: [
      '"allkeys-lru" expulsa las claves menos usadas sin importar si tienen TTL o no; "volatile-lru" solo expulsa claves que tienen una expiración (TTL) configurada explícitamente.',
      '"volatile-lru" guarda las claves expulsadas en disco SSD, mientras que "allkeys-lru" las destruye.',
      '"allkeys-lru" solo funciona con estructuras de datos Hash y List.',
      '"volatile-lru" es más rápido porque nunca calcula estadísticas de acceso.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Bajo "volatile-lru", si tu memoria se llena de datos persistentes sin TTL configurado, Redis no podrá liberar espacio y responderá con errores "OOM command not allowed". Si tu instancia se dedica puramente a almacenamiento en caché temporal, "allkeys-lru" o "allkeys-lfu" es la configuración estándar requerida.',
    proTip: 'Si usas la misma instancia de Redis para colas (BullMQ/Sidekiq) y para caché de datos, ¡nunca uses allkeys-lru! Podrías expulsar trabajos encolados. Lo ideal es separar instancias de Redis para caché y para colas.'
  },
  {
    id: 'sub-09',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Por qué el patrón "Write-Behind" (Write-Back) en caché ofrece menor latencia de escritura pero mayor riesgo de inconsistencia que "Write-Through"?',
    codeSnippet: `// Flujo Write-Behind:
1. App escribe inmediatamente a la Caché (en memoria).
2. La API responde 200 OK de inmediato al cliente.
3. Un proceso en segundo plano asíncrono persiste los cambios a la Base de Datos.`,
    codeLanguage: 'text',
    options: [
      'Si el nodo de caché sufre un reinicio o crash antes de que el proceso en background persista a la base de datos, los datos recién confirmados al cliente se pierden irremediablemente.',
      'Write-Behind ejecuta transacciones distribuidas 2-Phase Commit obligatorias.',
      'Write-Through no admite índices secundarios en bases de datos relacionales.',
      'Write-Behind duplica el consumo de CPU en la base de datos al realizar consultas periódicas.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Al confirmar la escritura al usuario antes de tocar el almacenamiento durable, Write-Behind prioriza velocidad extrema sobre durabilidad. Una falla de hardware o caída del proceso en el intervalo intermedio provoca pérdida de datos (data loss). Por ello se usa en contadores, visualizaciones o telemetría, nunca en balances financieros o cobros.',
    proTip: 'Para sistemas transaccionales, usa "Cache-Aside" con invalidación directa o "Write-Through" sincrónico.'
  },

  // ==================== 4. COLAS, MENSAJERÍA & RABBITMQ ====================
  {
    id: 'sub-10',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En RabbitMQ, ¿por qué es peligroso dejar el valor de "prefetch_count" (QoS) en 0 (sin límite) en consumidores con tareas pesadas?',
    codeSnippet: `channel.basicQos(0); // Peligro: prefetchCount sin límite
channel.basicConsume("heavy_video_processing", false, consumer);`,
    codeLanguage: 'java',
    options: [
      'RabbitMQ enviará todos los mensajes de la cola inmediatamente al primer consumidor conectado, saturando su memoria y dejando a los demás consumidores ociosos (worker starving).',
      'RabbitMQ desconecta el canal TCP automáticamente tras 10 mensajes.',
      'Provoca que los mensajes se borren sin ejecutarse debido a un timeout interno.',
      'Obliga a que todos los mensajes se procesen en orden alfabético.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Un prefetchCount de 0 significa que el broker empuja (push) tantos mensajes como tenga disponibles sin esperar confirmaciones (acks). Si un worker tarda 30 segundos en procesar un mensaje y hay 100 mensajes, los 100 van a parar a la memoria de ese único worker, mientras 5 workers adicionales recién levantados quedan inactivos con carga 0.',
    proTip: 'Para tareas pesadas (CPU bound o I/O lento), configura "prefetch_count = 1". Para micro-tareas ultrarrápidas, valores entre 50 y 200 optimizan el throughput de red reduciendo el overhead de ACKs individuales.'
  },
  {
    id: 'sub-11',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Qué error catastrófico provoca este código ante un mensaje con formato inválido (poison message)?',
    codeSnippet: `try {
    processOrder(message);
    channel.basicAck(deliveryTag, false);
} catch (Exception e) {
    logger.error("Error procesando orden", e);
    // Reencolar de inmediato para no perder el mensaje
    channel.basicNack(deliveryTag, false, true); // requeue = true
}`,
    codeLanguage: 'java',
    options: [
      'Crea un bucle infinito ("poison pill loop"): el mensaje corrupto vuelve a la cabeza de la cola, falla de nuevo, se reencola de nuevo y satura CPU/logs al 100% indefinidamente.',
      'RabbitMQ cierra la conexión automáticamente tras el primer Nack.',
      'El parámetro "requeue = true" descarta el mensaje permanentemente.',
      'El método "basicAck" no puede invocarse dentro de un bloque try-catch.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Si un mensaje falla debido a un error no transitorio (ej. JSON malformado o NullPointerException en el payload), llamar a "basicNack" con "requeue = true" reinserta el mensaje al inicio de la cola para que sea consumido inmediatamente por el mismo worker o el siguiente, repitiéndose en bucle infinito miles de veces por segundo.',
    proTip: 'Solución: Configura un Dead Letter Exchange (DLX) con "x-dead-letter-exchange" en la cola. Ante fallos de negocio, haz nack con "requeue = false" para que RabbitMQ desvíe el mensaje a la Dead Letter Queue (DLQ) para inspección manual.'
  },
  {
    id: 'sub-12',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Dado que los brokers como RabbitMQ, Kafka y SQS garantizan entrega "At-Least-Once", ¿cómo se garantiza que un pago no se cobre dos veces si el worker recibe el mismo mensaje duplicado?',
    codeSnippet: `// Patrón Idempotent Consumer
async function handlePayment(event) {
  const isProcessed = await redis.set(\`processed:\${event.idempotencyKey}\`, "1", "NX", "EX", 86400);
  if (!isProcessed) {
    logger.warn(\`Evento duplicado detectado: \${event.idempotencyKey}. Ignorando.\`);
    return;
  }
  await paymentGateway.charge(event.amount);
}`,
    codeLanguage: 'javascript',
    options: [
      'Haciendo que el consumidor sea idempotente: verificando y registrando una clave única (idempotency key) en una base de datos o Redis mediante una operación atómica antes de ejecutar la acción.',
      'Configurando RabbitMQ en modo "Exactly-Once-Hardware" en el archivo de configuración.',
      'Aumentando el tiempo de timeout de la conexión AMQP a 1 hora.',
      'Enviando siempre un ACK antes de comenzar a procesar el mensaje.'
    ],
    correctAnswerIndex: 0,
    explanation: 'En sistemas distribuidos, fallos de red durante el envío del ACK provocan que el broker reenvíe el mensaje creyendo que el worker murió. Por ende, los consumidores deben ser idempotentes por diseño: usar "idempotency keys" únicas con locks o registros transaccionales en base de datos para ignorar o no reejecutar efectos colaterales duplicados.',
    proTip: 'En bases de datos relacionales, el patrón "Outbox Pattern" combinado con una tabla de eventos procesados con restricción UNIQUE sobre event_id dentro de la misma transacción local es la solución más robusta.'
  },

  // ==================== 5. GIT WORKTREES & TRUCOS DE FLUJO ====================
  {
    id: 'sub-13',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Estás a mitad de una refactorización compleja con 15 archivos sin commitear y surge un bug urgente en producción. ¿Cómo te permite "git worktree" solucionarlo sin recurrir a "git stash" ni clonar de nuevo el repositorio?',
    codeSnippet: `git worktree add ../hotfix-login hotfix/login-crash
cd ../hotfix-login
# Reparar bug, commitear y pushear
cd ../mi-proyecto-principal
git worktree remove ../hotfix-login`,
    codeLanguage: 'bash',
    options: [
      'Crea un nuevo directorio de trabajo vinculado al mismo repositorio local (.git), permitiendo tener múltiples ramas activas chequeadas en simultáneo en carpetas independientes.',
      'Crea una máquina virtual aislada con Docker para compilar el código.',
      'Hace un backup de los archivos modificados en la nube de GitHub.',
      'Es un alias obsoleto de "git clone --depth 1".'
    ],
    correctAnswerIndex: 0,
    explanation: '"git worktree" te permite tener dos o más carpetas de trabajo apuntando al mismo almacenamiento de objetos en .git. Puedes estar ejecutando tu suite de pruebas en tu feature branch en una carpeta, y tener otra carpeta abierta en VS Code/IntelliJ con la rama de hotfix sin ensuciar el estado de trabajo ni perder tiempo haciendo stash/pop o re-instalando dependencias.',
    proTip: 'Para limpiar worktrees que eliminaste manualmente con rm -rf, ejecuta "git worktree prune".'
  },
  {
    id: 'sub-14',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué restricción estricta tiene "git worktree" para evitar inconsistencias de ramas?',
    codeSnippet: `fatal: 'main' is already checked out at '/path/to/project-main'`,
    codeLanguage: 'text',
    options: [
      'No permite tener la misma rama (branch) chequeada en más de un worktree al mismo tiempo para prevenir colisiones en el puntero HEAD.',
      'No permite ramas que tengan nombres con caracteres guion o barra inclinada.',
      'Solo funciona si el repositorio tiene menos de 100 commits en su historial.',
      'Requiere que el repositorio esté alojado en GitHub Enterprise.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Git impide que dos worktrees tengan activa la misma rama local porque si ambos hicieran commits independientes, el puntero de la rama divergiría en dos estados sin que exista una operación de merge explícita. Si necesitas inspeccionar la misma rama en otro worktree, puedes chequearla como un commit específico en estado detached HEAD.',
    proTip: 'Usa "git worktree list" para auditar qué ramas están asignadas a qué carpetas en tu máquina local.'
  },

  // ==================== 6. CODE SMELLS SUTILES & DISEÑO DE SOFTWARE ====================
  {
    id: 'sub-15',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Qué code smell sutil presenta este diseño y cuál es su principal riesgo de mantenimiento?',
    codeSnippet: `class UserService {
  public void register(String email, String rawPassword, String phoneCountry, String phoneArea, String phoneNumber) {
    if (!email.contains("@")) throw new IllegalArgumentException();
    if (rawPassword.length() < 8) throw new IllegalArgumentException();
    String formattedPhone = "+" + phoneCountry + " (" + phoneArea + ") " + phoneNumber;
    // ...
  }
}`,
    codeLanguage: 'java',
    options: [
      '"Primitive Obsession": usar tipos primitivos planos (Strings) para conceptos del dominio que tienen reglas de validación e invariantes propias, en vez de Value Objects (Email, Password, PhoneNumber).',
      '"Feature Envy": el método accede a métodos privados de otra clase externa.',
      '"God Object": la clase tiene más de 5000 líneas de código.',
      '"Dead Code": la variable formattedPhone nunca se utiliza en el código.'
    ],
    correctAnswerIndex: 0,
    explanation: '"Primitive Obsession" ocurre cuando conceptos de dominio con reglas de validación (email, contraseña, teléfono, dinero, coordenadas) se representan con strings o floats crudos. La validación se duplica en cada método/controlador, es fácil intercambiar argumentos ("phoneCountry" por "phoneArea") y el modelo se vuelve frágil. Se soluciona encapsulando en Value Objects inmutables con auto-validación.',
    proTip: 'Los Value Objects (ej. "record Email(String value)") garantizan que si un objeto de tipo Email existe, siempre es válido, eliminando defensas repetitivas en capas de servicio.'
  },
  {
    id: 'sub-16',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué es el code smell "Feature Envy" y cómo se identifica durante un Code Review?',
    codeSnippet: `class OrderInvoicePrinter {
  public double calculateTotal(Order order) {
    double sum = 0;
    for (OrderItem item : order.getItems()) {
      sum += item.getPrice() * item.getQuantity() - (item.getDiscountRate() * item.getPrice());
    }
    return sum + (sum * order.getCustomer().getTaxProfile().getVatPercentage());
  }
}`,
    codeLanguage: 'java',
    options: [
      'Un método en una clase parece más interesado en los datos y cálculos internos de otra clase que en los propios; la lógica debería pertenecer a la clase que posee los datos (Order).',
      'Una clase que utiliza demasiadas librerías externas de terceros.',
      'Un componente React que utiliza demasiados custom hooks concurrentes.',
      'Una función que tarda más de 200ms en devolver su resultado.'
    ],
    correctAnswerIndex: 0,
    explanation: '"Feature Envy" (envidia de características) viola el principio "Information Expert" y la ley de Demeter: la clase OrderInvoicePrinter está haciendo cálculos matemáticos minuciosos extrayendo getters de Order, OrderItem y Customer. Ese cálculo de totales e impuestos debe residir dentro del modelo Order o de un Dominio de Precios, no en una clase de impresión.',
    proTip: 'Si ves código que encadena más de 2 o 3 getters ("order.getCustomer().getTaxProfile()..."), es un indicador claro de Feature Envy o violación de la Ley de Demeter.'
  },
  {
    id: 'sub-17',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué es el "Temporal Coupling" (acoplamiento temporal) y por qué genera bugs difíciles de rastrear en pruebas unitarias?',
    codeSnippet: `const report = new ReportGenerator();
report.setContext(ctx);
report.prepareHeaders(); // Si olvidas llamar a esto primero...
report.generatePdf();    // ¡Falla con NullPointerException en tiempo de ejecución!`,
    codeLanguage: 'javascript',
    options: [
      'Ocurre cuando métodos de una clase deben ejecutarse en un orden cronológico específico estricto sin que la firma o el compilador fuercen dicho orden.',
      'Ocurre cuando el servidor y el cliente tienen la zona horaria desfasada por NTP.',
      'Es un bug exclusivo de operaciones asíncronas con setTimeout.',
      'Es la dependencia entre dos microservicios que comparten una base de datos en común.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El acoplamiento temporal ocurre cuando la API de una clase depende de un orden secreto de invocación de métodos mutables. Si un programador nuevo no llama a "prepareHeaders()" antes de "generatePdf()", el sistema explota. La solución es usar constructores con parámetros obligatorios, métodos puros o el patrón Fluent/Builder que no exponga estados intermedios inválidos.',
    proTip: 'Para erradicar el acoplamiento temporal, haz que el método previo devuelva una instancia tipada necesaria como parámetro del método siguiente (Type-Driven State Machine).'
  },

  // ==================== 7. SENTRY, OBSERVABILIDAD & DISTRIBUTED TRACING ====================
  {
    id: 'sub-18',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Por qué esta configuración de Sentry en una API de producción causó una factura astronómica y saturó la cuota mensual en 2 días?',
    codeSnippet: `Sentry.init({
  dsn: "https://example@sentry.io/123",
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  integrations: [new Sentry.Integrations.Http({ tracing: true })],
});`,
    codeLanguage: 'typescript',
    options: [
      'Configuró un muestreo del 100% ("1.0") en trazas y perfiles en una aplicación de alto tráfico, enviando cada petición y captura de CPU en vez de usar una tasa representativa (ej. 0.05).',
      'El DSN es público y cualquier usuario puede enviar errores a la cuenta.',
      'La integración HTTP no es compatible con Node.js en producción.',
      'Sentry requiere deshabilitar el tracing para que el plan gratuito no expire.'
    ],
    correctAnswerIndex: 0,
    explanation: 'En aplicaciones con miles o millones de peticiones por minuto, "tracesSampleRate: 1.0" y "profilesSampleRate: 1.0" significa capturar e ingestar el 100% absoluto de transacciones y perfiles de memoria/CPU. En producción de alto tráfico, se debe usar muestreo estadístico (0.01 a 0.1) o "tracesSampler" dinámico para muestrear 100% de errores y rutas críticas (ej. /checkout) y 1% de endpoints comunes (ej. /health).',
    proTip: 'Usa la función tracesSampler para descartar endpoints de salud (/healthz, /ready) devolviendo 0.0 y reservar presupuesto para rutas de negocio.'
  },
  {
    id: 'sub-19',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cómo previene un ingeniero senior que contraseñas, tokens JWT o tarjetas de crédito de usuarios terminen en los eventos de Sentry vulnerando GDPR/SOC2?',
    codeSnippet: `Sentry.init({
  beforeSend(event, hint) {
    if (event.request && event.request.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
    }
    // Scrub de payloads sensibles
    return event;
  }
});`,
    codeLanguage: 'javascript',
    options: [
      'Implementando el hook "beforeSend" para limpiar (scrub) headers de autenticación y campos sensibles en el cuerpo de la petición antes de su transmisión.',
      'Configurando una clave SSL privada en el dashboard de Sentry.',
      'Los errores capturados por Sentry están encriptados y ninguna ley de privacidad los regula.',
      'Desactivando el logging de excepciones en tiempo de compilación.'
    ],
    correctAnswerIndex: 0,
    explanation: '"beforeSend" es el punto de intercepción final del SDK de Sentry donde puedes auditar, modificar o rechazar eventos. Es mandatorio purgar encabezados como "Authorization", cookies de sesión y campos de formulario como "password", "cardNumber" o "cvv" para cumplir con regulaciones como PCI-DSS, HIPAA y GDPR.',
    proTip: 'Sentry también ofrece "Data Scrubbers" en su UI que reemplazan automáticamente con [Filtered] campos comunes como "pass*", "token*", "secret*" y expresiones regulares de tarjetas.'
  },
  {
    id: 'sub-20',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En Distributed Tracing entre un Frontend SPA y múltiples Microservicios Backend, ¿qué cabeceras HTTP estándar son responsables de propagar el identificador de la traza (traceparent)?',
    codeSnippet: `sentry-trace: 4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-1
baggage: sentry-environment=production,sentry-release=1.2.0`,
    codeLanguage: 'text',
    options: [
      'Las cabeceras "sentry-trace" (o el estándar W3C "traceparent") y "baggage", que transmiten el Trace ID, Parent Span ID y metadatos contextuales a través de llamadas de red.',
      'El encabezado "X-Forwarded-For" junto con "User-Agent".',
      'El cookie "PHPSESSID" o "JSESSIONID".',
      'El campo "Host" y "Accept-Encoding".'
    ],
    correctAnswerIndex: 0,
    explanation: 'El estándar W3C Trace Context define "traceparent" (y Sentry usa "sentry-trace" + "baggage") para transmitir: versión, trace_id de 16 bytes, parent_id de 8 bytes y flags de muestreo. Cuando el frontend realiza un fetch, inyecta estas cabeceras; el backend las extrae y crea sus spans vinculados al mismo trace_id, permitiendo visualizar la cascada completa de latencia de extremo a extremo.',
    proTip: 'Configura "tracePropagationTargets: [\'api.tudominio.com\']" en el frontend para evitar propagar cabeceras de rastreo a llamadas de dominios de terceros (Google Analytics, Stripe, etc.).'
  },

  // ==================== 8. SERVIR ASSETS EN S3, STREAMING & PDFS ====================
  {
    id: 'sub-21',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Un usuario sube un archivo PDF confidencial a un bucket S3 privado. Necesitas que el usuario lo visualice directamente en el visor de PDF integrado del navegador durante 5 minutos sin que se descargue como archivo en disco. ¿Qué parámetros de Presigned URL son obligatorios?',
    codeSnippet: `const command = new GetObjectCommand({
  Bucket: 'mis-facturas-privadas',
  Key: 'factura_123.pdf',
  ResponseContentType: 'application/pdf',
  ResponseContentDisposition: 'inline; filename="factura_123.pdf"'
});
const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });`,
    codeLanguage: 'typescript',
    options: [
      'Configurar "ResponseContentType: application/pdf" y "ResponseContentDisposition: inline; filename=..." con un tiempo de expiración (expiresIn: 300).',
      'Configurar "ResponseContentDisposition: attachment" con permisos públicos en el bucket S3.',
      'Convertir el archivo a base64 y enviarlo en el header HTTP Authorization.',
      'Hacer el bucket S3 de lectura pública durante los 5 minutos mediante una política de IAM.'
    ],
    correctAnswerIndex: 0,
    explanation: '"ResponseContentDisposition: inline" le ordena al navegador renderizar el recurso dentro de la ventana/pestaña si dispone de un visor compatible (como el visor PDF nativo de Chrome o Firefox). Por el contrario, "attachment" fuerza la descarga del archivo al disco del usuario. "ResponseContentType" garantiza que el navegador no lo interprete como texto plano ("text/plain") ni como binario genérico ("application/octet-stream").',
    proTip: 'Si no sobreescribes el Content-Type al generar la Presigned URL o al subir el archivo, S3 puede servirlo como application/octet-stream, lo que obligará al navegador a descargarlo aunque configures inline.'
  },
  {
    id: 'sub-22',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Por qué un video MP4 servido directamente desde un bucket S3 o CloudFront falla o no permite adelantar/retroceder la barra de reproducción (seeking) en Safari/iOS?',
    codeSnippet: `HTTP/1.1 206 Partial Content
Content-Range: bytes 1048576-2097151/10485760
Content-Length: 1048576
Accept-Ranges: bytes`,
    codeLanguage: 'http',
    options: [
      'Safari requiere obligatoriamente soporte de peticiones de rango HTTP (Range header) y respuesta con código de estado "206 Partial Content" para reproducir y hacer seeking en archivos multimedia.',
      'iOS solo permite reproducir videos en formato exclusivo Apple ProRes con códec H.265.',
      'S3 no soporta archivos de más de 10 Megabytes sin compresión Gzip.',
      'CloudFront bloquea por defecto todas las extensiones de video que no sean WebM.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Los reproductores HTML5 modernos (y especialmente Safari en iOS/macOS) no descargan el archivo de video completo; envían solicitudes HTTP con el encabezado "Range: bytes=0-1" para leer los metadatos iniciales (moov atom) y luego solicitan trozos específicos según la posición de la barra de reproducción. El servidor/CDN debe soportar "Range requests" y responder con "206 Partial Content".',
    proTip: 'Al usar ffmpeg para web, asegúrate de utilizar el flag "-movflags +faststart" para mover el átomo de metadatos "moov" al principio del archivo MP4, permitiendo reproducción instantánea sin esperar la descarga completa.'
  },
  {
    id: 'sub-23',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Al servir imágenes estáticas versionadas a través de AWS CloudFront conectado a S3, ¿cuál es la mejor práctica de Cache-Control para lograr máxima velocidad y cero costos de invalidaciones manuales?',
    codeSnippet: `// Estrategia Cache-Busting con Hashes:
// /assets/hero-banner.a8f2bc91.webp
Cache-Control: public, max-age=31536000, immutable`,
    codeLanguage: 'http',
    options: [
      'Nombrar los archivos con el hash de su contenido y enviar "Cache-Control: public, max-age=31536000, immutable"; si la imagen cambia, cambia la URL, eliminando la necesidad de invalidar la CDN.',
      'Enviar siempre "Cache-Control: no-cache, no-store" para forzar revalidación permanente.',
      'Ejecutar "aws cloudfront create-invalidation --paths /*" cada vez que un usuario solicita una imagen.',
      'Configurar el TTL de CloudFront en 60 segundos para todo el tráfico.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El patrón de assets inmutables con huella digital en la URL (fingerprinting/content hashing) permite configurar "max-age=31536000 (1 año)" e "immutable". El navegador y los Edge Locations de CloudFront retienen el archivo indefinidamente con tasa de aciertos (Cache Hit) cercana al 100%. Cuando se publica un nuevo diseño, el nombre del archivo cambia (ej. hero.f901.webp), por lo que nunca se pagan invalidaciones ni se sirven datos obsoletos.',
    proTip: 'Para archivos con nombres fijos que deben cambiar en el mismo path (ej. avatar_actual.png), usa "Cache-Control: no-cache" junto con ETag para que el navegador haga validaciones 304 Not Modified ultra-livianas.'
  },
  {
    id: 'sub-24',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Para permitir que clientes web suban archivos pesados (videos de 2 GB) a S3 directamente sin saturar el ancho de banda ni la memoria de tu servidor backend, ¿qué arquitectura se utiliza?',
    codeSnippet: `1. Frontend solicita sesión de carga a Backend.
2. Backend genera IDs de Multipart Upload y Presigned URLs por cada parte (chunk).
3. Frontend sube cada parte directamente a S3 en paralelo.
4. Backend completa el Multipart Upload en S3.`,
    codeLanguage: 'text',
    options: [
      'S3 Multipart Upload con Presigned URLs: el backend solo firma criptográficamente las partes y el navegador sube los fragmentos directamente a los servidores de AWS en paralelo.',
      'Recibir el archivo completo en la RAM del backend con multer y enviarlo por FTP.',
      'Aumentar el límite "client_max_body_size" de Nginx a 10 GB y retransmitir el stream.',
      'Guardar el video dividido en fragmentos Base64 en una tabla de PostgreSQL.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Transmitir gigabytes a través del servidor de aplicaciones desperdicia CPU, RAM y ancho de banda de salida (egress). Con S3 Multipart Upload + Presigned URLs, el cliente divide el archivo en fragmentos (ej. de 10MB) y los sube directo a AWS con reintentos individuales por fragmento si la conexión falla, mientras tu API backend solo firma URLs y orquesta el inicio y fin de la carga.',
    proTip: 'Configura una regla de ciclo de vida (Lifecycle Rule) en tu bucket S3 con "AbortIncompleteMultipartUpload" tras 3 o 7 días; de lo contrario, las subidas fallidas inconclusas acumulan partes ocultas en S3 que AWS te cobrará cada mes.'
  },

  // ==================== 9. TRUCOS DE DOCKER & DEVOPS ====================
  {
    id: 'sub-25',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Por qué un contenedor Docker con Node.js o Python ejecutándose como PID 1 a menudo ignora "docker stop" (tarda 10 segundos en apagarse y muere por SIGKILL) y acumula procesos zombies?',
    codeSnippet: `// Dockerfile sin init:
ENTRYPOINT ["node", "server.js"] // Se ejecuta como PID 1 en el contenedor

// Solución moderna:
ENTRYPOINT ["/usr/bin/tini", "--", "node", "server.js"]`,
    codeLanguage: 'dockerfile',
    options: [
      'En Linux, el proceso PID 1 tiene la responsabilidad especial de adoptar procesos huérfanos (reaping) y no aplica los manejadores por defecto para señales como SIGTERM; "tini" actúa como un init ligero que reenvía señales y recoge zombies.',
      'Node.js y Python no son compatibles con la arquitectura x86 de Linux.',
      'Docker stop envía por defecto una señal SIGSEGV que corrompe la memoria del runtime.',
      'Porque el archivo package.json no incluye la dependencia "@types/docker".'
    ],
    correctAnswerIndex: 0,
    explanation: 'En el kernel de Linux, el PID 1 (tradicionalmente systemd/init) ignora cualquier señal que no tenga un manejador explícito registrado en código. Cuando Docker envía SIGTERM, Node.js no termina a menos que tenga un listener de SIGTERM. Además, si la app lanza subprocesos que mueren, quedan como zombies ("<defunct>") porque Node.js no hace "waitpid()". Herramientas como "tini" o "dumb-init" solucionan esto de raíz.',
    proTip: 'Docker incluye tini integrado: puedes probarlo directamente en tu comando docker run pasando la bandera "--init".'
  },
  {
    id: 'sub-26',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Por qué este Dockerfile reconstruye y reinstala TODOS los módulos de npm cada vez que cambia una sola línea de código fuente en "src/index.ts"?',
    codeSnippet: `FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci --omit=dev
CMD ["node", "src/index.ts"]`,
    codeLanguage: 'dockerfile',
    options: [
      'Hizo "COPY . ." antes de "RUN npm ci", lo que invalida la caché de Docker de la capa de dependencias ante cualquier mínimo cambio en cualquier archivo del proyecto.',
      'El comando "npm ci" no tiene soporte de caché en Alpine Linux.',
      'Falta la instrucción "EXPOSE 3000" para habilitar la caché de capas.',
      'La imagen base de Node 20 no permite capas intermedias.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Docker valida la caché de capas de forma secuencial. Al copiar todo el repositorio ("COPY . ."), cualquier cambio en el código fuente modifica la firma de esa capa, invalidando todas las capas posteriores y forzando a que "npm ci" se ejecute desde cero. La solución es copiar primero solo "package*.json", ejecutar "npm ci", y luego copiar el resto del código ("COPY . .").',
    proTip: 'Asegúrate de tener un .dockerignore completo que excluya "node_modules", ".git", "coverage" y archivos ".env".'
  },
  {
    id: 'sub-27',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Con Docker BuildKit moderno, ¿cómo compartes la caché de gestores de paquetes (npm, pip, go, cargo) entre compilaciones sin que la carpeta de caché quede grabada en la imagen final?',
    codeSnippet: `RUN --mount=type=cache,target=/root/.cache/pip \\
    pip install -r requirements.txt`,
    codeLanguage: 'dockerfile',
    options: [
      'Utilizando montajes de caché ("RUN --mount=type=cache,target=..."), que mantienen los paquetes descargados en el host de compilación sin inflar el tamaño de la imagen resultante.',
      'Guardando la carpeta de caché en un volumen montado con "-v /tmp:/tmp" en tiempo de ejecución.',
      'Haciendo un "chmod 777" a la carpeta de dependencias en el host.',
      'Comprando una licencia comercial de Docker Desktop.'
    ],
    correctAnswerIndex: 0,
    explanation: '"--mount=type=cache" es una característica de BuildKit que monta temporalmente un directorio persistente exclusivo para el motor de build durante la ejecución de ese comando RUN. Los paquetes descargados se reutilizan en builds posteriores sin necesidad de descargarlos de nuevo por internet y sin añadir ni un solo megabyte al sistema de archivos de la imagen final.',
    proTip: 'En Node.js puedes usar "RUN --mount=type=cache,target=/root/.npm npm ci" para acelerar pipelines locales y en CI drásticamente.'
  },
  {
    id: 'sub-28',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Por qué ejecutar contenedores en producción con el usuario "root" por defecto representa un riesgo de seguridad crítico y cómo se soluciona?',
    codeSnippet: `# Dockerfile Seguro:
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser:appgroup`,
    codeLanguage: 'dockerfile',
    options: [
      'Si ocurre un fallo de escape de contenedor (container breakout), el atacante adquiere privilegios de root (UID 0) en el sistema operativo host. Se soluciona creando y declarando un usuario sin privilegios con la instrucción "USER".',
      'Root hace que el contenedor consuma el doble de ancho de banda de red.',
      'El kernel de Linux no permite conexiones HTTPS cuando el proceso es UID 0.',
      'Solo los contenedores de Windows soportan ejecución con usuario root.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Un contenedor comparte el mismo kernel del host. El usuario root (UID 0) dentro del contenedor tiene el mismo identificador numérico que root en el host a menos que esté activo User Namespaces. Si el atacante explota una vulnerabilidad en Docker o en el kernel (ej. Dirty COW, runc CVE), tiene control total de la máquina host. Declarar un usuario no root ("USER appuser") mitiga drásticamente el impacto.',
    proTip: 'En Kubernetes, refuerza esto a nivel de clúster con "securityContext: runAsNonRoot: true" y "allowPrivilegeEscalation: false".'
  },
  {
    id: 'sub-29',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia sutil pero crucial entre la instrucción "ENTRYPOINT" y "CMD" en un Dockerfile?',
    codeSnippet: `ENTRYPOINT ["python", "app.py"]
CMD ["--port", "8080"]`,
    codeLanguage: 'dockerfile',
    options: [
      '"ENTRYPOINT" define el ejecutable inmutable que siempre correrá; "CMD" proporciona los argumentos por defecto que pueden ser fácilmente sobreescritos al ejecutar "docker run <imagen> <otros-argumentos>".',
      '"CMD" se ejecuta durante el build de la imagen y "ENTRYPOINT" durante el arranque del contenedor.',
      '"ENTRYPOINT" solo funciona en imágenes basadas en Ubuntu, mientras "CMD" es universal.',
      'Son idénticos y solo existen dos palabras clave por compatibilidad histórica con UNIX.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Cuando se combinan en su formato exec (corchetes JSON), ENTRYPOINT especifica el comando principal del contenedor y CMD proporciona los parámetros predeterminados. Si ejecutas "docker run mi-imagen --port 9090", sólo los parámetros de CMD se reemplazan por "--port 9090", manteniendo el ejecutable "python app.py" intacto.',
    proTip: 'Utiliza siempre la sintaxis de array JSON ["ejecutable", "arg"] (Exec form) en lugar de la forma shell (ENTRYPOINT python app.py), ya que la forma shell lanza /bin/sh -c como PID 1 y oculta las señales del sistema operativo a tu aplicación.'
  },
  {
    id: 'sub-30',
    categoryId: 'subtle_engineering',
    categoryName: 'Sutilezas Pro & Producción',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En un pipeline de CI con pruebas automatizadas contra una base de datos PostgreSQL, ¿cuál es la técnica más veloz para acelerar los tests sin comprometer la integridad de las pruebas?',
    codeSnippet: `// Docker / Postgres config para CI:
docker run -e POSTGRES_PASSWORD=secret \\
  postgres:16-alpine \\
  -c fsync=off -c synchronous_commit=off -c full_page_writes=off`,
    codeLanguage: 'bash',
    options: [
      'Desactivar fsync y synchronous_commit en la instancia de Postgres efímera del CI, ya que las garantías de durabilidad en disco ante caídas de energía son irrelevantes en runners que se destruyen al finalizar.',
      'Reemplazar PostgreSQL por un archivo JSON en memoria en todas las pruebas.',
      'Ejecutar las pruebas unitarias sin compilar el proyecto.',
      'Hacer commit a git con el flag "--no-verify".'
    ],
    correctAnswerIndex: 0,
    explanation: 'Postgres dedica una gran cantidad de tiempo esperando que el kernel escriba físicamente las páginas en disco (fsync) para garantizar durabilidad ACID ante apagones. En un runner de CI que vivirá 3 minutos y se destruirá, esa persistencia no tiene valor. Apagar fsync ("fsync=off", "synchronous_commit=off", "full_page_writes=off") puede hacer que las suites de pruebas corran de 3 a 8 veces más rápido.',
    proTip: '¡Nunca apliques esto en bases de datos de producción ni en staging donde residan datos persistentes!'
  }
];
