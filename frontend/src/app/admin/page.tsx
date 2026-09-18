"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Protected } from "@/components/layout/protected";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { Category, Paginated, Problem, Submission, User } from "@/lib/types";

type Stats = {
  users: number;
  problems: number;
  submissions: number;
  accepted: number;
};

export default function AdminPage() {
  return (
    <Protected adminOnly>
      <AdminInner />
    </Protected>
  );
}

function AdminInner() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tab, setTab] = useState<"overview" | "users" | "problems" | "submissions">("overview");

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");

  const load = () => {
    api<Stats>("/admin/stats/").then(setStats).catch(console.error);
    api<Paginated<User>>("/admin/users/").then((r) => setUsers(r.results || (r as unknown as User[]))).catch(console.error);
    api<Paginated<Problem>>("/problems/?page_size=100").then((r) => setProblems(r.results)).catch(console.error);
    api<Paginated<Submission>>("/admin/submissions/").then((r) => setSubmissions(r.results)).catch(console.error);
    api<Paginated<Category> | Category[]>("/categories/", { auth: false }).then((r) => {
      const list = Array.isArray(r) ? r : r.results;
      setCategories(list);
      if (list[0]) setCategoryId(String(list[0].id));
    });
  };

  useEffect(() => {
    load();
  }, []);

  const createProblem = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      await api("/problems/", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          difficulty,
          category_id: Number(categoryId),
          xp_reward: difficulty === "easy" ? 10 : difficulty === "medium" ? 25 : 50,
          constraints: "",
          examples: [],
          starter_code: {},
        }),
      });
      setTitle("");
      setDescription("");
      setMsg("Problem created.");
      load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Failed");
    }
  };

  const deleteProblem = async (slug: string) => {
    if (!confirm("Delete this problem?")) return;
    await api(`/problems/${slug}/`, { method: "DELETE" });
    load();
  };

  return (
    <AppShell>
      <h1 className="mb-2 font-display-discord text-[36px] text-snow sm:text-[48px]">Admin</h1>
      <p className="mb-6 text-sm text-fog">Manage users, problems, and platform stats</p>

      <div className="mb-6 flex gap-2">
        {(["overview", "users", "problems", "submissions"] as const).map((t) => (
          <Button key={t} variant={tab === t ? "default" : "secondary"} size="sm" onClick={() => setTab(t)}>
            {t}
          </Button>
        ))}
      </div>

      {tab === "overview" && stats && (
        <div className="grid gap-4 sm:grid-cols-4">
          {Object.entries(stats).map(([k, v]) => (
            <Card key={k}>
              <CardContent className="p-5">
                <div className="text-xs uppercase text-fog">{k}</div>
                <div className="text-2xl font-medium text-snow">{v as number}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="overflow-hidden rounded-[16px] bg-not-quite-black">
          <table className="w-full text-sm">
            <thead className="bg-dark-charcoal text-xs uppercase text-fog">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Admin</th>
                <th className="px-4 py-3 text-left">XP</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-dim-grey/40">
                  <td className="px-4 py-3 text-snow">{u.username}</td>
                  <td className="px-4 py-3 text-fog">{u.email}</td>
                  <td className="px-4 py-3 text-snow">{u.is_admin ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-ember-orange">{u.profile?.xp ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "problems" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Create problem</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={createProblem} className="space-y-3">
                <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea
                  className="min-h-28 w-full rounded-[12px] border border-dim-grey bg-not-quite-black p-3 text-sm text-snow"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <select
                  className="h-10 w-full rounded-[12px] border border-dim-grey bg-not-quite-black px-3 text-sm text-snow"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <select
                  className="h-10 w-full rounded-[12px] border border-dim-grey bg-not-quite-black px-3 text-sm text-snow"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {msg && <p className="text-sm text-spring-green">{msg}</p>}
                <Button type="submit">Create</Button>
              </form>
            </CardContent>
          </Card>
          <div className="space-y-2">
            {problems.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-[12px] bg-not-quite-black px-3 py-2 text-sm"
              >
                <span className="text-snow">
                  {p.title}{" "}
                  <span className="text-greyple">({p.difficulty})</span>
                </span>
                <Button variant="danger" size="sm" onClick={() => deleteProblem(p.slug)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "submissions" && (
        <div className="overflow-hidden rounded-[16px] bg-not-quite-black">
          <table className="w-full text-sm">
            <thead className="bg-dark-charcoal text-xs uppercase text-fog">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Problem</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Lang</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className="border-t border-dim-grey/40">
                  <td className="px-4 py-3 text-snow">{s.username}</td>
                  <td className="px-4 py-3 text-fog">{s.problem_title}</td>
                  <td className="px-4 py-3 text-snow">{s.status}</td>
                  <td className="px-4 py-3 text-fog">{s.language}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
