# Rediseño Integral de UI/UX: Soporte de Safe-Area, Ergonomía Móvil y Estética Minimalista Moderna

Plan arquitectónico y visual para transformar la experiencia de usuario de DevQuiz, eliminando el apiñamiento de la barra superior en dispositivos reales y notch/isla dinámica, implementando la disciplina **Zero-Pill** de `frontend-design`, adoptando una paleta **Minimalista Moderna con Grafito Neutro y Esmeralda de Precisión**, y estableciendo una jerarquía de acciones nítida y accesible.

## Decisiones Críticas Confirmadas

> [!IMPORTANT]
> - **Espaciado Superior & Safe-Area**: Margen generoso con soporte nativo de `env(safe-area-inset-top)` y elevación de barra superior de al menos 54px para garantizar que la isla dinámica o cámara frontal nunca toque los controles de navegación.
> - **Identidad Estética y Paleta**: *Minimalista moderno con grafito neutro y esmeralda de precisión*. Adiós al morado de IA genérico y los gradientes de neón chillones; hola a superficies profundas de grafito (`#0B0F17`, `#111827`, `#1E293B`) y acentos de esmeralda de alta precisión (`#10B981`, `#059669`).
> - **Disciplina Zero-Pill & Jerarquía de Acciones**: Metadatos limpios en texto continuo con separadores tipográficos (`·`), eliminando cápsulas flotantes decorativas. Botón `Siguiente` como acción primaria de alto contraste y `Tutor IA` como acción secundaria en cristal/borde suave.

---

## 1. Visión General y Diagnóstico del Problema

### El Diagnóstico Visual
En el estado actual (evidenciado en la captura del usuario):
1. **Colisión de Cabecera**: La barra de navegación (`X` y `1 / 20`) se encuentra a apenas 40px del borde físico, quedando pegada y comprimida debajo de la Isla Dinámica / notch.
2. **Cliché de Píldoras ("Pill Sandwich")**: Dos badges cápsula saturados (`[IA PARA PROGRAMADORES]` `[MID]`) encima del título saturan la vista y violan la constitución de diseño.
3. **Conflicto de CTAs**: Dos botones violetas de igual peso visual compiten por la atención al pie de la pantalla, empujados contra la barra de gestos de inicio.

```
ESTADO ANTERIOR (APIÑADO & CLICHÉ)                NUEVO DISEÑO (ESPACIOSO & EDITORIAL)
┌──────────────────────────────────────┐          ┌──────────────────────────────────────┐
│  09:41      ( [·] )              5G  │          │  09:41           ( [·] )         5G  │
│  [X]                         1 / 20  │ ◄ PEGA   │                                      │ ◄ SAFE ZONE
│  ══════════════════════════════════  │          │  [✕] Salir                   1 de 20 │
│  [ IA PROG ] [ MID ]                 │ ◄ PILLS  │  ─────────────────────────────────── │
│  ¿Qué es un Package Hallucination... │          │  IA para Programadores · Nivel Medio │ ◄ ZERO-PILL
│                                      │          │  ¿Qué es un Package Hallucination... │
│  ┌────────────────────────────────┐  │          │                                      │
│  │ A  Opción...                   │  │          │  ┌────────────────────────────────┐  │
│  └────────────────────────────────┘  │          │  │ A  Opción legible              │  │
│                                      │          │  └────────────────────────────────┘  │
│  [✨ Tutor IA]      [Siguiente →]     │ ◄ CLASH  │                                      │
│                 ──                   │ ◄ BARRA  │  [✨ Tutor IA]     [ Siguiente → ]   │ ◄ JERARQUÍA
└──────────────────────────────────────┘          │                 ──                   │ ◄ PB-SAFE
                                                  └──────────────────────────────────────┘
```

---

## 2. Sistema de Diseño y Ficha de Estilo

### A. Paleta de Color (Minimalista Grafito & Esmeralda)
- **60% Lienzo Neutro Dominante**:
  - `Canvas Base`: `#090D16` (obsidiana fría con tinte pizarra profundo).
  - `Surface 1 (Contenedores)`: `#0F172A` / `#111827`.
  - `Surface 2 (Tarjetas & Opciones)`: `#1E293B` con bordes sutiles en `rgba(255,255,255,0.06)`.
- **30% Estructura y Tipografía**:
  - `Texto Principal`: `#F8FAFC` (blanco neutro suavizado, sin deslumbramiento).
  - `Texto Secundario`: `#94A3B8` (slate neutro legible, contraste WCAG AA 6:1).
  - `Bordes y Separadores`: `rgba(148, 163, 184, 0.12)`.
- **10% Acento de Precisión**:
  - `Acento Primario`: `#10B981` (esmeralda de precisión técnica).
  - `Acento Hover/Active`: `#059669`.
  - `Semántica de Acierto`: Fondo verde tintado al 10% con borde esmeralda.
  - `Semántica de Error`: `#F43F5E` (rosa carmín para fallos) con borde sutil.

### B. Tipografía y Jerarquía
- **Metadatos Limpios**:
  - Texto en `12px` (`text-xs`), tracking sutil, separado por punto medio `·`. Sin fondos de píldora ni bordes innecesarios.
- **Títulos y Enunciados**:
  - Tipografía equilibrada con `text-wrap: balance`, peso `font-semibold` o `font-bold`, y `line-height: 1.4`.
- **Bloque de Código**:
  - Contenedor con fondo `#070A10`, sintaxis contrastada y tipografía monospace (`JetBrains Mono` / `font-mono tabular-nums`).

---

## 3. Ergonomía Móvil y Distribución de Zonas

### A. Zona Superior (Hard Reach / Info)
- **Altura de Cabecera**: Incrementada a `56px` + margen de safe-area nativo (`pt-safe` / `env(safe-area-inset-top)`).
- **Control de Salida**: Botón de cerrar con área de toque táctil mínima de **44x44px** para evitar toques fallidos.
- **Contador de Progreso**: Indicador `1 de 20` claro con barra de progreso esmeralda de 2px de altura.

### B. Zona Media (Stretch Zone / Contenido)
- **Opciones de Respuesta**:
  - Tarjetas de opción con altura mínima de **48px**.
  - Identificador de letra (`A`, `B`, `C`, `D`) integrado con tipografía sólida en lugar de círculo recargado.
  - Micro-interacción de toque con `active:scale-[0.99]` y transición suave $\le 150\text{ms}$.

### C. Zona Inferior (Natural Thumb Reach / Acciones)
- **Acción Primaria**: Botón `Siguiente` ocupa el rol protagónico con fondo esmeralda sólido (`bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold`).
- **Acción Secundaria**: Botón `Tutor IA` con superficie de cristal translúcido (`bg-slate-800/60 hover:bg-slate-800 text-slate-200 border border-slate-700/60`).
- **Separación Inferior**: Espacio de resguardo de 24px (`pb-6` / `pb-safe`) por encima de la barra de gestos.

---

## 4. Diagrama de Arquitectura de Componentes

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PHONE SIMULATOR CONTAINER                       │
│  [Hardware Shell] -> [Safe-Area Inset Adapter]                         │
└────────────────────────────────────────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│        QUIZ TOP BAR & PROGRESS       │  │          QUIZ CONTENT FEED           │
├──────────────────────────────────────┤  ├──────────────────────────────────────┤
│ • Status Bar: Generous 48-56px       │  │ • Zero-Pill Typography Kicker        │
│ • Island Clearance: 16px bottom gap  │  │ • Balanced Question Title            │
│ • Close Hitbox: 44x44px touch area   │  │ • High-Contrast Code Syntax Box      │
│ • Precision Linear Emerald Progress  │  │ • 48px Touch-Target Options List     │
└──────────────────────────────────────┘  └──────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      THUMB-ZONE ACTION CONTROLS                        │
├────────────────────────────────────────────────────────────────────────┤
│ • Feedback Panel: Success Emerald / Error Rose with structured advice  │
│ • Action Grid: [Tutor IA (Secondary Glass)] + [Siguiente (Primary CTA)]│
│ • Home Indicator Safety Buffer: 20px padding clearance                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Plan de Ejecución y Archivos a Modificar

1. **`src/index.css`**:
   - Añadir utilidades de safe area (`pt-safe`, `pb-safe`) y suavizado tipográfico optimizado.
2. **`src/components/PhoneSimulator.tsx`**:
   - Rediseñar el marco del teléfono: ajustar el notch / dynamic island y otorgar margen superior generoso de 56px.
   - Refactorizar la cabecera del Quiz: botón de cerrar accesible (44x44px), indicador textual y barra de progreso.
   - Aplicar disciplina Zero-Pill a los metadatos de categoría y nivel.
   - Rediseñar las opciones de respuesta y la barra inferior de botones con la nueva jerarquía.
   - Actualizar la paleta de colores global a grafito y esmeralda.
3. **`src/App.tsx`**:
   - Actualizar la pantalla de Quiz de la vista principal y web responsiva para compartir las mismas mejoras de espaciado, Zero-Pill y botones.
4. **`app/src/main/java/com/devquiz/app/presentation/quiz/QuizScreen.kt`**:
   - Asegurar que el TopAppBar nativo de Android en Compose respete los `WindowInsets.statusBars` y padding de barras de navegación para que el APK en dispositivos físicos reales tampoco sufra recortes.
5. **Verificación y Compilación**:
   - Ejecutar `lint_applet` y `compile_applet` para garantizar cero regresiones.
