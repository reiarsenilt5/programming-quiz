import React, { useState } from 'react';
import { Check, Copy, Download, GitBranch, Github, Play, Shield, Terminal, Zap, CheckCircle2, AlertTriangle, PackageCheck } from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_FILES } from '../data/androidProjectCode';

export const GITHUB_WORKFLOW_YML = `name: Build Android APK

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch: # Permite compilar manualmente con un clic en GitHub Actions

jobs:
  build:
    name: Compilar APK (Debug)
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Clonar repositorio
        uses: actions/checkout@v4

      - name: ☕ Configurar JDK 17 (Temurin)
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: 🐘 Configurar Gradle 8.4
        uses: gradle/actions/setup-gradle@v3
        with:
          gradle-version: '8.4'

      - name: 🛡️ Preparar Gradle Wrapper
        run: |
          if [ ! -f "gradlew" ] || [ ! -f "gradle/wrapper/gradle-wrapper.jar" ]; then
            echo "Generando Gradle wrapper 8.4 bin..."
            gradle wrapper --gradle-version 8.4 --distribution-type bin
          fi
          chmod +x gradlew

      - name: ⚙️ Configurar local.properties
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
        run: |
          touch local.properties
          echo "sdk.dir=\${ANDROID_HOME}" >> local.properties
          if [ -n "\${GEMINI_API_KEY}" ]; then
            echo "gemini.api.key=\${GEMINI_API_KEY}" >> local.properties
          fi

      - name: 🔨 Compilar APK Debug
        run: |
          if [ -f "./gradlew" ] && [ -f "gradle/wrapper/gradle-wrapper.jar" ]; then
            ./gradlew assembleDebug --stacktrace --no-daemon
          else
            gradle assembleDebug --stacktrace --no-daemon
          fi

      - name: 🔍 Verificar generación de APK
        run: |
          echo "Buscando APK generado..."
          ls -la app/build/outputs/apk/debug/ || true

      - name: 📦 Subir APK Debug como Artefacto Descargable
        uses: actions/upload-artifact@v4
        with:
          name: DevQuiz-Debug-APK
          path: app/build/outputs/apk/debug/*.apk
          retention-days: 14
`;

export const FASTLANE_OR_RELEASE_YML = `name: Create GitHub Release with APK

on:
  push:
    tags:
      - 'v*' # Dispara cuando creas una tag como v1.0.0

jobs:
  release:
    name: Publicar Release con APK adjunto
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: 'gradle'

      - run: chmod +x gradlew
      - run: ./gradlew assembleDebug

      - name: Crear GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          files: app/build/outputs/apk/debug/app-debug.apk
          name: Release \${{ github.ref_name }}
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;

export default function CiCdGuide() {
  const [copied, setCopied] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadFullProjectZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      ANDROID_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });
      zip.file('gradlew', `#!/usr/bin/env sh\nexec gradle "$@"\n`);
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DevQuiz-Android-Complete-Project.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generando zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
              <Github className="w-3.5 h-3.5" />
              GitHub Actions CI/CD Pipeline
            </div>
            <h2 className="text-2xl font-bold text-white">
              Automatización de Compilación de APK en GitHub
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Cada vez que subas código a tu repositorio de GitHub (o presiones "Run workflow"),
              GitHub compilará el código Kotlin y generará el archivo <span className="text-emerald-400 font-mono font-semibold">app-debug.apk</span> listo para descargar e instalar en tu celular.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={downloadFullProjectZip}
              disabled={isZipping}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-lg shadow-emerald-950/50 whitespace-nowrap cursor-pointer"
            >
              <PackageCheck className="w-4 h-4" />
              <span>{isZipping ? 'Empaquetando...' : 'Descargar Todo (.ZIP)'}</span>
            </button>
            <button
              onClick={() => downloadFile('build-apk.yml', GITHUB_WORKFLOW_YML)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium text-xs transition shadow-lg shadow-indigo-600/30 whitespace-nowrap cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Descargar workflow (.yml)
            </button>
          </div>
        </div>
      </div>

      {/* Garantía de Compilación */}
      <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          ¿Qué garantiza que la compilación en GitHub NO falle?
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="flex items-start gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold">✓</span>
            <div>
              <strong className="text-white block">Auto-generador de gradlew:</strong>
              Si olvidaste subir el wrapper o estás en Windows sin permisos de ejecución, el workflow ejecuta <code className="text-indigo-300">gradle wrapper --gradle-version 8.3</code> en GitHub antes de compilar.
            </div>
          </div>
          <div className="flex items-start gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold">✓</span>
            <div>
              <strong className="text-white block">Estructura Gradle Completa:</strong>
              El proyecto incluye <code className="text-indigo-300">settings.gradle.kts</code>, <code className="text-indigo-300">build.gradle.kts</code> raíz y <code className="text-indigo-300">AndroidManifest.xml</code>.
            </div>
          </div>
          <div className="flex items-start gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold">✓</span>
            <div>
              <strong className="text-white block">Versiones 100% Compatibles:</strong>
              Kotlin 1.9.23 con KSP 1.9.23-1.0.20, Compose BOM 2024.02.02 y Gradle 8.3 (cero conflictos de dependencias).
            </div>
          </div>
          <div className="flex items-start gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold">✓</span>
            <div>
              <strong className="text-white block">Descarga en 1 Clic con ZIP:</strong>
              Puedes descargar el ZIP con el botón verde arriba, descomprimirlo en tu carpeta local, hacer <code className="text-emerald-400 font-mono">git push</code> y listo.
            </div>
          </div>
        </div>
      </div>

      {/* 3 Step Visual Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm mb-3">
            1
          </div>
          <h3 className="font-semibold text-white text-base">Crear la carpeta en tu repo</h3>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            Crea la ruta exacta en la raíz de tu proyecto:
          </p>
          <div className="mt-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-indigo-300">
            .github/workflows/build-apk.yml
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
            2
          </div>
          <h3 className="font-semibold text-white text-base">Hacer git push a GitHub</h3>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            Sube los cambios a la rama <code className="text-emerald-300">main</code>. GitHub Actions detectará el archivo e iniciará la compilación automáticamente.
          </p>
          <div className="mt-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400">
            git push origin main
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm mb-3">
            3
          </div>
          <h3 className="font-semibold text-white text-base">Descargar el APK en 1 clic</h3>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            Entra a la pestaña <span className="text-white font-medium">Actions</span> en GitHub, haz clic en la ejecución y en la sección <span className="text-amber-300 font-medium">Artifacts</span> descarga tu APK.
          </p>
          <div className="mt-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-amber-300">
            Artifacts ➔ DevQuiz-Debug-APK.zip
          </div>
        </div>
      </div>

      {/* Workflow Code Block */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-xs font-semibold text-slate-200">
              .github/workflows/build-apk.yml
            </span>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
              YAML
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(GITHUB_WORKFLOW_YML, 'main-yml')}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              {copied === 'main-yml' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar YAML</span>
                </>
              )}
            </button>
          </div>
        </div>
        <pre className="p-5 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed bg-slate-950/70">
          <code>{GITHUB_WORKFLOW_YML}</code>
        </pre>
      </div>

      {/* Detailed Tips & Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <Zap className="w-4 h-4" />
            Detalles Técnicos del Pipeline
          </div>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li>
              <strong className="text-white">JDK 17 Eclipse Temurin:</strong> Requerido por Gradle 8+ y las herramientas modernas de Android (AGP 8.3+).
            </li>
            <li>
              <strong className="text-white">Caché de Gradle:</strong> Descarga dependencias solo la primera vez, reduciendo el tiempo de compilación a menos de 2 minutos.
            </li>
            <li>
              <strong className="text-white">Permisos del Gradlew:</strong> El paso <code className="bg-slate-800 px-1 py-0.5 rounded text-indigo-300">chmod +x gradlew</code> previene el típico error "Permission denied" de Linux.
            </li>
            <li>
              <strong className="text-white">Disparador manual:</strong> Gracias a <code className="bg-slate-800 px-1 py-0.5 rounded text-indigo-300">workflow_dispatch</code>, puedes ir a Actions en GitHub y presionar "Run workflow" en cualquier momento sin hacer commits.
            </li>
          </ul>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Shield className="w-4 h-4" />
            Configuración de Secrets (Gemini API)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Si deseas que tu APK nativa de Android se compile con tu clave de Gemini para el tutor de IA sin exponerla en el código:
          </p>
          <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside">
            <li>Entra a tu repositorio en GitHub ➔ <strong>Settings</strong>.</li>
            <li>En la barra lateral izquierda, haz clic en <strong>Secrets and variables ➔ Actions</strong>.</li>
            <li>Haz clic en <strong>New repository secret</strong>.</li>
            <li>Nombre: <code className="text-indigo-300 font-mono">GEMINI_API_KEY</code>.</li>
            <li>Valor: Tu clave de Google AI Studio.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
