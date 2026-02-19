"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

interface User {
  id: number;
  email: string;
  username: string;
  role: "client" | "booster" | "admin";
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
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
    const data = await api.post<{ token: string; user: User }>("/auth/login", {
      email,
      password,
    });
    localStorage.setItem("token", data.token);
    setState({ user: data.user, loading: false });
    return data.user;
  }, []);

  const register = useCallback(
    async (email: string, password: string, username: string) => {
      const data = await api.post<{ token: string; user: User }>(
        "/auth/register",
        { email, password, username }
      );
      localStorage.setItem("token", data.token);
      setState({ user: data.user, loading: false });
      return data.user;
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setState({ user: null, loading: false });
  }, []);

  return { ...state, login, register, logout };
}
