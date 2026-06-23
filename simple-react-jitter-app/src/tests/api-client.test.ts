import { describe, expect, it, } from "vitest";
import { apiClient } from "../jitter-client/api-client";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

describe("request interceptor chain", () => {
  it("applies retry-count=0 and generates idempotency key on first request", async () => {
    const capturedConfigs: InternalAxiosRequestConfig[] = [];

    apiClient.defaults.adapter = async (
      config: InternalAxiosRequestConfig
    ): Promise<AxiosResponse> => {
      capturedConfigs.push(config);

      return {
        status: 500,
        data: {},
        headers: {},
        config,
        statusText: "ERR",
      };
    };

    await apiClient.get("/test").catch(() => {});

    const firstConfig = capturedConfigs[0];

    // manually replaying request, to simulate retry
    await apiClient.request(firstConfig).catch(() => {});

    expect(capturedConfigs[0].headers.get("x-retry-count")).toBe("0");
    expect(capturedConfigs[1].headers.get("x-retry-count")).toBe("1");
    expect(capturedConfigs[1].headers.get("x-idempotency-key")).toBe(
      capturedConfigs[0].headers.get("x-idempotency-key")
    );
  });
});