import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import Header from '../components/layout/Header'
import InsightBox from '../components/cards/InsightBox'
import { useRegionalSatisfaction } from '../hooks/useRegionalSatisfaction'
import { formatNumber, csatColor } from '../utils/formatters'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

export default function RegionalAnalysis() {
  const { data: regions, loading } = useRegionalSatisfaction()

  const chartData = {
    labels: regions.map(r => r.label),
    datasets: [{
      label: 'CSAT %',
      data: regions.map(r => r.csat),
      backgroundColor: regions.map(r =>
        r.csat >= 75 ? '#1D9E75' : r.csat >= 65 ? '#4a90d9' : r.csat >= 55 ? '#EF9F27' : '#E24B4A'
      ),
      borderRadius: 4,
    }],
  }

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
      x: { min: 40, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.35)', callback: v => v + '%' } },
      y: { grid: { color: 'transparent' }, ticks: { color: 'rgba(255,255,255,0.35)' } },
    },
  }

  return (
    <div>
      <Header
        title="Regional Analysis"
        subtitle="Customer satisfaction by Kenya region — calibrated to CA coverage data"
      />
      <div style={{ padding: '0 32px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '20px' }}>
          {/* Chart */}
          <div style={{ background: '#13161f', border: '1px solid #1e2330', borderRadius: '10px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', marginBottom: '16px' }}>
              CSAT by Region
            </div>
            <div style={{ height: '280px' }}>
              {loading ? <p style={{ color: '#6b7280' }}>Loading...</p> : <Bar data={chartData} options={chartOpts} />}
            </div>
          </div>

          {/* Table */}
          <div style={{ background: '#13161f', border: '1px solid #1e2330', borderRadius: '10px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', marginBottom: '16px' }}>
              Region Detail
            </div>
            {loading ? <p style={{ color: '#6b7280' }}>Loading...</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr>
                    {['Region', 'CSAT', 'Customers', 'Status'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '6px 8px', color: '#6b7280', borderBottom: '1px solid #1e2330', fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {regions.map(r => (
                    <tr key={r.region}>
                      <td style={{ padding: '8px', color: '#e2e8f0', borderBottom: '1px solid #1e2330' }}>{r.label}</td>
                      <td style={{ padding: '8px', color: csatColor(r.csat), fontWeight: 600, borderBottom: '1px solid #1e2330' }}>{r.csat}%</td>
                      <td style={{ padding: '8px', color: '#9ca3af', borderBottom: '1px solid #1e2330' }}>{formatNumber(r.customers)}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #1e2330' }}>
                        <span style={{
                          fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                          background: r.csat >= 70 ? '#0d2b1f' : r.csat >= 60 ? '#2b1f0d' : '#2b0d0d',
                          color: r.csat >= 70 ? '#1D9E75' : r.csat >= 60 ? '#EF9F27' : '#E24B4A',
                        }}>
                          {r.csat >= 70 ? 'Good' : r.csat >= 60 ? 'Average' : 'At Risk'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <InsightBox
          title="North Eastern — critical underservice gap"
          text="Satisfaction in North Eastern is 20–25 points below Nairobi. CA Kenya mobile coverage data shows this region has the lowest network penetration in the country. All three providers should prioritise infrastructure investment here."
          color="#E24B4A"
        />
        <InsightBox
          title="Nairobi leads — but urban saturation risk"
          text="Nairobi's high CSAT reflects dense infrastructure and competition. However, market saturation means growth must come from upselling existing customers rather than new acquisitions."
          color="#4a90d9"
        />
      </div>
    </div>
  )
}