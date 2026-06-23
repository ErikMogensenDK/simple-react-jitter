export type retryOptions = {
    initialWaitMs: number,
    baseMultiplier: number,
    maxDelayMs: number,
}

function calculateRetryDelay(
    failureCount: number,
    {
        initialWaitMs = 1000,
        baseMultiplier = 2,
        maxDelayMs = 15000,
    }: retryOptions
) {

    const cappedDelay = Math.min(
        initialWaitMs * (baseMultiplier ** failureCount),
        maxDelayMs
    )

    return Math.floor((Math.random() * (cappedDelay + 1)))
}

export default calculateRetryDelay;
