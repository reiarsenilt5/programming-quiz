# Expansión Integral de Quizzes: Mínimo 20 Preguntas por Categoría (Enfoque Junior & Aprendizaje)

Plan arquitectónico y pedagógico para garantizar que los 13 cuestionarios técnicos de DevQuiz cuenten con **al menos 20 preguntas cada uno**, diseñadas específicamente para principiantes y programadores junior, equilibrando predicción de salidas de código, corrección de errores comunes, conceptos sintácticos y casos reales de entrevistas técnicas iniciales.

## Decisiones Críticas y Preferencias del Usuario

> [!IMPORTANT]
> - **Nivel de Dificultad**: Todas las nuevas preguntas (161+ preguntas) estarán enfocadas en **Junior / Principiante**, con explicaciones detalladas paso a paso y consejos didácticos (`proTip`). Las preguntas avanzadas existentes se mantendrán para asegurar variedad sin afectar la accesibilidad para juniors.
> - **Variedad de Formatos**: Distribución equitativa y balanceada entre:
>   1. **Predicción de salidas & detección de bugs novatos** (`find_the_bug` / salida esperada).
>   2. **Conceptos sintácticos esenciales y buenas prácticas fundamentales** (`multiple_choice`).
>   3. **Casos prácticos de entrevistas técnicas para Juniors** (preguntas frecuentes de reclutamiento técnico).
> - **Sincronización Total**: Se actualizarán tanto los módulos de TypeScript de la aplicación web React (`src/data/`) como el archivo `app/src/main/assets/questions.json` del proyecto Android nativo y `src/data/androidProjectCode.ts` para descargas ZIP.

---

## 1. Visión General y Alcance del Contenido

### Estado Actual vs Meta Requerida
| Categoría | Preguntas Actuales | Preguntas Nuevas (Junior) | Total Final (Meta ≥ 20) |
| :--- | :---: | :---: | :---: |
| **Python Moderno** (`python`) | 2 | +18 | **20** |
| **PHP 8+ & OOP** (`php`) | 2 | +18 | **20** |
| **JavaScript Core** (`javascript`) | 2 | +18 | **20** |
| **TypeScript Avanzado** (`typescript`) | 2 | +18 | **20** |
| **React & Ecosystem** (`react`) | 1 | +19 | **20** |
| **SQL & Bases de Datos** (`sql`) | 3 | +17 | **20** |
| **Principios SOLID** (`solid`) | 3 | +17 | **20** |
| **Fundamentos & Git** (`modern_fundamentals`) | 2 | +18 | **20** |
| **IA para Programadores** (`ai_assistance`) | 2 | +18 | **20** |
| **Fullstack Senior** (`senior_fullstack`) | 50 | 0 | **50** (cumple ≥ 20) |
| **DevOps & Cloud** (`devops_cloud`) | 50 | 0 | **50** (cumple ≥ 20) |
| **Sutilezas Pro** (`subtle_engineering`) | 30 | 0 | **30** (cumple ≥ 20) |
| **Docker Mastery** (`docker_mastery`) | 25 | 0 | **25** (cumple ≥ 20) |
| **TOTAL GLOBAL** | **174** | **+163** | **337 preguntas** |

---

## 2. Experiencia de Usuario y Pedagogía Junior

### Pilares Didácticos para Principiantes y Juniors:
1. **Claridad Inmediata**: Código fuente conciso (de 4 a 12 líneas) enfocado en un solo concepto a la vez (ej. mutabilidad, scope, tipos primitivos vs referencia, async básico, SELECT/WHERE básico).
2. **Explicación Paso a Paso (`explanation`)**:
   - Por qué la respuesta correcta funciona así.
   - Por qué las otras opciones son trampas comunes en las que suelen caer quienes están aprendiendo.
3. **Consejo Profesional Junior (`proTip`)**:
   - Una regla mnemotécnica o convención de la industria que el junior puede aplicar directamente en su trabajo diario o entrevista.
4. **Distractores Educativos**: Las opciones incorrectas reflejan las confusiones más comunes de juniors (ej. confundir `==` con `===`, no saber que los strings son inmutables, olvidar `await`, etc.) y educan al usuario cuando falla.

---

## 3. Plan de Temarios por Categoría (18+ preguntas nuevas cada una)

1. **Python Junior**:
   - Variables, tipos básicos (`int`, `str`, `list`, `dict`), list comprehensions simples.
   - Slicing de strings y listas (`[::-1]`, `[1:3]`).
   - Diferencia entre `is` y `==`.
   - Manejo de excepciones con `try/except/finally`.
   - Funciones `*args` y `**kwargs`, funciones lambda simples.
   - Scope local vs global y la palabra clave `global`.
   - Métodos comunes de diccionarios (`.get()`, `.keys()`, `.items()`).
   - Virtual environments (`venv`) y `pip requirements.txt`.

2. **PHP Junior**:
   - Variables con `$`, diferencia entre `echo` y `print`.
   - Comparación débil `==` vs estricta `===` y `declare(strict_types=1)`.
   - Arrays asociativos e indexados, funciones `array_map`, `count()`.
   - Clases y POO básica: `public`, `private`, `protected`, constructores.
   - Herencia básica y uso de `parent::__construct()`.
   - Manejo de formularios GET vs POST, sanitización con `htmlspecialchars()`.
   - Composer y autoloading de PSR-4.

3. **JavaScript Junior**:
   - `var`, `let`, `const` y temporal dead zone (TDZ).
   - Coerción de tipos (`"5" + 2` vs `"5" - 2`).
   - Métodos de arrays: `map`, `filter`, `reduce`, `find`, `includes`.
   - Arrow functions vs funciones tradicionales (comportamiento de `this`).
   - Promesas y `async/await` básico: manejo de `.catch()`.
   - Desestructuración de objetos y arrays, operador spread/rest (`...`).
   - Event Bubbling básico en el DOM y `addEventListener`.

4. **TypeScript Junior**:
   - Tipos primitivos (`string`, `number`, `boolean`, `any`, `unknown`, `never`).
   - Interfaces vs Types: sintaxis y cuándo usar cada uno.
   - Propiedades opcionales (`?`) y unión de tipos (`|`).
   - Aserción de tipos (`as string`) y Type Narrowing con `typeof` / `instanceof`.
   - Tipado de funciones (parámetros y retorno).
   - Generics introductorios (`Array<T>`, funciones con `<T>`).
   - Enums vs Union Types de cadenas literales.

5. **React Junior**:
   - Qué es JSX y reglas de tags cerrados / fragmentos (`<>...</>`).
   - Props vs State (`useState`).
   - Reglas de los Hooks (no condicionales, solo en el nivel superior).
   - `useEffect`: array de dependencias (`[]` vs dependencias vs sin array).
   - Renderizado de listas y la importancia de `key` única.
   - Event handling (`onClick={() => handleClick()}`).
   - Formularios controlados vs no controlados (`value` y `onChange`).
   - Levantamiento de estado (Lifting State Up) básico.

6. **SQL Junior**:
   - Cláusulas fundamentales: `SELECT`, `FROM`, `WHERE`, `ORDER BY`, `LIMIT`.
   - Diferencia entre `INNER JOIN` y `LEFT JOIN` con diagramas mentales claros.
   - Funciones de agregación: `COUNT()`, `SUM()`, `AVG()` y la cláusula `GROUP BY`.
   - Diferencia entre `WHERE` y `HAVING`.
   - Claves primarias (`PRIMARY KEY`) vs claves foráneas (`FOREIGN KEY`).
   - Comandos DDL vs DML (`SELECT`, `INSERT`, `UPDATE`, `DELETE` sin WHERE peligroso).
   - Concepto de `NULL` y operadores `IS NULL` / `COALESCE`.

7. **Principios SOLID Junior**:
   - **S (SRP)**: Una clase con una sola responsabilidad (ej. factura no debe enviar emails ni guardar en BD).
   - **O (OCP)**: Código abierto para extensión, cerrado para modificación (usar polimorfismo en vez de if/else infinitos).
   - **L (LSP)**: Una subclase debe poder sustituir a su clase padre sin romper el programa (ej. Cuadrado y Rectángulo).
   - **I (ISP)**: No forzar a una clase a implementar métodos que no usa (interfaces pequeñas).
   - **D (DIP)**: Depender de abstracciones/interfaces, no de clases concretas (inyección de dependencias explicada de forma simple).

8. **Fundamentos & Git Junior**:
   - Comandos básicos: `git init`, `git add`, `git commit -m`, `git status`.
   - Ramas: `git branch`, `git checkout -b` / `git switch -c`, `git merge`.
   - Diferencia entre Git (control de versiones) y GitHub (plataforma de alojamiento).
   - Resolver un conflicto de fusión básico (marcadores `<<<<<<<`, `=======`, `>>>>>>>`).
   - Código HTTP: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error).
   - Verbos HTTP en APIs REST: `GET`, `POST`, `PUT`, `DELETE`.
   - `.gitignore`: por qué no subir `node_modules/` o `.env`.

9. **IA para Programadores Junior**:
   - Prompting eficaz: dar contexto, especificar lenguaje y formato de salida.
   - Alucinaciones de IA: por qué nunca copiar código sin leerlo y probarlo.
   - Seguridad: jamás enviar claves API, contraseñas o datos de clientes a un LLM público.
   - Uso de IA para explicar errores: "Explícame qué significa TypeError: undefined is not a function".
   - Generación de tests unitarios y documentación usando asistentes de código.

---

## 4. Arquitectura de Datos y Estrategia de Implementación

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES SYNCHRONIZATION                    │
└────────────────────────────────────────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│        REACT WEB APPLICATION         │  │        ANDROID APK PROJECT           │
├──────────────────────────────────────┤  ├──────────────────────────────────────┤
│ src/data/questionsData.ts            │  │ app/src/main/assets/questions.json   │
│ src/data/juniorExpandedQuestions.ts  │  │ (337+ preguntas estructuradas        │
│ • Importación tipada modular         │  │  leídas por Room / Assets manager)   │
│ • Componentes UI interactivos        │  │                                      │
│ • Simulador y Estadísticas de test   │  │ src/data/androidProjectCode.ts       │
│                                      │  │ (Espejo en ZIP exportable)           │
└──────────────────────────────────────┘  └──────────────────────────────────────┘
```

### Plan de Archivos a Modificar:
1. **Nuevo Módulo Modular (`src/data/juniorExpandedQuestions.ts`)**:
   - Alberga las 161+ preguntas nuevas para mantener el código limpio y mantenible sin sobrecargar un solo archivo gigante.
2. **Actualización de `src/data/questionsData.ts`**:
   - Importar y unir las nuevas preguntas a `QUESTIONS_DATA`.
3. **Actualización de `app/src/main/assets/questions.json`**:
   - Sincronizar el archivo JSON con las 337+ preguntas totales.
4. **Actualización de `src/data/androidProjectCode.ts`**:
   - Sincronizar el asset `questions.json` dentro del bundle de archivos exportables.
5. **Verificación**:
   - Validar con script de conteo que cada una de las 13 categorías tenga `>= 20` preguntas.
   - Ejecutar `lint_applet` y `compile_applet`.

---

## 5. Criterio de Aceptación y Verificación

1. **Condición de Terminación Estricta**: Cada categoría individual (13 en total) tiene $\ge 20$ preguntas verificadas por script.
2. **Nivel Junior Asegurado**: Las nuevas preguntas cuentan con código claro, explicaciones didácticas paso a paso y consejos prácticos.
3. **Distribución Balanceada**: Presencia equilibrada de bugs novatos, sintaxis y preguntas de entrevistas iniciales.
4. **Cero Errores de Tipado o Compilación**: El proyecto compila sin errores (`tsc --noEmit` y `npm run build` exitosos).
