import { useState, useEffect } from 'react'
import { fetchChurnSegments } from '../api/api'

export function useChurnSegments() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    fetchChurnSegments()
      .then(res => { setData(res.data); setError(null) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}