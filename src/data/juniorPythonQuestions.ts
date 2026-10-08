import { Question } from '../types/quiz';

export const JUNIOR_PYTHON_QUESTIONS: Question[] = [
  {
    id: 'py-03',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Cuál es el resultado de este código al intentar modificar un elemento de una tupla?',
    codeLanguage: 'python',
    codeSnippet: 'coordenadas = (10, 20)\ncoordenadas[0] = 50\nprint(coordenadas)',
    options: [
      'Imprime (50, 20) sin problema.',
      'Lanza TypeError porque las tuplas son inmutables.',
      'Convierte automáticamente la tupla en una lista [50, 20].',
      'Imprime (10, 20) ignorando la asignación.'
    ],
    correctAnswerIndex: 1,
    explanation: 'En Python, las tuplas son estructuras inmutables. Una vez creadas, no se pueden modificar, reasignar sus índices ni eliminar elementos. Si necesitas modificar elementos, debes usar una lista [10, 20].',
    proTip: 'Usa tuplas para datos fijos como coordenadas o pares clave-valor que no deban alterarse accidentalmente.'
  },
  {
    id: 'py-04',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia fundamental entre el operador `==` y el operador `is` en Python?',
    codeLanguage: 'python',
    codeSnippet: 'a = [1, 2, 3]\nb = [1, 2, 3]\nprint(a == b)\nprint(a is b)',
    options: [
      'Ambos hacen exactamente lo mismo en cualquier tipo de dato.',
      '`==` compara identidad en memoria física, mientras `is` compara igualdad de valores.',
      '`==` compara igualdad de valores (contenido), mientras `is` compara identidad en memoria (mismo objeto).',
      '`is` solo se usa con números enteros y floats.'
    ],
    correctAnswerIndex: 2,
    explanation: '`==` evalúa si el contenido de los dos objetos es igual (a == b es True). `is` verifica si ambas variables apuntan a la misma dirección de memoria física con id() (a is b es False porque son dos listas distintas en memoria).',
    proTip: 'Para comparar con None, siempre usa "if x is None:" en lugar de "if x == None:".'
  },
  {
    id: 'py-05',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué método es la forma segura recomendada para obtener un valor de un diccionario sin arriesgar un KeyError?',
    codeLanguage: 'python',
    codeSnippet: 'usuario = {"nombre": "Ana", "edad": 24}\n# ¿Cómo obtener "email" con valor por defecto "no_tiene"?',
    options: [
      'usuario["email"] ?: "no_tiene"',
      'usuario.get("email", "no_tiene")',
      'usuario.fetch("email", "no_tiene")',
      'usuario.find("email") or "no_tiene"'
    ],
    correctAnswerIndex: 1,
    explanation: 'El método .get(clave, default) busca la clave en el diccionario. Si no existe, devuelve el valor por defecto provisto (o None si no se especifica), evitando lanzar una excepción KeyError.',
    proTip: 'Acceder con corchetes usuario["clave"] solo se recomienda si estás 100% seguro de que la clave existe.'
  },
  {
    id: 'py-06',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es el resultado de la siguiente list comprehension básica?',
    codeLanguage: 'python',
    codeSnippet: 'numeros = [1, 2, 3, 4, 5]\npares = [x * 2 for x in numeros if x % 2 == 0]\nprint(pares)',
    options: [
      '[2, 4, 6, 8, 10]',
      '[4, 8]',
      '[2, 4]',
      '[4, 16]'
    ],
    correctAnswerIndex: 1,
    explanation: 'El filtro "if x % 2 == 0" selecciona los números pares (2 y 4). Luego, la expresión "x * 2" multiplica cada uno por 2, resultando en [4, 8].',
    proTip: 'Las list comprehensions son más rápidas y legibles que combinar bucles for tradicionales con .append().'
  },
  {
    id: 'py-07',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué ocurre al ejecutar este bloque de manejo de archivos sin contexto `with`?',
    codeLanguage: 'python',
    codeSnippet: 'archivo = open("datos.txt", "w")\narchivo.write("Hola Mundo")\n# ¿Qué falta aquí para una buena práctica?',
    options: [
      'Falta llamar a archivo.close() o usar la sentencia "with open(...) as archivo:".',
      'Python no permite escribir strings en modo "w".',
      'Falta importar el módulo "fileio".',
      'El método write lanza automáticamente un error si no se pasa un entero.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Dejar archivos abiertos puede provocar bloqueos del sistema de archivos y pérdida de datos en buffer si el proceso termina abruptamente. La sintaxis "with open(...) as f:" asegura que el archivo se cierre automáticamente incluso si ocurre un error.',
    proTip: 'Siempre usa el Context Manager "with open(...) as f:" para cualquier archivo, socket o conexión.'
  },
  {
    id: 'py-08',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: 'En una entrevista técnica para Junior: ¿Para qué sirven `*args` y `**kwargs` en los parámetros de una función?',
    codeLanguage: 'python',
    codeSnippet: 'def procesar(*args, **kwargs):\n    pass',
    options: [
      '*args recibe argumentos posicionales variables como tupla, y **kwargs argumentos con nombre (clave=valor) como diccionario.',
      '*args es para números y **kwargs es exclusivamente para strings.',
      'Son punteros de memoria como en C y C++.',
      '*args obliga a que todos los argumentos sean del mismo tipo estricto.'
    ],
    correctAnswerIndex: 0,
    explanation: '*args empaqueta cualquier cantidad de argumentos posicionales adicionales en una tupla, mientras que **kwargs empaqueta argumentos nombrados en un diccionario.',
    proTip: 'El nombre puede ser cualquiera (ej. *valores), pero *args y **kwargs son la convención universal PEP 8.'
  },
  {
    id: 'py-09',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué imprime el siguiente slicing de cadenas en Python?',
    codeLanguage: 'python',
    codeSnippet: 'texto = "Python"\nprint(texto[::-1])',
    options: [
      '"P"',
      '"nohtyP"',
      'Error de índice negativo',
      '"Python"'
    ],
    correctAnswerIndex: 1,
    explanation: 'La sintaxis de slicing [inicio:fin:paso] con paso -1 recorre la secuencia en orden inverso desde el final hasta el inicio, invirtiendo la cadena.',
    proTip: 'Este truco funciona exactamente igual en cadenas, listas y tuplas.'
  },
  {
    id: 'py-10',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué bloque se ejecuta SIEMPRE en una estructura try/except/finally, ocurra o no una excepción?',
    codeLanguage: 'python',
    codeSnippet: 'try:\n    resultado = 10 / divisor\nexcept ZeroDivisionError:\n    print("Error")\nfinally:\n    # ¿Cuándo se ejecuta esto?',
    options: [
      'Solo si ocurre un ZeroDivisionError.',
      'Solo si NO ocurre ningún error.',
      'Siempre, ocurra o no un error, ideal para liberar recursos o cerrar conexiones.',
      'Nunca, a menos que se llame explícitamente a finally().'
    ],
    correctAnswerIndex: 2,
    explanation: 'El bloque finally se ejecuta de manera garantizada tras salir del try o except, independientemente de si hubo error o si hubo un return previo.',
    proTip: 'Usa finally para tareas de limpieza obligatorias como desconectar bases de datos o resetear banderas.'
  },
  {
    id: 'py-11',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo se añade un nuevo elemento al final de una lista existente en Python?',
    codeLanguage: 'python',
    codeSnippet: 'frutas = ["manzana", "banana"]\n# ¿Cómo añadir "naranja"?',
    options: [
      'frutas.push("naranja")',
      'frutas.add("naranja")',
      'frutas.append("naranja")',
      'frutas.insert_end("naranja")'
    ],
    correctAnswerIndex: 2,
    explanation: 'En Python las listas usan el método .append(elemento) para agregar un ítem al final. (.push() pertenece a JavaScript y .add() a conjuntos set).',
    proTip: 'Si quieres agregar múltiples elementos a la vez desde otra lista, usa .extend(otra_lista) o el operador +=.'
  },
  {
    id: 'py-12',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué estructura de datos elimina duplicados automáticamente y no mantiene orden garantizado?',
    codeLanguage: 'python',
    codeSnippet: 'datos = [1, 2, 2, 3, 3, 3, 4]\nresultado = set(datos)\nprint(len(resultado))',
    options: [
      '4',
      '7',
      '3',
      'Error de conversión'
    ],
    correctAnswerIndex: 0,
    explanation: 'El tipo set almacena solo elementos únicos. Al convertir [1, 2, 2, 3, 3, 3, 4] a set, los duplicados se eliminan, quedando {1, 2, 3, 4}, cuya longitud es 4.',
    proTip: 'Convertir una lista a set(lista) es la forma más rápida y común para eliminar duplicados en entrevistas técnicas.'
  },
  {
    id: 'py-13',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo se formatea una cadena de texto de manera moderna y limpia en Python 3.6+?',
    codeLanguage: 'python',
    codeSnippet: 'nombre = "Carlos"\nedad = 22\n# ¿Cuál es el f-string correcto?',
    options: [
      'f"Hola, me llamo {nombre} y tengo {edad} años"',
      '"Hola, me llamo %s y tengo %d años" (nombre, edad)',
      '"Hola, me llamo {0} y tengo {1} años".concat(nombre, edad)',
      'str.format("Hola", nombre, edad)'
    ],
    correctAnswerIndex: 0,
    explanation: 'Los f-strings (cadenas literales precedidas por "f" o "F") permiten interpolar variables y expresiones Python directamente dentro de llaves {variable}.',
    proTip: 'Los f-strings son más legibles y significativamente más rápidos que % o .format().'
  },
  {
    id: 'py-14',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Qué error genera intentar concatenar un string con un entero mediante el operador `+`?',
    codeLanguage: 'python',
    codeSnippet: 'mensaje = "Nivel: " + 1\nprint(mensaje)',
    options: [
      'Imprime "Nivel: 1" con coerción automática.',
      'Lanza un TypeError: can only concatenate str (not "int") to str.',
      'Convierte "Nivel: " a NaN.',
      'Lanza un ValueError.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Python tiene tipado fuerte (strong typing) y no realiza coerción implícita de tipos como JavaScript. Para concatenar debes convertirlo explícitamente: str(1) o usar f"Nivel: {1}".',
    proTip: 'Recuerda: Python es de tipado dinámico pero FUERTE. Nunca concatena números con texto automáticamente.'
  },
  {
    id: 'py-15',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es la función del comando `pip install -r requirements.txt` en el flujo de trabajo de un desarrollador?',
    codeLanguage: 'bash',
    codeSnippet: 'pip install -r requirements.txt',
    options: [
      'Instalar Python en el sistema operativo.',
      'Instalar todas las librerías y dependencias externas listadas en el archivo requirements.txt.',
      'Crear un archivo ejecutable .exe del proyecto.',
      'Ejecutar las pruebas unitarias del proyecto.'
    ],
    correctAnswerIndex: 1,
    explanation: 'El comando instala de forma automatizada todas las dependencias y versiones de paquetes que el proyecto necesita, garantizando reproducibilidad en otros entornos.',
    proTip: 'Genera tu lista de dependencias con "pip freeze > requirements.txt" dentro de un entorno virtual activo.'
  },
  {
    id: 'py-16',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué hace la palabra reservada `break` dentro de un bucle `for` o `while`?',
    codeLanguage: 'python',
    codeSnippet: 'for n in range(10):\n    if n == 3:\n        break\n    print(n, end=" ")',
    options: [
      'Pasa inmediatamente a la siguiente iteración sin salir del bucle.',
      'Termina e interrumpe inmediatamente el bucle completo.',
      'Pausa la ejecución durante 3 segundos.',
      'Reinicia el bucle desde cero.'
    ],
    correctAnswerIndex: 1,
    explanation: '`break` sale inmediatamente del bucle en ejecución. Para saltar solo la iteración actual y continuar con la siguiente, se utiliza `continue`.',
    proTip: 'Imprime "0 1 2 " porque al llegar a 3 el bucle se detiene por completo.'
  },
  {
    id: 'py-17',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es la forma correcta de definir una función constructora en una clase de Python?',
    codeLanguage: 'python',
    codeSnippet: 'class Persona:\n    # ¿Cómo definir el constructor?',
    options: [
      'def constructor(self, nombre): self.nombre = nombre',
      'def __init__(self, nombre): self.nombre = nombre',
      'def Persona(self, nombre): self.nombre = nombre',
      'def new(self, nombre): self.nombre = nombre'
    ],
    correctAnswerIndex: 1,
    explanation: 'En Python, el método mágico especial `__init__` se ejecuta automáticamente al instanciar una clase. El primer parámetro siempre debe ser `self`, que referencia a la instancia creada.',
    proTip: 'Nunca olvides incluir `self` como primer parámetro en los métodos de instancia de una clase.'
  },
  {
    id: 'py-18',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué devuelve la función `len()` cuando se le pasa un diccionario?',
    codeLanguage: 'python',
    codeSnippet: 'info = {"id": 1, "nombre": "Dev", "activo": True}\nprint(len(info))',
    options: [
      '3 (la cantidad de pares clave-valor)',
      '6 (sumando claves y valores)',
      'El tamaño en bytes en memoria RAM',
      'Lanza un TypeError porque los diccionarios no tienen longitud'
    ],
    correctAnswerIndex: 0,
    explanation: 'En los diccionarios de Python, `len(d)` devuelve el número de claves (o entradas clave-valor) almacenadas.',
    proTip: 'Para comprobar si un diccionario está vacío de forma pythonica, usa "if not info:" en lugar de "if len(info) == 0:".'
  },
  {
    id: 'py-19',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Por qué este código genera un NameError al intentar modificar una variable global?',
    codeLanguage: 'python',
    codeSnippet: 'contador = 0\n\ndef incrementar():\n    contador += 1\n\nincrementar()',
    options: [
      'Porque en Python las variables globales son de solo lectura permanente.',
      'Porque Python asume que "contador" es una variable local no asignada antes de su uso; requiere la sentencia "global contador".',
      'Porque las funciones en Python no pueden contener números.',
      'Porque el operador += no existe en Python.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Al intentar asignar contador += 1 dentro de una función sin declarar "global contador", Python considera que "contador" es una variable local, arrojando UnboundLocalError / NameError.',
    proTip: 'Como buena práctica de arquitectura limpia, evita modificar variables globales dentro de funciones; es mejor pasar el valor como parámetro y devolverlo.'
  },
  {
    id: 'py-20',
    categoryId: 'python',
    categoryName: 'Python Moderno',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Para qué sirve crear un entorno virtual con `python -m venv mi_entorno`?',
    codeLanguage: 'bash',
    codeSnippet: 'python -m venv .venv',
    options: [
      'Para aislar las librerías y dependencias de este proyecto de la instalación global del sistema.',
      'Para compilar el código Python en lenguaje máquina antes de ejecutarlo.',
      'Para aumentar la velocidad de procesamiento de la CPU.',
      'Para hacer copias de seguridad automáticas en la nube.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Un entorno virtual (venv) crea un directorio aislado que contiene su propio ejecutable de Python y sus propias librerías instaladas con pip, evitando colisiones de versiones entre diferentes proyectos.',
    proTip: 'Siempre incluye la carpeta del entorno virtual (".venv/" o "venv/") en tu archivo .gitignore.'
  }
];
