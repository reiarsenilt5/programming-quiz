# Plan de Implementación: Sesión y Registro de "Reintentar Fallidos" (Repaso de Errores con Tutor de IA)

Diseño y arquitectura para la nueva sesión de **Reintentar Fallidos**, que registra de forma persistente cada pregunta respondida incorrectamente por el usuario, expone el escenario exacto del error (qué opción eligió y por qué falló), permite resolverlas interactivamente eliminándolas al acertar, y habilita el Tutor de IA para asegurar el aprendizaje profundo tanto en la versión Web como en la aplicación nativa de Android (Kotlin/Jetpack Compose).

---

### Decisiones Críticas Confirmadas

> [!IMPORTANT]
> **Decisiones confirmadas con el usuario en Fase 1:**
> - **Ubicación de Acceso**: Integrado como un **nuevo Modo de Juego en Inicio** (con contador en vivo de fallos pendientes) y con acceso detallado en la pestaña de **Estadísticas**.
> - **Comportamiento al Acertar**: Al reintentar la pregunta y responderla correctamente, se **elimina automáticamente de la lista de fallos** con retroalimentación visual de superación (*«¡Concepto Dominado!»*).
> - **Presentación del Escenario**: **Modo interactivo completo** que muestra la pregunta, la opción fallada por el usuario (en rojo), la opción correcta (en verde), la explicación técnica paso a paso y el botón del **Tutor de IA (Gemini)** para consultar cualquier duda.

---

## 1. Visión General y Flujo de Usuario

### El Problema Pedagógico
Hasta ahora, cuando el usuario fallaba una pregunta, veía la retroalimentación breve en el momento, pero al avanzar o terminar el quiz no existía una sesión dedicada que conservara el histórico de errores acumulados. Esto impedía un ciclo de aprendizaje iterativo (repasar específicamente las debilidades técnicas).

### La Solución: Sesión "Repaso de Errores"
1. **Registro Automático Silencioso**: Cada vez que el usuario comete un error en cualquier modo (Práctica, Blitz 60s, Reto Diario), la pregunta y la opción seleccionada se registran de inmediato en el almacenamiento local persistente (`localStorage` en Web / `SharedPreferences` en Android).
2. **Acceso Claro e Indicador Dinámico**:
   - En **Inicio**, la tarjeta de Modos de Juego suma el modo **Reintentar Fallos** con un contador dinámico (ejemplo: *«3 pendientes»* o *«¡Al día! 0 fallos»*).
   - En **Estadísticas**, se muestra el bloque de **Banco de Errores** con la lista de preguntas falladas organizadas por tecnología y botón para iniciar el repaso.
   - En **Resultados**, si el examen tuvo errores, un botón directo invita a *«Repasar Fallos de este Examen»*.
3. **Escenario de Aprendizaje Interactivo**:
   - Al abrir una pregunta fallada, el usuario ve el contexto completo:
     - Bloque de código y enunciado.
     - Indicador visual: qué respondió erróneamente en el intento anterior.
     - Opciones interactivas para responder nuevamente.
     - Si acierta: animación de éxito, eliminación inmediata de la lista de fallos y actualización del contador.
     - Si vuelve a fallar o solicita ayuda: tarjeta explicativa detallada + botón **Tutor de IA (Gemini)** para una explicación didáctica en 3 secciones.

---

## 2. Experiencia de Usuario y Diseño Visual

### A. Nueva Tarjeta de Modo en Pantalla de Inicio
* **Título**: `Reintentar`
* **Subtítulo Dinámico**: Si hay fallos: `X por corregir` (en color ámbar/rosa); si no hay fallos: `0 pendientes` (en color esmeralda).
* **Iconografía**: Icono circular de reintento (`RotateCcw` / `Target` / `RefreshCw`) con contenedor estilizado.

### B. Sección "Banco de Errores" en Pantalla de Estadísticas
* Card con lista desplegable de todas las preguntas falladas pendientes de dominar:
  - Etiqueta de tecnología (`Python`, `Docker`, `SQL`, etc.).
  - Título resumido de la pregunta.
  - Indicador de tu selección fallida vs respuesta correcta.
  - Botón principal de acción: `Iniciar Sesión de Repaso (X preguntas)`.
  - Botón secundario para limpiar o reiniciar el historial de fallos si el usuario lo desea.

### C. Pantalla de Quiz en Modo Repaso de Errores
* **Banner Superior**: `⚠️ Repasando Pregunta Fallada` con chip de dificultad y tecnología.
* **Marcado Didáctico**: Destaca la opción que el usuario marcó erróneamente en el pasado para que analice la trampa conceptual antes de responder.
* **Al Acertar**: Toast/Banner verde: `🎉 ¡Excelente! Pregunta dominada y retirada de tu lista de fallos`.
* **Botón Tutor de IA**: Destacado en púrpura para consultar a Gemini en caso de duda residual.

---

## 3. Arquitectura Técnica y Estrategia de Datos

```
┌────────────────────────────────────────────────────────┐
│               Flujo del Banco de Errores               │
└───────────────────────────┬────────────────────────────┘
                            │
            Cualquier Quiz (Práctica / Blitz / Diario)
                            │
               ¿Respuesta Incorrecta?
                            ▼
      ┌───────────────────────────────────────────┐
      │  FailedQuestionsManager (Persistencia)    │
      │  - Guarda: questionId, wrongOptionIndex,  │
      │    timestamp, failCount                   │
      └─────────────────────┬─────────────────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
      Inicio (Badge "3 fallos")    Estadísticas (Lista de errores)
               │                         │
               └────────────┬────────────┘
                            │
               Click: "Reintentar Fallos"
                            ▼
      ┌───────────────────────────────────────────┐
      │  ReviewQuizSession                        │
      │  - Carga solo las preguntas falladas      │
      │  - Muestra el escenario del error         │
      │  - Integra Tutor de IA (Gemini)           │
      │                                           │
      │  ¿Acertó al reintentar?                   │
      │    SI ➔ Elimina de FailedQuestionsManager │
      │    NO ➔ Mantiene en lista + Tutor de IA   │
      └───────────────────────────────────────────┘
```

### Modelo de Datos (`FailedQuestionRecord`)
```typescript
export interface FailedQuestionRecord {
  questionId: string;
  selectedOptionIndex: number;
  timestamp: number;
  failCount: number;
}
```

---

## 4. Plan de Implementación de Archivos

### Fase 1: Capa Web (React / TypeScript)
1. **Tipos & Persistencia (`src/types/quiz.ts` y `src/App.tsx`)**:
   - Añadir `FailedQuestionRecord` a `src/types/quiz.ts`.
   - Implementar `failedQuestions` en el estado de `App.tsx` sincronizado con `localStorage.getItem('devquiz_failed_questions')`.
   - Modificar `handleConfirmAnswer()`: si `!isCorrect`, guardar la pregunta en `failedQuestions`; si ya existía, incrementar `failCount`.
2. **Modo de Juego 'failed_review' en Inicio**:
   - Añadir la 4ta tarjeta en la sección `Modos de Juego`:
     - Título: *«Reintentar»*, subtítulo: *«{failedCount} pendientes»*.
     - Al hacer clic, lanza el quiz filtrando únicamente las preguntas de `failedQuestions`.
3. **Sección en Pestaña de Estadísticas**:
   - Renderizar el bloque *«Banco de Errores Pendientes»* con desglose de preguntas falladas y botón *«Iniciar Repaso de Errores»*.
4. **Lógica de Éxito en Reintento**:
   - Si `selectedMode === 'failed_review'` y el usuario acierta la pregunta, removerla de `failedQuestions` y mostrar el banner verde *«¡Concepto Dominado!»*.

### Fase 2: Capa Nativa Android (Kotlin & Jetpack Compose)
1. **`FailedQuestionsManager.kt`**:
   - Módulo en `app/src/main/java/com/devquiz/app/data/FailedQuestionsManager.kt` para almacenar en `SharedPreferences` la lista de preguntas falladas como JSON serializado.
2. **`QuizViewModel.kt`**:
   - Registrar fallos al confirmar respuestas incorrectas.
   - Nuevo método `loadFailedQuestionsReview()` que filtra las preguntas de la base local según los IDs fallados.
   - Eliminar de la lista de fallos cuando el usuario acierte una pregunta en modo revisión.
3. **`HomeScreen.kt` / `MainScreen`**:
   - Añadir tarjeta de *«Reintentar Fallidos»* en `Modos de Juego` con contador dinámico en tiempo real.
4. **`StatsScreen.kt`**:
   - Añadir card del *«Banco de Fallos Técnicos»* con lista de preguntas falladas y botón para iniciar el repaso interactivo.
5. **Sincronización de `androidProjectCode.ts`**:
   - Actualizar el repositorio de archivos Android descargables en ZIP y visibles en el explorador de código.

---

## 5. Verificación y Criterios de Aceptación
* [ ] Las respuestas incorrectas se guardan de forma persistente y no se pierden al recargar la app o cerrar el móvil.
* [ ] La tarjeta de "Reintentar" aparece visible en los Modos de Juego con el contador de preguntas pendientes.
* [ ] En Estadísticas se puede ver el historial de las preguntas en las que falló el usuario.
* [ ] Al iniciar la sesión de repaso, el usuario puede ver su opción fallada anterior, responder interactivamente y pedir ayuda al Tutor de IA.
* [ ] Al acertar una pregunta en la sesión de repaso, se elimina automáticamente de la lista de fallos.
* [ ] Todo el código compila y pasa validación de tipos sin advertencias ni errores.
