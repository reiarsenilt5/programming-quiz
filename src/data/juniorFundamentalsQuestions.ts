import { Question } from '../types/quiz';

export const JUNIOR_FUNDAMENTALS_QUESTIONS: Question[] = [
  {
    id: 'mf-03',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia fundamental entre Git y GitHub?',
    codeLanguage: 'text',
    codeSnippet: 'Git vs GitHub',
    options: [
      'Git es el software de control de versiones distribuido local, mientras que GitHub es una plataforma en la nube para alojar y colaborar en repositorios Git.',
      'Git es un lenguaje de programación y GitHub es el compilador.',
      'Son exactamente lo mismo con dos nombres de marcas diferentes.',
      'GitHub solo funciona en sistemas operativos Linux.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Git funciona completamente offline en tu máquina local gestionando el historial de commits. GitHub (junto con GitLab y Bitbucket) es un servicio web remoto donde subes tu repositorio para colaborar, hacer Pull Requests y CI/CD.',
    proTip: 'Pregunta obligada en entrevistas iniciales: Git es la herramienta de consola local; GitHub es el servicio de alojamiento remoto.'
  },
  {
    id: 'mf-04',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué hace el comando `git add .` en el flujo de trabajo de Git?',
    codeLanguage: 'bash',
    codeSnippet: 'git add .',
    options: [
      'Envía los cambios directamente a la rama remota en GitHub.',
      'Agrega todos los archivos nuevos y modificados del directorio actual al área de preparación (Staging Area / Index).',
      'Crea una nueva rama llamada "."',
      'Deshace todos los cambios realizados desde el último commit.'
    ],
    correctAnswerIndex: 1,
    explanation: '`git add` traslada los cambios del "Working Directory" (tu espacio de trabajo) a la "Staging Area" (área de preparación), listos para ser empaquetados en el siguiente commit con `git commit`.',
    proTip: 'Para agregar solo un archivo específico y mantener commits atómicos y limpios: `git add ruta/archivo.ts`.'
  },
  {
    id: 'mf-05',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Por qué NUNCA se deben subir archivos `.env` o la carpeta `node_modules/` a un repositorio Git?',
    codeLanguage: 'text',
    codeSnippet: '.env\nnode_modules/',
    options: [
      'Porque `.env` contiene secretos, claves de API y contraseñas que quedarían expuestas, y `node_modules` contiene miles de dependencias pesadas que se reinstalan con npm install.',
      'Porque Git solo admite archivos con menos de 10 líneas de código.',
      'Porque GitHub cobra una tarifa por cada archivo que empiece con punto.',
      'Porque rompe la compatibilidad con Windows.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Subir claves en `.env` a repositorios públicos o compartidos es una de las vulnerabilidades más comunes en ciberseguridad. Además, las dependencias de `node_modules/` se reconstruyen fácilmente en cualquier máquina leyendo el `package.json`.',
    proTip: 'Asegúrate siempre de añadir `.env` y `node_modules/` a tu archivo `.gitignore` antes del primer commit.'
  },
  {
    id: 'mf-06',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es el comando moderno de Git para crear una nueva rama y cambiarse a ella en un solo paso?',
    codeLanguage: 'bash',
    codeSnippet: '# ¿Cuál comando crea y entra en la rama "feature-login"?',
    options: [
      'git switch -c feature-login (o git checkout -b feature-login)',
      'git create branch feature-login',
      'git new feature-login',
      'git branch --jump feature-login'
    ],
    correctAnswerIndex: 0,
    explanation: '`git switch -c nombre-rama` (introducido en Git 2.23) o el comando clásico `git checkout -b nombre-rama` crean la rama y hacen el cambio a ella de forma instantánea.',
    proTip: '`git switch` se introdujo para separar la navegación de ramas de las operaciones de restauración de archivos que hacía `checkout`.'
  },
  {
    id: 'mf-07',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: 'En el protocolo HTTP: ¿Qué significa un código de estado en el rango 4xx (como 404 o 401)?',
    codeLanguage: 'text',
    codeSnippet: 'HTTP 404 Not Found | HTTP 401 Unauthorized | HTTP 400 Bad Request',
    options: [
      'Un error del lado del cliente (petición malformada, recurso no encontrado o falta de autenticación).',
      'Una respuesta exitosa que contiene datos en JSON.',
      'Un error interno grave del servidor en el backend (crash de base de datos).',
      'Una redirección permanente a otra URL.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Los códigos HTTP se dividen en rangos: 2xx = Éxito, 3xx = Redirección, 4xx = Error del Cliente (tú pediste algo mal o no tienes permisos), 5xx = Error del Servidor (el backend se cayó o falló).',
    proTip: 'Regla nemotécnica: "4xx es tu culpa (cliente), 5xx es culpa de mi servidor".'
  },
  {
    id: 'mf-08',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué método HTTP se debe usar en una API REST estándar para CREAR un nuevo recurso en el servidor?',
    codeLanguage: 'text',
    codeSnippet: 'REST API Verbs: GET, POST, PUT, DELETE, PATCH',
    options: [
      'GET',
      'POST',
      'DELETE',
      'OPTIONS'
    ],
    correctAnswerIndex: 1,
    explanation: 'En las convenciones de diseño RESTful: `POST` se utiliza para crear nuevos recursos enviando los datos en el cuerpo de la petición. `GET` solo lee sin modificar datos.',
    proTip: '`GET` debe ser siempre una operación segura e idempotente (nunca debe borrar o crear registros en la base de datos).'
  },
  {
    id: 'mf-09',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué significan los marcadores `<<<<<<<`, `=======` y `>>>>>>>` cuando ocurre un Conflicto de Fusión (Merge Conflict) en Git?',
    codeLanguage: 'text',
    codeSnippet: '<<<<<<< HEAD\nconst api = "https://v1.api.com";\n=======\nconst api = "https://v2.api.com";\n>>>>>>> feature-nueva',
    options: [
      'Son marcadores generados por Git que delimitan el código de tu rama actual (HEAD) y el de la rama que estás fusionando (feature-nueva) que tocan las mismas líneas.',
      'Son comentarios válidos de TypeScript para optimizar la compilación.',
      'Un error de disco duro que corrompió el archivo.',
      'Una directiva especial para que GitHub elija aleatoriamente una de las dos opciones.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Git no puede decidir por sí mismo cuál de los dos cambios es el correcto cuando dos personas modifican la misma línea. Muestra los marcadores para que el desarrollador edite el archivo manualmente, elija la versión correcta y borre los marcadores.',
    proTip: 'Una vez resuelto manualmente, guarda el archivo, haz `git add archivo` y completa el merge con `git commit`.'
  },
  {
    id: 'mf-10',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué hace el comando `git pull` entre bastidores?',
    codeLanguage: 'bash',
    codeSnippet: 'git pull origin main',
    options: [
      'Ejecuta un `git fetch` (descarga los commits del remoto) seguido inmediatamente de un `git merge` (los fusiona en tu rama local actual).',
      'Sube tus archivos locales a GitHub.',
      'Borra la rama remota de GitHub.',
      'Crea una Pull Request en la interfaz web de GitHub.'
    ],
    correctAnswerIndex: 0,
    explanation: '`git pull` es la combinación abreviada de descargar las novedades del servidor remoto (`git fetch`) y aplicarlas a tu rama de trabajo actual (`git merge`).',
    proTip: 'Si quieres evitar commits de merge automáticos y mantener un historial lineal, puedes usar `git pull --rebase`.'
  },
  {
    id: 'mf-11',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia entre el verbo HTTP `PUT` y `PATCH` al actualizar un recurso en una API REST?',
    codeLanguage: 'text',
    codeSnippet: 'PUT /usuarios/1 vs PATCH /usuarios/1',
    options: [
      '`PUT` reemplaza el recurso completo (debes enviar todos los campos); `PATCH` aplica una modificación parcial (solo envías los campos que cambiaron).',
      '`PATCH` solo funciona para imágenes y archivos binarios.',
      '`PUT` solo se usa en bases de datos PostgreSQL.',
      'Son totalmente idénticos en la especificación RFC.'
    ],
    correctAnswerIndex: 0,
    explanation: '`PUT` es un reemplazo completo idempotente del recurso. Si solo quieres cambiar el nombre de un usuario sin tener que enviar su email, contraseña y dirección, lo idiomático en REST es usar `PATCH`.',
    proTip: 'Pregunta clásica de entrevista backend junior: "PUT reemplaza todo, PATCH actualiza parcialmente".'
  },
  {
    id: 'mf-12',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué comando de Git permite inspeccionar el estado actual de los archivos (modificados, en staging o sin seguimiento)?',
    codeLanguage: 'bash',
    codeSnippet: 'git status',
    options: [
      'git log',
      'git status',
      'git check',
      'git diff --all'
    ],
    correctAnswerIndex: 1,
    explanation: '`git status` muestra qué rama tienes activa, qué archivos están listos para commit (verde), cuáles modificados sin añadir (rojo) y cuáles no tienen seguimiento (untracked).',
    proTip: 'Es una excelente costumbre ejecutar `git status` antes y después de cada `git add` y `git commit`.'
  },
  {
    id: 'mf-13',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es una Pull Request (PR) o Merge Request (MR)?',
    codeLanguage: 'text',
    codeSnippet: 'GitHub Pull Request (PR)',
    options: [
      'Una propuesta formal para fusionar los cambios de una rama (generalmente una feature) en otra rama principal, permitiendo revisión de código (Code Review) y pruebas automáticas.',
      'Una petición que hace el servidor al cliente para descargar archivos.',
      'Un comando de consola exclusivo para borrar ramas.',
      'Un tipo de licencia de software libre.'
    ],
    correctAnswerIndex: 0,
    explanation: 'La Pull Request es la base de la colaboración en equipos modernos de desarrollo. Permite a compañeros de equipo comentar, sugerir mejoras, verificar que los tests pasen y aprobar el código antes de que llegue a producción.',
    proTip: 'Mantén tus PRs pequeñas y enfocadas en una sola tarea (menos de 300 líneas); son mucho más fáciles de revisar y aprobar.'
  },
  {
    id: 'mf-14',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Por qué un mensaje de commit como "fix", "cambios" o "asdf" es considerado una mala práctica profesional?',
    codeLanguage: 'text',
    codeSnippet: 'git commit -m "arreglos"',
    options: [
      'Porque no explica qué cambió ni por qué, haciendo imposible rastrear bugs en el historial con git log o revertir cambios con confianza.',
      'Porque Git rechaza commits que tengan menos de 20 palabras.',
      'Porque impide hacer git push a GitHub.',
      'Porque desactiva el compilador del proyecto.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Los mensajes de commit deben ser descriptivos. La convención "Conventional Commits" recomienda formatos claros como: `feat: agregar formulario de login` o `fix: corregir cálculo de impuestos en el carrito`.',
    proTip: 'Un buen commit responde a la frase: "Si aplico este commit, este cambio va a...".'
  },
  {
    id: 'mf-15',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué comando de Git permite ver el historial cronológico de commits realizados en el repositorio?',
    codeLanguage: 'bash',
    codeSnippet: 'git log --oneline -n 5',
    options: [
      'git history',
      'git log',
      'git show --all',
      'git list'
    ],
    correctAnswerIndex: 1,
    explanation: '`git log` lista los commits con su hash SHA-1, autor, fecha y mensaje. El modificador `--oneline` muestra cada commit de forma compacta en una sola línea.',
    proTip: 'Usa `git log --graph --oneline --all` para ver un árbol visual de ramas en tu propia terminal.'
  },
  {
    id: 'mf-16',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué comando se utiliza para guardar temporalmente cambios sin commitear cuando necesitas cambiar urgentemente de rama?',
    codeLanguage: 'bash',
    codeSnippet: 'git stash\n# ... cambias de rama, trabajas ...\ngit stash pop',
    options: [
      'git stash',
      'git pause',
      'git hold',
      'git save'
    ],
    correctAnswerIndex: 0,
    explanation: '`git stash` toma tus modificaciones pendientes en el working directory y las guarda en una pila temporal limpia, dejando tu rama en el estado del último commit. Luego las recuperas con `git stash pop`.',
    proTip: 'Es perfecto cuando estás en medio de una función y te piden arreglar un bug urgente en otra rama.'
  },
  {
    id: 'mf-17',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué código de estado HTTP indica que una petición fue exitosa y además se creó un nuevo recurso en el servidor?',
    codeLanguage: 'text',
    codeSnippet: 'HTTP 201 Created',
    options: [
      '200 OK',
      '201 Created',
      '204 No Content',
      '301 Moved Permanently'
    ],
    correctAnswerIndex: 1,
    explanation: '`201 Created` es la respuesta estándar que un endpoint POST exitoso debe devolver al crear una nueva entidad (ej. un nuevo usuario o producto en la base de datos).',
    proTip: '`204 No Content` se usa cuando la operación fue exitosa pero no hay contenido que retornar en el cuerpo (muy común en DELETE).'
  },
  {
    id: 'mf-18',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué significa el término "CORS" (Cross-Origin Resource Sharing) que frecuentemente causa errores en el frontend?',
    codeLanguage: 'text',
    codeSnippet: 'Access-Control-Allow-Origin',
    options: [
      'Un mecanismo de seguridad del navegador que bloquea peticiones HTTP hechas desde un dominio/puerto hacia otro dominio distinto si el servidor no autoriza explícitamente el origen.',
      'Un protocolo para conectar cables de fibra óptica.',
      'Un error de compilación de CSS.',
      'Un plugin de Chrome para acelerar descargas.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Por seguridad, los navegadores impiden que una web en `http://localhost:3000` consulte una API en `http://api.empresa.com` a menos que el servidor envíe la cabecera `Access-Control-Allow-Origin`.',
    proTip: 'El error de CORS se soluciona en el BACKEND habilitando el origen permitido o usando un proxy en desarrollo, NO en el código del navegador.'
  },
  {
    id: 'mf-19',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué hace el comando `git clone <url>`?',
    codeLanguage: 'bash',
    codeSnippet: 'git clone https://github.com/usuario/repo.git',
    options: [
      'Descarga una copia completa de un repositorio remoto existente, incluyendo todos sus archivos, ramas y todo el historial de commits en una carpeta local.',
      'Sube tu proyecto actual a un servidor nuevo.',
      'Duplica un archivo en la misma carpeta.',
      'Instala las dependencias con npm.'
    ],
    correctAnswerIndex: 0,
    explanation: '`git clone` inicializa un repositorio local, configura el remoto `origin` apuntando a esa URL y descarga todas las ramas y commits disponibles.',
    proTip: 'Es el primer comando que ejecutarás al integrarte a un nuevo equipo de trabajo o clonar un proyecto open source.'
  },
  {
    id: 'mf-20',
    categoryId: 'modern_fundamentals',
    categoryName: 'Fundamentos & Git',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es el archivo `README.md` en la raíz de un repositorio de código?',
    codeLanguage: 'markdown',
    codeSnippet: '# Mi Proyecto\nGuía de instalación y uso...',
    options: [
      'La documentación principal del proyecto en formato Markdown que explica de qué trata el software, cómo instalarlo y cómo ponerlo en marcha.',
      'El archivo donde se compila el código binario.',
      'Un archivo oculto exclusivo de Windows.',
      'El registro de contraseñas del servidor.'
    ],
    correctAnswerIndex: 0,
    explanation: 'GitHub y otras plataformas muestran automáticamente el contenido de `README.md` como portada de presentación del repositorio. Un buen README es fundamental en tu portafolio como programador junior.',
    proTip: 'En tu portafolio: incluye capturas de pantalla, tecnologías usadas y pasos claros para correr el proyecto (`git clone`, `npm install`, `npm run dev`).'
  }
];
