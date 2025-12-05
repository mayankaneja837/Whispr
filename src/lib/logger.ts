export type LogARg = string | Error | unknown

export const logger = {
    log: (...args: LogARg[]) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(...args);
      }
    },
  
    error: (...args: LogARg[]) => {
      if (process.env.NODE_ENV !== "production") {
        console.error(...args);
      }
  
      try {
        const err = args[0] instanceof Error ? args[0] : new Error(JSON.stringify(args));
        import("@sentry/nextjs").then((Sentry) => Sentry.captureException(err));
      } catch (e) {
        console.error("Failed to report error:", e);
      }
    },
  };
  