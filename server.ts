import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Performance Testing API
  app.post('/api/test', async (req, res) => {
    const { 
      url, 
      count = 10, 
      method = 'GET', 
      headers = {}, 
      body = null, 
      dynamicSeats = false,
      interval = 0 // New: interval in ms between requests
    } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const results: any[] = [];
    const startTime = Date.now();
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const totalRequests = count;
    
    // We'll fire off requests. If interval > 0, we'll wait between starting each one.
    // To handle large counts without crashing, we still batch them slightly or just fire all if total is reasonable.
    // For 200 requests, firing them with small delays is fine.
    
    const requestPromises = [];

    for (let i = 0; i < totalRequests; i++) {
        const globalIdx = i;
        
        const executeRequest = async () => {
          const reqStart = performance.now();
          let finalBody = body;
          
          // Handle Dynamic Seat Logic
          if (dynamicSeats && body) {
            try {
              const seatsPerRow = 6;
              const row = Math.floor(globalIdx / seatsPerRow) + 1;
              const col = (globalIdx % seatsPerRow) + 1;
              const seatChar = String.fromCharCode(65 + (globalIdx % seatsPerRow));
              
              finalBody = {
                ...body,
                seatId: seatChar,
                rowNumber: row,
                columnNumber: col,
                generatedAt: new Date().toISOString()
              };
            } catch (e) {
              console.error('Error calculating dynamic seat:', e);
            }
          }

          try {
            const response = await fetch(url, {
              method,
              headers: {
                'User-Agent': 'IFE-Tester/1.0',
                'Content-Type': 'application/json',
                ...headers
              },
              body: finalBody ? JSON.stringify(finalBody) : undefined,
              signal: AbortSignal.timeout(10000)
            });
            const reqEnd = performance.now();
            
            let responseData: any = null;
            try {
              const contentType = response.headers.get('content-type');
              if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
              } else {
                responseData = await response.text();
                if (typeof responseData === 'string' && responseData.length > 2000) {
                  responseData = responseData.substring(0, 2000) + '... [truncated]';
                }
              }
            } catch (e) {
              responseData = '[Error parsing response body]';
            }

            return {
              status: response.status,
              duration: reqEnd - reqStart,
              success: response.ok,
              data: responseData
            };
          } catch (error: any) {
            const reqEnd = performance.now();
            return {
              status: 0,
              duration: reqEnd - reqStart,
              success: false,
              error: error.message
            };
          }
        };

        requestPromises.push(executeRequest());
        
        if (interval > 0 && i < totalRequests - 1) {
            await sleep(interval);
        }
    }

    const allResults = await Promise.all(requestPromises);
    results.push(...allResults);

    const endTime = Date.now();
    const totalDuration = endTime - startTime;

    // Calculate metrics
    const durations = results.map(r => r.duration).sort((a, b) => a - b);
    const avgResponseTime = durations.reduce((a, b) => a + b, 0) / results.length;
    const minResponseTime = durations[0];
    const maxResponseTime = durations[durations.length - 1];
    const p95 = durations[Math.floor(durations.length * 0.95)];
    const errorCount = results.filter(r => !r.success).length;
    const errorRate = (errorCount / results.length) * 100;

    res.json({
      summary: {
        totalRequests: results.length,
        totalDuration,
        avgResponseTime,
        minResponseTime,
        maxResponseTime,
        p95,
        errorCount,
        errorRate,
      },
      results: results.slice(0, 100) // Limit detailed results returned to avoid massive payloads
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
