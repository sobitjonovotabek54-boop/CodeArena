"use client";

import { create } from "zustand";
import { api, setTokens, type Tokens } from "@/lib/api";
import type { User } from "@/lib/types";

type AuthState = {
  user: User | null;
  loading: boolean;
  hydrated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  hydrated: false,

  hydrate: async () => {
    if (typeof window === "undefined") return;
    const access = localStorage.getItem("ca_access");
    if (!access) {
      set({ hydrated: true, user: null });
      return;
    }
    try {
      await get().fetchMe();
    } catch {
      setTokens(null);
      set({ user: null });
    } finally {
      set({ hydrated: true });
    }
  },

  fetchMe: async () => {
    const user = await api<User>("/auth/me/");
    set({ user });
  },

  login: async (username, password) => {
    set({ loading: true });
    try {
      const tokens = await api<Tokens>("/auth/login/", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ username, password }),
      });
      setTokens(tokens);
      await get().fetchMe();
    } finally {
      set({ loading: false });
    }
  },

  register: async (username, email, password) => {
    set({ loading: true });
    try {
      await api("/auth/register/", {
        method: "POST",
        auth: false,
        body: JSON.stringify({
          username,
          email,
          password,
          password_confirm: password,
        }),
      });
      await get().login(username, password);
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    setTokens(null);
    set({ user: null });
  },
}));
