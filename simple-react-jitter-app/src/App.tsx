import { useState, } from 'react'
import { useQuery, } from '@tanstack/react-query'
import './App.css'
import { apiService, } from './jitter-client/api-client'

function App() {
  const [failureMode] = useState(false)
  const queryKey = ['demo-data', failureMode]

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
        apiService.getDataAndFail()
  })

  return (
    <main className="query-demo">
      <h1>React Query Demo</h1>
      <p className="query-demo-subtitle">
        Demonstrates useQuery with exponential backoff + jitter retries. 
        Check network tab of browser dev-tools (f12), to see requests being made.
      </p>

      <section className="query-demo-card">
        {isLoading ? <p>Loading data...</p> : null}

        {isError ? (
          <p className="query-demo-error">{'Done retrying failing request - reload to try again'}</p>
        ) : null}

        {!isLoading && !isError ? (
          <pre className="query-demo-json">
            {JSON.stringify(data ?? {}, null, 2)}
          </pre>
        ) : null}

        {isFetching && (
          <p className="query-demo-loading-hint">
            Retrying with exponential backoff + jitter...
          </p>
        )}

      </section>
    </main>
  )
}

export default App
