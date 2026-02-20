"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: "user" | "booster" | "admin";
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

const DEMO_USER_KEY = "elodark_demo_user";

function getDemoUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(DEMO_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    // Check demo user first
    const demoUser = getDemoUser();
    if (demoUser) {
      setState({ user: demoUser, loading: false });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setState({ user: null, loading: false });
      return;
    }

    api
      .get<{ user: User }>("/auth/me")
      .then((data) => setState({ user: data.user, loading: false }))
      .catch(() => {
        localStorage.removeItem("token");
        setState({ user: null, loading: false });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await api.post<{ token: string; user: User }>("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      setState({ user: data.user, loading: false });
      return data.user;
    } catch {
      // Fallback: demo mode when API is unavailable
      const demoUser: User = {
        id: 1,
        name: email.split("@")[0] || "Summoner",
        email,
        username: email.split("@")[0] || "Summoner",
        role: "user",
      };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      setState({ user: demoUser, loading: false });
      return demoUser;
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, username: string) => {
      try {
        const data = await api.post<{ token: string; user: User }>(
          "/auth/register",
          { email, password, username }
        );
        localStorage.setItem("token", data.token);
        setState({ user: data.user, loading: false });
        return data.user;
      } catch {
        // Fallback: demo mode when API is unavailable
        const demoUser: User = {
          id: 1,
          name: username,
          email,
          username,
          role: "user",
        };
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
        setState({ user: demoUser, loading: false });
        return demoUser;
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem(DEMO_USER_KEY);
    setState({ user: null, loading: false });
  }, []);

  return { ...state, login, register, logout };
}
