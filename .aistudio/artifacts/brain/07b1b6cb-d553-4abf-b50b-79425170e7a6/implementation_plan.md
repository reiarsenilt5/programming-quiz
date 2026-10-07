# Plan de Implementación: Top 100 Preguntas de Entrevistas Técnicas Senior 2026 (2 Nuevos Quizzes)

Plan estructurado para diseñar, categorizar e integrar **100 preguntas avanzadas de entrevistas técnicas senior** organizadas en dos nuevos quizzes especializados de 50 preguntas cada uno, cubriendo escenarios reales de producción, depuración de código crítico y decisiones de arquitectura, con sincronización total entre la versión Web (React/TypeScript) y la aplicación móvil Android (Kotlin/Jetpack Compose).

---

## 1. Visión y Objetivos de los 2 Nuevos Quizzes

### Quiz 1: Fullstack Senior 2026 (`senior_fullstack`)
* **Nombre mostrado**: *Fullstack Senior 2026 (React, Python, Laravel & SQL)*
* **Volumen**: 50 preguntas exclusivas y de alta dificultad.
* **Núcleo temático**:
  1. **React 19 & Frontend Moderno (12 preguntas)**: React Compiler, Server Actions, Server Components vs Client Components, fugas en `useEffect` y cierres asíncronos (`stale closures`), concurrencia (`useTransition`, `useDeferredValue`), reconciliación virtual DOM vs render directo, microfrontends y hydration mismatches.
  2. **Python Moderno Backend & Async (13 preguntas)**: Python 3.13 free-threaded build (no-GIL), `asyncio` event loop blocking con operaciones síncronas, generadores/iteradores y consumo de memoria (`yield`), FastAPI inyección de dependencias (`Depends`), Pydantic v2 validación en Rust, decoradores con preservación de metadatos (`functools.wraps`), profiling de memoria.
  3. **Laravel 11 & PHP Moderno (13 preguntas)**: Laravel 11 lean skeleton, ciclo de vida del Service Container (Singletons con state leaks en Laravel Octane/FrankenPHP), Eloquent N+1 con subqueries complejas y lazy loading en producción, bloqueos atómicos en Redis para queues (`withoutOverlapping`), transacciones anidadas y deadlocks en base de datos.
  4. **SQL Avanzado & Arquitectura de Datos (12 preguntas)**: Window functions complejas (`ROW_NUMBER`, `DENSE_RANK`, `LAG`/`LEAD`), optimización con `EXPLAIN (ANALYZE, BUFFERS)` (Index Only Scan vs Bitmap Heap Scan), niveles de aislamiento de transacciones (Read Committed vs Repeatable Read vs Serializable, phantom reads), particionamiento de tablas y control de bloat con PostgreSQL MVCC/VACUUM.

### Quiz 2: DevOps & Cloud Architecture 2026 (`devops_cloud`)
* **Nombre mostrado**: *DevOps & Cloud Architecture 2026 (Linux, K8s & CI/CD)*
* **Volumen**: 50 preguntas exclusivas y de alta dificultad.
* **Núcleo temático**:
  1. **Linux Internals & Incident Response (13 preguntas)**: Triage en vivo bajo caída (`strace`, `lsof`, `tcpdump`, `htop`, `dmesg`), gestión de memoria en kernel (Page Cache, Swappiness, OOM Killer y `oom_score_adj`), descriptores de archivos (`ulimit`, `file-max`), señales de procesos (`SIGTERM`, `SIGKILL`, `SIGINT`), sockets y TIME_WAIT tuning (`sysctl`).
  2. **Docker & Containers Seguros (12 preguntas)**: Multi-stage builds con imágenes distroless, cgroups v2 y asignación estricta de CPU/Memory quotas, problema del PID 1 (zombie processes y signal handling con `tini`), ataques de contenedor con privilegios y namespaces de Linux, caching de capas y SBOM generation.
  3. **Kubernetes & Orquestación Cloud-Native (13 preguntas)**: Ciclo de vida de Pods y políticas de QoS (Guaranteed, Burstable, BestEffort), probes críticas (`liveness`, `readiness`, `startup`), cero tiempo de inactividad en RollingUpdates (`preStop` hooks y graceful shutdown), Ingress controllers, Network Policies, autoscaling horizontal con KEDA vs HPA.
  4. **CI/CD, Seguridad & Arquitectura de Resiliencia (12 preguntas)**: Pipelines modernos de GitHub Actions / GitLab CI, escaneo de vulnerabilidades en artefactos (Trivy, Cosign signing), estrategias de despliegue (Canary, Blue/Green con Service Mesh), resiliencia de microservicios (Circuit Breakers con Sentinel/Resilience4j, Exponential Backoff con Jitter), observabilidad y OpenTelemetry (trazas distribuidas, métricas y spans).

---

## 2. Especificación Técnica de las Preguntas

Cada pregunta incluirá:
* **Título claro del problema**: Enunciado directo simulando la pregunta formulada por un Staff/Principal Engineer en una ronda técnica.
* **Snippet de código o comando real**: Ejemplos concisos en Python, PHP/Laravel, JavaScript/React, SQL, Bash o YAML de Kubernetes según aplique.
* **Opciones precisas**: 4 alternativas técnicas con distractores plausibles que capturan los errores más comunes de desarrolladores Mid/Junior.
* **Explicación técnica profunda**: Detalle paso a paso del porqué de la respuesta correcta y la razón por la cual fallan las alternativas.
* **Pro-Tip de Entrevista**: Consejo táctico de alto valor ("Qué busca escuchar el entrevistador" o "Buenas prácticas recomendadas en producción").

---

## 3. Plan de Integración en el Código

### Fase 1: Actualización de Modelos y Tipos
1. **Web (`src/types/quiz.ts` y `src/data/questionsData.ts`)**:
   * Registrar las dos nuevas categorías en `CATEGORIES` con iconos, colores y metadatos visuales.
   * Añadir el banco completo de las 100 preguntas estructuradas y tipadas.
2. **Android Native (`com.devquiz.app.domain.model.Question.kt`)**:
   * Extender el enum `CategoryType`:
     ```kotlin
     SENIOR_FULLSTACK("senior_fullstack", "Fullstack Senior 2026"),
     DEVOPS_CLOUD("devops_cloud", "DevOps & Cloud 2026")
     ```
   * Actualizar el repositorio local o data source nativo de Android en `androidProjectCode.ts` para que la app Android compilada contenga las 100 nuevas preguntas sin necesidad de backend externo.

### Fase 2: Experiencia de Usuario en la App
1. **Filtros y navegación**: Asegurar que las tarjetas de las nuevas categorías se muestren con insignias destacadas ("🔥 Top 50 Senior" y "☁️ Top 50 DevOps").
2. **Selector de preguntas en el Quiz**: Soporte fluido tanto para sesiones completas de 50 preguntas como para tandas de práctica rápida (10 preguntas aleatorias) y modo contrarreloj.

### Fase 3: Verificación y Compilación
1. Ejecutar `lint_applet` para garantizar que no existan errores de tipos o sintaxis en TypeScript.
2. Ejecutar `compile_applet` para confirmar la compilación exitosa de la aplicación web.
3. Verificar la compatibilidad del código Kotlin para que GitHub Actions CI continúe generando la APK sin ninguna regresión.

---

## 4. Criterios de Aceptación
* [ ] Las categorías `senior_fullstack` y `devops_cloud` aparecen activas en la interfaz web y móvil.
* [ ] 50 preguntas rigurosas de Fullstack Senior (React, Python, Laravel, SQL) integradas con snippets y explicaciones.
* [ ] 50 preguntas rigurosas de DevOps & Cloud (Linux, Docker, K8s, CI/CD) integradas con snippets y explicaciones.
* [ ] La aplicación compila limpiamente sin advertencias ni errores.
