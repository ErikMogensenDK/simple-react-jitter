import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import MockAdapter from "axios-mock-adapter";
import { apiClient, apiService } from "../jitter-client/api-client";

describe("integration: exponential backoff", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    vi.useFakeTimers();
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.restore();
    vi.useRealTimers();
  });

  it("waits between retries with exponential delays", async () => {
    let callCount = 0;

    mock.onGet("/testPath").reply(() => {
      callCount += 1;
      if (callCount < 4) return [500, { error: "fail" }]; // fail 3 times
      return [200, { ok: true }]; // succeed on 4th call
    });

    // deterministic exponential delays for test
    const plannedDelays = [100, 200, 400];
    let i = 0;
    const retryDelay = vi.fn(() => plannedDelays[i++]);

    const qc = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 3,
          retryDelay,
        },
      },
    });

    const promise = qc.fetchQuery({
      queryKey: ["data"],
      queryFn: () => apiService.getData<{ ok: boolean }>(),
    });

    // Let the initial request cycle start before timing assertions.
    await vi.advanceTimersByTimeAsync(0);

    // initial call happens immediately
    expect(callCount).toBe(1);

    await vi.advanceTimersByTimeAsync(99);
    expect(callCount).toBe(1);

    await vi.advanceTimersByTimeAsync(1); // +100 => retry 1
    expect(callCount).toBe(2);

    await vi.advanceTimersByTimeAsync(200); // retry 2
    expect(callCount).toBe(3);

    await vi.advanceTimersByTimeAsync(400); // retry 3
    expect(callCount).toBe(4);

    await expect(promise).resolves.toEqual({ ok: true });
    expect(retryDelay).toHaveBeenCalledTimes(3);
  });
});