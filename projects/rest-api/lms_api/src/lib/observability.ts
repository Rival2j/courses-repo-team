import * as Sentry from "@sentry/node";

type ObservabilityInitInput = {
  sentryDsn?: string;
  environment?: string;
  release?: string;
  serviceName: string;
};

export type RequestContextInput = {
  requestId?: string | number;
  method?: string;
  url?: string;
  userId?: string;
};

let sentryEnabled = false;

export function initObservability(input: ObservabilityInitInput): boolean {
  if (!input.sentryDsn) {
    sentryEnabled = false;
    return false;
  }

  Sentry.init({
    dsn: input.sentryDsn,
    environment: input.environment,
    release: input.release,
    tracesSampleRate: 0,
  });

  Sentry.setTag("service", input.serviceName);
  sentryEnabled = true;
  return true;
}

export function captureException(error: unknown, context?: RequestContextInput): void {
  if (!sentryEnabled) {
    return;
  }

  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext("request", {
        request_id: context.requestId,
        method: context.method,
        url: context.url,
      });

      if (context.userId) {
        scope.setUser({ id: context.userId });
      }
    }

    Sentry.captureException(error);
  });
}
