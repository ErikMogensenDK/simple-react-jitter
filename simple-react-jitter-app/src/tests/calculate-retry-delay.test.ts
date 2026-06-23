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
        { failureCount: 1, maxExpectedDelay: 2000 },
        { failureCount: 3, maxExpectedDelay: 8000 },
        { failureCount: 500, maxExpectedDelay: 30000 },
    ])(
        'returns jittered delay within 0..$maxExpectedDelay for failureCount=$failureCount',
        ({ failureCount, maxExpectedDelay }) => {
            const delay = calculateRetryDelay(failureCount, defaultRetryOptions)

            expect(delay).toBeGreaterThanOrEqual(0)
            expect(delay).toBeLessThanOrEqual(maxExpectedDelay)
        }
    )

    it('returns 0 when random is 0', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0)

        const delay = calculateRetryDelay(1, defaultRetryOptions)

        expect(delay).toBe(0)
    })

    it('can return the capped max delay when random is near 1', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.999999)

        const delay = calculateRetryDelay(500, defaultRetryOptions)

        expect(delay).toBe(defaultRetryOptions.maxDelayMs)
    })
})
