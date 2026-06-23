import axios from 'axios'
import { applyIdempotencyKeyHeader, applyRetryCount } from './apply-retry-meta-data';

// export const apiClient = axios.create({ baseURL: '/api' })
export const apiClient = axios.create({ 
    baseURL: 'http://localhost:3001/api',
    timeout: 5000,
 })

apiClient.interceptors.request.use(applyRetryCount);
apiClient.interceptors.request.use(applyIdempotencyKeyHeader);

// deliberately failing endpoint
const FAIL_PATH = '/testPath/fail'

export async function getDataAndFail() {
    const response = await apiClient.get(FAIL_PATH)
    return response.data
}

export const apiService = {
    getDataAndFail,
}