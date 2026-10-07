# Plan de Implementación: Barra de Navegación Inferior, Tema Oscuro y Tutor de IA con Gemini en Dispositivo Físico

Plan arquitectónico integral para corregir la ausencia de la barra de navegación inferior en el APK de Android, homogeneizar el diseño con el modo oscuro de la demo web, e integrar el Tutor de IA (Gemini) en el dispositivo físico con soporte dual para API Key (en pantalla de Ajustes y en compilación CI/CD) y retroalimentación visual de errores de red o cuota.

---

### Decisiones Críticas Confirmadas

> [!IMPORTANT]
> **Decisiones confirmadas con el usuario en Fase 1:**
> - **Clave de Gemini API**: Configurable de forma dual: directamente en la nueva pantalla de **Ajustes** de la app instalada (almacenada en `SharedPreferences` local) y mediante variable de compilación `GEMINI_API_KEY` en Gradle / GitHub Actions Secrets para generar el APK preconfigurado.
> - **Estilo Visual**: **Modo Oscuro Permanente** idéntico al de la demo web (`#090D16` / `#0F172A`), con colores de superficie oscuros, acentos índigo/púrpura y tipografía contrastante sin depender del tema claro u oscuro del sistema del teléfono.
> - **Pestaña Blitz 60s en Navegación**: Inicia directamente la partida rápida contrarreloj de 60 segundos con temporizador activo y preguntas aleatorias de alta velocidad.

---

## 1. Visión General y Diagnóstico del Problema

### Causa Raíz Identificada en el Dispositivo Físico
1. **Ausencia de NavigationBar en Android Compose**: El archivo `HomeScreen.kt` tenía un `Scaffold` con únicamente `topBar` y `LazyColumn`, omitiendo el parámetro `bottomBar`. Por eso, en la pantalla del móvil físico (Captura 2), la lista de categorías se extiende hasta el borde inferior sin mostrar los botones de Inicio, Blitz 60s, Estadísticas y Ajustes.
2. **Inconsistencia de Tema (Fondo Blanco)**: En `MainActivity.kt` se utilizaba el `MaterialTheme` predeterminado sin un esquema de color oscuro forzado (`darkColorScheme`), por lo que en teléfonos configurados con tema claro del sistema se mostraba con fondo blanco y tarjetas grises descoloridas en lugar de la estética cyberpunk/moderna de la demo.
3. **Fallo Silencioso del Tutor de IA**:
   - `BuildConfig.GEMINI_API_KEY` tenía por defecto `"YOUR_GEMINI_KEY_HERE"`. Al invocar a Gemini sin una clave válida, la llamada arrojaba una excepción.
   - En `QuizScreen.kt`, el diálogo de IA se abría únicamente con la condición `if (state.aiExplanationText != null || state.isAiLoading)`. Cuando ocurría una excepción, `isAiLoading` pasaba a `false` y `aiError` se llenaba, pero el diálogo **nunca se mostraba**, generando la sensación de que el botón no respondía.
   - No existía una pantalla en la app para que el usuario pudiera escribir o pegar su clave de Gemini API sin recompilar el código.

---

## 2. Experiencia de Usuario y Diseño Visual

### A. Paleta de Color y Tema Oscuro Forzado (Jetpack Compose & Web)
* **Background Canvas**: `#090D16` (Deep Space Navy).
* **Surface Containers**: `#0F172A` (Slate 900) con bordes suaves `#1E293B` (Slate 800).
* **Primary Accent**: `#6366F1` (Indigo 500) y gradientes púrpura `#8B5CF6`.
* **Secondary / Blitz**: `#F43F5E` (Rose 500) para modos contrarreloj.
* **Success / Streak**: `#10B981` (Emerald 500) y `#F59E0B` (Amber 500) para rachas de días.
* **Text Hierarchy**: Blanco de alto contraste `#F8FAFC` para titulares y `#94A3B8` para subtítulos y metadatos.

### B. Barra de Navegación Inferior (`NavigationBar`)
* Cuatro destinos ergonómicos con altura estándar de 64dp y respeto de `navigationBarsPadding()` para no colisionar con los botones del sistema de Android:
  1. **Inicio** (`Icons.Default.Home`): Vista principal con banner de racha, modos de juego y las categorías técnicas con badges temáticos.
  2. **Blitz 60s** (`Icons.Default.Bolt` o `Timer`): Lanza de forma instantánea una sesión de 60 segundos con cuenta regresiva en vivo.
  3. **Estadísticas** (`Icons.Default.BarChart`): Métricas de precisión, total de preguntas respondidas, racha actual y porcentaje de dominio por categoría técnica.
  4. **Ajustes** (`Icons.Default.Settings`): Gestión de clave Gemini API (con enlace a Google AI Studio para obtenerla gratis), indicador de conectividad y estado del modelo.

### C. Experiencia del Tutor de IA y Retroalimentación Visual
* **Botón en QuizScreen**: Destacado con icono de chispas `✨ Tutor de IA` disponible tras responder la pregunta.
* **Modal / BottomSheet con Estados Visuales Claros**:
  - **Estado Cargando**: Indicador de progreso circular con mensaje *"Analizando la pregunta con Gemini 1.5 Flash..."*.
  - **Estado Exitoso**: Tarjeta estructurada en tres secciones limpias: *1. ¿Por qué es la opción correcta?*, *2. Trampa común / Error frecuente*, *3. Pro-Tip de entrevista técnica*.
  - **Estado de Error Visual (Sin Fallo Silencioso)**:
    - Si no hay conexión o falla la red: Alerta visual roja/ámbar *"Sin conexión a internet. Revisa tu red Wi-Fi o datos móviles"*, con botón `Reintentar`.
    - Si la clave no está configurada o es inválida: Alerta informativa *"Clave de Gemini API no configurada o expirada"*, con un botón directo `Configurar Clave en Ajustes` o campo rápido para pegarla en el momento.

---

## 3. Decisiones de Producto y Arquitectura Técnica

### Decisión 1: Almacenamiento y Prioridad de la Clave Gemini (Dual Strategy)
* **Enfoque**: `ApiKeyRepository` basado en `SharedPreferences` de Android con fallback a `BuildConfig.GEMINI_API_KEY`.
* **Prioridad**:
  1. Si el usuario ingresó una clave en la pantalla de **Ajustes**, se usa esa clave guardada en el dispositivo.
  2. Si no hay clave en Ajustes, se utiliza la clave inyectada en tiempo de compilación (`BuildConfig.GEMINI_API_KEY`).
  3. Si ninguna existe o es la cadena por defecto `"YOUR_GEMINI_KEY_HERE"`, la app no se cuelga; muestra amigablemente el aviso para ingresarla.

### Decisión 2: Scaffold Unificado y Navegación de Estados
* En lugar de múltiples actividades complejas, se estructura `MainScreen` en Compose con un `Scaffold` que aloja la `NavigationBar` persistentemente en la pantalla raíz, intercambiando el contenido según la pestaña seleccionada (`Home`, `Stats`, `Settings`).
* Al pulsar `Blitz 60s`, se conmuta el flujo al examen en modo `TimeTrial`.

```
┌────────────────────────────────────────────────────────┐
│                      MainActivity                      │
└───────────────────────────┬────────────────────────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
      ¿En Quiz o Resultado?        ¿En Navegación Principal?
               │                         │
     ┌─────────┴─────────┐               ▼
     │  QuizScreen       │       ┌───────────────────────┐
     │  - Pregunta/Timer │       │ Scaffold              │
     │  - Tutor IA Modal │       │ - TopAppBar           │
     │  ResultScreen     │       │ - Content Switcher    │
     └───────────────────┘       │   ├── HomeScreen      │
                                 │   ├── StatsScreen     │
                                 │   └── SettingsScreen  │
                                 │ - NavigationBar       │
                                 │   (Inicio/Blitz/Stats/│
                                 │    Ajustes)           │
                                 └───────────────────────┘
```

---

## 4. Plan de Modificaciones de Código

### Paso 1: Módulo de Configuración y Clave API en Android
* Crear `ApiKeyManager.kt` para lectura/escritura en `SharedPreferences`.
* Actualizar `QuizViewModel.kt` para:
  - Instanciar dinámicamente `GenerativeModel` con la clave activa (de Ajustes o BuildConfig).
  - Manejar excepciones de red (`IOException`, `UnknownHostException`, `ServerException`) y emitir mensajes de error localizados y claros.

### Paso 2: Nuevas Pantallas y Componentes en Compose
* **`SettingsScreen.kt`**:
  - Campo de texto seguro para ingresar la clave Gemini (`AIzaSy...`).
  - Botón "Guardar Clave" con confirmación visual.
  - Indicador de estado: Clave configurada / Clave pendiente.
  - Guía explicativa con enlace a Google AI Studio (`aistudio.google.com/apikey`).
  - Información de versión y repositorio.
* **`StatsScreen.kt`**:
  - Resumen de partidas, porcentaje de aciertos global y desglose por cada una de las tecnologías.
* **Actualización de `HomeScreen.kt`**:
  - Integrar la barra de navegación inferior con Material 3 `NavigationBar` y `NavigationBarItem`.
  - Aplicar tema oscuro consistente con la demo.

### Paso 3: Corrección en `QuizScreen.kt` para el Tutor de IA
* Modificar el diálogo/hoja de Tutor IA para que soporte los tres estados: Carga, Éxito y **Error Visual**.
* Si hay error, mostrar tarjeta roja con icono de advertencia, descripción comprensible y botón de reintento.

### Paso 4: Sincronización en Simulador Web y Guía CI/CD
* Actualizar `src/data/androidProjectCode.ts` para que el código Kotlin exportable refleje exactamente estos cambios.
* Actualizar `src/components/CiCdGuide.tsx` indicando claramente dónde y cómo configurar el secret `GEMINI_API_KEY` en el repositorio de GitHub para que el APK generado por GitHub Actions ya incluya la clave.

---

## 5. Verificación y Criterios de Aceptación
* [ ] La barra inferior (Inicio, Blitz 60s, Estadísticas, Ajustes) está visible en el dispositivo físico con navegación fluida.
* [ ] La interfaz utiliza el modo oscuro nativo idéntico al de la demo web.
* [ ] La pantalla de Ajustes permite ingresar y guardar la clave de Gemini API sin necesidad de recompilar la app.
* [ ] El Tutor de IA responde de forma interactiva en la app nativa y, si no hay clave o falla la conexión, muestra un mensaje de error visual amigable sin crashear.
* [ ] La compilación y linteo se ejecutan limpiamente.
