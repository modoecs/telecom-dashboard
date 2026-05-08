import {
  Chart as ChartJS, ArcElement, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import Header from '../components/layout/Header'
import KPICard from '../components/cards/KPICard'
import SkeletonCard from '../components/cards/SkeletonCard'
import { useKPIs } from '../hooks/useKPIs'
import { useProviderBenchmark } from '../hooks/useProviderBenchmark'
import { useNPSBreakdown } from '../hooks/useNPSBreakdown'
import { formatNumber, formatHours, npsColor, csatColor, spiColor } from '../utils/formatters'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const GRID   = 'rgba(255,255,255,0.05)'
const TICK   = 'rgba(255,255,255,0.35)'
const COLORS = { safaricom: '#1D9E75', airtel: '#4a90d9', telkom: '#D85A30' }

export default function ExecutiveOverview() {
  const { data: kpis,      loading: kLoading } = useKPIs()
  const { data: benchmark, loading: bLoading } = useProviderBenchmark()
  const { data: nps,       loading: nLoading } = useNPSBreakdown()

  const card = (label, value, sub, color, icon) => (
    kLoading
      ? <SkeletonCard key={label} />
      : <KPICard key={label} label={label} value={value} sub={sub} color={color} icon={icon} />
  )

  return (
    <div>
      <Header
        title="Executive Overview"
        subtitle="Kenya telecom CX performance — CA Kenya Q3 FY2024/25 calibrated"
      />

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
        padding: '0 32px',
        marginBottom: '28px',
      }}>
        {card('Total Customers',   kpis ? formatNumber(kpis.total_customers)        : '—', `+${kpis?.mom_growth_pct}% MoM`,          '#e2e8f0', '👥')}
        {card('Overall CSAT',      kpis ? `${kpis.overall_csat}%`                   : '—', 'Target: 75%',                              csatColor(kpis?.overall_csat ?? 0), '⭐')}
        {card('Net Promoter Score',kpis ? `+${kpis.overall_nps}`                    : '—', 'Industry avg: +31',                        npsColor(kpis?.overall_nps ?? 0),  '📈')}
        {card('Churn Risk',        kpis ? `${kpis.churn_risk_pct}%`                 : '—', kpis ? `${formatNumber(kpis.churn_risk_count)} customers` : '', '#EF9F27', '⚠️')}
        {card('Complaint Rate',    kpis ? `${kpis.complaint_rate}%`                 : '—', kpis ? `${formatNumber(kpis.total_complaints)} open cases`  : '', '#E24B4A', '🚨')}
        {card('Avg Resolution',    kpis ? formatHours(kpis.avg_resolution_hours)    : '—', `SLA: ${kpis?.resolution_sla_hours}h`,      kpis?.avg_resolution_hours > 24 ? '#E24B4A' : '#1D9E75', '⏱')}
      </div>

      {/* Benchmark Table + NPS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px', padding: '0 32px', marginBottom: '28px' }}>

        {/* Benchmark Table */}
        <div style={{ background: '#13161f', border: '1px solid #1e2330', borderRadius: '10px', padding: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', marginBottom: '16px' }}>
            Provider Competitive Benchmark
          </div>
          {bLoading ? <p style={{ color: '#6b7280', fontSize: '13px' }}>Loading...</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr>
                  {['Provider','CSAT','NPS','Complaints','Resolution','Churn','SPI'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '6px 8px', color: '#6b7280', borderBottom: '1px solid #1e2330', fontWeight: 500 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {benchmark.map(p => (
                  <tr key={p.slug}>
                    <td style={{ padding: '10px 8px', color: '#e2e8f0', fontWeight: 500, borderBottom: '1px solid #1e2330' }}>{p.provider}</td>
                    <td style={{ padding: '10px 8px', color: csatColor(p.csat),  borderBottom: '1px solid #1e2330' }}>{p.csat}%</td>
                    <td style={{ padding: '10px 8px', color: npsColor(p.nps),    borderBottom: '1px solid #1e2330' }}>+{p.nps}</td>
                    <td style={{ padding: '10px 8px', color: '#e2e8f0',          borderBottom: '1px solid #1e2330' }}>{p.complaint_rate}%</td>
                    <td style={{ padding: '10px 8px', color: p.avg_resolution_hours > 24 ? '#E24B4A' : '#1D9E75', borderBottom: '1px solid #1e2330' }}>{p.avg_resolution_hours}h</td>
                    <td style={{ padding: '10px 8px', color: p.churn_risk > 20 ? '#E24B4A' : '#EF9F27', borderBottom: '1px solid #1e2330' }}>{p.churn_risk}%</td>
                    <td style={{ padding: '10px 8px', color: spiColor(p.spi), fontWeight: 600, borderBottom: '1px solid #1e2330' }}>{p.spi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* NPS Breakdown */}
        <div style={{ background: '#13161f', border: '1px solid #1e2330', borderRadius: '10px', padding: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', marginBottom: '4px' }}>
            NPS Breakdown by Provider
          </div>
          <div style={{ fontSize: '11px', color: '#4a5568', marginBottom: '16px' }}>
            Promoters (9–10) · Passives (7–8) · Detractors (0–6)
          </div>
          {nLoading ? <p style={{ color: '#6b7280', fontSize: '13px' }}>Loading...</p> : (
            nps.map(p => (
              <div key={p.slug} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>{p.provider}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: npsColor(p.nps_score) }}>
                    NPS {p.nps_score > 0 ? '+' : ''}{p.nps_score}
                  </span>
                </div>
                <div style={{ display: 'flex', height: '14px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${p.pct_promoters}%`,  background: '#1D9E75' }} title={`Promoters ${p.pct_promoters}%`} />
                  <div style={{ width: `${p.pct_passives}%`,   background: '#4a5568' }} title={`Passives ${p.pct_passives}%`} />
                  <div style={{ width: `${p.pct_detractors}%`, background: '#E24B4A' }} title={`Detractors ${p.pct_detractors}%`} />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '10px', color: '#4a5568' }}>
                  <span style={{ color: '#1D9E75' }}>▌ {p.pct_promoters}%</span>
                  <span style={{ color: '#4a5568' }}>▌ {p.pct_passives}%</span>
                  <span style={{ color: '#E24B4A' }}>▌ {p.pct_detractors}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}