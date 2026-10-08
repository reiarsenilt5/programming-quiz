import { Question } from '../types/quiz';

export const JUNIOR_SQL_QUESTIONS: Question[] = [
  {
    id: 'sql-04',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia fundamental entre `INNER JOIN` y `LEFT JOIN` en una consulta relacional?',
    codeLanguage: 'sql',
    codeSnippet: 'SELECT u.nombre, p.total\nFROM usuarios u\nLEFT JOIN pedidos p ON u.id = p.usuario_id;',
    options: [
      '`INNER JOIN` devuelve solo las filas que tienen coincidencia en ambas tablas; `LEFT JOIN` devuelve todos los registros de la tabla izquierda aunque no tengan pedidos (rellenando con NULL).',
      '`LEFT JOIN` borra los datos que no coincidan en la tabla derecha.',
      '`INNER JOIN` es solo para bases de datos NoSQL.',
      'Ambos devuelven exactamente los mismos resultados en cualquier circunstancia.'
    ],
    correctAnswerIndex: 0,
    explanation: '`INNER JOIN` requiere correspondencia estricta en ambas tablas. `LEFT JOIN` (o LEFT OUTER JOIN) preserva todas las filas de la tabla de la izquierda (usuarios); si un usuario no tiene pedidos, sus columnas de pedido aparecerán como NULL.',
    proTip: 'Usa LEFT JOIN cuando quieras listar elementos que podrían no tener registros asociados (ej. "todos los clientes y sus pedidos si tienen").'
  },
  {
    id: 'sql-05',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es la diferencia entre la cláusula `WHERE` y la cláusula `HAVING` en SQL?',
    codeLanguage: 'sql',
    codeSnippet: 'SELECT departamento, COUNT(*) as total_empleados\nFROM empleados\nWHERE salario > 1000\nGROUP BY departamento\nHAVING COUNT(*) > 5;',
    options: [
      '`WHERE` filtra filas individuales ANTES de agrupar; `HAVING` filtra grupos DESPUÉS de aplicar `GROUP BY` y funciones de agregación (como COUNT, AVG).',
      '`HAVING` se ejecuta antes de `WHERE` para ordenar la tabla.',
      '`WHERE` solo funciona con números y `HAVING` con strings.',
      'Son sinónimos intercambiables en cualquier consulta.'
    ],
    correctAnswerIndex: 0,
    explanation: '`WHERE` no puede evaluar el resultado de funciones agregadas como COUNT(*) o AVG() porque opera fila por fila antes de la agregación. `HAVING` está diseñado específicamente para filtrar los grupos resultantes.',
    proTip: 'Pregunta típica de entrevista junior: Recuerda la regla "WHERE para filas, HAVING para grupos agregados".'
  },
  {
    id: 'sql-06',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Por qué la consulta `SELECT * FROM clientes WHERE telefono = NULL;` nunca devuelve resultados?',
    codeLanguage: 'sql',
    codeSnippet: 'SELECT * FROM clientes WHERE telefono = NULL;',
    options: [
      'Porque en SQL `NULL` representa un valor desconocido y no se puede comparar con `=`, se debe usar la sintaxis `IS NULL`.',
      'Porque los nombres de columnas no pueden llamarse telefono.',
      'Porque falta escribir `NULL()` con paréntesis.',
      'Porque las consultas SELECT prohíben buscar valores vacíos.'
    ],
    correctAnswerIndex: 0,
    explanation: 'En la lógica trivaluada de SQL (True, False, Unknown), `algo = NULL` siempre evalúa a `UNKNOWN` (desconocido), por lo que la condición nunca es verdadera. La única forma correcta de buscar nulos es: `WHERE telefono IS NULL` o `WHERE telefono IS NOT NULL`.',
    proTip: 'Grábate esto a fuego: NUNCA uses `= NULL` ni `!= NULL`; usa siempre `IS NULL` o `IS NOT NULL`.'
  },
  {
    id: 'sql-07',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Cuál es el peligro crítico de ejecutar una sentencia `UPDATE` o `DELETE` sin cláusula `WHERE`?',
    codeLanguage: 'sql',
    codeSnippet: 'DELETE FROM usuarios; -- ¿Qué ocurre si ejecutas esto?',
    options: [
      'Elimina todos los registros de toda la tabla de manera irreversible.',
      'Da un error de sintaxis y no borra nada.',
      'Borra únicamente el primer registro que fue insertado.',
      'Crea una copia de seguridad automática antes de borrar.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Sin una condición `WHERE`, los comandos `UPDATE` y `DELETE` afectan a absolutamente todas las filas de la tabla. En producción, esto puede ocasionar una catástrofe de pérdida total de datos.',
    proTip: 'Regla de oro: Antes de correr un DELETE o UPDATE con WHERE, corre primero un SELECT con ese mismo WHERE para verificar exactamente qué filas vas a modificar.'
  },
  {
    id: 'sql-08',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué es una Clave Primaria (`PRIMARY KEY`) en una tabla relacional?',
    codeLanguage: 'sql',
    codeSnippet: 'CREATE TABLE productos (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    nombre VARCHAR(100) NOT NULL\n);',
    options: [
      'Una columna (o conjunto de columnas) que identifica de forma única cada fila en una tabla, garantizando que no se repita y nunca sea NULL.',
      'La contraseña para acceder a la base de datos.',
      'El nombre de usuario que creó la tabla.',
      'Una clave de encriptación SSL.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Una clave primaria garantiza la unicidad e integridad de cada fila. Combina implícitamente las restricciones `UNIQUE` y `NOT NULL`, y crea automáticamente un índice para búsquedas ultrarrápidas.',
    proTip: 'Casi todas las tablas relacionales deben tener una clave primaria, habitualmente un ID entero autonumérico o un UUID.'
  },
  {
    id: 'sql-09',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Para qué sirve una Clave Foránea (`FOREIGN KEY`) en el diseño de bases de datos?',
    codeLanguage: 'sql',
    codeSnippet: 'CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)',
    options: [
      'Garantiza la integridad referencial, asegurando que el valor en usuario_id exista realmente en la tabla usuarios.',
      'Permite conectar bases de datos de servidores de otros países.',
      'Oculta la columna para que los usuarios no puedan verla.',
      'Convierte la base de datos a formato NoSQL.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Las claves foráneas evitan registros huérfanos (por ejemplo, pedidos asignados a un cliente que no existe). Si intentas insertar un ID inexistente, la base de datos rechazará la operación.',
    proTip: 'Configura `ON DELETE CASCADE` solo cuando tenga sentido de negocio que al borrar el registro padre se borren sus hijos relacionados.'
  },
  {
    id: 'sql-10',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué función de agregación calcula el promedio aritmético de una columna numérica?',
    codeLanguage: 'sql',
    codeSnippet: 'SELECT AVG(precio) as precio_promedio FROM productos;',
    options: [
      'SUM()',
      'AVG()',
      'COUNT()',
      'MEAN()'
    ],
    correctAnswerIndex: 1,
    explanation: '`AVG()` (Average) suma los valores de la columna y los divide entre el número de registros no nulos.',
    proTip: '`AVG()` ignora automáticamente los valores NULL en su cálculo; no los toma como ceros.'
  },
  {
    id: 'sql-11',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cómo se ordenan los resultados de una consulta de mayor a menor (descendente)?',
    codeLanguage: 'sql',
    codeSnippet: 'SELECT nombre, puntuacion FROM jugadores ORDER BY puntuacion DESC;',
    options: [
      'ORDER BY puntuacion ASC',
      'ORDER BY puntuacion DESC',
      'SORT BY puntuacion DOWN',
      'GROUP BY puntuacion DESC'
    ],
    correctAnswerIndex: 1,
    explanation: '`DESC` (descendente) ordena de mayor a menor en números o de la Z a la A en texto. `ASC` (ascendente) es el comportamiento por defecto.',
    proTip: 'Puedes combinar múltiples ordenamientos: `ORDER BY fecha DESC, nombre ASC`.'
  },
  {
    id: 'sql-12',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué cláusula limita la cantidad de registros devueltos por una consulta (ej. para paginación)?',
    codeLanguage: 'sql',
    codeSnippet: 'SELECT * FROM articulos ORDER BY fecha DESC LIMIT 10 OFFSET 20;',
    options: [
      'LIMIT y OFFSET',
      'TOP y STOP',
      'RANGE y PAGE',
      'MAX y SKIP'
    ],
    correctAnswerIndex: 0,
    explanation: '`LIMIT 10` indica devolver un máximo de 10 filas. `OFFSET 20` se salta las primeras 20 filas. Juntas son la base de la paginación tradicional en PostgreSQL, MySQL y SQLite.',
    proTip: 'En SQL Server se utiliza `TOP (10)` o `OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY`.'
  },
  {
    id: 'sql-13',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué operador se utiliza con `WHERE` para buscar patrones de texto que contengan una palabra específica?',
    codeLanguage: 'sql',
    codeSnippet: 'SELECT * FROM libros WHERE titulo LIKE "%Python%";',
    options: [
      'MATCH',
      'LIKE con el comodín %',
      'CONTAINS',
      'EQUALS'
    ],
    correctAnswerIndex: 1,
    explanation: 'El operador `LIKE` compara cadenas con comodines. El símbolo `%` representa cero o más caracteres arbitrarios, por lo que `"%Python%"` encuentra cualquier título que contenga "Python" en cualquier posición.',
    proTip: 'El comodín `_` (guión bajo) representa exactamente un solo carácter cualquiera.'
  },
  {
    id: 'sql-14',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué función SQL devuelve el primer valor no nulo de una lista de argumentos?',
    codeLanguage: 'sql',
    codeSnippet: 'SELECT COALESCE(telefono, celular, "Sin número") as contacto FROM usuarios;',
    options: [
      'IFNULL()',
      'COALESCE()',
      'NVL()',
      'DEFAULT()'
    ],
    correctAnswerIndex: 1,
    explanation: '`COALESCE(val1, val2, ...)` es una función estándar ANSI SQL que evalúa sus argumentos en orden y retorna el primer valor que no sea NULL.',
    proTip: 'Es extremadamente útil para proporcionar valores de respaldo amigables en reportes y vistas.'
  },
  {
    id: 'sql-15',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Junior',
    type: 'find_the_bug',
    title: '¿Por qué la consulta `SELECT categoria, AVG(precio) FROM productos;` arroja un error en SQL estricto?',
    codeLanguage: 'sql',
    codeSnippet: 'SELECT categoria, AVG(precio) FROM productos;',
    options: [
      'Porque falta la cláusula `GROUP BY categoria`; no se pueden mezclar columnas no agregadas con funciones de agregación sin agrupar.',
      'Porque AVG() solo funciona en tablas temporales.',
      'Porque la columna categoria debe ser numérica.',
      'Porque SELECT prohíbe tener más de una columna si hay funciones.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Si seleccionas una columna individual (`categoria`) junto a una función agregada (`AVG(precio)`), el motor SQL necesita saber cómo agrupar las filas. La consulta correcta es: `SELECT categoria, AVG(precio) FROM productos GROUP BY categoria;`.',
    proTip: 'Regla básica: Toda columna que aparezca en el SELECT que no esté dentro de una función de agregación debe estar en el GROUP BY.'
  },
  {
    id: 'sql-16',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué significa la propiedad ACID en las transacciones de bases de datos relacionales?',
    codeLanguage: 'text',
    codeSnippet: 'A - C - I - D',
    options: [
      'Atomicidad, Consistencia, Aislamiento (Isolation) y Durabilidad.',
      'Acceso, Conectividad, Integración y Distribución.',
      'Algoritmo, Código, Interfaz y Datos.',
      'Autenticación, Criptografía, Identidad y Despliegue.'
    ],
    correctAnswerIndex: 0,
    explanation: 'ACID garantiza transacciones seguras: Atomicidad (todo o nada), Consistencia (reglas de integridad se cumplen), Aislamiento (transacciones concurrentes no se interfieren) y Durabilidad (los datos confirmados sobreviven a fallos del sistema).',
    proTip: 'Pregunta clásica de entrevista: En una transferencia bancaria, se descuenta de una cuenta y se suma en otra dentro de una misma transacción Atómica: si falla una, se revierte todo (ROLLBACK).'
  },
  {
    id: 'sql-17',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Para qué sirve crear un ÍNDICE (`INDEX`) en una columna de una tabla de base de datos?',
    codeLanguage: 'sql',
    codeSnippet: 'CREATE INDEX idx_email ON usuarios(email);',
    options: [
      'Acelera dramáticamente la velocidad de las búsquedas y filtros (WHERE) en esa columna, a costa de un ligero coste adicional de espacio y tiempo en inserciones.',
      'Obliga a que todos los emails sean únicos.',
      'Encripta la columna email con SHA-256.',
      'Oculta la columna en la consola del administrador.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Un índice funciona como el índice alfabético al final de un libro. En lugar de escanear la tabla entera fila por fila (Full Table Scan), el motor busca directamente en una estructura B-Tree optimizada.',
    proTip: 'No indexes todas las columnas indiscriminadamente; indexa aquellas que se usan con alta frecuencia en cláusulas WHERE y JOIN.'
  },
  {
    id: 'sql-18',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué comando DDL se utiliza para agregar una nueva columna a una tabla existente sin borrarla?',
    codeLanguage: 'sql',
    codeSnippet: 'ALTER TABLE usuarios ADD COLUMN fecha_nacimiento DATE;',
    options: [
      'UPDATE TABLE',
      'MODIFY TABLE',
      'ALTER TABLE',
      'CHANGE TABLE'
    ],
    correctAnswerIndex: 2,
    explanation: '`ALTER TABLE nombre_tabla ADD COLUMN nombre_columna tipo;` modifica la estructura de una tabla existente para incorporar nuevas columnas o restricciones.',
    proTip: 'Comandos que cambian la estructura (CREATE, ALTER, DROP) son DDL (Data Definition Language); comandos que manipulan datos (SELECT, INSERT, UPDATE, DELETE) son DML.'
  },
  {
    id: 'sql-19',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Qué operador permite comprobar si un valor coincide con cualquiera de los valores dentro de una lista o subconsulta?',
    codeLanguage: 'sql',
    codeSnippet: 'SELECT * FROM pedidos WHERE estado IN ("enviado", "entregado", "facturado");',
    options: [
      'BETWEEN',
      'IN',
      'EXISTS',
      'LIKE'
    ],
    correctAnswerIndex: 1,
    explanation: 'El operador `IN (...)` es una alternativa limpia y eficiente a encadenar múltiples condiciones `OR`: `WHERE estado = "enviado" OR estado = "entregado" OR ...`.',
    proTip: 'También puedes usar `NOT IN (...)` para excluir una lista de valores.'
  },
  {
    id: 'sql-20',
    categoryId: 'sql',
    categoryName: 'SQL & Bases de Datos',
    difficulty: 'Junior',
    type: 'multiple_choice',
    title: '¿Cuál es la forma segura y profesional de prevenir ataques de Inyección SQL (SQL Injection) en código backend?',
    codeLanguage: 'sql',
    codeSnippet: '// ¿Cómo ejecutar consultas de forma segura con parámetros?',
    options: [
      'Usar consultas preparadas (Prepared Statements / Parámetros Bind) o un ORM seguro, nunca concatenar texto del usuario directamente en la cadena SQL.',
      'Reemplazar todas las comillas con espacios en blanco manualmente con regex.',
      'Cambiar el puerto del servidor de base de datos a 9999.',
      'Desactivar el comando SELECT en la base de datos.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Las consultas preparadas envían la plantilla SQL y los datos por canales separados al motor de base de datos. El motor trata los datos estrictamente como valores literales, haciendo imposible que el texto malicioso se interprete como instrucciones SQL.',
    proTip: 'Nunca hagas: `query = "SELECT * FROM users WHERE email = \'" + input + "\'"` en ningún lenguaje.'
  }
];
