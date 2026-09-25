"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor, { BeforeMount, OnMount } from "@monaco-editor/react";
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
import { useAuth } from "@/store/auth";
import { getProblemDescription, getProblemTitle } from "@/lib/problem-translations";
import type { Problem, Submission } from "@/lib/types";
import { cn, difficultyColor, formatStatus, statusColor } from "@/lib/utils";

const LANGS = [
  { id: "python", label: "Python", monaco: "python" },
  { id: "javascript", label: "JavaScript", monaco: "javascript" },
  { id: "cpp", label: "C++", monaco: "cpp" },
  { id: "java", label: "Java", monaco: "java" },
] as const;

type Reward = {
  first_solve: boolean;
  xp_gained: number;
  coins_gained?: number;
  total_coins?: number;
};

// Do'kondan sotib olinadigan IDE mavzulari (ShopItem.preview_data.themeId)
const defineShopThemes: BeforeMount = (monaco) => {
  monaco.editor.defineTheme("cyberpunk-neon", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "ff2e97", fontStyle: "bold" },
      { token: "string", foreground: "00f5d4" },
      { token: "number", foreground: "fee440" },
      { token: "comment", foreground: "7b6f9c", fontStyle: "italic" },
      { token: "type", foreground: "a855f7" },
    ],
    colors: {
      "editor.background": "#120b24",
      "editor.foreground": "#e0d7ff",
      "editor.lineHighlightBackground": "#1f1440",
      "editorCursor.foreground": "#ff2e97",
      "editorLineNumber.foreground": "#5b4a8a",
      "editor.selectionBackground": "#a855f755",
    },
  });
  monaco.editor.defineTheme("matrix-green", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "22c55e" },
      { token: "keyword", foreground: "4ade80", fontStyle: "bold" },
      { token: "string", foreground: "86efac" },
      { token: "number", foreground: "bbf7d0" },
      { token: "comment", foreground: "166534", fontStyle: "italic" },
    ],
    colors: {
      "editor.background": "#000000",
      "editor.foreground": "#22c55e",
      "editor.lineHighlightBackground": "#052e16",
      "editorCursor.foreground": "#4ade80",
      "editorLineNumber.foreground": "#14532d",
      "editor.selectionBackground": "#16a34a55",
    },
  });
  monaco.editor.defineTheme("monokai-pro", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "ff6188" },
      { token: "string", foreground: "ffd866" },
      { token: "number", foreground: "ab9df2" },
      { token: "comment", foreground: "727072", fontStyle: "italic" },
      { token: "type", foreground: "78dce8" },
      { token: "identifier", foreground: "fcfcfa" },
    ],
    colors: {
      "editor.background": "#2d2a2e",
      "editor.foreground": "#fcfcfa",
      "editor.lineHighlightBackground": "#403e41",
      "editorCursor.foreground": "#fcfcfa",
      "editorLineNumber.foreground": "#5b595c",
      "editor.selectionBackground": "#5b595c88",
    },
  });
};

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
  const editorTheme = useAuth((s) => s.user?.profile?.equipped_theme) || "vs-dark";
  const fetchMe = useAuth((s) => s.fetchMe);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(problem.starter_code?.python || "");
  const [fontSize, setFontSize] = useState(14);
  const [fullscreen, setFullscreen] = useState(false);
  const [leftWidth, setLeftWidth] = useState(40);
  const [consoleHeight, setConsoleHeight] = useState(190);
  const [busy, setBusy] = useState<"run" | "submit" | null>(null);
  const [result, setResult] = useState<RunPayload | null>(null);
  const [reward, setReward] = useState<Reward | null>(null);
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
        reward: Reward | null;
      }>("/submit/", {
        method: "POST",
        body: JSON.stringify({ problem_id: problem.id, language, code }),
      });
      setResult(data.result);
      setReward(data.reward);
      // Navbar'dagi coin/XP balansini yangilash
      if (data.reward) fetchMe().catch(() => {});
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
        "flex flex-col overflow-hidden rounded-[16px] border border-dim-grey/50 bg-not-quite-black shadow-2xl transition-all",
        fullscreen && "fixed inset-2 z-50 rounded-xl"
      )}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dim-grey/50 bg-dark-charcoal px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => changeLanguage(l.id)}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition-all duration-150 active:scale-[0.97]",
                language === l.id
                  ? "bg-blurple font-bold text-snow "
                  : "text-fog hover:bg-not-quite-black hover:text-snow"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-fog">
            <span>{t.workspace.fontSize}:</span>
            <input
              type="range"
              min={12}
              max={20}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-16 accent-blurple"
            />
          </label>
          <Button
            variant="ghost"
            size="icon"
            title={t.workspace.copyCode}
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-4 w-4 text-spring-green" />
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
          className="overflow-y-auto border-r border-dim-grey/50 p-5"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-snow">
              {getProblemTitle(problem, lang)}
            </h1>
            <Badge className={difficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
            <Badge>+{problem.xp_reward} XP</Badge>
          </div>
          <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-fog leading-relaxed">
            {getProblemDescription(problem, lang)}
          </div>
          {problem.examples?.map((ex, i) => (
            <div key={i} className="mt-4 rounded-xl border border-dim-grey/50 bg-dark-charcoal p-3.5 text-sm">
              <div className="mb-1 text-xs font-semibold text-fog">
                {t.workspace.examples} {i + 1}
              </div>
              <div className="text-xs text-fog">{t.workspace.input}</div>
              <pre className="mt-1 overflow-x-auto rounded-lg bg-void/60 p-2.5 font-mono text-xs text-snow">
                {ex.input}
              </pre>
              <div className="mt-2 text-xs text-fog">{t.workspace.expectedOutput}</div>
              <pre className="mt-1 overflow-x-auto rounded-lg bg-void/60 p-2.5 font-mono text-xs text-snow">
                {ex.output}
              </pre>
            </div>
          ))}
          {problem.constraints && (
            <div className="mt-4">
              <div className="text-xs font-semibold text-fog uppercase tracking-wider">
                {t.workspace.constraints}
              </div>
              <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-dark-charcoal p-2.5 text-xs text-fog font-mono">
                {problem.constraints}
              </pre>
            </div>
          )}
        </aside>

        {/* Resizer bar */}
        <div
          className="w-1.5 cursor-col-resize bg-dim-grey/60 hover:bg-blurple/50 transition"
          onMouseDown={() => {
            dragging.current = "h";
          }}
        />

        {/* Right pane: Monaco Editor */}
        <div className="flex min-w-0 flex-1 flex-col" style={{ width: `${100 - leftWidth}%` }}>
          <div className="min-h-[580px] flex-1" style={{ minHeight: 580 }}>
            <Editor
              height="100%"
              theme={editorTheme}
              beforeMount={defineShopThemes}
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
        className="h-1.5 cursor-row-resize bg-dim-grey/60 hover:bg-blurple/50 transition"
        onMouseDown={() => {
          dragging.current = "v";
        }}
      />

      {/* Console / Test Results Panel */}
      <div className="border-t border-dim-grey/50 bg-void" style={{ height: consoleHeight }}>
        <div className="flex items-center justify-between border-b border-dim-grey/50 px-4 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-fog">
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
            <div className="rounded-lg border border-ekko-red/30 bg-ekko-red/10 p-2.5 text-ekko-red">
              {error}
            </div>
          )}
          {reward?.first_solve && (
            <div className="mb-2.5 rounded-lg border border-spring-green/40 bg-spring-green/10 p-2.5 text-spring-green font-sans font-semibold flex items-center gap-2 ">
              <span>🎉</span> {t.workspace.congrats} +{reward.xp_gained} {t.workspace.xpGained}
              {!!reward.coins_gained && (
                <span className="ml-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-amber-300">
                  🪙 +{reward.coins_gained} {t.workspace.coinsGained}
                </span>
              )}
            </div>
          )}
          {!result && !error && (
            <div className="text-greyple">
              {t.workspace.runCode} yoki {t.workspace.submitCode} tugmasini bosing.
            </div>
          )}
          {result?.stderr && (
            <pre className="mb-2 whitespace-pre-wrap text-ekko-red">{result.stderr}</pre>
          )}
          {result?.test_results?.map((tCase, i) => (
            <div
              key={i}
              className={cn(
                "mb-2.5 rounded-xl border p-3",
                tCase.passed
                  ? "border-spring-green/30 bg-spring-green/10"
                  : "border-ekko-red/30 bg-ekko-red/10"
              )}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {tCase.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-spring-green" />
                  ) : (
                    <XCircle className="h-4 w-4 text-ekko-red" />
                  )}
                  <span className="font-semibold text-snow">
                    {t.workspace.testCase} {i + 1}
                  </span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                      tCase.passed
                        ? "bg-blurple/20 text-spring-green"
                        : "bg-ekko-red/20 text-ekko-red"
                    )}
                  >
                    {tCase.passed ? t.workspace.passed : t.workspace.failed}
                  </span>
                </div>
                <span className="text-greyple">{tCase.runtime_ms?.toFixed?.(2)} ms</span>
              </div>
              <div className="grid gap-1 text-fog mt-2">
                <div>
                  <span className="text-greyple">{t.workspace.input}:</span> {tCase.input}
                </div>
                <div>
                  <span className="text-greyple">{t.workspace.expected}:</span> {tCase.expected}
                </div>
                <div>
                  <span className="text-greyple">{t.workspace.actual}:</span>{" "}
                  {tCase.actual || tCase.error || "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="flex items-center justify-end gap-3 border-t border-dim-grey/50 bg-dark-charcoal px-4 py-2.5 backdrop-blur-md">
        <Button variant="secondary" onClick={run} disabled={!!busy}>
          <Play className="h-4 w-4 text-spring-green fill-spring-green" />
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
