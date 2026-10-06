import React, { useState } from 'react';
import { 
  Folder, 
  FileCode, 
  FileJson, 
  Copy, 
  Check, 
  Download, 
  FileSpreadsheet,
  Terminal,
  ChevronDown,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_FILES, AndroidCodeFile } from '../data/androidProjectCode';

interface CodeExplorerProps {
  initialFilePath?: string;
}

export default function CodeExplorer({ initialFilePath }: CodeExplorerProps) {
  const [selectedFile, setSelectedFile] = useState<AndroidCodeFile>(
    ANDROID_FILES.find((f) => f.path === initialFilePath) || ANDROID_FILES[0]
  );
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (file: AndroidCodeFile) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
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
      // Añadir gradlew stub para garantizar compatibilidad
      zip.file(
        'gradlew',
        `#!/usr/bin/env sh\nexec gradle "$@"\n`
      );
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

  const filteredFiles = filterCategory === 'all'
    ? ANDROID_FILES
    : ANDROID_FILES.filter((f) => f.category === filterCategory);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[760px]">
      {/* Top Header */}
      <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Android Studio Code Studio & Project Tree
            </h3>
            <p className="text-[11px] text-slate-400">
              Clean Architecture • Kotlin • Jetpack Compose • Hilt • Room
            </p>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 text-xs bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos ({ANDROID_FILES.length})
          </button>
          <button
            onClick={() => setFilterCategory('gradle')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              filterCategory === 'gradle'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Gradle & CI
          </button>
          <button
            onClick={() => setFilterCategory('viewmodel')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              filterCategory === 'viewmodel'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ViewModel
          </button>
          <button
            onClick={() => setFilterCategory('ui')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              filterCategory === 'ui'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Compose UI
          </button>
          <button
            onClick={() => setFilterCategory('model')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              filterCategory === 'model'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Room & Models
          </button>
        </div>

        <button
          onClick={downloadFullProjectZip}
          disabled={isZipping}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-950/50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isZipping ? 'Empaquetando ZIP...' : 'Descargar Proyecto (.ZIP)'}</span>
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: File Tree */}
        <div className="w-72 bg-slate-950/70 border-r border-slate-800 flex flex-col p-3 overflow-y-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
            Archivos del Proyecto Nativo
          </span>

          <div className="space-y-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/40'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {file.name.endsWith('.json') ? (
                      <FileJson className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : file.name.endsWith('.yml') ? (
                      <Terminal className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    ) : file.name.endsWith('.toml') || file.name.endsWith('.kts') ? (
                      <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <FileCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    )}
                    <span className="truncate">{file.name}</span>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Area: Code Display */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {/* File Tab Bar */}
          <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-200">
                {selectedFile.path}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                {selectedFile.language.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>

              <button
                onClick={() => downloadFile(selectedFile)}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar</span>
              </button>
            </div>
          </div>

          {/* Description banner */}
          <div className="bg-slate-900/40 px-4 py-2 border-b border-slate-800/60 text-xs text-slate-400 flex items-center justify-between">
            <span>{selectedFile.description}</span>
            <span className="text-[10px] text-indigo-400 font-mono">
              {selectedFile.content.split('\n').length} líneas
            </span>
          </div>

          {/* Code Body */}
          <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed">
            <pre className="whitespace-pre">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
