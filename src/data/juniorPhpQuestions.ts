import { Question } from '../types/quiz';

export const JUNIOR_PHP_QUESTIONS: Question[] = [
  {
    id: 'php-03',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia fundamental entre el operador `==` y `===` en PHP?',
    codeLanguage: 'php',
    codeSnippet: '$a = "10";\n$b = 10;\nvar_dump($a == $b);\nvar_dump($a === $b);',
    options: [
      'Ambos devuelven true siempre.',
      '`==` compara solo el valor con coerción de tipos, mientras que `===` compara valor y tipo de dato estricto.',
      '`===` es exclusivo de PHP 8 y no existe en versiones anteriores.',
      '`==` evalúa referencias de punteros.'
    ],
    correctAnswerIndex: 1,
    explanation: '`==` realiza conversión de tipos (type juggling) antes de comparar, por lo que "10" == 10 es true. `===` compara estrictamente valor y tipo, por lo que string no es igual a integer y devuelve false.',
    proTip: 'En código profesional y moderno siempre usa "===" y "!==" para evitar comportamientos inesperados de conversión automática.'
  },
  {
    id: 'php-04',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué error común ocurre al olvidar el símbolo `$` al declarar o usar una variable en PHP?',
    codeLanguage: 'php',
    codeSnippet: 'nombre = "Juan";\necho $nombre;',
    options: [
      'PHP asume que "nombre" es una constante global o arroja un Error de Parse / Fatal Error.',
      'Crea una variable global oculta en memoria.',
      'Imprime "Juan" con una advertencia leve.',
      'Convierte automáticamente la variable a un array.'
    ],
    correctAnswerIndex: 0,
    explanation: 'En PHP todas las variables deben comenzar obligatoriamente con el signo de dólar ($). Escribir "nombre = ..." sin $ provoca un error sintáctico o intenta buscar una constante predefinida inexistente.',
    proTip: 'Recuerda: solo las constantes (define() o const NOMBRE) van sin signo de dólar.'
  },
  {
    id: 'php-05',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo se accede a un valor dentro de un array asociativo en PHP?',
    codeLanguage: 'php',
    codeSnippet: '$usuario = [\n    "email" => "dev@example.com",\n    "rol" => "junior"\n];\n// ¿Cómo obtener el email?',
    options: [
      '$usuario.email',
      '$usuario->email',
      '$usuario["email"]',
      '$usuario("email")'
    ],
    correctAnswerIndex: 2,
    explanation: 'En arrays asociativos de PHP se utilizan corchetes con la clave entre comillas: $usuario["email"]. La flecha -> se reserva para propiedades de objetos e instancias de clases.',
    proTip: 'Usa el operador null coalescing $usuario["email"] ?? "default" para evitar advertencias de "Undefined array key".'
  },
  {
    id: 'php-06',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es el operador de coalescencia nula (`??`) introducido en PHP y para qué se usa?',
    codeLanguage: 'php',
    codeSnippet: '$colorFavorito = $_GET["color"] ?? "azul";',
    options: [
      'Es un operador ternario que devuelve el valor izquierdo si existe y no es null; si no, devuelve el valor derecho.',
      'Comprueba si dos variables tienen el mismo nombre en memoria.',
      'Es un operador de división especial para números flotantes.',
      'Lanza una excepción si la variable es nula.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El operador $a ?? $b es equivalente a "isset($a) ? $a : $b". Si $_GET["color"] no existe o es null, toma "azul" de forma segura sin emitir warnings.',
    proTip: 'Es uno de los operadores más utilizados en controladores y vistas para valores por defecto.'
  },
  {
    id: 'php-07',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Por qué este formulario procesa datos de forma insegura ante ataques XSS (Cross-Site Scripting)?',
    codeLanguage: 'php',
    codeSnippet: '$comentario = $_POST["comentario"];\necho "<p>" . $comentario . "</p>";',
    options: [
      'Porque $_POST no puede imprimir strings en HTML.',
      'Porque imprime el texto directamente sin escapar caracteres especiales con htmlspecialchars(), permitiendo inyección de scripts HTML/JS.',
      'Porque falta cerrar el tag php con ?> obligatoriamente.',
      'Porque el punto de concatenación (.) está obsoleto.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Si un usuario malicioso envía "<script>alert(1)</script>", el navegador ejecutará el script. La solución es escapar con htmlspecialchars($comentario, ENT_QUOTES, "UTF-8").',
    proTip: 'En motores de plantillas modernos como Blade (Laravel) o Twig (Symfony), la sintaxis {{ $comentario }} escapa automáticamente.'
  },
  {
    id: 'php-08',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: 'En Programación Orientada a Objetos en PHP: ¿Qué visibilidad permite acceder a una propiedad desde la propia clase y desde sus clases hijas, pero NO desde fuera?',
    codeLanguage: 'php',
    codeSnippet: 'class Empleado {\n    // ¿Qué modificador usar aquí?\n    salario;\n}',
    options: [
      'public',
      'private',
      'protected',
      'static'
    ],
    correctAnswerIndex: 2,
    explanation: 'El modificador `protected` hace que la propiedad o método sea accesible dentro de la clase actual y sus clases derivadas (herencia), pero inaccesible directamente desde instancias externas.',
    proTip: '`private` restringe el acceso estrictamente a la clase donde se declaró, ni siquiera sus hijas pueden acceder.'
  },
  {
    id: 'php-09',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué función nativa de PHP se utiliza para contar la cantidad de elementos en un array?',
    codeLanguage: 'php',
    codeSnippet: '$tecnologias = ["PHP", "MySQL", "Docker", "Git"];\necho count($tecnologias);',
    options: [
      'length($tecnologias)',
      'size($tecnologias)',
      'count($tecnologias)',
      '$tecnologias.length()'
    ],
    correctAnswerIndex: 2,
    explanation: 'En PHP se utiliza la función nativa count($array) (o sizeof($array)) para obtener el número de elementos de un array.',
    proTip: 'En bucles for, guarda el count() en una variable antes del bucle para no recalcularlo en cada iteración.'
  },
  {
    id: 'php-10',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo se concatenan dos cadenas de texto en PHP?',
    codeLanguage: 'php',
    codeSnippet: '$saludo = "Hola" . " " . "Mundo";',
    options: [
      'Usando el signo más (+)',
      'Usando el punto (.)',
      'Usando el símbolo ampersand (&)',
      'Usando la flecha (->)'
    ],
    correctAnswerIndex: 1,
    explanation: 'El operador de concatenación en PHP es el punto (.). El operador (+) realiza operaciones aritméticas y forzará la conversión de los strings a números.',
    proTip: 'También puedes usar comillas dobles con interpolación: "$saludo $nombre".'
  },
  {
    id: 'php-11',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Cuál es el error en este método de clase al intentar acceder a una propiedad de la instancia?',
    codeLanguage: 'php',
    codeSnippet: 'class Usuario {\n    public string $nombre = "Ana";\n    public function saludar(): void {\n        echo "Hola " . $nombre;\n    }\n}',
    options: [
      'En PHP no se pueden tipar los métodos con void.',
      'Falta referenciar la propiedad de la instancia con $this->nombre.',
      'El método saludar debe ser obligatorio que sea private.',
      'Las cadenas no se pueden imprimir con echo dentro de una clase.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Dentro de un método de clase en PHP, las propiedades de la instancia no están en el scope local de la función; deben llamarse obligatoriamente a través de $this->propiedad.',
    proTip: 'Nota que se escribe $this->nombre, SIN el signo de dólar delante del nombre de la propiedad.'
  },
  {
    id: 'php-12',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es la función del archivo `composer.json` en un proyecto PHP moderno?',
    codeLanguage: 'json',
    codeSnippet: '{\n    "require": {\n        "php": "^8.2",\n        "guzzlehttp/guzzle": "^7.8"\n    }\n}',
    options: [
      'Configurar el servidor web Apache o Nginx.',
      'Definir las dependencias, librerías externas y el mapa de autoloading del proyecto.',
      'Compilar el código PHP a binario.',
      'Almacenar las contraseñas de la base de datos de producción.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Composer es el gestor de paquetes estándar de la comunidad PHP. `composer.json` declara las librerías necesarias y las reglas de autocarga PSR-4.',
    proTip: 'El archivo generado "composer.lock" guarda las versiones exactas instaladas y SIEMPRE debe subirse a Git.'
  },
  {
    id: 'php-13',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: 'En PHP 8.0+: ¿Qué ventaja ofrece la promoción de propiedades en el constructor (Constructor Property Promotion)?',
    codeLanguage: 'php',
    codeSnippet: 'class Producto {\n    public function __construct(\n        public string $nombre,\n        public float $precio\n    ) {}\n}',
    options: [
      'Permite declarar y asignar propiedades de clase directamente en la firma del constructor sin código repetitivo.',
      'Hace que las propiedades sean automáticamente globales en toda la aplicación.',
      'Evita que las clases necesiten namespace.',
      'Convierte el objeto automáticamente a JSON.'
    ],
    correctAnswerIndex: 0,
    explanation: 'La promoción de propiedades en constructor de PHP 8 evita declarar la propiedad arriba, recibirla como argumento y hacer $this->prop = $prop; todo se hace en una sola línea en la firma.',
    proTip: 'Es el estándar en Laravel 10+, Symfony 6+ y código moderno de PHP.'
  },
  {
    id: 'php-14',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo se maneja una excepción en PHP para evitar que la aplicación se detenga con un error fatal 500?',
    codeLanguage: 'php',
    codeSnippet: 'try {\n    $resultado = dividir(10, 0);\n} catch (Exception $e) {\n    echo "Ocurrió un error: " . $e->getMessage();\n}',
    options: [
      'Usando la estructura try ... catch.',
      'Usando el prefijo @ delante de cada función.',
      'Cambiando el nombre del archivo a .html.',
      'Definiendo una variable $ignore_errors = true.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El bloque try ... catch captura las excepciones lanzadas por el código y permite recuperarse de forma elegante, registrar el error y mostrar un mensaje amigable al usuario.',
    proTip: 'Nunca uses el operador "@" para silenciar errores; oculta bugs graves que luego son casi imposibles de depurar.'
  },
  {
    id: 'php-15',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué superglobal de PHP almacena la información de sesión persistente entre diferentes peticiones HTTP de un usuario?',
    codeLanguage: 'php',
    codeSnippet: 'session_start();\n$_SESSION["usuario_id"] = 42;',
    options: [
      '$_COOKIE',
      '$_SESSION',
      '$_ENV',
      '$_SERVER'
    ],
    correctAnswerIndex: 1,
    explanation: '$_SESSION guarda datos en el servidor asociados a una cookie de identificación de sesión en el navegador (PHPSESSID). Requiere llamar a session_start() previamente.',
    proTip: 'Nunca guardes contraseñas en texto plano o datos confidenciales de tarjetas de crédito en la sesión.'
  },
  {
    id: 'php-16',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Por qué la función `header("Location: /home");` puede fallar con el error "Headers already sent"?',
    codeLanguage: 'php',
    codeSnippet: 'echo "Cargando...";\nheader("Location: /dashboard.php");\nexit;',
    options: [
      'Porque header() no admite rutas relativas.',
      'Porque ya se envió salida HTML o espacios en blanco al navegador antes de enviar las cabeceras HTTP.',
      'Porque la palabra "Location" debe estar en minúsculas.',
      'Porque falta llamar a session_destroy().'
    ],
    correctAnswerIndex: 1,
    explanation: 'El protocolo HTTP exige que todas las cabeceras (headers) se envíen ANTES de cualquier contenido o cuerpo de respuesta. Cualquier echo, print o espacio en blanco previo bloquea el envío de nuevos headers.',
    proTip: 'Siempre incluye un "exit;" o "die();" inmediatamente después de header("Location: ...") para detener la ejecución.'
  },
  {
    id: 'php-17',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué estructura condicional introducida en PHP 8 es más estricta, devuelve un valor y no necesita `break`?',
    codeLanguage: 'php',
    codeSnippet: '$mensaje = match ($rol) {\n    "admin" => "Acceso Total",\n    "editor" => "Acceso Contenido",\n    default => "Acceso Básico",\n};',
    options: [
      'La expresión match',
      'El operador switch moderno',
      'El if ternario múltiple',
      'El operador spaceship'
    ],
    correctAnswerIndex: 0,
    explanation: 'La expresión `match` de PHP 8 realiza comparaciones estrictas (===), devuelve directamente el valor de la rama coincidente y no sufre de caídas por falta de break como `switch`.',
    proTip: 'Prefiere `match` sobre `switch` siempre que busques asignar un valor según una condición directa.'
  },
  {
    id: 'php-18',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué método mágico de PHP se ejecuta automáticamente cuando se intenta convertir un objeto a cadena de texto?',
    codeLanguage: 'php',
    codeSnippet: 'class Libro {\n    public string $titulo = "Clean Code";\n    public function __toString(): string {\n        return "Libro: " . $this->titulo;\n    }\n}\n$l = new Libro();\necho $l;',
    options: [
      '__construct()',
      '__toString()',
      '__invoke()',
      '__destruct()'
    ],
    correctAnswerIndex: 1,
    explanation: 'El método mágico __toString() define cómo debe comportarse y qué cadena debe retornar un objeto cuando es impreso mediante echo o concatenado con strings.',
    proTip: 'Debe devolver obligatoriamente un string para evitar un TypeError.'
  },
  {
    id: 'php-19',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué función convierte un array asociativo de PHP en un string con formato JSON estándar?',
    codeLanguage: 'php',
    codeSnippet: '$datos = ["status" => "ok", "codigo" => 200];\n$json = json_encode($datos);',
    options: [
      'json_decode()',
      'json_encode()',
      'serialize()',
      'array_to_json()'
    ],
    correctAnswerIndex: 1,
    explanation: 'json_encode($valor) serializa arrays u objetos PHP a una cadena con formato JSON. Por el contrario, json_decode($str, true) parsea un string JSON a un array de PHP.',
    proTip: 'En respuestas de APIs REST siempre acompaña json_encode() con el header header("Content-Type: application/json").'
  },
  {
    id: 'php-20',
    categoryId: 'php',
    categoryName: 'PHP 8+ & OOP',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Para qué sirve la directiva `declare(strict_types=1);` al inicio de un archivo PHP?',
    codeLanguage: 'php',
    codeSnippet: '<?php\ndeclare(strict_types=1);\n\nfunction sumar(int $a, int $b): int {\n    return $a + $b;\n}',
    options: [
      'Obliga a que las llamadas a funciones en ese archivo respeten los tipos exactos sin conversión implícita (ej. rechaza pasar "5" como int).',
      'Impide el uso de variables con signo $ en ese script.',
      'Convierte el archivo en código C++',
      'Desactiva el recolector de basura de PHP para máxima velocidad.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Por defecto PHP intenta convertir tipos débilmente. Con strict_types=1 activado, pasar un tipo incorrecto lanza inmediatamente un TypeError, mejorando la robustez y calidad del software.',
    proTip: 'Debe ser la primerísima instrucción del archivo PHP, inmediatamente después de la etiqueta <?php.'
  }
];
