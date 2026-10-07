# Plan de Resolución Definitiva: Compilación y Descarga de APK en GitHub Actions CI

Plan exhaustivo para diagnosticar, corregir y blindar el pipeline de integración continua (CI) en GitHub Actions para el repositorio `programming-quiz`, garantizando la compilación limpia del APK Android en Kotlin/Jetpack Compose y su distribución automática mediante GitHub Releases y Artifacts.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Decisiones confirmadas a través del proceso interactivo de aclaración:
> - **Entrega del APK**: Se generará tanto como artefacto descargable en **GitHub Actions** como en una **GitHub Release automática** con enlace directo para descarga en móvil.
> - **Gestión de IA en la app**: Modo híbrido y resiliente. La aplicación funciona 100% offline con el banco de preguntas local (`questions.json`) y activa explicaciones avanzadas si se provee la clave de Gemini (sin bloquear la ejecución si la clave no está configurada).
> - **Disparadores de compilación**: El workflow se ejecutará automáticamente en cada `push` a la rama `main` y bajo demanda mediante el botón manual `workflow_dispatch` ("Run workflow").

---

### 1. Overview & Core Concept

- **Problema**: Las ejecuciones de CI en GitHub Actions fallaban durante la tarea Gradle `assembleDebug` debido a errores acumulados en el código fuente de Kotlin (dependencias de Room huérfanas, llamadas incorrectas a la API de Jetpack Compose Material3, métodos de delegación de ViewModel) y a la ausencia de los ejecutables del Gradle Wrapper en el repositorio.
- **Objetivo**: Garantizar que el runner de GitHub Actions compile el APK (`app-debug.apk`) de manera determinista y confiable en menos de 3 minutos, publicándolo inmediatamente para que el usuario pueda descargarlo e instalarlo en su dispositivo móvil.
- **Público Objetivo**: Desarrolladores y estudiantes que desean practicar preguntas técnicas de programación (SOLID, SQL, Arquitectura, Backend, Kotlin, etc.) en una aplicación móvil nativa Android fluida.

---

### 2. Diagnóstico de Errores Identificados en CI

A partir del análisis de los registros de ejecución en GitHub Actions (`job/113003807536` y anteriores) y la inspección del árbol de código:

1. **Gradle Wrapper ausente en el repositorio Git**:
   - *Causa*: Los scripts `gradlew`, `gradlew.bat` y el binario `gradle-wrapper.jar` no estaban incluidos o carecían de permisos de ejecución en el entorno Linux del runner.
   - *Solución*: Se han incorporado los archivos oficiales del Gradle Wrapper 8.6 y se aseguró el paso `chmod +x ./gradlew` en el workflow.

2. **Imports no resueltos de Room (`Unresolved reference: room`)**:
   - *Causa*: Los archivos `QuestionDao.kt` y `QuestionEntity.kt` importaban anotaciones de `androidx.room.*`, pero Room y KSP no estaban configurados en Gradle (la app carga sus preguntas desde `assets/questions.json`).
   - *Solución*: Eliminación definitiva de los archivos de DAO/Entity obsoletos para erradicar errores de compilación estática.

3. **Incompatibilidad de firmas en Jetpack Compose Material 3**:
   - *Causa*: En `QuizScreen.kt`, `LinearProgressIndicator` utilizaba un lambda `{ state.progress }` en lugar del valor directo `state.progress: Float`, lo que causaba un fallo de resolución de tipos en Kotlin 1.9+.
   - *Solución*: Actualizado a `progress = state.progress`.

4. **Falta de biblioteca Material Icons Extended**:
   - *Causa*: `HomeScreen.kt` y `ResultScreen.kt` utilizan iconos como `School`, `Quiz` y `CheckCircle` que residen en `material-icons-extended`.
   - *Solución*: Inclusión explícita de `libs.androidx.material.icons.extended` en las dependencias de `app/build.gradle.kts`.

5. **Delegado `by viewModels()` sin `activity-ktx`**:
   - *Causa*: `MainActivity.kt` utilizaba el delegado de conveniencia de Fragment/Activity KTX sin esa dependencia declarada.
   - *Solución*: Inicialización mediante `by lazy { QuizViewModel(application) }`, completamente nativa y sin dependencias externas adicionales.

6. **Modelo Gemini y tolerancia a fallos offline**:
   - *Causa*: Llamada a un identificador no compatible con el SDK móvil de Generative AI y ausencia de manejo ante clave vacía.
   - *Solución*: Actualización a `gemini-1.5-flash` con inicialización segura que no interrumpe el quiz si no hay conexión o API Key.

---

### 3. Pipeline de CI & Distribución del APK

Configuración del flujo de automatización en `.github/workflows/build-apk.yml`:

```
┌────────────────────────────────────────────────────────┐
│             Disparador: push (main) o manual           │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  Runner: ubuntu-latest con JDK 17 (Eclipse Temurin)    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│       Configurar Gradle & Permisos de gradlew          │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│     Compilación: ./gradlew assembleDebug --no-daemon   │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│  Upload GitHub Artifact   │ │  Crear GitHub Release     │
│   (DevQuiz-APK-Debug)     │ │   con APK adjunto         │
└───────────────────────────┘ └───────────────────────────┘
```

#### Acciones de Distribución:
1. **GitHub Actions Artifacts**:
   - Nombre: `DevQuiz-APK-Debug`
   - Archivo: `app/build/outputs/apk/debug/app-debug.apk`
   - Retención: 30 días
2. **GitHub Release Automática**:
   - Acción: `softprops/action-gh-release@v2`
   - Tag automático: `v1.0.${{ github.run_number }}`
   - Nombre de la Release: `DevQuiz APK Build #${{ github.run_number }}`
   - Archivo adjunto directo: `DevQuiz-v1.0.${{ github.run_number }}-debug.apk`

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                     DevQuiz Android Module                      │
│                                                                 │
│   ┌────────────────────┐          ┌─────────────────────────┐   │
│   │ assets/            │          │ Gradle Build System     │   │
│   │ questions.json     │          │ - Kotlin 1.9.22         │   │
│   │ (9 categorías)     │          │ - Android SDK 34        │   │
│   └─────────┬──────────┘          │ - Jetpack Compose M3    │   │
│             │                     └─────────────────────────┘   │
│             ▼                                                   │
│   ┌────────────────────┐          ┌─────────────────────────┐   │
│   │ QuizViewModel      │◄─────────┤ MainActivity            │   │
│   │ - StateFlow        │          │ - Single Activity       │   │
│   │ - Timer 30s        │          │ - Theme Provider        │   │
│   │ - Gemini Fallback  │          └────────────┬────────────┘   │
│   └─────────┬──────────┘                       │                │
│             │                                  │                │
│             ▼                                  ▼                │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ Compose Screens: HomeScreen -> QuizScreen -> ResultUI   │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

#### Categorías integradas en `questions.json`:
1. `solid` - Principios SOLID de diseño de software.
2. `sql` - SQL relacional, índices, ACID y optimización.
3. `fundamentals` - Fundamentos de desarrollo y programación.
4. `backend` - Arquitectura de servidores, APIs y concurrencia.
5. `clean-code` - Código limpio, refactorización y testing.
6. `design-patterns` - Patrones de diseño GoF y arquitecturales.
7. `devops` - CI/CD, Docker y despliegue.
8. `security` - Seguridad web, autenticación y OWASP.
9. `cloud` - Cloud computing y servicios distribuidos.

---

### 5. Pasos de Ejecución tras Aprobación

1. **Ajuste del Workflow `.github/workflows/build-apk.yml`**:
   - Incluir el paso de creación de GitHub Release automática con permisos `contents: write`.
   - Renombrar y copiar el APK compilado con el número de build para fácil identificación.
2. **Verificación de archivos y dependencias**:
   - Confirmar la presencia de `gradlew`, `gradlew.bat` y `gradle/wrapper/gradle-wrapper.jar`.
   - Validar la sintaxis de `app/build.gradle.kts` y `libs.versions.toml`.
3. **Instrucciones de commit y descarga**:
   - Proporcionar las instrucciones claras para que el usuario sincronice los cambios a GitHub y descargue el APK directamente desde la Release o desde Artifacts.
