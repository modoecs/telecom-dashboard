import { useState, useEffect } from 'react'
import { fetchSpendDistribution } from '../api/api'

export function useSpendDistribution() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    fetchSpendDistribution()
      .then(res => { setData(res.data); setError(null) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}