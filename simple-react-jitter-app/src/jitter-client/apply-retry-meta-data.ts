import type { InternalAxiosRequestConfig } from "axios";

export function applyRetryCount(
    config: InternalAxiosRequestConfig & { __retryCount?: number; }
) {
    const c = config as typeof config & {
        __retryCount?: number;
    };

    if (c.__retryCount == null) {
        c.__retryCount = 0;
    } else {
        c.__retryCount = c.__retryCount + 1;
    }


    config.headers.set("x-retry-count", String(c.__retryCount));
    return config;
};

export function applyIdempotencyKeyHeader(
    config: InternalAxiosRequestConfig & { __idempotencyKey?: string }
) {
    const c = config as typeof config & {
        __idempotencyKey?: string;
    };

    if (c.__idempotencyKey == undefined) {
        c.__idempotencyKey = crypto.randomUUID();
    }

    config.headers.set("x-idempotency-key", String(c.__idempotencyKey));
    return config;
};


