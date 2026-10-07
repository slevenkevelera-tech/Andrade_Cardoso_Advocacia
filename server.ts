import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

// Load environment variables securely from .env.local first, then .env
dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Limit request body sizes to 500kb to mitigate Denial of Service (DoS) and payload bomb attacks
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: false, limit: '500kb' }));

// Security Headers: Hardening against Cross-Site Scripting (XSS), Clickjacking and MIME sniffing
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// In-memory Rate Limiter to protect server-side endpoints from brute-force and DDoS
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const ipRequestRecords = new Map<string, RateLimitRecord>();

const rateLimiter = (maxRequests = 30, windowMs = 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = ipRequestRecords.get(clientIp);

    if (!record || now > record.resetTime) {
      ipRequestRecords.set(clientIp, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        error: 'Limite de requisições excedido. Por favor, aguarde alguns instantes antes de enviar nova mensagem.',
      });
    }

    record.count++;
    next();
  };
};

// Periodic cleanup of expired rate-limit records
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestRecords.entries()) {
    if (now > record.resetTime) {
      ipRequestRecords.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// ============================================================================
// API ROUTES
// ============================================================================

// 1. Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: isProduction ? 'production' : 'development',
  });
});

// 2. Safe Public Configuration (NEVER returns private secrets like GEMINI_API_KEY)
app.get('/api/config', (_req: Request, res: Response) => {
  res.json({
    firebase: {
      apiKey: process.env.VITE_FIREBASE_API_KEY || '',
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.VITE_FIREBASE_APP_ID || '',
      measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || '',
    },
  });
});

// 3. Server-Side AI Chat Proxy using Gemini 3.8 Flash
// GEMINI_API_KEY is kept strictly on the server and is NEVER sent to the client.
app.post('/api/chat', rateLimiter(20, 60 * 1000), async (req: Request, res: Response) => {
  try {
    const message = typeof req.body?.message === 'string' ? req.body.message.trim().slice(0, 1200) : '';
    const history = Array.isArray(req.body?.history) ? req.body.history
      .filter((item: any) => item && typeof item.text === 'string')
      .map((item: any) => ({ role: item.role === 'model' ? 'model' : 'user', text: item.text.trim().slice(0, 1200) }))
      .filter((item: any) => item.text)
      .slice(-12) : [];

    if (!message) return res.status(400).json({ error: 'Mensagem inválida ou ausente.' });

    const contents = [...history.map((item: any) => ({ role: item.role, parts: [{ text: item.text }] })), { role: 'user', parts: [{ text: message }] }];

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'Assistente inteligente indisponível no momento.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'andrade-cardoso-website' } },
    });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: `Você é o Concierge Virtual do escritório Andrade & Cardoso Advogados Associados.
Sócios Fundadores:
- Dr. Maurilo Cardoso: Especialista em Direito Tributário Estratégico, Direito Público e Prerrogativas da Advocacia (Delegado OAB/PA Cametá). Atua em causas de alta complexidade nos Tribunais Superiores (TRF1, STJ e STF).
- Lorenzo Cardoso: Especialista em Engenharia de Software, Jurimetria e Automação Jurídica, liderando produtos do Andrade Cardoso Club e inovações processuais.
Seu objetivo é acolher clientes, esclarecer dúvidas com polidez e orientar o agendamento de consultas ou triagem preliminar.
Não substitua consulta jurídica formal. Não invente fatos, prazos, honorários ou resultados. Nunca diga que um lead foi salvo, alguém foi notificado ou uma consulta foi agendada, a menos que a aplicação confirme explicitamente.
Responda sempre em Português do Brasil com tom sóbrio, elegante, profissional e empático. Seja conciso (máximo 3 parágrafos curtos).`,
      },
    });

    const replyText = response.text || 'Agradecemos o contato. Nossa equipe jurídica responderá prontamente.';
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('[API /api/chat Error]:', error?.message || error);
    res.status(500).json({
      error: 'Falha no processamento da solicitação pelo assistente.',
    });
  }
});

// Endpoint to download the complete project as a ZIP archive
app.get(['/andrade-cardoso-advocacia.zip', '/api/download-zip'], (_req: Request, res: Response) => {
  const possiblePaths = [
    path.resolve(__dirname, 'public', 'andrade-cardoso-advocacia.zip'),
    path.resolve(__dirname, 'dist', 'andrade-cardoso-advocacia.zip'),
    path.resolve(__dirname, 'andrade-cardoso-advocacia.zip'),
  ];
  for (const zipPath of possiblePaths) {
    if (fs.existsSync(zipPath)) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="andrade-cardoso-advocacia.zip"');
      return res.sendFile(zipPath);
    }
  }
  return res.status(404).send('Arquivo ZIP não encontrado no servidor.');
});

// ============================================================================
// SERVER INITIALIZATION (DEV WITH VITE MIDDLEWARES / PROD STATIC SERVE WITH RESILIENCE)
// ============================================================================
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const indexPath = path.resolve(distPath, 'index.html');
  const httpServer = http.createServer(app);

  if (isProduction) {
    // If running in production but dist/index.html is missing (e.g. Render build step only ran 'npm install'),
    // automatically trigger the build on-the-fly to guarantee files exist.
    if (!fs.existsSync(indexPath)) {
      console.warn(`[Render/Prod Warning]: '${indexPath}' não encontrado.`);
      console.log("[Render/Prod]: Executando 'npm run build' automaticamente para gerar os arquivos...");
      try {
        const { execSync } = await import('child_process');
        execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
      } catch (buildErr: any) {
        console.error('[Build Error]: Falha ao executar build automático:', buildErr?.message || buildErr);
      }
    }

    if (fs.existsSync(indexPath)) {
      console.log(`[Andrade & Cardoso] Servindo bundle de produção a partir de: ${distPath}`);
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(indexPath, (err) => {
          if (err) {
            console.error('[SendFile Error]:', err);
            if (!res.headersSent) {
              res.status(500).send('Erro ao carregar a página principal.');
            }
          }
        });
      });
    } else {
      console.warn('[Vite Middleware Fallback]: dist/index.html ainda ausente. Ativando Vite runtime dinâmico como contingência...');
      const vite = await createViteServer({
        server: { middlewareMode: true, hmr: { server: httpServer } },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    }
  } else {
    // Development mode with Vite middlewares attached to the HTTP server for valid WebSocket upgrades
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: { server: httpServer } },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[Andrade & Cardoso] Servidor seguro ativo na porta ${PORT} (${isProduction ? 'Produção' : 'Desenvolvimento'})`);
  });
}

startServer().catch((err) => {
  console.error('[Erro Fatal ao Iniciar Servidor]:', err);
  process.exit(1);
});
