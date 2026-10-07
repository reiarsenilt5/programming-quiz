import { Question } from '../types/quiz';

export const DEVOPS_CLOUD_QUESTIONS: Question[] = [
  // ==================== LINUX SYSTEMS & OS INTERNALS (12 Preguntas) ====================
  {
    id: 'dev-01',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuáles son los dos mecanismos fundamentales del Kernel de Linux sobre los cuales se construyen los contenedores OCI (Docker/containerd)?',
    options: [
      'Xen Hypervisor y QEMU emulators.',
      'Kernel Namespaces (aislamiento de visibilidad) y Control Groups / cgroups (aislamiento y cuotas de recursos).',
      'Swap partitions y módulos de kernel DKMS.',
      'Sistemas de archivos ext4 y swap files.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Los Namespaces (pid, net, mnt, ipc, uts, user) definen qué recursos puede ver un proceso. Los cgroups v1/v2 controlan cuántos recursos (CPU, RAM, I/O de disco) puede consumir. Los contenedores no son máquinas virtuales; son procesos estándar de Linux gobernados por estas dos primitivas del kernel.',
    proTip: 'Inspecciona los namespaces activos de cualquier proceso con `ls -l /proc/<PID>/ns` en tu terminal Linux.'
  },
  {
    id: 'dev-02',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En Linux, ¿qué es exactamente un Proceso Zombie (Z) y cómo se resuelve si persiste consumiendo entradas en la tabla de procesos?',
    options: [
      'Un proceso que consume el 100% de la CPU en un bucle infinito; se resuelve con renice -20.',
      'Un proceso que finalizó su ejecución pero su padre aún no ha leído su código de salida con wait()/waitpid(); se resuelve terminando al proceso padre para que PID 1 lo adopte y lo limpie.',
      'Un virus informático que infecta /tmp; se resuelve reiniciando el demonio cron.',
      'Un proceso huérfano con prioridad negativa en el planificador CFS.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Un proceso zombie no consume memoria RAM ni CPU, solo ocupa una entrada en la Process Table. No puedes matarlo con kill -9 porque ya está muerto. La solución es enviar SIGCHLD al padre para que invoque wait(), o matar al proceso padre para que systemd (PID 1) lo adopte (reaping).',
    proTip: 'En contenedores Docker sin init system, usa `--init` (Tini) para evitar acumulación de zombies cuando tu aplicación spawnea subprocesos.'
  },
  {
    id: 'dev-03',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Por qué la llamada al sistema epoll (Linux) escala a decenas de miles de conexiones concurrentes mientras select() y poll() colapsan?',
    options: [
      'epoll compila las peticiones de red directamente en microcódigo del CPU.',
      'select/poll tienen complejidad O(N) porque el kernel debe recorrer todo el array de file descriptors en cada ciclo; epoll usa eventos O(1) con una estructura rbtree y callback list en memoria compartida.',
      'epoll utiliza exclusivamente conexiones UDP sin confirmación ACK.',
      'poll() está limitado a un máximo de 10 conexiones en Linux de 64 bits.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Con select(), la aplicación copia una lista de todos los sockets al kernel y este los itera secuencialmente en cada llamada O(N). Con epoll, el kernel registra listeners mediante callbacks de hardware; cuando un socket recibe datos, se añade a una lista de listos (ready list), permitiendo al servidor leer únicamente los descriptores activos O(1).',
    proTip: 'Servidores de alto rendimiento como Nginx, Envoy, Node.js (libuv) y Netty basan su arquitectura de Event Loop en epoll.'
  },
  {
    id: 'dev-04',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Cuando el kernel de Linux se queda sin memoria física (OOM), ¿cómo decide el OOM Killer a qué proceso terminar?',
    options: [
      'Termina el proceso con el PID más bajo.',
      'Calcula un puntaje (oom_score) combinando el porcentaje de memoria consumida y el factor de ajuste oom_score_adj (-1000 a 1000).',
      'Termina todos los procesos de forma aleatoria hasta liberar 1GB.',
      'Termina siempre al proceso con mayor tiempo de CPU acumulado.'
    ],
    correctAnswerIndex: 1,
    explanation: 'El OOM Killer evalúa /proc/<PID>/oom_score. Un proceso con oom_score_adj de -1000 es inmune a ser terminado (usado por demonios críticos como sshd o kubelet). Procesos con valores altos de consumo sin privilegios son los primeros candidatos.',
    proTip: 'En Kubernetes, los pods con QoS "BestEffort" reciben un oom_score_adj alto (1000) y son expulsados antes que los pods "Guaranteed" (-997).'
  },
  {
    id: 'dev-05',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Si un servicio en producción arroja "java.io.IOException: Too many open files", ¿qué comando permite diagnosticar qué descriptores están saturando el límite?',
    options: [
      'traceroute -p 80',
      'lsof -p <PID> | wc -l y verificar /proc/<PID>/limits (Max open files)',
      'chmod +x /etc/hosts',
      'cat /sys/kernel/debug/acpi'
    ],
    correctAnswerIndex: 1,
    explanation: 'En Linux "todo es un archivo", incluyendo sockets TCP de red, pipes y archivos en disco. lsof (List Open Files) o `ls /proc/<PID>/fd | wc -l` permite auditar el número real de descriptores abiertos frente a los límites definidos en ulimit -n o LimitNOFILE en systemd.',
    proTip: 'Para cambiar el límite en servicios systemd, añade `LimitNOFILE=65536` en la sección [Service] del archivo .service.'
  },
  {
    id: 'dev-06',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Durante una degradación repentina de latencia sin alto consumo de CPU, ¿qué herramienta de bajo nivel permite trazar en tiempo real las syscalls bloqueantes de un proceso?',
    options: [
      'strace -tt -T -p <PID>',
      'ping -c 4 localhost',
      'df -h /var/log',
      'whoami'
    ],
    correctAnswerIndex: 0,
    explanation: 'strace intercepta todas las llamadas al sistema del proceso. Las banderas -tt muestran marcas de tiempo con microsegundos y -T muestra el tiempo exacto que duró la ejecución de la syscall (por ejemplo, futex() colgado o epoll_wait() esperando sockets).',
    proTip: 'En entornos de producción masiva con eBPF, herramientas como `bcc/syscount` o `perf` son aún más eficientes porque tienen menor sobrecarga que ptrace.'
  },
  {
    id: 'dev-07',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Por qué la comunicación entre microservicios locales en el mismo nodo mediante UNIX Domain Sockets (UDS) es sustancialmente más rápida que TCP sobre 127.0.0.1?',
    options: [
      'UDS transmite ondas electromagnéticas directas en la placa madre.',
      'UDS evita el cálculo de checksums TCP, el handshake SYN/ACK, la segmentación de paquetes y el overhead del stack de red IP del kernel.',
      'TCP sobre loopback requiere enviar paquetes físicos a la tarjeta de red externa.',
      'UNIX Domain Sockets están limitados a 1 usuario a la vez.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Los UNIX Domain Sockets operan como pipes bidireccionales en el subsistema VFS del kernel. No tienen cabeceras TCP, ni control de congestión, ni cálculo de checksums; copian los datos directamente de un búfer de usuario a otro en memoria RAM.',
    proTip: 'Conectar Nginx o Envoy con upstream PHP-FPM o Node.js mediante sockets UDS (/run/app.sock) reduce la latencia P99 entre un 15% y 25% frente a puertos TCP.'
  },
  {
    id: 'dev-08',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En el modelo de permisos POSIX de Linux, ¿cuál es el propósito del Sticky Bit configurado en el directorio /tmp (chmod 1777)?',
    options: [
      'Permite que todos los usuarios modifiquen el archivo del sistema operativo.',
      'Permite a todos los usuarios escribir en el directorio, pero solo el propietario de un archivo o root puede borrar o renombrar su propio archivo.',
      'Impide la ejecución de binarios ELF dentro de la carpeta.',
      'Comprime automáticamente todos los logs creados.'
    ],
    correctAnswerIndex: 1,
    explanation: 'El Sticky Bit (representado por una "t" en `drwxrwxrwt`) impide que un usuario malicioso elimine los archivos temporales de otro usuario en directorios públicos compartidos como /tmp.',
    proTip: 'El bit SUID (4xxx), en contraste, ejecuta un binario con los permisos del propietario del archivo (ejemplo: /bin/passwd ejecutado con privilegios de root).'
  },
  {
    id: 'dev-09',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En una unidad de Systemd (systemd unit), ¿qué ventaja ofrece configurar Type=notify sobre Type=simple?',
    codeLanguage: 'ini',
    codeSnippet: `[Service]
Type=notify
ExecStart=/usr/bin/my-api
Restart=on-failure
RestartSec=5s`,
    options: [
      'Type=notify envía un mensaje de texto SMS al administrador.',
      'El servicio notifica explícitamente a systemd (vía sd_notify) cuando ha completado su inicialización y está 100% listo para recibir tráfico, evitando condiciones de carrera con servicios dependientes.',
      'Type=notify ejecuta el proceso en un contenedor Docker oculto.',
      'Type=simple no soporta reinicios automáticos.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Con Type=simple, systemd considera el servicio activo inmediatamente tras hacer fork/exec, lo que puede romper servicios dependientes que intenten conectar antes de que el socket esté listo. Con Type=notify, systemd espera la señal READY=1 emitida por la aplicación.',
    proTip: 'sd_notify("READY=1") es el estándar para servicios robustos en Linux moderno.'
  },
  {
    id: 'dev-10',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En cgroups v2, ¿cuál es la diferencia crucial entre memory.high y memory.max?',
    options: [
      'memory.high es para arquitecturas ARM y memory.max es para x86.',
      'memory.max es el límite duro (Hard Limit) que dispara el OOM Killer si se supera; memory.high es un límite blando (Throttling) que activa reclaimed proactivo y frena las peticiones del proceso sin matarlo.',
      'memory.high asigna memoria de video GPU.',
      'No existe memory.high en el kernel de Linux.'
    ],
    correctAnswerIndex: 1,
    explanation: 'cgroups v2 introdujo memory.high para amortiguar picos de carga. Al superar memory.high, el kernel ralentiza los procesos infractores y libera cachés de páginas agresivamente, previniendo reinicios violentos por OOM Killer si la memoria se estabiliza.',
    proTip: 'Kubernetes moderno y containerd v2 aprovechan cgroups v2 para una gestión de recursos mucho más predecible que la antigua jerarquía separada de cgroups v1.'
  },
  {
    id: 'dev-11',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En el handshake TCP de 3 vías, ¿cómo protege net.ipv4.tcp_syncookies = 1 al servidor ante ataques de denegación de servicio SYN Flood?',
    options: [
      'Bloquea la dirección IP de origen en iptables de forma permanente.',
      'En lugar de almacenar el estado de la conexión semiabierta en la SYN backlog queue (agotando RAM), codifica la información de estado dentro del Número de Secuencia Inicial (ISN) del paquete SYN-ACK.',
      'Apaga el puerto TCP atacado durante 60 segundos.',
      'Desvía el tráfico hacia un servidor proxy en la nube.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Durante un SYN Flood, el atacante envía miles de paquetes SYN sin responder nunca con el ACK final, llenando la tabla de conexiones en memoria. Con SYN Cookies activas, el kernel no asigna memoria de estado hasta recibir el ACK legítimo del cliente conteniendo el número de secuencia verificado con una firma criptográfica.',
    proTip: 'tcp_syncookies es una defensa vital habilitada por defecto en prácticamente todas las distribuciones modernas de Linux para servidores.'
  },
  {
    id: 'dev-12',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Al analizar el comando iostat -xz 1, ¿qué métrica indica inequívocamente que el almacenamiento en disco está saturado al 100% de su capacidad?',
    options: [
      '%idle > 90%',
      '%util cercano a 100% acompañado de un aumento drástico en await (tiempo medio de espera por solicitud de I/O en milisegundos).',
      'r/s = 0',
      'wMB/s = 10'
    ],
    correctAnswerIndex: 1,
    explanation: '%util refleja el porcentaje de tiempo durante el cual el dispositivo de almacenamiento atendió solicitudes activas. Cuando se aproxima al 100% y la métrica `await` se dispara por encima de valores normales (ej. > 20-50ms en SSDs NVMe), el disco no da abasto y las peticiones entran en cola de espera.',
    proTip: 'Recuerda que en arreglos RAID o discos SSD con múltiples colas internas, %util puede llegar al 100% antes de la saturación real; revisa siempre `await` y `aqu-sz` (queue size).'
  },

  // ==================== DOCKER & CONTAINER RUNTIME (10 Preguntas) ====================
  {
    id: 'dev-13',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es la ventaja de seguridad primordial de utilizar imágenes base Distroless (de Google) en la etapa final de un Dockerfile multi-stage?',
    codeLanguage: 'dockerfile',
    codeSnippet: `FROM golang:1.23 AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build -o /server

FROM gcr.io/distroless/static-debian12
COPY --from=builder /server /server
ENTRYPOINT ["/server"]`,
    options: [
      'Incluyen compiladores de C++ preinstalados.',
      'Contienen únicamente la aplicación y sus dependencias estrictas de runtime; no tienen gestores de paquetes (apt), ni shell (/bin/sh o /bin/bash), reduciendo la superficie de ataque y el riesgo de ejecución de comandos por atacantes (RCE).',
      'Aumentan el tamaño de la imagen para mejorar la persistencia en caché.',
      'Permiten ejecutar el contenedor sin necesidad de Linux Kernel.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Sin shells, curl, wget ni herramientas de administración del sistema dentro de la imagen final, si un atacante logra inyectar código en la aplicación, no dispondrá de una consola interactiva ni de binarios nativos para descargar payloads secundarios o escalar privilegios.',
    proTip: 'Para depuración en Kubernetes, usa `kubectl debug` con un ephemeral container en lugar de contaminar tu imagen de producción con herramientas de shell.'
  },
  {
    id: 'dev-14',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Por qué este Dockerfile destruye la eficiencia de la caché de capas de Docker en cada commit de código?',
    codeLanguage: 'dockerfile',
    codeSnippet: `FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install --production
CMD ["node", "server.js"]`,
    options: [
      'Porque alpine no soporta Node.js versión 20.',
      'Al copiar todo el código fuente (COPY . .) antes de npm install, cualquier cambio mínimo en un archivo de texto invalida la caché de esa capa y obliga a reinstalar todas las dependencias de npm en cada build.',
      'Porque falta exponer el puerto 80 con EXPOSE.',
      'Porque WORKDIR /app debe llamarse /root.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Docker invalida la caché de una instrucción si los archivos involucrados cambian. Al copiar package*.json primero, ejecutar npm install, y después copiar el código restante, npm install solo se ejecuta cuando las dependencias realmente cambian.',
    proTip: 'Patrón óptimo: COPY package.json package-lock.json ./ -> RUN npm ci --only=production -> COPY . .'
  },
  {
    id: 'dev-15',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Por qué un contenedor con CMD ["npm", "start"] tarda 10 segundos en detenerse (Graceful Shutdown roto) al recibir docker stop?',
    options: [
      'Porque npm start no tiene permisos de lectura sobre /etc/resolv.conf.',
      'npm se ejecuta como PID 1 y no reenvía la señal SIGTERM a los procesos hijos de Node.js; tras un timeout de 10 segundos, el daemon de Docker se ve forzado a enviar SIGKILL incondicional.',
      'Porque Docker requiere una tarjeta gráfica para enviar señales POSIX.',
      'Porque los contenedores siempre tardan 10 segundos por diseño.'
    ],
    correctAnswerIndex: 1,
    explanation: 'PID 1 en Linux tiene tratamiento especial: el kernel no le aplica manejadores de señales por defecto. Como el script de npm no propaga SIGTERM al proceso de node, la aplicación nunca inicia su rutina de cierre graceful y el motor de Docker la destruye abruptamente con SIGKILL tras 10 segundos.',
    proTip: 'Ejecuta directamente el binario de la aplicación con la forma exec: `CMD ["node", "dist/main.js"]` o usa dumb-init / tini.'
  },
  {
    id: 'dev-16',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En seguridad de contenedores, ¿qué riesgo previene la activación de User Namespaces (userns-remap)?',
    options: [
      'Impide que los usuarios puedan descargar imágenes desde Docker Hub.',
      'Mapea el usuario root (UID 0) del contenedor a un usuario sin privilegios en el host (ej. UID 100000), de modo que un contenedor que escape (container breakout) no tenga privilegios de root en el host físico.',
      'Desactiva el cifrado de contraseñas en /etc/shadow.',
      'Obliga a los contenedores a usar SSH para autenticarse.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Por defecto en Docker, UID 0 dentro del contenedor es el mismo UID 0 (root) del host subyacente. Si una vulnerabilidad del kernel permite escapar del namespace, el atacante es root en toda la máquina. Con User Namespaces, el atacante es un usuario sin privilegios en el host.',
    proTip: 'Configura `"userns-remap": "default"` en /etc/docker/daemon.json para aislar UIDs globalmente.'
  },
  {
    id: 'dev-17',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia fundamental entre el modo de red Bridge y el modo de red Host en Docker?',
    options: [
      'Bridge requiere Bluetooth; Host usa Wi-Fi.',
      'En modo Bridge el contenedor tiene su propio Network Namespace aislado y traduce puertos con iptables NAT; en modo Host comparte la pila de red del host sin aislamiento ni overhead de NAT.',
      'En modo Host el contenedor no puede comunicarse con internet.',
      'En modo Bridge solo se admiten conexiones SSH.'
    ],
    correctAnswerIndex: 1,
    explanation: 'En modo host (`--net=host`), el contenedor no crea un nuevo net namespace; se vincula directamente a las interfaces de red físicas de la máquina. Ofrece el máximo throughput de red eliminando el puente virtual docker0 y reglas iptables connat, a costa de no poder mapear puertos en conflicto.',
    proTip: 'Útil para proxies de ultra-baja latencia (como Envoy o HAProxy) o exportadores de métricas como Prometheus node-exporter.'
  },
  {
    id: 'dev-18',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cómo funciona el sistema de archivos Overlay2 en Docker al modificar un archivo existente en una capa inferior?',
    options: [
      'Modifica el archivo original en la capa de solo lectura.',
      'Aplica Copy-On-Write (CoW): copia el archivo completo desde la capa inferior (lowerdir) hacia la capa de lectura y escritura del contenedor (upperdir) antes de aplicar la modificación.',
      'Crea una partición SWAP dedicada por cada archivo.',
      'Elimina las capas intermedias para ahorrar espacio.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Las capas de la imagen base son inmutables (lowerdir). Cuando un proceso modifica un archivo existente (ej. un archivo de log de 2GB), overlay2 debe copiar el archivo completo a la capa mutable (upperdir) mediante Copy-on-Write, lo que puede causar pausas notables de I/O si no se usan volúmenes dedicados.',
    proTip: 'Bases de datos como PostgreSQL o MongoDB NUNCA deben escribir en el filesystem del contenedor; deben montar siempre Docker Volumes para eludir el driver overlay2.'
  },
  {
    id: 'dev-19',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es la combinación estándar de flags para ejecutar un contenedor Docker en producción siguiendo el principio de mínimo privilegio (Hardening)?',
    options: [
      '--privileged --net=host -u root',
      '--read-only --cap-drop=ALL --cap-add=NET_BIND_SERVICE --security-opt=no-new-privileges:true --user 10001:10001',
      '--restart=always --ipc=host',
      '-d -p 80:80 --gpus all'
    ],
    correctAnswerIndex: 1,
    explanation: 'Esta configuración descarta todas las capacidades de kernel de Linux (cap-drop=ALL), otorga solo la estrictamente necesaria para abrir puertos privilegiados, monta el sistema de archivos raíz como solo lectura, bloquea la escalada de privilegios mediante SUID (no-new-privileges) y ejecuta como usuario no root.',
    proTip: 'Si la aplicación necesita escribir archivos temporales con un root filesystem de solo lectura, monta un volumen tmpfs en `/tmp`.'
  },
  {
    id: 'dev-20',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En una directiva HEALTHCHECK de Docker, ¿para qué sirve el parámetro start-period?',
    codeLanguage: 'dockerfile',
    codeSnippet: `HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \\
  CMD curl -f http://localhost:8080/health || exit 1`,
    options: [
      'Para retrasar la ejecución del ENTRYPOINT 40 segundos.',
      'Proporciona una ventana de gracia durante el arranque inicial en la cual los fallos del healthcheck no se contabilizan contra el número máximo de reintentos.',
      'Obliga al contenedor a cerrarse después de 40 segundos.',
      'Indica el tiempo que tardará en compilarse la imagen.'
    ],
    correctAnswerIndex: 1,
    explanation: 'start-period permite a servicios con arranques pesados (como JVM, modelos de ML o inicializaciones de caché) fallar pruebas de salud durante su inicio sin ser marcados prematuramente como unhealthy y reiniciados en bucle.',
    proTip: 'En Kubernetes, este concepto equivale al `startupProbe`, que desactiva las pruebas de liveness hasta que la aplicación arranca con éxito.'
  },
  {
    id: 'dev-21',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Para construir y publicar imágenes multi-arquitectura (linux/amd64 y linux/arm64 para AWS Graviton / Apple Silicon), ¿qué comando de Docker Buildx se utiliza?',
    options: [
      'docker build -t mi-app .',
      'docker buildx build --platform linux/amd64,linux/arm64 -t mi-repo/app:v1 --push .',
      'docker commit --all-platforms mi-app',
      'docker run --arch=multi mi-app'
    ],
    correctAnswerIndex: 1,
    explanation: 'Docker Buildx aprovecha BuildKit y emulación con QEMU o nodos constructores remotos para compilar un manifest list (OCI image index) que agrupa los binarios de ambas arquitecturas bajo una sola etiqueta unificada.',
    proTip: 'El flag `--push` es necesario porque los daemon de Docker locales no pueden almacenar directamente imágenes multi-arquitectura completas en su almacenamiento estándar.'
  },
  {
    id: 'dev-22',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia entre la forma exec (JSON array) y la forma shell de las directivas ENTRYPOINT y CMD en un Dockerfile?',
    codeLanguage: 'dockerfile',
    codeSnippet: `// Forma Exec:  ENTRYPOINT ["/app/bin", "arg1"]
// Forma Shell: ENTRYPOINT /app/bin arg1`,
    options: [
      'No hay diferencias prácticas.',
      'La forma exec ejecuta el binario directamente como PID 1; la forma shell antepone /bin/sh -c, lo que impide que las señales de parada (SIGTERM) lleguen directamente al binario de la aplicación.',
      'La forma exec solo funciona en entornos Windows.',
      'La forma shell es más segura porque valida sintaxis en tiempo de compilación.'
    ],
    correctAnswerIndex: 1,
    explanation: 'La forma shell envuelve la ejecución en una shell hija (`/bin/sh -c`). Como la shell se convierte en PID 1 y frecuentemente no propaga señales a sus subprocesos, la aplicación no recibe SIGTERM y termina muriendo violentamente por SIGKILL tras el timeout.',
    proTip: 'Usa siempre la sintaxis de array JSON: `ENTRYPOINT ["executable", "param1", "param2"]`.'
  },

  // ==================== KUBERNETES ARCHITECTURE & OPERATIONS (14 Preguntas) ====================
  {
    id: 'dev-23',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En el plano de control (Control Plane) de Kubernetes, ¿por qué los clusters de etcd exigen siempre un número impar de nodos (3, 5, 7)?',
    options: [
      'Porque etcd no puede abrir sockets en direcciones IP pares.',
      'Para satisfacer el algoritmo de consenso distribuido Raft: un cluster de N nodos requiere un quórum de (N/2)+1 votos; un cluster de 4 nodos tiene la misma tolerancia a fallos que uno de 3 pero con mayor sobrecarga.',
      'Porque Kubernetes reserva los números pares para los nodos Worker.',
      'Para balancear la memoria swap de forma simétrica.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Tanto un cluster de 3 nodos como uno de 4 necesitan 3 nodos activos para formar quórum (toleran la pérdida de 1 solo nodo). Añadir un cuarto nodo solo incrementa el tráfico de replicación de red sin mejorar la tolerancia a fallos.',
    proTip: 'Nunca despliegues clusters de etcd con números pares de réplicas en producción.'
  },
  {
    id: 'dev-24',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia operativa fundamental entre una Liveness Probe y una Readiness Probe en Kubernetes?',
    options: [
      'Liveness prueba la memoria RAM; Readiness prueba el disco duro.',
      'Si falla la Liveness Probe, kubelet reinicia el contenedor (restart); si falla la Readiness Probe, el Pod se retira temporalmente de los endpoints del Service para no recibir tráfico.',
      'Readiness Probe solo se ejecuta una vez al arrancar; Liveness se ejecuta indefinidamente.',
      'Liveness Probe solo funciona con protocolos gRPC.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Liveness detecta situaciones irreversibles (deadlocks) donde reiniciar el proceso es la única solución. Readiness detecta situaciones temporales (calentamiento de caché, saturación momentánea) y simplemente deja de enviar tráfico sin reiniciar el pod agresivamente.',
    proTip: 'Nunca hagas que tu livenessProbe compruebe dependencias externas (como bases de datos); si la BD cae, ¡todos tus pods se reiniciarán en cascada en bucle!'
  },
  {
    id: 'dev-25',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Por qué muchos equipos senior de Kubernetes evitan configurar CPU Limits (resources.limits.cpu) y solo configuran CPU Requests?',
    options: [
      'Porque los límites de CPU están deshabilitados en el kernel Linux por defecto.',
      'Porque el planificador CFS del kernel aplica estrangulamiento (CPU Throttling) mediante cuotas de periodo (cpu.cfs_quota_us), degradando la latencia incluso cuando el nodo tiene CPU ociosa disponible.',
      'Porque configurar CPU limits cancela la recolección de basura.',
      'Porque kubelet rechaza la creación de pods con límites de CPU.'
    ],
    correctAnswerIndex: 1,
    explanation: 'La CPU es un recurso compresible. Al superar el límite dentro de una ventana de 100ms, el kernel suspende los hilos del proceso (throttling) provocando picos de latencia en la aplicación. Sin CPU limit, el pod puede consumir ciclos ociosos de la CPU del nodo sin riesgo de ser terminado.',
    proTip: 'Para memoria (recurso no compresible), configura siempre requests y limits iguales para evitar OOM Kills imprevistos.'
  },
  {
    id: 'dev-26',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿En qué orden expulsa kubelet a los pods de un nodo cuando se presenta presión crítica de memoria (MemoryPressure)?',
    options: [
      'Primero Guaranteed, luego Burstable, y finalmente BestEffort.',
      'Primero BestEffort (sin requests ni limits), luego Burstable (cuyo consumo supere sus requests), y en último lugar Guaranteed (requests == limits).',
      'Expulsa primero al Pod con mayor tiempo en ejecución.',
      'Expulsa a los pods alfabéticamente según su nombre.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Kubernetes clasifica los pods en 3 Clases de Calidad de Servicio (QoS). BestEffort tiene la prioridad más baja ante desalojos; Guaranteed tiene la máxima protección y solo será desalojado si no quedan pods de otras categorías.',
    proTip: 'Asegura que tus bases de datos y servicios críticos en K8s tengan QoS Guaranteed para máxima supervivencia.'
  },
  {
    id: 'dev-27',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué tipo de Service de Kubernetes se utiliza para bases de datos distribuidas con StatefulSet cuando se requiere descubrir individualmente la IP de cada Pod?',
    options: [
      'NodePort',
      'Headless Service (especificando clusterIP: None en el manifiesto).',
      'LoadBalancer de AWS/GCP.',
      'ExternalName'
    ],
    correctAnswerIndex: 1,
    explanation: 'Un Headless Service no asigna una IP virtual de cluster ni balancea tráfico con kube-proxy. En su lugar, el DNS interno de CoreDNS devuelve registros A/AAAA con las direcciones IP directas de cada Pod individualmente (ej. pod-0.service.namespace.svc.cluster.local).',
    proTip: 'Imprescindible para clusters de Kafka, Cassandra, Elasticsearch o PostgreSQL StatefulSets.'
  },
  {
    id: 'dev-28',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En la evolución de redes de Kubernetes, ¿qué ventaja ofrece la nueva Gateway API frente al Ingress tradicional?',
    options: [
      'Permite conectar pods a redes VPN satelitales.',
      'Diseño basado en roles (GatewayClass para infra, Gateway para cluster ops, HTTPRoute para desarrolladores), portabilidad cross-vendor nativa y soporte de canary splits/headers sin anotaciones propietarias.',
      'Sustituye completamente al CNI de la red de pods.',
      'Elimina la necesidad de certificados SSL/TLS.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Ingress quedó limitado y dependía de decenas de anotaciones no estandarizadas (`nginx.ingress.kubernetes.io/...`). Gateway API es extensible, orientada a roles y soporta enrutamiento avanzado por headers, query params y tráfico canario de forma declarativa y portable.',
    proTip: 'Gateway API ya es estándar de disponibilidad general (GA) y la dirección recomendada por el CNCF.'
  },
  {
    id: 'dev-29',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es la ventaja de KEDA (Kubernetes Event-driven Autoscaling) sobre el Horizontal Pod Autoscaler (HPA) estándar de K8s?',
    options: [
      'KEDA solo escala nodos físicos en VMware.',
      'Permite escalar pods basándose directamente en eventos externos y métricas de cola (Kafka consumer lag, Amazon SQS, RabbitMQ, Redis) e incluso escalar de 0 a 1 y viceversa.',
      'KEDA no requiere instalar Custom Resource Definitions (CRDs).',
      'HPA estándar escala más rápido que KEDA.'
    ],
    correctAnswerIndex: 1,
    explanation: 'HPA tradicional solo escala nativamente por CPU y memoria, y tiene un mínimo estricto de 1 réplica. KEDA monitorea eventos externos con más de 60 escaladores y permite escalar a 0 cuando la cola está vacía, reduciendo costos drásticamente.',
    proTip: 'Ideal para arquitecturas de procesamiento asíncrono y workers de colas en la nube.'
  },
  {
    id: 'dev-30',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Por defecto en Kubernetes, ¿cuál es la política de comunicación de red entre Pods en diferentes namespaces?',
    options: [
      'Está completamente bloqueada por defecto.',
      'Es abierta y permisiva: cualquier Pod puede comunicarse con cualquier otro Pod en cualquier namespace a menos que se aplique una NetworkPolicy explícita.',
      'Solo se permite comunicación mediante HTTP puerto 80.',
      'Requiere un certificado TLS mutuo obligatorio.'
    ],
    correctAnswerIndex: 1,
    explanation: 'El modelo de red plano de Kubernetes establece conectividad de todos contra todos por defecto. Para asegurar un entorno Zero Trust, se debe crear una NetworkPolicy con default-deny ingress y egress.',
    proTip: 'Recuerda que las NetworkPolicies solo funcionan si tu cluster utiliza un CNI que las soporte (como Calico o Cilium); el CNI básico de AWS VPC históricamente requería plugins adicionales.'
  },
  {
    id: 'dev-31',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Por qué los CNI modernos basados en eBPF (como Cilium) superan drásticamente a kube-proxy con iptables en clusters masivos?',
    options: [
      'Porque Cilium reemplaza el kernel de Linux por FreeBSD.',
      'iptables es una lista lineal O(N) que se bloquea durante actualizaciones de reglas con miles de Services; eBPF utiliza Hash Maps en el kernel con resolución O(1) y bypass de la pila TCP de sockets.',
      'eBPF desactiva la encriptación de paquetes en la red.',
      'iptables solo puede manejar un máximo de 100 pods por cluster.'
    ],
    correctAnswerIndex: 1,
    explanation: 'En clusters con miles de endpoints, regenerar reglas iptables consume gigabytes de memoria y altos porcentajes de CPU. eBPF inyecta bytecode directamente en los puntos de anclaje de red del kernel, logrando enrutamiento ultrarrápido y observabilidad profunda con Hubble.',
    proTip: 'Ejecutar Cilium en modo kube-proxy replacement elimina kube-proxy por completo del cluster.'
  },
  {
    id: 'dev-32',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué garantía ofrece un StatefulSet frente a un Deployment para cargas de trabajo con estado persistente?',
    options: [
      'Los pods se despliegan en orden inverso alfabético.',
      'Identidad de red ordinal y estable (ej. web-0, web-1), volúmenes PVC dedicados e independientes generados con volumeClaimTemplates, y terminación ordenada y secuencial.',
      'Los StatefulSets no pueden reiniciarse en caso de fallo del nodo.',
      'Todos los pods comparten obligatoriamente el mismo disco físico.'
    ],
    correctAnswerIndex: 1,
    explanation: 'En un Deployment, los pods tienen nombres aleatorios y comparten el mismo PVC si es ReadWriteMany. Un StatefulSet crea PVCs separados para cada réplica y garantiza que si web-0 se reinicia, se volverá a asociar al mismo volumen exacto con el mismo nombre DNS.',
    proTip: 'Durante el escalado de un StatefulSet, el pod N+1 no se inicializa hasta que el pod N esté en estado Ready.'
  },
  {
    id: 'dev-33',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: 'En una estrategia RollingUpdate de Kubernetes, ¿cómo se garantiza que NUNCA caiga la capacidad disponible durante un despliegue?',
    codeLanguage: 'yaml',
    codeSnippet: `strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 0
    maxSurge: 25%`,
    options: [
      'Configurando maxSurge en 0.',
      'Estableciendo maxUnavailable en 0 (ningún pod existente se destruye antes de que un pod nuevo esté listo y Ready) y maxSurge mayor que 0 (crea pods adicionales temporalmente).',
      'Desactivando el readiness probe en el pod.',
      'Aumentando el número de réplicas a un millón.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Con maxUnavailable: 0, Kubernetes tiene prohibido dar de baja ningún pod antiguo hasta que los nuevos pods pasen exitosamente sus pruebas de readiness, garantizando el 100% de la capacidad de servicio en todo momento.',
    proTip: 'Verifica que tu cluster tenga suficientes recursos de CPU/RAM para alojar los pods temporales creados por maxSurge.'
  },
  {
    id: 'dev-34',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En seguridad RBAC de Kubernetes, ¿por qué es una buena práctica configurar automountServiceAccountToken: false en pods de producción?',
    options: [
      'Para que el Pod no pueda conectarse a internet.',
      'Para evitar que un atacante que comprometa el contenedor robe el token JWT montado en /var/run/secrets/kubernetes.io/serviceaccount y consulte el API Server de Kubernetes.',
      'Para acelerar el tiempo de booteo del sistema operativo.',
      'Porque ServiceAccounts solo existen en entornos locales minikube.'
    ],
    correctAnswerIndex: 1,
    explanation: 'La inmensa mayoría de pods (frontends, APIs) no necesitan comunicarse con el API Server de Kubernetes. Dejar montado el token por defecto expone el cluster si la aplicación tiene una vulnerabilidad RCE.',
    proTip: 'Desactívalo en el spec del Pod o del ServiceAccount a menos que sea un operador o controlador de K8s.'
  },
  {
    id: 'dev-35',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es la función del External Secrets Operator (ESO) en la gestión de credenciales en Kubernetes?',
    options: [
      'Encriptar archivos locales con contraseñas en texto plano.',
      'Sincronizar automáticamente secretos desde gestores empresariales (AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager) hacia Kubernetes Secrets nativos de forma segura.',
      'Eliminar la necesidad de usar RBAC en el cluster.',
      'Reemplazar la base de datos etcd por Redis.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Permite mantener GitOps libre de secretos (sin commitear tokens a Git) definiendo un recurso ExternalSecret que consulta el gestor de secretos de la nube y crea el Kubernetes Secret en memoria de forma desatendida.',
    proTip: 'Se integra de manera nativa con ArgoCD y rotación automática de claves cada N horas.'
  },
  {
    id: 'dev-36',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Para qué sirve configurar un PodDisruptionBudget (PDB) en un servicio crítico?',
    codeLanguage: 'yaml',
    codeSnippet: `apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: api`,
    options: [
      'Para limitar el costo financiero en la factura de la nube.',
      'Impide que operaciones voluntarias de mantenimiento del cluster (como kubectl drain de un nodo para actualizar el kernel) desalojen más pods de los permitidos, asegurando la alta disponibilidad del servicio.',
      'Para evitar que los desarrolladores usen kubectl delete pod.',
      'Para limitar el ancho de banda de red por pod.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Los PDBs protegen contra interrupciones voluntarias (eviction API, drain, cluster autoscaler scale-down). Si un administrador drena un nodo, el API Server rechazará la operación si violaría la restricción minAvailable.',
    proTip: 'Ten cuidado de no configurar minAvailable: 100% en servicios con pocas réplicas, ya que bloqueará indefinidamente el drenado de nodos.'
  },

  // ==================== CI/CD & INFRASTRUCTURE AS CODE (7 Preguntas) ====================
  {
    id: 'dev-37',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Por qué la autenticación mediante OpenID Connect (OIDC) en GitHub Actions es drásticamente superior a almacenar AWS_ACCESS_KEY_ID en los secrets del repositorio?',
    options: [
      'Porque OIDC no requiere conexión a internet.',
      'Elimina credenciales estáticas de larga duración; intercambia un token criptográfico efímero de corta duración generado por GitHub por un rol temporal IAM en la nube con permisos mínimos.',
      'Porque AWS no permite usar Access Keys en 2026.',
      'OIDC solo funciona para cuentas personales sin costo.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Las credenciales estáticas (Access Keys) se filtran, no rotan y presentan riesgos catastróficos si se comprometen. Con OIDC no hay secretos guardados en el repositorio: AWS valida el token de GitHub Actions y otorga credenciales temporales (STS AssumeRoleWithWebIdentity) válidas por una hora.',
    proTip: 'Configura la condición en la Trust Policy de IAM para aceptar únicamente la rama main y el repositorio específico (`repo:org/repo:ref:refs/heads/main`).'
  },
  {
    id: 'dev-38',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En pipelines de CI/CD masivos, ¿cómo se diseña una clave de caché determinista con actions/cache para optimizar tiempos de build?',
    codeLanguage: 'yaml',
    codeSnippet: `key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
restore-keys: |
  \${{ runner.os }}-node-`,
    options: [
      'Usando la fecha y hora actual en milisegundos como clave.',
      'Usando el hash criptográfico del lockfile de dependencias exactas y claves restore-keys secundarias como fallback para recuperar la versión más cercana ante pequeñas variaciones.',
      'Desactivando el caching para evitar colisiones de memoria.',
      'Guardando toda la carpeta /usr/bin del runner en caché.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Si el package-lock.json no cambió, el hash es idéntico y la descarga de dependencias toma 2 segundos. Si cambió, las restore-keys cargan la caché previa para que npm solo descargue la diferencia incremental.',
    proTip: 'Limpia cachés huérfanas periódicamente con la API de GitHub Actions para no sobrepasar el límite de 10GB por repositorio.'
  },
  {
    id: 'dev-39',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En la filosofía GitOps implementada con herramientas como ArgoCD o Flux, ¿cuál es el principio del "Loop de Reconciliación" (Reconciliation Loop)?',
    options: [
      'Un bucle que reinicia los servidores si nadie hace commit en 24 horas.',
      'Un agente que compara continuamente el estado deseado declarado en el repositorio Git con el estado real vivo en el cluster, detectando desviaciones (drift) y auto-sincronizando.',
      'Un script bash que hace git push forzado cada 5 minutos.',
      'Un mecanismo para reconciliar conflictos de fusión en ramas de Git.'
    ],
    correctAnswerIndex: 1,
    explanation: 'GitOps invierte el modelo tradicional: en vez de que un pipeline de CI haga push con credenciales admin hacia el cluster, un operador dentro del cluster tira de Git (pull) y corrige activamente cualquier modificación manual no autorizada (Drift Detection & Self-Healing).',
    proTip: 'Esto elimina la necesidad de otorgar accesos de red o credenciales de despliegue al cluster desde servidores de CI externos.'
  },
  {
    id: 'dev-40',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En Terraform / OpenTofu, ¿por qué es crítico configurar State Locking (por ejemplo, con AWS DynamoDB y bucket S3)?',
    options: [
      'Para encriptar las contraseñas de las bases de datos con RSA 4096.',
      'Para evitar que dos ejecuciones concurrentes de terraform apply modifiquen la infraestructura simultáneamente y corrompan el archivo de estado compartido (terraform.tfstate).',
      'Para duplicar la velocidad de creación de servidores EC2.',
      'Para permitir el uso de variables sin declarar tipos.'
    ],
    correctAnswerIndex: 1,
    explanation: 'El archivo de estado es la fuente de verdad de la infraestructura. Si dos ingenieros o pipelines de CI ejecutan apply al mismo tiempo sin bloqueo, se sobrescriben estados, se pierden recursos rastreados y se producen bloqueos inconsistentes.',
    proTip: 'S3 además debe tener habilitado Versioning para poder recuperar estados previos ante corrupciones accidentales.'
  },
  {
    id: 'dev-41',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En un bloque de recurso de Terraform, ¿para qué se utiliza la directiva lifecycle { create_before_destroy = true }?',
    codeLanguage: 'hcl',
    codeSnippet: `resource "aws_security_group" "api" {
  name = "api-sg"
  lifecycle {
    create_before_destroy = true
  }
}`,
    options: [
      'Para impedir que el recurso sea destruido jamás por terraform destroy.',
      'Invierte el orden por defecto de Terraform: crea y aprovisiona el nuevo recurso antes de destruir el recurso obsoleto existente, evitando caídas de servicio (downtime).',
      'Crea una copia de seguridad del recurso en formato JSON.',
      'Obliga a Terraform a compilar el código en Go.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Por defecto, cuando un cambio requiere reemplazar un recurso, Terraform destruye el anterior y luego crea el nuevo, generando una ventana de indisponibilidad. create_before_destroy invierte el proceso para garantizar cero tiempo de inactividad.',
    proTip: 'Esencial para Security Groups, Launch Templates y certificados SSL/TLS.'
  },
  {
    id: 'dev-42',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es la principal ventaja arquitectónica de un despliegue tipo Canary sobre un despliegue Blue-Green tradicional?',
    options: [
      'Canary no requiere balanceadores de carga.',
      'Permite exponer la nueva versión a un porcentaje diminuto de tráfico real (ej. 1% a 5%) mientras se analizan métricas de errores y latencia antes de promover al 100%, limitando el radio de impacto (Blast Radius).',
      'Blue-Green consume la mitad de la infraestructura que Canary.',
      'Canary solo funciona con bases de datos relacionales.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Blue-Green cambia el 100% del tráfico de una sola vez de un entorno a otro. Si existe un bug que solo surge bajo datos reales, afecta a todos los usuarios inmediatamente. Canary expone solo a una fracción mínima y revierte de forma automatizada si la tasa de errores HTTP 5xx sube un 0.1%.',
    proTip: 'Herramientas como Argo Rollouts y Flagger automatizan el análisis canary basándose en consultas PromQL.'
  },
  {
    id: 'dev-43',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En un pipeline de CI/CD para producción, ¿en qué fase debe ejecutarse la migración de base de datos para garantizar compatibilidad con el código actual y nuevo?',
    options: [
      'Después de destruir todos los servidores antiguos.',
      'Antes del despliegue del nuevo código, asegurando que los cambios de base de datos sean retrocompatibles (Backward-Compatible) con la versión de código actualmente en vivo.',
      'Al mismo tiempo que se reinicia el balanceador de carga.',
      'Manualmente por un administrador de sistemas mediante SSH.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Si la migración no es retrocompatible y corre antes, romperá los pods en producción actuales. Si corre después, los pods nuevos fallarán al arrancar por esquemas faltantes. La única solución en CI/CD es que toda migración sea aditiva y retrocompatible antes de desplegar código.',
    proTip: 'Aplica el principio: Primero migración retrocompatible en CI -> Despliegue de código nuevo -> Limpieza de columnas deprecadas en un release futuro.'
  },

  // ==================== OBSERVABILITY, RELIABILITY & RESILIENCE (7 Preguntas) ====================
  {
    id: 'dev-44',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En el estándar OpenTelemetry (OTel), ¿cuál es el rol del OpenTelemetry Collector en una arquitectura de observabilidad?',
    options: [
      'Almacenar permanentemente petabytes de datos en disco duro local.',
      'Actuar como un proxy neutral de alto rendimiento que recibe, procesa (filtrado, enmascaramiento de PII, muestreo) y exporta métricas, trazas y logs hacia múltiples backends (Prometheus, Datadog, Jaeger).',
      'Reemplazar a los agentes del sistema operativo como systemd.',
      'Compilar aplicaciones en microservicios automáticamente.'
    ],
    correctAnswerIndex: 1,
    explanation: 'El OTel Collector desacopla el código de la aplicación de las plataformas comerciales de observabilidad. Las aplicaciones emiten datos usando el protocolo estándar OTLP al Collector local, y este se encarga de retransmitir y transformar los datos hacia cualquier proveedor sin modificar el código fuente.',
    proTip: 'Despliega el Collector como DaemonSet para procesar telemetría localmente en cada nodo del cluster antes de enviarla a la red.'
  },
  {
    id: 'dev-45',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En monitoreo de sistemas, ¿para qué tipo de servicios se aplica el Método RED (Rate, Errors, Duration) y para cuáles el Método USE (Utilization, Saturation, Errors)?',
    options: [
      'RED es para bases de datos; USE es para interfaces gráficas.',
      'RED se aplica a servicios orientados a peticiones (APIs, microservicios HTTP/gRPC); USE se aplica a recursos de infraestructura y hardware (CPU, Memoria, Discos, Interfaces de red).',
      'USE es un estándar deprecado reemplazado por SNMP.',
      'Son idénticos y se aplican indistintamente.'
    ],
    correctAnswerIndex: 1,
    explanation: 'El Método RED (de Tom Wilkie) evalúa la experiencia del usuario en servicios de petición (tasa de peticiones por segundo, tasa de errores y latencia/duración). El Método USE (de Brendan Gregg) audita la salud de los recursos físicos (cuán ocupado está, cuánto trabajo encolado hay y cuántos errores de hardware ocurren).',
    proTip: 'Un dashboard de servicio debe comenzar con las métricas RED arriba y las métricas USE abajo para diagnóstico causa-raíz.'
  },
  {
    id: 'dev-46',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Si un servicio tiene un SLO de disponibilidad del 99.9% en una ventana de 30 días, ¿cuál es el tiempo máximo de inactividad permitido (Error Budget) antes de congelar nuevos despliegues de features?',
    options: [
      'Aproximadamente 43 minutos al mes.',
      'Aproximadamente 8 horas al mes.',
      '7 segundos al año.',
      'No se permite ninguna caída.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Un 99.9% ("tres nueves") significa que el sistema puede tener un 0.1% de fallos. 30 días = 43,200 minutos. 43,200 * 0.001 = 43.2 minutos de Error Budget al mes. Si se consume el presupuesto, las políticas de SRE dictan pausar nuevos releases y dedicar la capacidad de ingeniería a estabilidad.',
    proTip: 'Recuerda los números canónicos: 99% = 7.2 horas/mes; 99.9% = 43.2 minutos/mes; 99.99% = 4.32 minutos/mes.'
  },
  {
    id: 'dev-47',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En trazado distribuido (Distributed Tracing), ¿cuál es el formato del estándar W3C Trace Context en la cabecera HTTP traceparent?',
    codeLanguage: 'text',
    codeSnippet: `traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`,
    options: [
      'nombre-del-servicio + timestamp unix + ip del cliente.',
      'versión (00) - Trace ID global de 16 bytes (32 hex) - Parent Span ID de 8 bytes (16 hex) - Trace Flags de 1 byte (01 = sampled).',
      'Un token JWT codificado en base64 con la firma del microservicio.',
      'El User-Agent encriptado con hash MD5.'
    ],
    correctAnswerIndex: 1,
    explanation: 'El estándar W3C TraceContext estandarizó la propagación de contexto entre diferentes proveedores y tecnologías de observabilidad, permitiendo que una llamada correlacione todas las trazas a través de decenas de microservicios sin silos.',
    proTip: 'Propaga siempre esta cabecera en tus clientes HTTP salientes para no romper la cadena de trazas distribuidas.'
  },
  {
    id: 'dev-48',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Por qué el algoritmo Sliding Window Log implementado con Redis Sorted Sets (ZADD y ZREMRANGEBYSCORE) es más preciso que Fixed Window para Rate Limiting distribuido?',
    options: [
      'Porque no requiere conexión TCP.',
      'Elimina el problema del "doble tráfico en el borde de la ventana" (Traffic Burst en los límites de tiempo) midiendo la tasa en una ventana móvil continua milisegundo a milisegundo.',
      'Porque comprime los números enteros con gzip.',
      'Porque solo permite tráfico en horas laborales.'
    ],
    correctAnswerIndex: 1,
    explanation: 'En Fixed Window (ej. 100 req/min), un usuario puede enviar 100 peticiones en el segundo 59 y otras 100 en el segundo 01 del siguiente minuto, acumulando 200 peticiones en 2 segundos. Sliding Window Log evalúa la ventana móvil estricta de los últimos 60 segundos con exactitud milimétrica.',
    proTip: 'Para volúmenes ultra-masivos donde los Sorted Sets consumen demasiada RAM, usa Sliding Window Counter (aproximación matemática ligera).'
  },
  {
    id: 'dev-49',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En el patrón de diseño Circuit Breaker (ej. Resilience4j, Envoy), ¿cuál es el comportamiento del estado Half-Open (Semi-Abierto)?',
    options: [
      'Rechaza todas las peticiones con código HTTP 503.',
      'Permite pasar un número limitado de peticiones de prueba hacia el servicio downstream degradado para verificar si se ha recuperado antes de volver a cerrar el circuito (Closed) o reabrirlo (Open).',
      'Duplica el número de hilos de ejecución en el cliente.',
      'Envía un correo electrónico al soporte técnico.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Tras permanecer un tiempo en estado Open (fallando rápido para proteger el servicio saturado), el interruptor transiciona a Half-Open. Si las peticiones de sondeo tienen éxito, el circuito se restablece a Closed; si continúan fallando, regresa a Open.',
    proTip: 'Combina Circuit Breakers con Fallbacks amigables (ej. servir datos desde una caché local o mensaje degradado).'
  },
  {
    id: 'dev-50',
    categoryId: 'devops_cloud',
    categoryName: 'DevOps & Cloud (Linux, Docker, K8s)',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En las prácticas de Chaos Engineering, ¿cuál es el objetivo primordial de inyectar fallos controlados (Chaos Mesh, Gremlin, LitmusChaos) en sistemas distribuidos?',
    options: [
      'Probar la velocidad de tecleo de los ingenieros de guardia.',
      'Validar empíricamente la hipótesis de resiliencia del sistema en estado estacionario (Steady State), descubriendo debilidades arquitectónicas desconocidas antes de que ocurran en incidentes reales de producción.',
      'Obligar a la infraestructura a consumir todo el presupuesto de AWS.',
      'Eliminar las pruebas unitarias del pipeline de desarrollo.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Chaos Engineering no consiste en "romper cosas al azar", sino en experimentos científicos controlados: definir el estado estacionario normal, formular una hipótesis (ej. "si la zona de disponibilidad B cae, el tráfico se redirigirá sin degradar el 99.9% de peticiones"), inyectar el fallo y verificar si la hipótesis se sostiene.',
    proTip: 'Comienza siempre ejecutando experimentos de caos en entornos de Staging con límites de radio de explosión (Blast Radius) controlados antes de pasar a producción.'
  }
];
