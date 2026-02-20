type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function safeSerialize(value: unknown): unknown {
  try {
    return JSON.parse(
      JSON.stringify(value, (_key, current) => {
        if (typeof current === "bigint") return current.toString();
        if (current instanceof Error) {
          return {
            name: current.name,
            message: current.message,
            stack: current.stack,
          };
        }
        return current;
      })
    );
  } catch {
    return { message: "context_not_serializable" };
  }
}

function write(level: LogLevel, message: string, context?: LogContext) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    ...(context ? { context: safeSerialize(context) } : {}),
  };

  const serialized = JSON.stringify(payload);
  if (level === "error") {
    console.error(serialized);
    return;
  }
  if (level === "warn") {
    console.warn(serialized);
    return;
  }
  console.info(serialized);
}

export const logger = {
  info(message: string, context?: LogContext) {
    write("info", message, context);
  },
  warn(message: string, context?: LogContext) {
    write("warn", message, context);
  },
  error(message: string, error?: unknown, context?: LogContext) {
    write("error", message, {
      ...context,
      ...(error !== undefined ? { error: safeSerialize(error) } : {}),
    });
  },
};

export type { LogContext };
