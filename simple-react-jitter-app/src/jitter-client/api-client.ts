import axios from 'axios'
import { applyIdempotencyKeyHeader, applyRetryCount } from './apply-retry-meta-data';

// export const apiClient = axios.create({ baseURL: '/api' })
export const apiClient = axios.create({ 
    baseURL: 'http://localhost:3001/api',
    timeout: 5000,
 })

apiClient.interceptors.request.use(applyRetryCount);
apiClient.interceptors.request.use(applyIdempotencyKeyHeader);

const FAIL_PATH = '/testPath/fail'

/**
 * Calls a deliberately-failing endpoint.
 */
export async function getDataAndFail<T = unknown>() {
    const response = await apiClient.get<T>(FAIL_PATH)
    return response.data
}

export const apiService = {
    getDataAndFail,
}