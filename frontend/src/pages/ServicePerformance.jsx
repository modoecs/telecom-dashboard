import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import Header from '../components/layout/Header'
import InsightBox from '../components/cards/InsightBox'
import { useServiceSatisfaction } from '../hooks/useServiceSatisfaction'
import { useProviderBenchmark } from '../hooks/useProviderBenchmark'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const GRID = 'rgba(255,255,255,0.05)'
const TICK = 'rgba(255,255,255,0.35)'

const SERVICE_LABELS = {
  mobile_money:     'Mobile Money',
  data_bundles:     'Data Bundles',
  voice:            'Voice',
  sms:              'SMS',
  customer_support: 'Support',
}

export default function ServicePerformance() {
  const { data: services, loading: sLoading } = useServiceSatisfaction()
  const { data: benchmark, loading: bLoading } = useProviderBenchmark()

  const chartData = {
    labels: services.map(s => SERVICE_LABELS[s.service] ?? s.service),
    datasets: [
      { label: 'Safaricom', data: services.map(s => s.scores.safaricom), backgroundColor: '#1D9E75' },
      { label: 'Airtel',    data: services.map(s => s.scores.airtel),    backgroundColor: '#4a90d9' },
      { label: 'Telkom',    data: services.map(s => s.scores.telkom),    backgroundColor: '#D85A30' },
    ],
  }

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: TICK, font: { size: 11 } } } },
    scales: {
      x: { grid: { color: GRID }, ticks: { color: TICK } },
      y: { min: 30, max: 100, grid: { color: GRID }, ticks: { color: TICK, callback: v => v + '%' } },
    },
  }

  // SPI bar chart
  const spiData = {
    labels: benchmark.map(p => p.provider),
    datasets: [{
      label: 'SPI Score',
      data: benchmark.map(p => p.spi),
      backgroundColor: benchmark.map(p =>
        p.spi >= 75 ? '#1D9E75' : p.spi >= 55 ? '#EF9F27' : '#E24B4A'
      ),
    }],
  }

  const spiOpts = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
      x: { min: 0, max: 100, grid: { color: GRID }, ticks: { color: TICK } },
      y: { grid: { color: 'transparent' }, ticks: { color: TICK } },
    },
  }

  return (
    <div>
      <Header
        title="Service Performance"
        subtitle="Satisfaction scores by provider and service category"
      />

      <div style={{ padding: '0 32px' }}>
        {/* Service satisfaction chart */}
        <div style={{ background: '#13161f', border: '1px solid #1e2330', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', marginBottom: '16px' }}>
            Satisfaction Score by Provider & Service (%)
          </div>
          <div style={{ height: '280px' }}>
            {sLoading ? <p style={{ color: '#6b7280' }}>Loading...</p> : <Bar data={chartData} options={chartOpts} />}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          {/* SPI */}
          <div style={{ background: '#13161f', border: '1px solid #1e2330', borderRadius: '10px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', marginBottom: '4px' }}>
              Service Performance Index
            </div>
            <div style={{ fontSize: '11px', color: '#4a5568', marginBottom: '16px' }}>
              Composite: CSAT × 0.35 + NPS × 0.25 + Complaint⁻¹ × 0.25 + Resolution⁻¹ × 0.15
            </div>
            <div style={{ height: '160px' }}>
              {bLoading ? <p style={{ color: '#6b7280' }}>Loading...</p> : <Bar data={spiData} options={spiOpts} />}
            </div>
          </div>

          {/* Market share */}
          <div style={{ background: '#13161f', border: '1px solid #1e2330', borderRadius: '10px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', marginBottom: '4px' }}>
              Market Share
            </div>
            <div style={{ fontSize: '11px', color: '#4a5568', marginBottom: '16px' }}>
              Source: CA Kenya Q3 FY2024/25
            </div>
            {benchmark.map(p => (
              <div key={p.slug} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                  <span style={{ color: '#9ca3af' }}>{p.provider}</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{p.market_share}%</span>
                </div>
                <div style={{ background: '#1e2330', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${p.market_share}%`,
                    height: '100%',
                    background: p.slug === 'safaricom' ? '#1D9E75' : p.slug === 'airtel' ? '#4a90d9' : '#D85A30',
                    borderRadius: '4px',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <InsightBox
          title="Safaricom — Mobile Money dominance"
          text="Safaricom holds 90.8% of mobile money market share (CA Kenya). M-PESA ARPU of KShs 395.22/month is 48% higher than data ARPU, making it the highest-value service by far."
          color="#1D9E75"
        />
        <InsightBox
          title="Data bundles — lowest SPI across all providers"
          text="Data bundle satisfaction is the weakest service score industrywide. With rate per MB declining 3.3% YoY, pricing pressure remains the primary driver of dissatisfaction."
          color="#EF9F27"
        />
      </div>
    </div>
  )
}