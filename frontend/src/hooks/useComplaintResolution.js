import { useState, useEffect } from 'react'
import { fetchComplaintResolution } from '../api/api'

export function useComplaintResolution() {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    fetchComplaintResolution()
      .then(res => { setData(res.data); setError(null) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}