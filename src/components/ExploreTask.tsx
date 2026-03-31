import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Code2, Cpu, Link2, Loader2, RefreshCw, ServerCog, TerminalSquare, Upload, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';

type AssignedNode = {
  id: string;
  region: string;
  carbonScore: string;
  latency: string;
  accelerator: string;
};

type PipelineStep = {
  title: string;
  detail: string;
};

type BackendNode = {
  id?: string;
  carbon_zone?: string;
  carbon_intensity?: string | number;
  cpu?: string | number;
};

type JobStatus = 'queued' | 'assigned' | 'running' | 'completed' | 'failed';

type SchedulerJob = {
  id: string;
  status: JobStatus;
  progress: number;
  node_id: string | null;
  result: unknown;
};

type SchedulerEvent = {
  type?: string;
  event?: string;
  job_id?: string;
  node_id?: string;
  progress?: number;
};

const PIPELINE_STEPS: PipelineStep[] = [
  {
    title: 'Upload Received',
    detail: 'Backend validates the script, container metadata, and execution constraints.',
  },
  {
    title: 'Sandbox Analysis',
    detail: 'The orchestration layer scans dependencies, estimates runtime, and verifies trust policies.',
  },
  {
    title: 'Node Matching',
    detail: 'The scheduler ranks low-carbon nodes by memory, CPU availability, and proximity.',
  },
  {
    title: 'Execution Ready',
    detail: 'A verified worker is reserved and your workload package is prepared for dispatch.',
  },
];

const FALLBACK_NODES: AssignedNode[] = [
  { id: 'node-eu-144', region: 'Stockholm, SE', carbonScore: '0.08 kgCO2/kWh', latency: '19 ms', accelerator: '32 vCPU / 64 GB' },
  { id: 'node-in-233', region: 'Bengaluru, IN', carbonScore: '0.11 kgCO2/kWh', latency: '24 ms', accelerator: '16 vCPU / 48 GB' },
  { id: 'node-ca-087', region: 'Montreal, CA', carbonScore: '0.05 kgCO2/kWh', latency: '31 ms', accelerator: '24 vCPU / 96 GB' },
];

const SOCKET_URLS = ['ws://127.0.0.1:8000/ws', 'ws://localhost:8000/ws'];

async function fetchJob(jobId: string) {
  const res = await fetch('http://127.0.0.1:8000/jobs');
  const data = await res.json();
  const jobs = Array.isArray(data) ? data : Object.values(data ?? {});
  return jobs.find((job) => job && typeof job === 'object' && 'id' in job && (job as { id?: string }).id === jobId);
}

const extractJobResultDisplay = (result: unknown): string | null => {
  if (result === null || result === undefined) {
    return null;
  }

  if (typeof result === 'string') {
    return result.trim() ? result : null;
  }

  if (typeof result === 'object') {
    const resultObject = result as {
      result?: unknown;
    };

    if (resultObject.result && typeof resultObject.result === 'object') {
      const nestedResult = resultObject.result as {
        stdout?: unknown;
      };

      if (typeof nestedResult.stdout === 'string' && nestedResult.stdout.trim()) {
        return nestedResult.stdout;
      }
    }

    if (resultObject.result !== undefined && resultObject.result !== null) {
      if (typeof resultObject.result === 'string') {
        return resultObject.result;
      }

      return JSON.stringify(resultObject.result, null, 2);
    }

    return JSON.stringify(result, null, 2);
  }

  return String(result);
};

const normalizeJob = (job: Record<string, unknown>): SchedulerJob | null => {
  const rawId = job.id ?? job.job_id;
  if (typeof rawId !== 'string' || !rawId) {
    return null;
  }

  const rawStatus = typeof job.status === 'string' ? job.status : 'queued';
  const rawProgress = typeof job.progress === 'number' ? job.progress : Number(job.progress ?? 0);
  const rawNodeId = job.node_id ?? job.nodeId ?? job.assigned_node ?? null;

  return {
    id: rawId,
    status: ['assigned', 'running', 'completed', 'failed'].includes(rawStatus) ? (rawStatus as JobStatus) : 'queued',
    progress: Number.isFinite(rawProgress) ? Math.max(0, Math.min(100, rawProgress)) : 0,
    node_id: typeof rawNodeId === 'string' && rawNodeId ? rawNodeId : null,
    result: job.result ?? null,
  };
};

function useSchedulerSocket(onMessage: (data: SchedulerEvent) => void) {
  const [connected, setConnected] = useState(false);
  const messageHandlerRef = useRef(onMessage);

  useEffect(() => {
    messageHandlerRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimer: number | null = null;
    let urlIndex = 0;
    let closed = false;

    const clearReconnectTimer = () => {
      if (reconnectTimer !== null) {
        window.clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    const scheduleReconnect = () => {
      if (closed) return;
      clearReconnectTimer();
      reconnectTimer = window.setTimeout(() => {
        urlIndex = (urlIndex + 1) % SOCKET_URLS.length;
        connect();
      }, 2000);
    };

    const connect = () => {
      if (closed) return;

      try {
        socket = new WebSocket(SOCKET_URLS[urlIndex]);
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setConnected(false);
        scheduleReconnect();
        return;
      }

      socket.onopen = () => {
        setConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data) as SchedulerEvent;
          messageHandlerRef.current(parsed);
        } catch (error) {
          console.error('Failed to parse scheduler event:', error);
        }
      };

      socket.onerror = () => {
        setConnected(false);
      };

      socket.onclose = () => {
        setConnected(false);
        scheduleReconnect();
      };
    };

    connect();

    return () => {
      closed = true;
      clearReconnectTimer();
      setConnected(false);
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      } else if (socket) {
        socket.onclose = null;
        socket.close();
      }
    };
  }, []);

  return { connected };
}

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="h-2 overflow-hidden rounded-full bg-white/10">
    <div
      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-[width] duration-500 ease-out"
      style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
    />
  </div>
);

const STATUS_STYLES: Record<JobStatus, string> = {
  queued: 'bg-slate-500/15 text-slate-300 border border-slate-400/20',
  assigned: 'bg-amber-500/15 text-amber-300 border border-amber-400/20',
  running: 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/20',
  completed: 'bg-green-500/15 text-green-300 border border-green-400/20',
  failed: 'bg-rose-500/15 text-rose-300 border border-rose-400/20',
};

const ExploreTask = () => {
  const [taskName, setTaskName] = useState('vision-inference-batch');
  const [repoUrl, setRepoUrl] = useState('https://github.com/example/inference-worker');
  const [entryFile, setEntryFile] = useState('worker.py');
  const [notes, setNotes] = useState('python worker.py --batch-size 32 --model yolov8n.pt');
  const [selectedFile, setSelectedFile] = useState('No file selected');
  const [isAssigning, setIsAssigning] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [assignedNode, setAssignedNode] = useState<AssignedNode | null>(null);
  const [jobs, setJobs] = useState<Record<string, SchedulerJob>>({});
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [logs, setLogs] = useState('');
  const [logsError, setLogsError] = useState<string | null>(null);
  const [isLogsLoading, setIsLogsLoading] = useState(false);

  const estimatedRuntime = useMemo(() => `${Math.max(6, entryFile.length + notes.length / 10).toFixed(0)} min`, [entryFile, notes]);
  const jobsList = useMemo(() => Object.values(jobs), [jobs]);

  const { connected } = useSchedulerSocket((data) => {
    const eventType = data.type ?? data.event;
    const jobId = data.job_id;

    if (!eventType || !jobId) return;

    setJobs((current) => {
      const existing = current[jobId] ?? {
        id: jobId,
        status: 'queued' as JobStatus,
        progress: 0,
        node_id: null,
        result: null,
      };

      switch (eventType) {
        case 'job_assigned':
          return {
            ...current,
            [jobId]: {
              ...existing,
              status: 'assigned',
              node_id: data.node_id ?? existing.node_id,
            },
          };
        case 'job_progress':
          return {
            ...current,
            [jobId]: {
              ...existing,
              status: 'running',
              progress: typeof data.progress === 'number' ? data.progress : existing.progress,
              node_id: data.node_id ?? existing.node_id,
            },
          };
        case 'job_completed':
          fetchJob(jobId)
            .then((fullJob) => {
              const result = fullJob && typeof fullJob === 'object' && 'result' in fullJob ? fullJob.result : null;

              setJobs((prev) => ({
                ...prev,
                [jobId]: {
                  ...(prev[jobId] ?? existing),
                  status: 'completed',
                  progress: 100,
                  result,
                },
              }));
            })
            .catch((error) => {
              console.error(`Failed to refresh completed job ${jobId}:`, error);
              setJobs((prev) => ({
                ...prev,
                [jobId]: {
                  ...(prev[jobId] ?? existing),
                  status: 'completed',
                  progress: 100,
                  result: (prev[jobId] ?? existing).result,
                },
              }));
            });

          return current;
        case 'job_failed':
          return {
            ...current,
            [jobId]: {
              ...existing,
              status: 'failed',
              result: null,
            },
          };
        default:
          return current;
      }
    });
  });

  useEffect(() => {
    let cancelled = false;

    const loadJobs = async () => {
      try {
        const jobsRes = await fetch('http://127.0.0.1:8000/jobs');
        const jobsData = await jobsRes.json();
        const entries = Array.isArray(jobsData) ? jobsData : Object.values(jobsData ?? {});
        const normalizedJobs = entries.reduce<Record<string, SchedulerJob>>((accumulator, job) => {
          if (!job || typeof job !== 'object') {
            return accumulator;
          }

          const normalized = normalizeJob(job as Record<string, unknown>);
          if (normalized) {
            accumulator[normalized.id] = normalized;
          }
          return accumulator;
        }, {});

        if (!cancelled) {
          setJobs(normalizedJobs);
        }
      } catch (error) {
        console.error('Failed to load jobs:', error);
      }
    };

    loadJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedNode) return;

    let cancelled = false;

    const fetchLogs = async () => {
      setIsLogsLoading(true);
      setLogsError(null);

      try {
        const response = await fetch(`http://127.0.0.1:8000/debug/agent-logs/${selectedNode}`);
        if (!response.ok) {
          throw new Error(`Log request failed with status ${response.status}`);
        }

        const text = await response.text();
        if (!cancelled) {
          setLogs(text);
        }
      } catch (error) {
        console.error('Failed to fetch logs:', error);
        if (!cancelled) {
          setLogs('');
          setLogsError('Failed to fetch logs');
        }
      } finally {
        if (!cancelled) {
          setIsLogsLoading(false);
        }
      }
    };

    fetchLogs();
    const interval = window.setInterval(fetchLogs, 3000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [selectedNode]);

  const handleRefreshLogs = async () => {
    if (!selectedNode) return;

    setIsLogsLoading(true);
    setLogsError(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/debug/agent-logs/${selectedNode}`);
      if (!response.ok) {
        throw new Error(`Log request failed with status ${response.status}`);
      }

      const text = await response.text();
      setLogs(text);
    } catch (error) {
      console.error('Failed to refresh logs:', error);
      setLogs('');
      setLogsError('Failed to fetch logs');
    } finally {
      setIsLogsLoading(false);
    }
  };

  const handleAssignNode = async () => {
    setAssignedNode(null);
    setActiveStep(0);
    setIsAssigning(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/submit-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_type: taskName,
        }),
      });

      const data = await res.json();
      console.log('Job created:', data);

      const createdJobId = typeof data?.job_id === 'string' ? data.job_id : typeof data?.id === 'string' ? data.id : null;
      if (createdJobId) {
        setJobs((current) => ({
          ...current,
          [createdJobId]: current[createdJobId] ?? {
            id: createdJobId,
            status: 'queued',
            progress: 0,
            node_id: null,
            result: null,
          },
        }));
      }

      setActiveStep(1);

      const assignRes = await fetch('http://127.0.0.1:8000/assign-job', {
        method: 'POST',
      });

      const assignData = await assignRes.json();
      console.log('Assignment:', assignData);

      const jobId = typeof assignData?.job_id === 'string' ? assignData.job_id : createdJobId;
      const assignedNodeId = assignData?.node_id ?? assignData?.node?.id ?? null;

      if (jobId) {
        setJobs((current) => ({
          ...current,
          [jobId]: {
            ...(current[jobId] ?? {
              id: jobId,
              status: 'queued',
              progress: 0,
              node_id: null,
              result: null,
            }),
            status: assignedNodeId ? 'assigned' : current[jobId]?.status ?? 'queued',
            node_id: typeof assignedNodeId === 'string' ? assignedNodeId : current[jobId]?.node_id ?? null,
          },
        }));
      }

      setActiveStep(2);

      const nodesRes = await fetch('http://127.0.0.1:8000/nodes');
      const nodes = await nodesRes.json();

      const nodeList: BackendNode[] = Array.isArray(nodes) ? nodes : Object.values(nodes ?? {});
      const matchedNode = Array.isArray(nodes)
        ? nodeList.find((item) => item?.id === assignedNodeId)
        : nodes?.[assignedNodeId] ?? nodeList.find((item) => item?.id === assignedNodeId);

      if (!matchedNode) {
        const fallbackNode = FALLBACK_NODES.find((item) => item.id === assignedNodeId) ?? FALLBACK_NODES[0];
        setAssignedNode(fallbackNode);
        setActiveStep(3);
        setIsAssigning(false);
        return;
      }

      setAssignedNode({
        id: matchedNode.id ?? String(assignedNodeId ?? 'unassigned-node'),
        region: matchedNode.carbon_zone || 'Unknown',
        carbonScore: String(matchedNode.carbon_intensity ?? 'N/A'),
        latency: String(matchedNode.cpu ?? 'N/A'),
        accelerator: '1 job capacity',
      });

      setActiveStep(3);
      setIsAssigning(false);
    } catch (err) {
      console.error('Error:', err);
      setIsAssigning(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 mb-4">Explore Workspace</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Upload your code, let the backend inspect it, and get matched to a live compute node.
            </h1>
            <p className="mt-5 text-lg text-slate-400 leading-relaxed">
              This page is separate from the landing experience. It simulates the backend pipeline that receives a script,
              verifies workload requirements, and assigns the user to a suitable node.
            </p>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 px-6 py-5 backdrop-blur-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">Projected Runtime</p>
            <p className="mt-2 text-3xl font-black text-white">{estimatedRuntime}</p>
            <p className="mt-2 text-sm text-slate-400">Green-first scheduling with backend node reservation.</p>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.25fr_0.9fr]">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 md:p-10 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                <Code2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">Code Intake</p>
                <h2 className="text-2xl font-black text-white">Script Upload Console</h2>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Task Label</label>
                <input
                  value={taskName}
                  onChange={(event) => setTaskName(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-4 text-white outline-none transition-all focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Repository Or Artifact URL</label>
                <div className="relative">
                  <Link2 className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    value={repoUrl}
                    onChange={(event) => setRepoUrl(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/60 py-4 pl-14 pr-5 text-white outline-none transition-all focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-[1fr_auto]">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Entrypoint File</label>
                  <input
                    value={entryFile}
                    onChange={(event) => setEntryFile(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-4 text-white outline-none transition-all focus:border-emerald-500/50"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Upload Script</label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm font-bold text-white transition-all hover:border-emerald-400/60 hover:bg-emerald-500/15">
                    <Upload className="h-5 w-5 text-emerald-400" />
                    <span>Select File</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(event) => setSelectedFile(event.target.files?.[0]?.name ?? 'No file selected')}
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Selected Upload</p>
                <p className="mt-2 text-sm font-medium text-white">{selectedFile}</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Execution Notes</label>
                <textarea
                  rows={5}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/60 px-5 py-4 text-white outline-none transition-all focus:border-emerald-500/50"
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Link to="/" className="text-xs font-black uppercase tracking-[0.22em] text-slate-500 transition-colors hover:text-white">
                  Back To Landing
                </Link>
                <button
                  onClick={handleAssignNode}
                  disabled={isAssigning}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-slate-950 transition-all hover:scale-[1.02] hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isAssigning ? <Loader2 className="h-4 w-4 animate-spin" /> : <ServerCog className="h-4 w-4" />}
                  Send To Backend
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="space-y-8"
          >
            <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/55 p-8 backdrop-blur-xl">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-emerald-400">
                  <Workflow className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Backend Flow</p>
                  <h3 className="text-2xl font-black text-white">Assignment Pipeline</h3>
                </div>
              </div>

              {!connected && (
                <div className="mb-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
                  Live updates disconnected
                </div>
              )}

              <div className="space-y-4">
                {PIPELINE_STEPS.map((step, index) => {
                  const isComplete = activeStep > index || (!isAssigning && assignedNode !== null && index <= activeStep);
                  const isCurrent = activeStep === index && isAssigning;

                  return (
                    <div
                      key={step.title}
                      className={`rounded-3xl border px-5 py-4 transition-all ${
                        isComplete
                          ? 'border-emerald-500/30 bg-emerald-500/10'
                          : isCurrent
                            ? 'border-white/15 bg-white/5'
                            : 'border-white/5 bg-black/20'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 text-emerald-400">
                          {isCurrent ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.16em] text-white">{step.title}</p>
                          <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.detail}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/55 p-8 backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-emerald-400">
                  <ServerCog className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Live Jobs</p>
                  <h3 className="text-2xl font-black text-white">Scheduler Activity</h3>
                </div>
              </div>

              {jobsList.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-5">
                  <p className="text-sm leading-relaxed text-slate-400">No jobs yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobsList.map((job) => (
                    <div key={job.id} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                      {(() => {
                        const resultDisplay = extractJobResultDisplay(job.result);

                        return (
                          <>
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Job Id</p>
                                <p className="mt-2 text-sm font-bold text-white">{job.id}</p>
                              </div>
                              <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${STATUS_STYLES[job.status]}`}>
                                {job.status}
                              </span>
                            </div>

                            <div className="mt-4 space-y-3">
                              <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                                <span>Node: {job.node_id ?? 'Pending'}</span>
                                <span>{job.progress}%</span>
                              </div>
                              <ProgressBar progress={job.progress} />
                            </div>

                            {(resultDisplay || job.status === 'completed') && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3"
                        >
                          <p className="text-xs text-slate-400 uppercase">Result</p>
                          {resultDisplay ? (
                            <div className="mt-2 max-h-40 overflow-y-auto rounded-xl bg-black p-3 text-xs font-mono text-green-400">
                              <pre className="whitespace-pre-wrap">{resultDisplay}</pre>
                            </div>
                          ) : (
                            <p className="mt-2 text-xs text-slate-500">No result returned</p>
                          )}
                        </motion.div>
                            )}

                            {job.node_id && (
                              <button
                                onClick={() => {
                                  setSelectedNode((current) => (current === job.node_id ? null : job.node_id));
                                  setLogs('');
                                  setLogsError(null);
                                }}
                                className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:border-emerald-400/40 hover:bg-emerald-500/10"
                              >
                                <TerminalSquare className="h-4 w-4 text-emerald-400" />
                                {selectedNode === job.node_id ? 'Hide Logs' : 'View Logs'}
                              </button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/55 p-8 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-emerald-400">
                    <TerminalSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Agent Logs</p>
                    <h3 className="text-2xl font-black text-white">Node Console</h3>
                  </div>
                </div>

                <button
                  onClick={handleRefreshLogs}
                  disabled={!selectedNode || isLogsLoading}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:border-emerald-400/40 hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 text-emerald-400 ${isLogsLoading ? 'animate-spin' : ''}`} />
                  Refresh Logs
                </button>
              </div>

              <div className="mb-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                {selectedNode ? `Viewing ${selectedNode}` : 'Select a job node to view logs'}
              </div>

              <div className="h-[200px] overflow-y-auto rounded-3xl border border-white/10 bg-black/40 p-5 font-mono text-sm leading-relaxed text-emerald-200">
                {logsError ? (
                  <p className="text-rose-300">{logsError}</p>
                ) : selectedNode ? (
                  logs.trim() ? (
                    <pre className="whitespace-pre-wrap">{logs}</pre>
                  ) : (
                    <p className="text-slate-400">{isLogsLoading ? 'Loading logs...' : 'No logs available'}</p>
                  )
                ) : (
                  <p className="text-slate-400">No logs available</p>
                )}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/12 to-slate-950 p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                  <Cpu className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400">Assigned Node</p>
                  <h3 className="text-2xl font-black text-white">Execution Target</h3>
                </div>
              </div>

              {assignedNode ? (
                <div className="space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Node Id</p>
                    <p className="mt-2 text-2xl font-black text-white">{assignedNode.id}</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Region</p>
                      <p className="mt-2 text-sm font-bold text-white">{assignedNode.region}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Latency</p>
                      <p className="mt-2 text-sm font-bold text-white">{assignedNode.latency}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Carbon Score</p>
                      <p className="mt-2 text-sm font-bold text-white">{assignedNode.carbonScore}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Capacity</p>
                      <p className="mt-2 text-sm font-bold text-white">{assignedNode.accelerator}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Backend orchestration completed. This user can now ship the uploaded script bundle to the reserved node for execution.
                  </p>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-black/25 p-6">
                  <p className="text-sm leading-relaxed text-slate-400">
                    No node assigned yet. Upload the workload script and send it to the backend to see the scheduler reserve a worker.
                  </p>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
};

export default ExploreTask;
