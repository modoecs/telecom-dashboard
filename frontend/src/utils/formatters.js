// Format KShs currency
export const formatKShs = (value) => {
  if (value >= 1_000_000_000)
    return `KShs ${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000)
    return `KShs ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000)
    return `KShs ${(value / 1_000).toFixed(1)}K`
  return `KShs ${value}`
}

// Format large numbers with commas
export const formatNumber = (value) =>
  new Intl.NumberFormat('en-KE').format(value)

// Format percentage
export const formatPct = (value) => `${value}%`

// Format hours
export const formatHours = (value) => `${value}h`

// NPS badge colour
export const npsColor = (score) => {
  if (score >= 50) return '#1D9E75'
  if (score >= 20) return '#EF9F27'
  return '#E24B4A'
}

// CSAT badge colour
export const csatColor = (score) => {
  if (score >= 75) return '#1D9E75'
  if (score >= 60) return '#EF9F27'
  return '#E24B4A'
}

// SPI badge colour
export const spiColor = (score) => {
  if (score >= 75) return '#1D9E75'
  if (score >= 55) return '#EF9F27'
  return '#E24B4A'
}