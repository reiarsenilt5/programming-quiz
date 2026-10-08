import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Endpoint de verificación de clave de Gemini API
  app.post('/api/verify-gemini-key', async (req, res) => {
    try {
      const { apiKey } = req.body;
      const keyToTest = apiKey?.trim() || process.env.GEMINI_API_KEY;

      if (!keyToTest) {
        return res.status(400).json({ valid: false, error: 'No se proporcionó ninguna clave API.' });
      }

      const testAi = new GoogleGenAI({
        apiKey: keyToTest,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' },
        },
      });

      let testResponse;
      try {
        testResponse = await testAi.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: 'Test connection: responde OK',
        });
      } catch {
        try {
          testResponse = await testAi.models.generateContent({
            model: 'gemini-flash-latest',
            contents: 'Test connection: responde OK',
          });
        } catch {
          testResponse = await testAi.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Test connection: responde OK',
          });
        }
      }

      if (testResponse.text) {
        return res.json({ valid: true, message: '¡Clave de Gemini API verificada con éxito!' });
      }
      return res.status(400).json({ valid: false, error: 'No se recibió respuesta válida del modelo.' });
    } catch (error: any) {
      console.error('Error verificando clave:', error);
      return res.status(400).json({
        valid: false,
        error: error?.message || 'Error al validar la clave con Google AI Studio.',
      });
    }
  });

  // API endpoint: Explain question with AI Tutor (Gemini Flash Lite)
  app.post('/api/ai-explain', async (req, res) => {
    try {
      const {
        questionTitle,
        codeSnippet,
        selectedAnswer,
        correctAnswer,
        explanation,
        category,
        difficulty,
        customApiKey
      } = req.body;

      const activeKey = customApiKey?.trim() || process.env.GEMINI_API_KEY;
      if (!activeKey) {
        return res.status(400).json({
          error: 'Clave de Gemini API no configurada. Por favor ingrésala en la pantalla de Ajustes.',
        });
      }

      const client = new GoogleGenAI({
        apiKey: activeKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `Actúa como un Senior Staff Software Engineer y Mentor Técnico en la app "DevQuiz: Master Modern Coding".
Tu objetivo es proporcionar una explicación técnica de nivel profesional sobre la siguiente pregunta:

- Categoría: ${category || 'Software Engineering'}
- Nivel de Dificultad: ${difficulty || 'Intermedio'}
- Pregunta: "${questionTitle}"
${codeSnippet ? `- Código de la pregunta:\n\`\`\`\n${codeSnippet}\n\`\`\`` : ''}
- Respuesta seleccionada por el usuario: "${selectedAnswer}"
- Respuesta Correcta: "${correctAnswer}"
- Explicación breve inicial: "${explanation}"

Por favor, estructura tu respuesta con claridad pedagógica y markdown limpio:
1. 💡 **Fundamento Técnico & Anatomía del Código**: Explica exactamente qué ocurre en tiempo de ejecución o compilación, el estándar o especificación aplicable.
2. ⚠️ **Por qué fallan las alternativas incorrectas**: Los errores conceptuales comunes que llevan a elegir las opciones trampa.
3. 🚀 **Patrón de Producción & Buenas Prácticas**: Un ejemplo conciso de cómo se implementa esto en un proyecto real hoy en día.
4. 🧠 **Pro-Tip para Entrevistas**: Una regla mnemotécnica o dato clave de arquitectura.

Sé conciso, riguroso y en español neutro profesional.`;

      let response;
      try {
        response = await client.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
        });
      } catch (err: any) {
        console.warn('Fallback to gemini-flash-latest:', err?.message);
        try {
          response = await client.models.generateContent({
            model: 'gemini-flash-latest',
            contents: prompt,
          });
        } catch (err2: any) {
          console.warn('Fallback to gemini-2.5-flash:', err2?.message);
          response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
          });
        }
      }

      res.json({
        explanation: response.text || 'No se pudo generar la respuesta detallada.',
      });
    } catch (error: any) {
      console.error('Error al invocar Gemini API:', error);
      res.status(500).json({
        error: 'Error al consultar el tutor de IA',
        details: error?.message || 'Error en el servicio de IA',
      });
    }
  });

  // Vite middleware for dev or static files for prod
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
