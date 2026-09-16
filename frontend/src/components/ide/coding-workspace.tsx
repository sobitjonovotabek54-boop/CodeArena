"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import {
  Play,
  Send,
  RotateCcw,
  Copy,
  Maximize2,
  Minimize2,
  CheckCircle2,
  XCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useLang } from "@/store/lang";
import { getProblemDescription, getProblemTitle } from "@/lib/problem-translations";
import type { Problem, Submission } from "@/lib/types";
import { cn, difficultyColor, formatStatus, statusColor } from "@/lib/utils";

const LANGS = [
  { id: "python", label: "Python", monaco: "python" },
  { id: "javascript", label: "JavaScript", monaco: "javascript" },
  { id: "cpp", label: "C++", monaco: "cpp" },
  { id: "java", label: "Java", monaco: "java" },
] as const;

type RunPayload = {
  status: string;
  stdout: string;
  stderr: string;
  runtime_ms: number;
  passed_tests: number;
  total_tests: number;
  test_results: {
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    error: string;
    runtime_ms: number;
  }[];
};

export function CodingWorkspace({ problem }: { problem: Problem }) {
  const { t, lang } = useLang();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(problem.starter_code?.python || "");
  const [fontSize, setFontSize] = useState(14);
  const [fullscreen, setFullscreen] = useState(false);
  const [leftWidth, setLeftWidth] = useState(40);
  const [consoleHeight, setConsoleHeight] = useState(190);
  const [busy, setBusy] = useState<"run" | "submit" | null>(null);
  const [result, setResult] = useState<RunPayload | null>(null);
  const [reward, setReward] = useState<{ first_solve?: boolean; xp_gained?: number } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const dragging = useRef<"h" | "v" | null>(null);

  useEffect(() => {
    setCode(problem.starter_code?.[language] || "");
    setResult(null);
    setError("");
  }, [language, problem]);

  const monacoLang = useMemo(() => {
    return LANGS.find((l) => l.id === language)?.monaco || "python";
  }, [language]);

  const onMount: OnMount = (editor) => {
    editor.focus();
  };

  const changeLanguage = (id: string) => {
    setLanguage(id);
    setCode(problem.starter_code?.[id] || "");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const run = async () => {
    setBusy("run");
    setError("");
    setReward(null);
    try {
      const data = await api<RunPayload>("/run/", {
        method: "POST",
        body: JSON.stringify({ problem_id: problem.id, language, code }),
      });
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Run failed");
    } finally {
      setBusy(null);
    }
  };

  const submit = async () => {
    setBusy("submit");
    setError("");
    try {
      const data = await api<{
        result: RunPayload;
        submission: Submission;
        reward: { first_solve: boolean; xp_gained: number } | null;
      }>("/submit/", {
        method: "POST",
        body: JSON.stringify({ problem_id: problem.id, language, code }),
      });
      setResult(data.result);
      setReward(data.reward);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setBusy(null);
    }
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current) return;
    const root = document.getElementById("ide-root");
    if (!root) return;
    const rect = root.getBoundingClientRect();
    if (dragging.current === "h") {
      const x = e.clientX - rect.left;
      const pct = Math.max(25, Math.min(70, (x / rect.width) * 100));
      setLeftWidth(pct);
    } else if (dragging.current === "v") {
      const y = rect.bottom - e.clientY;
      setConsoleHeight(Math.max(100, Math.min(450, y)));
    }
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return (
    <div
      id="ide-root"
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#0b0e14] shadow-2xl transition-all",
        fullscreen && "fixed inset-2 z-50 rounded-xl"
      )}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 bg-zinc-900/60 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => changeLanguage(l.id)}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition-all duration-150 active:scale-[0.97]",
                language === l.id
                  ? "bg-emerald-500 font-bold text-zinc-950 shadow-[0_1px_8px_rgba(16,185,129,0.35)]"
                  : "text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-200"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span>{t.workspace.fontSize}:</span>
            <input
              type="range"
              min={12}
              max={20}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-16 accent-emerald-500"
            />
          </label>
          <Button
            variant="ghost"
            size="icon"
            title={t.workspace.copyCode}
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title={t.workspace.resetCode}
            onClick={() => setCode(problem.starter_code?.[language] || "")}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title={t.workspace.fullscreen}
            onClick={() => setFullscreen((f) => !f)}
          >
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Main split view */}
      <div className="flex min-h-0 flex-1" style={{ height: fullscreen ? "calc(100vh - 180px)" : 580 }}>
        {/* Left pane: Problem description */}
        <aside
          className="overflow-y-auto border-r border-zinc-800/80 p-5"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">
              {getProblemTitle(problem, lang)}
            </h1>
            <Badge className={difficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
            <Badge>+{problem.xp_reward} XP</Badge>
          </div>
          <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-zinc-300 leading-relaxed">
            {getProblemDescription(problem, lang)}
          </div>
          {problem.examples?.map((ex, i) => (
            <div key={i} className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3.5 text-sm">
              <div className="mb-1 text-xs font-semibold text-zinc-400">
                {t.workspace.examples} {i + 1}
              </div>
              <div className="text-xs text-zinc-400">{t.workspace.input}</div>
              <pre className="mt-1 overflow-x-auto rounded-lg bg-black/50 p-2.5 font-mono text-xs text-zinc-200">
                {ex.input}
              </pre>
              <div className="mt-2 text-xs text-zinc-400">{t.workspace.expectedOutput}</div>
              <pre className="mt-1 overflow-x-auto rounded-lg bg-black/50 p-2.5 font-mono text-xs text-zinc-200">
                {ex.output}
              </pre>
            </div>
          ))}
          {problem.constraints && (
            <div className="mt-4">
              <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                {t.workspace.constraints}
              </div>
              <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-zinc-900/40 p-2.5 text-xs text-zinc-400 font-mono">
                {problem.constraints}
              </pre>
            </div>
          )}
        </aside>

        {/* Resizer bar */}
        <div
          className="w-1.5 cursor-col-resize bg-zinc-800 hover:bg-emerald-500/50 transition"
          onMouseDown={() => {
            dragging.current = "h";
          }}
        />

        {/* Right pane: Monaco Editor */}
        <div className="flex min-w-0 flex-1 flex-col" style={{ width: `${100 - leftWidth}%` }}>
          <div className="min-h-[580px] flex-1" style={{ minHeight: 580 }}>
            <Editor
              height="100%"
              theme="vs-dark"
              language={monacoLang}
              value={code}
              onChange={(v) => setCode(v || "")}
              onMount={onMount}
              options={{
                fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                insertSpaces: true,
                wordWrap: "on",
                lineNumbers: "on",
                fontFamily: "JetBrains Mono, Fira Code, monospace",
                padding: { top: 12 },
              }}
            />
          </div>
        </div>
      </div>

      {/* Horizontal resizer */}
      <div
        className="h-1.5 cursor-row-resize bg-zinc-800 hover:bg-emerald-500/50 transition"
        onMouseDown={() => {
          dragging.current = "v";
        }}
      />

      {/* Console / Test Results Panel */}
      <div className="border-t border-zinc-800/80 bg-[#0a0c10]" style={{ height: consoleHeight }}>
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {t.workspace.console} / {t.workspace.testResults}
          </span>
          {result && (
            <span className={cn("text-xs font-bold", statusColor(result.status))}>
              {formatStatus(result.status)} · {result.passed_tests}/{result.total_tests} ·{" "}
              {result.runtime_ms?.toFixed?.(1) ?? result.runtime_ms} ms
            </span>
          )}
        </div>
        <div className="h-[calc(100%-36px)] overflow-y-auto p-3.5 font-mono text-xs">
          {error && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-rose-400">
              {error}
            </div>
          )}
          {reward?.first_solve && (
            <div className="mb-2.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 p-2.5 text-emerald-300 font-sans font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span>🎉</span> {t.workspace.congrats} +{reward.xp_gained} {t.workspace.xpGained}
            </div>
          )}
          {!result && !error && (
            <div className="text-zinc-500">
              {t.workspace.runCode} yoki {t.workspace.submitCode} tugmasini bosing.
            </div>
          )}
          {result?.stderr && (
            <pre className="mb-2 whitespace-pre-wrap text-rose-400">{result.stderr}</pre>
          )}
          {result?.test_results?.map((tCase, i) => (
            <div
              key={i}
              className={cn(
                "mb-2.5 rounded-xl border p-3",
                tCase.passed
                  ? "border-emerald-900/60 bg-emerald-950/20"
                  : "border-rose-900/60 bg-rose-950/20"
              )}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {tCase.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-400" />
                  )}
                  <span className="font-semibold text-zinc-200">
                    {t.workspace.testCase} {i + 1}
                  </span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                      tCase.passed
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-rose-500/20 text-rose-400"
                    )}
                  >
                    {tCase.passed ? t.workspace.passed : t.workspace.failed}
                  </span>
                </div>
                <span className="text-zinc-500">{tCase.runtime_ms?.toFixed?.(2)} ms</span>
              </div>
              <div className="grid gap-1 text-zinc-400 mt-2">
                <div>
                  <span className="text-zinc-500">{t.workspace.input}:</span> {tCase.input}
                </div>
                <div>
                  <span className="text-zinc-500">{t.workspace.expected}:</span> {tCase.expected}
                </div>
                <div>
                  <span className="text-zinc-500">{t.workspace.actual}:</span>{" "}
                  {tCase.actual || tCase.error || "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="flex items-center justify-end gap-3 border-t border-zinc-800/80 bg-zinc-900/60 px-4 py-2.5 backdrop-blur-md">
        <Button variant="secondary" onClick={run} disabled={!!busy}>
          <Play className="h-4 w-4 text-emerald-400 fill-emerald-400" />
          {busy === "run" ? t.workspace.running : t.workspace.runCode}
        </Button>
        <Button onClick={submit} disabled={!!busy}>
          <Send className="h-4 w-4" />
          {busy === "submit" ? t.workspace.submitting : t.workspace.submitCode}
        </Button>
      </div>
    </div>
  );
}
