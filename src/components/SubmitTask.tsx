import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Zap } from 'lucide-react';

type NodePosition = {
  top: string;
  left: string;
};

const createSimulationNodes = (count: number): NodePosition[] =>
  Array.from({ length: count }, (_, index) => ({
    top: `${18 + ((index * 17) % 62)}%`,
    left: `${12 + ((index * 23) % 68)}%`,
  }));

const getNodeMetrics = () => {
  return {
    success_rate: 1.0,
    uptime: 1.0,
    speed: navigator.hardwareConcurrency ? navigator.hardwareConcurrency / 4 : 1.0,
  };
};

const getCPUUsage = () => {
  return Math.floor(Math.random() * 60);
};

const SubmitTask = () => {
  const [zone, setZone] = useState('');
  const [nodeId, setNodeId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isFinding, setIsFinding] = useState(false);
  const nodePositions = useMemo(() => createSimulationNodes(12), []);

  useEffect(() => {
    if (!isOnline || !nodeId) return;

    const interval = setInterval(() => {
      fetch(`http://127.0.0.1:8000/nodes/${nodeId}/heartbeat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'idle',
          availability: 'idle',
          metrics: getNodeMetrics(),
          carbon_zone: zone,
          cpu: getCPUUsage(),
          current_job_id: null,
        }),
      }).catch((error) => {
        console.error(error);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [isOnline, nodeId, zone]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative"
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.25em]">Contributor Node</p>
                <h2 className="text-3xl font-black text-white tracking-tight">Join Compute Mesh</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Register this machine as an available contributor node and keep it active with a recurring heartbeat.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Carbon Zone</label>
                <input
                  type="text"
                  placeholder="e.g. IN-NO"
                  value={zone}
                  onChange={(event) => setZone(event.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
                />
              </div>

              <button
                onClick={async () => {
                  if (!zone) {
                    alert('Enter carbon zone');
                    return;
                  }

                  setIsFinding(true);

                  try {
                    const id = 'node-' + Math.random().toString(36).slice(2, 6);
                    setNodeId(id);

                    await fetch('http://127.0.0.1:8000/nodes/register', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        node_id: id,
                        status: 'idle',
                        availability: 'idle',
                        metrics: getNodeMetrics(),
                        carbon_zone: zone,
                        cpu: getCPUUsage(),
                        current_job_id: null,
                      }),
                    });

                    setIsOnline(true);
                    setIsFinding(false);
                  } catch (err) {
                    console.error(err);
                    setIsFinding(false);
                  }
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all hover:scale-105"
              >
                Deploy to Mesh
              </button>
            </div>
          </motion.div>
        </div>

        <div className="w-full lg:w-[380px] space-y-8">
          <div className="bg-slate-950/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 overflow-hidden relative group">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Mesh Simulation</h3>

            <div className="relative h-64 flex items-center justify-center mb-8">
              <div className="absolute w-48 h-48 border border-emerald-500/20 rounded-full animate-ping"></div>
              <div className="absolute w-32 h-32 border border-emerald-500/30 rounded-full animate-ping delay-300"></div>
              <div className="absolute w-16 h-16 border border-emerald-500/40 rounded-full animate-pulse"></div>

              <div className="relative z-10 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                {isFinding ? <Loader2 className="h-6 w-6 text-slate-950 animate-spin" /> : <Search className="h-6 w-6 text-slate-950" />}
              </div>

              {isFinding &&
                nodePositions.map((position, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                    style={position}
                  />
                ))}
            </div>

            <div className="space-y-4 text-center">
              <p className="text-sm font-black text-white uppercase tracking-widest">
                {isFinding ? 'Deploying Contributor Node...' : 'Ready for Mesh Discovery'}
              </p>

              {nodeId && (
                <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                  <p className="text-xs text-slate-400 uppercase">Node ID</p>
                  <p className="text-white font-bold">{nodeId}</p>
                  <p className="text-xs text-emerald-400">
                    {isOnline ? 'Online (Heartbeat Active)' : 'Offline'}
                  </p>
                </div>
              )}

              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500"
                  animate={isFinding ? { width: '100%' } : { width: '0%' }}
                  transition={{ duration: 10 }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Broadcast: {isOnline ? 'Active' : 'Standby'}</span>
                <span>Latency: 12ms</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-slate-900 to-black">
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <Zap className="h-5 w-5" />
              <span className="text-xs font-black uppercase tracking-widest">Power Insight</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Contributor nodes strengthen the mesh by advertising local capacity, staying reachable, and giving the scheduler
              fresh heartbeat data for greener placement decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitTask;
