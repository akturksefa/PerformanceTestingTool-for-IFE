import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Activity, 
  AlertCircle, 
  Clock, 
  Users, 
  Zap, 
  BarChart3, 
  RefreshCcw,
  Globe,
  CheckCircle2,
  XCircle,
  Database,
  Terminal
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from './lib/utils';
import type { TestResponse, TestSummary, IndividualResult } from './types';

export default function App() {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [concurrency, setConcurrency] = useState(10);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dynamicSeats, setDynamicSeats] = useState(false);
  const [payload, setPayload] = useState(JSON.stringify({
    "seatId": "E",
    "rowNumber": 3,
    "columnNumber": 1,
    "readingLight": false,
    "passengerCall": true,
    "volume": 50,
    "brightness": 50,
    "handsetBrightness": 50,
    "dnd": 1,
    "audience": 0,
    "backLight": "on",
    "zone": "Business"
  }, null, 2));

  const runTest = async () => {
    setLoading(true);
    setError(null);
    let parsedBody = null;
    
    if (method !== 'GET' && payload.trim()) {
      try {
        parsedBody = JSON.parse(payload);
      } catch (e) {
        setError('Invalid JSON payload');
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          method,
          count: concurrency,
          body: parsedBody,
          dynamicSeats
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to run test');
      }

      const result: TestResponse = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during testing');
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.results.map((r, i) => ({
      index: i + 1,
      duration: Math.round(r.duration),
      status: r.status,
    }));
  }, [data]);

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#C9D1D9] p-6 lg:p-8 flex flex-col gap-6 selection:bg-[#58A6FF]/30">
      {/* Header */}
      <header className="flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 text-white font-extrabold text-xl tracking-tight">
          LOADPULSE <span className="bg-[#58A6FF] text-[#0A0C10] text-xs px-1.5 py-0.5 rounded font-bold">PRO</span>
        </div>
        <div className="text-sm text-[#8B949E] font-medium flex items-center gap-2">
          {loading ? (
            <span className="flex items-center gap-1.5 text-[#58A6FF]">
              <RefreshCcw size={14} className="animate-spin" />
              RUNNING TEST...
            </span>
          ) : (
            <>Session ID: <span className="text-white font-mono opacity-80 cursor-default">#LP-{Date.now().toString().slice(-5)}</span></>
          )}
        </div>
      </header>

      {/* Bento Grid */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[320px_1fr_1fr] md:grid-rows-[repeat(3,auto)] lg:grid-rows-[180px_180px_1fr] gap-4">
        
        {/* Config Card */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 flex flex-col md:row-span-3 lg:row-span-3">
          <div className="text-[12px] font-bold uppercase tracking-wider text-[#8B949E] mb-6 flex items-center gap-2">
            <Terminal size={14} />
            Test Configuration
          </div>
          
          <div className="space-y-4 flex-grow">
            <div className="space-y-2">
              <label className="block text-[13px] text-[#8B949E]">Endpoint URL</label>
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-3.5 text-[#8B949E]" />
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-[#0A0C10] border border-[#30363D] rounded-md py-2.5 pl-9 pr-3 text-white text-sm font-mono focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF] outline-none transition-all placeholder:opacity-30"
                  placeholder="https://api.v1.prod/health"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[13px] text-[#8B949E]">Concurrent Users (VUs)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="1" 
                  max="200" 
                  value={concurrency}
                  onChange={(e) => setConcurrency(parseInt(e.target.value))}
                  className="flex-grow accent-[#58A6FF] h-1.5 bg-[#0A0C10] rounded-lg cursor-pointer"
                />
                <span className="bg-[#0A0C10] border border-[#30363D] px-2 py-1 rounded font-mono text-sm text-[#58A6FF]">
                  {concurrency}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-[11px] text-[#8B949E] font-bold uppercase tracking-widest opacity-60">
                <span>Method</span>
                <span>Type</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['GET', 'POST', 'PUT', 'DELETE'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={cn(
                      "rounded py-2 text-[10px] font-bold transition-all border",
                      method === m 
                        ? "bg-[#58A6FF] text-[#0A0C10] border-[#58A6FF] shadow-[0_0_10px_rgba(88,166,255,0.3)]" 
                        : "bg-[#0A0C10] border-[#30363D] text-[#8B949E] hover:border-[#58A6FF]/50"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {method !== 'GET' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-2"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-[13px] text-[#8B949E]">Payload (JSON)</label>
                    <button 
                      onClick={() => setDynamicSeats(!dynamicSeats)}
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded border transition-all flex items-center gap-1",
                        dynamicSeats ? "bg-[#58A6FF]/20 text-[#58A6FF] border-[#58A6FF]/30" : "bg-[#30363D]/50 text-[#8B949E] border-[#30363D]"
                      )}
                    >
                      <Users size={10} />
                      {dynamicSeats ? "DYNAMIC SEATS ON" : "DYNAMIC SEATS OFF"}
                    </button>
                  </div>
                  <textarea 
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                    rows={8}
                    className="w-full bg-[#0A0C10] border border-[#30363D] rounded-md p-3 text-white text-[11px] font-mono focus:border-[#58A6FF] focus:ring-1 focus:ring-[#58A6FF] outline-none transition-all resize-none"
                    placeholder='{ "key": "value" }'
                  />
                  {dynamicSeats && (
                    <p className="text-[10px] text-[#58A6FF] opacity-80 italic">
                      Info: seatId, rowNumber, columnNumber will be auto-generated per user.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          <button 
            onClick={runTest}
            disabled={loading || !url}
            className={cn(
              "mt-6 w-full py-3 rounded-md font-bold text-sm tracking-wide transition-all shadow-lg active:scale-[0.98]",
              loading 
                ? "bg-[#30363D] text-[#8B949E] cursor-wait" 
                : "bg-[#58A6FF] text-white hover:brightness-110 shadow-[#58A6FF]/20"
            )}
          >
            {loading ? "INITIALIZING..." : "START TEST"}
          </button>
        </div>

        {/* Metrics Cards */}
        {data ? (
          <>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 flex flex-col justify-between"
            >
              <div className="text-[12px] font-bold uppercase tracking-wider text-[#8B949E] mb-2">Avg. Response Time</div>
              <div className="text-[42px] font-bold text-white flex items-baseline gap-1">
                {Math.round(data.summary.avgResponseTime)}
                <span className="text-lg font-normal text-[#8B949E]">ms</span>
              </div>
              <div className="text-[12px] text-[#3FB950] font-medium flex items-center gap-1 mt-1">
                <Zap size={12} fill="currentColor" />
                Optimal performance detected
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 flex flex-col justify-between"
            >
              <div className="text-[12px] font-bold uppercase tracking-wider text-[#8B949E] mb-2">Error Rate</div>
              <div className={cn(
                "text-[42px] font-bold flex items-baseline gap-1",
                data.summary.errorRate > 0 ? "text-[#F85149]" : "text-white"
              )}>
                {data.summary.errorRate.toFixed(2)}
                <span className="text-lg font-normal text-[#8B949E] opacity-60">%</span>
              </div>
              <div className="text-[12px] text-[#8B949E] mt-1 italic">
                {data.summary.errorCount} failed requests detected
              </div>
            </motion.div>

            {/* Chart Area */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 lg:col-span-2 flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="text-[12px] font-bold uppercase tracking-wider text-[#8B949E]">Latency Distribution (ms)</div>
                <div className="flex items-center gap-4 text-[10px] font-bold bg-[#0A0C10] px-2 py-1 rounded border border-[#30363D]">
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#58A6FF]" /> P50</span>
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full border border-[#58A6FF]" /> P95: {Math.round(data.summary.p95)}ms</span>
                </div>
              </div>
              <div className="flex-grow h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363D" />
                    <XAxis dataKey="index" hide />
                    <YAxis stroke="#8B949E" fontSize={10} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-[#0A0C10] border border-[#30363D] p-3 rounded shadow-2xl text-[10px] uppercase font-bold tracking-wider">
                              <p className="text-[#8B949E] mb-2">Req #{item.index}</p>
                              <p className="text-white text-sm">{item.duration}ms</p>
                              <p className={cn("mt-1", item.status < 400 ? "text-[#3FB950]" : "text-[#F85149]")}>
                                STATUS: {item.status || 'ERR'}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="duration" 
                      stroke="#58A6FF" 
                      fill="#58A6FF" 
                      fillOpacity={0.15} 
                      strokeWidth={2}
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="lg:col-span-2 lg:row-span-2 bg-[#161B22] border border-[#30363D] border-dashed rounded-xl flex flex-items flex-col items-center justify-center p-12 text-center text-[#8B949E]">
            <div className="bg-[#0A0C10] p-4 rounded-full mb-4 border border-[#30363D]">
              <Activity size={32} strokeWidth={1} />
            </div>
            <h3 className="text-white font-bold text-sm mb-1 uppercase tracking-widest">Awaiting Command</h3>
            <p className="text-xs max-w-[200px] leading-relaxed opacity-60">Ready to simulate concurrent traffic and generate telemetry. Start a test to begin.</p>
          </div>
        )}

        {/* Detailed Table Card */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl lg:col-span-3 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-[#30363D] flex justify-between items-center bg-[#0A0C10]/20">
            <div className="text-[12px] font-bold uppercase tracking-wider text-[#8B949E] flex items-center gap-2">
              <Database size={14} />
              Detailed Request Telemetry
            </div>
            {data && (
              <div className="text-[10px] text-[#8B949E] bg-[#0A0C10] px-2 py-0.5 rounded font-mono border border-[#30363D]">
                SAMPLING: {data.results.length} REQS
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans">
              <thead>
                <tr className="border-b border-[#30363D]">
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#8B949E] uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#8B949E] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#8B949E] uppercase tracking-wider">Latency</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#8B949E] uppercase tracking-wider">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]">
                {data ? data.results.map((result, idx) => (
                  <tr key={idx} className="hover:bg-[#0A0C10]/40 transition-colors group">
                    <td className="px-6 py-2.5 text-[11px] font-mono opacity-60 group-hover:opacity-100 uppercase">req_{Math.random().toString(36).substring(2, 7)}</td>
                    <td className="px-6 py-2.5">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[11px] font-semibold border",
                        result.status >= 200 && result.status < 300 
                          ? "bg-[#3FB950]/10 text-[#3FB950] border-[#3FB950]/20" 
                          : "bg-[#F85149]/10 text-[#F85149] border-[#F85149]/20"
                      )}>
                        {result.status || 'TIMEOUT'} {result.status === 200 ? 'OK' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-2.5 text-[13px] font-mono text-white font-medium">
                      {result.duration.toFixed(0)}<span className="opacity-40 text-[10px] ml-0.5">ms</span>
                    </td>
                    <td className="px-6 py-2.5">
                      {result.success ? (
                        <div className="flex items-center gap-1.5 text-[#3FB950]">
                          <CheckCircle2 size={12} />
                          <span className="text-[10px] font-bold uppercase opacity-80 underline underline-offset-4 decoration-[#3FB950]/30">Pass</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[#F85149]">
                          <XCircle size={12} />
                          <span className="text-[10px] font-bold uppercase opacity-80 underline underline-offset-4 decoration-[#F85149]/30">Fail</span>
                        </div>
                      )}
                    </td>
                  </tr>
                )) : (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="opacity-10 grayscale">
                      <td className="px-6 py-2.5 h-[41px]"><div className="h-2 w-20 bg-[#30363D] rounded shadow-inner" /></td>
                      <td className="px-6 py-2.5"><div className="h-4 w-16 bg-[#30363D] rounded-full" /></td>
                      <td className="px-6 py-2.5"><div className="h-3 w-12 bg-[#30363D] rounded shadow-inner" /></td>
                      <td className="px-6 py-2.5"><div className="h-3 w-10 bg-[#30363D] rounded shadow-inner" /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-[#F85149]/10 border border-[#F85149]/30 p-4 rounded-lg flex items-center gap-3 text-[#F85149] text-xs font-bold uppercase tracking-wider">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
