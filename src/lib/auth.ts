import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface JWTPayload {
  id: number;
  name: string;
  email: string;
  role: "user" | "booster" | "admin";
}

export function verifyToken(req: NextRequest): JWTPayload | null {
  const header = req.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) return null;

  try {
    const token = header.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET não configurado");
      return null;
    }
    return jwt.verify(token, secret) as JWTPayload;
  } catch {
    return null;
  }
}

export function requireAuth(req: NextRequest): JWTPayload | NextResponse {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Token não fornecido ou inválido" }, { status: 401 });
  }
  return user;
}

export function requireRole(req: NextRequest, ...roles: string[]): JWTPayload | NextResponse {
  const result = requireAuth(req);
  if (result instanceof NextResponse) return result;
  if (!roles.includes(result.role)) {
    return NextResponse.json({ error: "Acesso negado. Permissão insuficiente." }, { status: 403 });
  }
  return result;
}

export function isUser(result: JWTPayload | NextResponse): result is JWTPayload {
  return !(result instanceof NextResponse);
}
