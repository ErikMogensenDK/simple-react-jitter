import { afterEach, describe, expect, it, vi } from 'vitest'
import calculateRetryDelay, { type retryOptions } from '../jitter-client/calculate-retry-delay'

const defaultRetryOptions: retryOptions = {
    baseMultiplier: 2,
    initialWaitMs: 1000,
    maxDelayMs: 30000,
}

describe('calculateRetryDelay', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it.each([
        { failureCount: 1, maxExpectedDelay: 2001 },
        { failureCount: 3, maxExpectedDelay: 8001 },
        { failureCount: 500, maxExpectedDelay: 30001 },
    ])(
        'returns jittered delay within 0..$maxExpectedDelay for failureCount=$failureCount',
        ({ failureCount, maxExpectedDelay }) => {
            vi.spyOn(Math, 'random').mockReturnValue(1)
            const maxDelay = calculateRetryDelay(failureCount, defaultRetryOptions)
            expect(maxDelay).toBe(maxExpectedDelay)

            vi.spyOn(Math, 'random').mockReturnValue(0)
            const minDelay = calculateRetryDelay(failureCount, defaultRetryOptions)
            expect(minDelay).toBe(0)

            vi.spyOn(Math, 'random').mockReturnValue(0.5)
            const midDelay = calculateRetryDelay(failureCount, defaultRetryOptions)
            expect(midDelay).toBe(Math.floor(maxExpectedDelay/2))
        }
    )
})
