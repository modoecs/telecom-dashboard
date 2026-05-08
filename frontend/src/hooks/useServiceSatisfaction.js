import { useState, useEffect } from 'react'
import { fetchServiceSatisfaction } from '../api/api'

export function useServiceSatisfaction() {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    fetchServiceSatisfaction()
      .then(res => { setData(res.data); setError(null) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}