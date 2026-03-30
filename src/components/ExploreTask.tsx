import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Code2, Cpu, Link2, Loader2, ServerCog, Upload, Workflow } from 'lucide-react';
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

const ASSIGNED_NODES: AssignedNode[] = [
  { id: 'node-eu-144', region: 'Stockholm, SE', carbonScore: '0.08 kgCO2/kWh', latency: '19 ms', accelerator: '32 vCPU / 64 GB' },
  { id: 'node-in-233', region: 'Bengaluru, IN', carbonScore: '0.11 kgCO2/kWh', latency: '24 ms', accelerator: '16 vCPU / 48 GB' },
  { id: 'node-ca-087', region: 'Montreal, CA', carbonScore: '0.05 kgCO2/kWh', latency: '31 ms', accelerator: '24 vCPU / 96 GB' },
];

const ExploreTask = () => {
  const [taskName, setTaskName] = useState('vision-inference-batch');
  const [repoUrl, setRepoUrl] = useState('https://github.com/example/inference-worker');
  const [entryFile, setEntryFile] = useState('worker.py');
  const [notes, setNotes] = useState('python worker.py --batch-size 32 --model yolov8n.pt');
  const [selectedFile, setSelectedFile] = useState('No file selected');
  const [isAssigning, setIsAssigning] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [assignedNode, setAssignedNode] = useState<AssignedNode | null>(null);

  const estimatedRuntime = useMemo(() => `${Math.max(6, entryFile.length + notes.length / 10).toFixed(0)} min`, [entryFile, notes]);

  useEffect(() => {
    if (!isAssigning) {
      return undefined;
    }

    const timers = PIPELINE_STEPS.map((_, index) =>
      window.setTimeout(() => {
        setActiveStep(index);

        if (index === PIPELINE_STEPS.length - 1) {
          const node = ASSIGNED_NODES[(taskName.length + entryFile.length) % ASSIGNED_NODES.length];
          setAssignedNode(node);
          setIsAssigning(false);
        }
      }, (index + 1) * 900),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [entryFile, isAssigning, taskName]);

  const handleAssignNode = () => {
    setAssignedNode(null);
    setActiveStep(0);
    setIsAssigning(true);
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
