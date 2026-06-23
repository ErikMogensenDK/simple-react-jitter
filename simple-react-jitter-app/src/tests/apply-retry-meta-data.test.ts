import { describe, expect, it, vi } from "vitest";
import { type InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import { applyIdempotencyKeyHeader, applyRetryCount } from "../jitter-client/apply-retry-meta-data";

type configWithNewHeaders = InternalAxiosRequestConfig & {
    __retryCount?: number;
    __idempotencyKey?: string;
}

describe("unit-test of interceptors", () => {

    it("sets retry-count to 0 on first attempt", async () => {
        const config = {
            headers: new AxiosHeaders(),
        } as configWithNewHeaders

        applyRetryCount(config);
        expect(config.__retryCount).toBeDefined();
        expect(config.headers.get("x-retry-count")).toBe('0');
        expect(config.__retryCount).toBe(0);

        applyRetryCount(config)
        expect(config.__retryCount).toBeDefined();
        expect(config.headers.get("x-retry-count")).toBe('1');
        expect(config.__retryCount).toBe(1);
    });

    it("returns expected guid also on second try", async () => {
        const config = {
            headers: new AxiosHeaders(),
        } as configWithNewHeaders

        const expectedGuid = crypto.randomUUID();
        const spy = vi.spyOn(crypto, 'randomUUID').mockReturnValue(expectedGuid)

        applyIdempotencyKeyHeader(config);
        expect(config.__idempotencyKey).toBeDefined();
        expect(config.headers.get("x-idempotency-key")).toBe(expectedGuid);
        expect(config.__idempotencyKey).toBe(expectedGuid);

        applyIdempotencyKeyHeader(config)
        expect(config.__idempotencyKey).toBeDefined();
        expect(config.headers.get("x-idempotency-key")).toBe(expectedGuid);
        expect(config.__idempotencyKey).toBe(expectedGuid);

        // if UUID method was only called once, the header was already present on second call
        expect(spy).toHaveBeenCalledOnce();
    });
});
