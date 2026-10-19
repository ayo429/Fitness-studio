import { useEffect, useState } from 'react'

// Fetches JSON from the API and reports loading / error / slow states.
// "slow" turns true after 3 seconds, which usually means the free
// server is waking up from sleep.
export default function useFetch(url) {
  const [state, setState] = useState({ data: null, error: null, loading: true, slow: false })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const slowTimer = setTimeout(() => {
      setState((s) => (s.loading ? { ...s, slow: true } : s))
    }, 3000)

    fetch(url, { signal: controller.signal, credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        return res.json()
      })
      .then((data) => setState({ data, error: null, loading: false, slow: false }))
      .catch((err) => {
        if (err.name === 'AbortError') return
        setState({ data: null, error: err.message, loading: false, slow: false })
      })

    return () => {
      clearTimeout(slowTimer)
      controller.abort()
    }
  }, [url, attempt])

  const retry = () => {
    setState({ data: null, error: null, loading: true, slow: false })
    setAttempt((a) => a + 1)
  }

  return { ...state, retry }
}
