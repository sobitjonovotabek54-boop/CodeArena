const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export type Tokens = { access: string; refresh: string };

function getTokens(): Tokens | null {
  if (typeof window === "undefined") return null;
  const access = localStorage.getItem("ca_access");
  const refresh = localStorage.getItem("ca_refresh");
  if (!access || !refresh) return null;
  return { access, refresh };
}

export function setTokens(tokens: Tokens | null) {
  if (typeof window === "undefined") return;
  if (!tokens) {
    localStorage.removeItem("ca_access");
    localStorage.removeItem("ca_refresh");
    return;
  }
  localStorage.setItem("ca_access", tokens.access);
  localStorage.setItem("ca_refresh", tokens.refresh);
}

async function refreshAccess(): Promise<string | null> {
  const tokens = getTokens();
  if (!tokens?.refresh) return null;
  const res = await fetch(`${API_URL}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: tokens.refresh }),
  });
  if (!res.ok) {
    setTokens(null);
    return null;
  }
  const data = await res.json();
  setTokens({ access: data.access, refresh: data.refresh || tokens.refresh });
  return data.access as string;
}

export function formatApiError(err: unknown): string {
  if (!err) return "Xatolik yuz berdi";
  if (typeof err === "string") return err;

  if (typeof err === "object") {
    const obj = err as Record<string, unknown>;

    if (typeof obj.detail === "string") {
      const lower = obj.detail.toLowerCase();
      if (lower.includes("no active account") || lower.includes("credentials")) {
        return "Username yoki parol noto'g'ri.";
      }
      return obj.detail;
    }

    if (typeof obj.error === "string") {
      return obj.error;
    }

    const messages: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      let valText = "";
      if (Array.isArray(value)) {
        valText = value
          .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
          .join(" ");
      } else if (typeof value === "string") {
        valText = value;
      }

      const lower = valText.toLowerCase();
      if (key === "email") {
        if (lower.includes("already exists") || lower.includes("allaqachon") || lower.includes("exists")) {
          messages.push("Email noto'g'ri (bu email allaqachon ro'yxatdan o'tgan).");
        } else if (lower.includes("valid") || lower.includes("noto'g'ri")) {
          messages.push("Email manzili noto'g'ri kiritildi.");
        } else {
          messages.push(`Email: ${valText}`);
        }
      } else if (key === "username") {
        if (lower.includes("already exists") || lower.includes("allaqachon") || lower.includes("exists")) {
          messages.push("Bu username allaqachon band.");
        } else {
          messages.push(`Username: ${valText}`);
        }
      } else if (key === "password" || key === "password_confirm") {
        if (lower.includes("match") || lower.includes("mos")) {
          messages.push("Parollar bir-biriga mos kelmadi.");
        } else if (lower.includes("short") || lower.includes("kamida")) {
          messages.push("Parol kamida 6 ta belgidan iborat bo'lishi kerak.");
        } else {
          messages.push(`Parol: ${valText}`);
        }
      } else if (valText) {
        messages.push(valText);
      }
    }

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  return "So'rovni bajarishda xatolik yuz berdi.";
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const h = new Headers(headers);
  if (!h.has("Content-Type") && rest.body) h.set("Content-Type", "application/json");

  if (auth) {
    const access = getTokens()?.access;
    if (!access) throw new Error("Not authenticated");
    h.set("Authorization", `Bearer ${access}`);
  }

  let res = await fetch(`${API_URL}${path}`, { ...rest, headers: h });

  if (res.status === 401 && auth) {
    const newAccess = await refreshAccess();
    if (!newAccess) throw new Error("Session expired");
    h.set("Authorization", `Bearer ${newAccess}`);
    res = await fetch(`${API_URL}${path}`, { ...rest, headers: h });
  }

  if (!res.ok) {
    let detail = `So'rov xatosi (${res.status})`;
    try {
      const err = await res.json();
      detail = formatApiError(err);
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export { API_URL };
