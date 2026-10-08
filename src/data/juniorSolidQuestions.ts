import { Question } from '../types/quiz';

export const JUNIOR_SOLID_QUESTIONS: Question[] = [
  {
    id: 'solid-04',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué significa la "S" en SOLID y cuál es su definición en términos sencillos?',
    codeLanguage: 'text',
    codeSnippet: 'S - Single Responsibility Principle (SRP)',
    options: [
      'Una clase debe tener una única razón para cambiar, es decir, debe encargarse de una sola responsabilidad bien delimitada.',
      'Solo se puede crear un único objeto de cada clase (patrón Singleton).',
      'El software debe compilarse en un solo archivo binario.',
      'Las funciones solo pueden recibir un único parámetro.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El Principio de Responsabilidad Única (SRP) postula que cada módulo o clase debe encargarse de un único aspecto de la funcionalidad del software. Si una clase hace cálculos contables, guarda en BD y genera PDFs, tiene 3 razones para cambiar y viola el SRP.',
    proTip: 'Pregúntate: "¿Qué hace esta clase?". Si la respuesta incluye la conjunción "Y" (ej: "calcula salarios Y envía correos Y genera reportes"), probablemente viola el SRP.'
  },
  {
    id: 'solid-05',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Por qué la siguiente clase `Factura` viola claramente el Principio de Responsabilidad Única (SRP)?',
    codeLanguage: 'typescript',
    codeSnippet: 'class Factura {\n    calcularTotal() { /* cálculo */ }\n    guardarEnBaseDeDatos() { /* SQL INSERT */ }\n    enviarEmailAlCliente() { /* SMTP */ }\n}',
    options: [
      'Porque mezcla lógica de negocio (cálculo), persistencia de datos (SQL) y comunicación externa (email) en una misma clase.',
      'Porque TypeScript prohíbe tener más de dos métodos por clase.',
      'Porque falta un constructor con parámetros tipados.',
      'Porque Factura debería ser una interfaz y no una clase.'
    ],
    correctAnswerIndex: 0,
    explanation: 'La clase Factura tiene 3 motivos distintos para ser modificada: si cambia la regla de impuestos, si cambia el motor de base de datos o si cambia el proveedor de email. La solución limpia es separar en `Factura`, `FacturaRepository` y `EmailService`.',
    proTip: 'Separar estas responsabilidades facilita enormemente escribir pruebas unitarias independientes.'
  },
  {
    id: 'solid-06',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué significa la "O" en SOLID (Open/Closed Principle - Principio Abierto/Cerrado)?',
    codeLanguage: 'text',
    codeSnippet: 'O - Open / Closed Principle',
    options: [
      'El software debe estar abierto a la extensión (añadir nuevas funcionalidades), pero cerrado a la modificación (sin alterar el código existente ya testeado).',
      'El código fuente debe ser siempre de código abierto (Open Source).',
      'Los archivos deben abrirse y cerrarse con comandos del sistema operativo.',
      'Las clases deben tener constructores abiertos y métodos cerrados.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Debes poder extender el comportamiento de una clase sin tener que abrir su archivo y modificar su código fuente existente, utilizando abstracciones, herencia o polimorfismo.',
    proTip: 'Si cada vez que añades un nuevo tipo de producto o método de pago tienes que editar un gigantesco switch / if-else, estás violando el OCP.'
  },
  {
    id: 'solid-07',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Cómo se refactoriza este código con if/else para cumplir el Principio Abierto/Cerrado (OCP)?',
    codeLanguage: 'typescript',
    codeSnippet: 'function procesarPago(metodo: string, monto: number) {\n    if (metodo === "tarjeta") { /* ... */ }\n    else if (metodo === "paypal") { /* ... */ }\n    else if (metodo === "crypto") { /* ... */ }\n}',
    options: [
      'Crear una interfaz `MetodoPago` con el método `pagar(monto)`, e implementar clases concretas (`PagoTarjeta`, `PagoPaypal`, `PagoCrypto`).',
      'Añadir más cláusulas else-if para cada moneda del mundo.',
      'Reemplazar el if por un switch statement.',
      'Usar una variable global con arrays asociativos.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Al usar polimorfismo con una interfaz común `MetodoPago`, cuando surja un nuevo método (ej. `PagoTransferencia`), solo creas una nueva clase sin tocar ni modificar el código previo de procesarPago.',
    proTip: 'El patrón Estrategia (Strategy Pattern) es la implementación canónica para cumplir con el OCP.'
  },
  {
    id: 'solid-08',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué establece el Principio de Sustitución de Liskov (LSP - la "L" de SOLID)?',
    codeLanguage: 'text',
    codeSnippet: 'L - Liskov Substitution Principle',
    options: [
      'Los objetos de una clase hija deben poder sustituir a los objetos de la clase padre sin alterar el correcto funcionamiento del programa.',
      'Todas las variables deben sustituirse por constantes.',
      'Las subclases deben tener obligatoriamente más métodos que sus padres.',
      'No se permite la herencia múltiple en ningún lenguaje.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Nombrado en honor a Barbara Liskov. Si una función espera un objeto de tipo `Vehiculo`, debe funcionar correctamente sin fallos tanto si le pasas un `Coche` como si le pasas una `Bicicleta` (siempre que ambas hereden de Vehiculo y cumplan su contrato).',
    proTip: 'Si en tu código ves: `if (vehiculo instanceof Bicicleta)` para evitar llamar a un método que rompe, estás violando LSP.'
  },
  {
    id: 'solid-09',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: 'El clásico dilema: ¿Por qué hacer que `Cuadrado` herede de `Rectángulo` suele violar Liskov (LSP)?',
    codeLanguage: 'typescript',
    codeSnippet: 'class Rectangulo {\n    setAncho(w: number) { this.ancho = w; }\n    setAlto(h: number) { this.alto = h; }\n}\nclass Cuadrado extends Rectangulo {\n    setAncho(w: number) { this.ancho = w; this.alto = w; } // Modifica ambos\n}',
    options: [
      'Porque un usuario de Rectangulo espera que cambiar el ancho no altere el alto; el Cuadrado rompe ese comportamiento esperado.',
      'Porque los cuadrados no tienen área calculable.',
      'Porque TypeScript prohíbe que figuras geométricas sean clases.',
      'Porque los cuadrados no son polígonos.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Aunque matemáticamente un cuadrado es un tipo de rectángulo, en programación orientada a objetos mutable violan los contratos de comportamiento de sus métodos. El código que espera un Rectángulo verá su lógica quebrada.',
    proTip: 'La herencia modela comportamiento ("se comporta como"), no únicamente taxonomía conceptual de la vida real.'
  },
  {
    id: 'solid-10',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué postula el Principio de Segregación de Interfaces (ISP - la "I" de SOLID)?',
    codeLanguage: 'text',
    codeSnippet: 'I - Interface Segregation Principle',
    options: [
      'Ningún cliente debería verse obligado a depender de métodos que no utiliza; es mejor tener muchas interfaces pequeñas y específicas que una interfaz gigantesca.',
      'Las interfaces deben declararse en archivos separados con extensión .interface.',
      'Todas las interfaces deben tener como mínimo 10 métodos obligatorios.',
      'Las interfaces solo pueden ser implementadas por clases abstractas.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Las "interfaces grasas" (fat interfaces) obligan a clases simples a implementar métodos con cuerpos vacíos o que arrojan excepciones tipo "NotImplementedError", lo que es una pésima práctica.',
    proTip: 'Es preferible tener `interface Imprimible` e `interface Escaneable` que una gran `interface DispositivoMultifuncion` con todo forzado.'
  },
  {
    id: 'solid-11',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Por qué la siguiente interfaz viola el Principio de Segregación de Interfaces (ISP)?',
    codeLanguage: 'typescript',
    codeSnippet: 'interface Trabajador {\n    trabajar(): void;\n    comer(): void;\n}\nclass Robot implements Trabajador {\n    trabajar() { /* trabaja */ }\n    comer() { throw new Error("Los robots no comen"); }\n}',
    options: [
      'Porque obliga a la clase Robot a implementar el método comer(), el cual no tiene ningún sentido para un robot.',
      'Porque los robots no pueden ser clases en POO.',
      'Porque falta declarar un método dormir().',
      'Porque las interfaces no admiten el tipo de retorno void.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Robot se ve forzado a implementar un método que no le corresponde, arrojando una excepción. La solución es segregar en `interface Trabajable { trabajar(): void }` y `interface Alimentable { comer(): void }`.',
    proTip: 'Un robot implementará solo `Trabajable`, mientras que un Humano implementará ambas interfaces.'
  },
  {
    id: 'solid-12',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué establece el Principio de Inversión de Dependencias (DIP - la "D" de SOLID)?',
    codeLanguage: 'text',
    codeSnippet: 'D - Dependency Inversion Principle',
    options: [
      'Los módulos de alto nivel no deben depender de módulos de bajo nivel; ambos deben depender de abstracciones (interfaces). Las abstracciones no deben depender de los detalles.',
      'Las dependencias deben instalarse en orden inverso en el package.json.',
      'El código backend debe depender directamente de los componentes de React.',
      'Las bases de datos deben crearse antes que el código de la aplicación.'
    ],
    correctAnswerIndex: 0,
    explanation: 'El DIP invierte la jerarquía tradicional. En lugar de que tu servicio de negocio cree directamente instancias de `MySQLDatabase` con `new`, el servicio depende de una interfaz abstracta `DatabaseConnection`.',
    proTip: 'Esto desacopla tu lógica de negocio de la tecnología concreta de persistencia o red utilizada.'
  },
  {
    id: 'solid-13',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Por qué la siguiente clase viola el Principio de Inversión de Dependencias (DIP)?',
    codeLanguage: 'typescript',
    codeSnippet: 'class ServicioUsuarios {\n    private emailService = new ServicioSendGrid(); // Instancia directa\n    registrarUsuario() { this.emailService.enviar(); }\n}',
    options: [
      'Porque ServicioUsuarios está fuertemente acoplado a la implementación concreta de SendGrid; si quieres cambiar a Mailgun o hacer tests unitarios con un Mock, debes modificar la clase.',
      'Porque las clases de servicio no pueden enviar emails.',
      'Porque falta exportar ServicioSendGrid.',
      'Porque new solo se puede usar dentro del constructor.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Al instanciar con `new` dentro de la clase, creas un acoplamiento duro. La solución es inyectar la dependencia a través del constructor recibiendo una interfaz común: `constructor(private emailService: IEmailService)`.',
    proTip: 'La Inyección de Dependencias (DI) es la técnica práctica principal para aplicar el principio DIP.'
  },
  {
    id: 'solid-14',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es la Inyección de Dependencias (Dependency Injection) en la práctica?',
    codeLanguage: 'typescript',
    codeSnippet: 'class Carrito {\n    constructor(private pasarelaPago: IPasarelaPago) {}\n}',
    options: [
      'Pasar las dependencias que una clase necesita desde el exterior (generalmente por el constructor), en lugar de que la clase las instancie internamente con `new`.',
      'Un virus informático que infecta archivos TypeScript.',
      'Un método para inyectar código SQL en bases de datos.',
      'Una forma de compilar código en caliente.'
    ],
    correctAnswerIndex: 0,
    explanation: 'La inyección de dependencias permite que otra entidad (el llamador o un contenedor DI) proporcione las instancias necesarias. Esto hace que las clases sean 100% testeables, ya que en tests puedes pasar un Mock simulado.',
    proTip: 'En pruebas unitarias: puedes inyectar un `MockPasarelaPago` que no cobra dinero real y responde al instante.'
  },
  {
    id: 'solid-15',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es el beneficio más evidente de aplicar principios SOLID en un proyecto real?',
    codeLanguage: 'text',
    codeSnippet: 'Mantenibilidad + Testeabilidad + Escalabilidad',
    options: [
      'El código es más fácil de mantener, extender sin romper cosas existentes y mucho más sencillo de probar con pruebas automatizadas.',
      'El código se ejecuta 100 veces más rápido en la CPU.',
      'Elimina la necesidad de usar bases de datos.',
      'Garantiza que la aplicación nunca tendrá ningún error.'
    ],
    correctAnswerIndex: 0,
    explanation: 'SOLID no es para acelerar el hardware; es para el equipo humano de desarrollo: reduce el acoplamiento, aumenta la cohesión y previene la "deuda técnica" donde tocar una línea rompe diez partes no relacionadas del sistema.',
    proTip: 'Los principios SOLID son guías, no dogmas absolutos; aplícalos con sentido común sin sobre-diseñar aplicaciones simples.'
  },
  {
    id: 'solid-16',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué patrón de diseño ayuda a cumplir el Principio de Responsabilidad Única extrayendo la construcción de objetos complejos?',
    codeLanguage: 'text',
    codeSnippet: 'Patrón Creacional',
    options: [
      'Patrón Factory (Fábrica) o Builder',
      'Patrón Observer',
      'Patrón Decorator',
      'Patrón MVC'
    ],
    correctAnswerIndex: 0,
    explanation: 'El patrón Factory delega la responsabilidad de instanciar y ensamblar objetos complejos a una clase especializada, liberando a la clase de negocio de conocer los detalles de creación.',
    proTip: 'Usa Factory cuando crear un objeto requiera múltiples configuraciones o dependencias condicionales.'
  },
  {
    id: 'solid-17',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué síntoma en una base de código ("Code Smell") suele delatar una violación del Principio de Responsabilidad Única (SRP)?',
    codeLanguage: 'text',
    codeSnippet: 'God Object / Clase Dios',
    options: [
      'Una "Clase Dios" (God Class) gigantesca con más de 2000 líneas que maneja la vista, la base de datos, las validaciones y los cálculos de negocio.',
      'Un archivo con solo 20 líneas de código.',
      'Usar nombres de variables en inglés.',
      'Tener demasiadas pruebas unitarias que pasan.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Las clases gigantescas que intentan "hacer de todo" son el síntoma clásico de violación del SRP. Son difíciles de leer, propensas a conflictos de merge en Git y casi imposibles de testear.',
    proTip: 'Cuando veas una clase con cientos de líneas y métodos dispares, desglósala en clases colaboradoras más pequeñas y enfocadas.'
  },
  {
    id: 'solid-18',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo se relaciona el Principio de Segregación de Interfaces (ISP) con el principio de diseño "Keep It Simple" (KISS)?',
    codeLanguage: 'text',
    codeSnippet: 'Interfaces específicas vs monolitos',
    options: [
      'Al crear interfaces con pocos métodos específicos para cada rol, las clases que las implementan solo escriben el código estrictamente necesario sin métodos inútiles.',
      'ISP prohíbe el uso de interfaces en proyectos sencillos.',
      'KISS obliga a que todas las interfaces tengan un solo método llamado run().',
      'No tienen ninguna relación conceptual.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Tener contratos pequeños y específicos mantiene las clases sencillas, comprensibles y sin código muerto o implementaciones vacías que confunden a otros programadores.',
    proTip: 'En TypeScript y Go es común tener interfaces con uno o dos métodos (ej. `Reader`, `Writer`, `Clonable`).'
  },
  {
    id: 'solid-19',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: 'En una entrevista técnica para Junior: ¿Quién propuso y popularizó el acrónimo SOLID?',
    codeLanguage: 'text',
    codeSnippet: 'Uncle Bob (Robert C. Martin)',
    options: [
      'Robert C. Martin ("Uncle Bob") en sus libros y publicaciones sobre Clean Architecture y Agile.',
      'Bill Gates en el lanzamiento de Windows 95.',
      'Linus Torvalds al programar el kernel de Linux.',
      'Mark Zuckerberg al crear React.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Robert C. Martin recopiló estos 5 principios a principios de la década de 2000, y más tarde Michael Feathers introdujo el mnemónico SOLID para recordarlos fácilmente.',
    proTip: 'Conocer el origen y la filosofía detrás de SOLID demuestra madurez y cultura técnica en entrevistas de trabajo.'
  },
  {
    id: 'solid-20',
    categoryId: 'solid',
    categoryName: 'Principios SOLID',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué principio SOLID se violaría si una clase hija anula un método del padre para lanzar una excepción `throw new UnsupportedOperationException()`?',
    codeLanguage: 'typescript',
    codeSnippet: 'class Ave {\n    volar() { /* vuela */ }\n}\nclass Pinguino extends Ave {\n    volar() { throw new Error("Los pingüinos no pueden volar"); }\n}',
    options: [
      'El Principio de Sustitución de Liskov (LSP), porque Pinguino no puede sustituir a Ave de forma segura sin romper el código que llama a volar().',
      'El Principio de Inversión de Dependencias (DIP).',
      'El Principio de Responsabilidad Única (SRP).',
      'Ninguno, es la forma correcta de modelar pingüinos.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Cualquier código que reciba un `Ave` y llame a `.volar()` fallará inesperadamente si recibe un `Pinguino`. La jerarquía correcta sería no poner `.volar()` en el padre común `Ave`, sino crear una interfaz o subclase `AveVoladora`.',
    proTip: 'Pregunta clásica de examen: "Un Pingüino es un Ave, pero no todo Ave vuela; no heredes comportamiento que no todas las hijas poseen".'
  }
];
