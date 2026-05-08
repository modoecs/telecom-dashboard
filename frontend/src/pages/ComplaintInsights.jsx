import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import Header from '../components/layout/Header'
import InsightBox from '../components/cards/InsightBox'
import { useComplaintCategories } from '../hooks/useComplaintCategories'
import { useComplaintResolution } from '../hooks/useComplaintResolution'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const GRID = 'rgba(255,255,255,0.05)'
const TICK = 'rgba(255,255,255,0.35)'

export default function ComplaintInsights() {
  const { data: categories, loading: cLoading } = useComplaintCategories()
  const { data: resolution, loading: rLoading } = useComplaintResolution()

  const catData = {
    labels: categories.map(c => c.label),
    datasets: [
      { label: 'Safaricom', data: categories.map(c => c.by_provider.safaricom), backgroundColor: '#1D9E75' },
      { label: 'Airtel',    data: categories.map(c => c.by_provider.airtel),    backgroundColor: '#4a90d9' },
      { label: 'Telkom',    data: categories.map(c => c.by_provider.telkom),    backgroundColor: '#D85A30' },
    ],
  }

  const resData = {
    labels: resolution.map(p => p.provider),
    datasets: [
      { label: 'Network',  data: resolution.map(p => p.by_category.network_downtime),      backgroundColor: '#E24B4A' },
      { label: 'Billing',  data: resolution.map(p => p.by_category.billing_errors),        backgroundColor: '#EF9F27' },
      { label: 'Support',  data: resolution.map(p => p.by_category.support_delays),        backgroundColor: '#4a90d9' },
    ],
  }

  const barOpts = (yLabel = '') => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: TICK, font: { size: 11 } } } },
    scales: {
      x: { grid: { color: GRID }, ticks: { color: TICK } },
      y: { grid: { color: GRID }, ticks: { color: TICK, callback: v => yLabel ? v + yLabel : v } },
    },
  })

  return (
    <div>
      <Header
        title="Complaint Insights"
        subtitle="Complaint volumes, categories and resolution performance"
      />
      <div style={{ padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: '#13161f', border: '1px solid #1e2330', borderRadius: '10px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', marginBottom: '16px' }}>Complaint Volume by Category</div>
            <div style={{ height: '260px' }}>
              {cLoading ? <p style={{ color: '#6b7280' }}>Loading...</p> : <Bar data={catData} options={barOpts()} />}
            </div>
          </div>
          <div style={{ background: '#13161f', border: '1px solid #1e2330', borderRadius: '10px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', marginBottom: '16px' }}>Avg Resolution Time (hours)</div>
            <div style={{ height: '260px' }}>
              {rLoading ? <p style={{ color: '#6b7280' }}>Loading...</p> : <Bar data={resData} options={barOpts('h')} />}
            </div>
          </div>
        </div>

        {/* Sentiment table */}
        <div style={{ background: '#13161f', border: '1px solid #1e2330', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', marginBottom: '16px' }}>Sentiment Score by Category</div>
          {cLoading ? <p style={{ color: '#6b7280' }}>Loading...</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr>
                  {['Category', 'Total Complaints', 'Avg Sentiment', 'Signal'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '6px 8px', color: '#6b7280', borderBottom: '1px solid #1e2330', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.category}>
                    <td style={{ padding: '8px', color: '#e2e8f0', borderBottom: '1px solid #1e2330' }}>{c.label}</td>
                    <td style={{ padding: '8px', color: '#9ca3af', borderBottom: '1px solid #1e2330' }}>{c.total}</td>
                    <td style={{ padding: '8px', color: c.avg_sentiment < -0.3 ? '#E24B4A' : '#EF9F27', borderBottom: '1px solid #1e2330' }}>
                      {c.avg_sentiment.toFixed(2)}
                    </td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #1e2330' }}>
                      <span style={{
                        fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                        background: c.avg_sentiment < -0.3 ? '#2b0d0d' : '#2b1f0d',
                        color: c.avg_sentiment < -0.3 ? '#E24B4A' : '#EF9F27',
                      }}>
                        {c.avg_sentiment < -0.3 ? 'Negative' : 'Neutral'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <InsightBox
          title="Network downtime — highest volume complaint"
          text="Network downtime accounts for the largest share of complaints across all providers. Telkom's resolution time exceeds 44h on average, directly correlating with its 28%+ churn risk."
          color="#E24B4A"
        />
        <InsightBox
          title="Airtel — resolution SLA breach"
          text="Airtel's average resolution of 38h against a 24h SLA is the clearest quick win available. A dedicated first-response team for the top 3 categories could reduce resolution time by ~40%."
          color="#EF9F27"
        />
      </div>
    </div>
  )
}