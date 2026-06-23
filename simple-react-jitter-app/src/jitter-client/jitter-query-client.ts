import { QueryClient } from '@tanstack/react-query'
import calculateRetryDelay from './calculate-retry-delay.ts'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
            retryDelay: (retryCount: number) => {
                return calculateRetryDelay(retryCount, {
                    baseMultiplier: 2,
                    initialWaitMs: 1000,
                    maxDelayMs: 30000
                })
            },
        },
    },
})
