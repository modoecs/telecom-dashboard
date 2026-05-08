import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js'
import { Doughnut, Bar, Line } from 'react-chartjs-2'
import Header from '../components/layout/Header'
import InsightBox from '../components/cards/InsightBox'
import { useChurnSegments } from '../hooks/useChurnSegments'
import { useSpendDistribution } from '../hooks/useSpendDistribution'
import { formatNumber, formatKShs } from '../utils/formatters'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler)

const GRID = 'rgba(255,255,255,0.05)'
const TICK = 'rgba(255,255,255,0.35)'

export default function ChurnBehavior() {
  const { data: churn, loading: chLoading } = useChurnSegments()
  const { data: spend, loading: spLoading } = useSpendDistribution()

  const doughnutData = churn ? {
    labels: ['High Risk', 'Dissatisfied', 'New Users', 'Loyal'],
    datasets: [{
      data: [
        churn.overall.high_risk,
        churn.overall.dissatisfied,
        churn.overall.new_users,
        churn.overall.loyal,
      ],
      backgroundColor: ['#E24B4A', '#EF9F27', '#4a90d9', '#1D9E75'],
      borderWidth: 0,
    }],
  } : null

  const doughnutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: { color: TICK, font: { size: 11 }, boxWidth: 12 },
      },
    },
  }

  const spendData = spend ? {
    labels: spend.buckets.map(b => b.label),
    datasets: [{
      label: 'Customers',
      data: spend.buckets.map(b => b.count),
      fill: true,
      tension: 0.4,
      borderColor: '#4a90d9',
      backgroundColor: 'rgba(74,144,217,0.1)',
      pointBackgroundColor: '#4a90d9',
      pointRadius: 4,
    }],
  } : null

  const spendOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: GRID }, ticks: { color: TICK } },
      y: { grid: { color: GRID }, ticks: { color: TICK } },
    },
  }

  return (
    <div>
      <Header
        title="Churn & Customer Behavior"
        subtitle="Churn segmentation, spend distribution and subscription breakdown"
      />
      <div style={{ padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>

          {/* Churn donut */}
          <div style={{ background: '#13161f', border: '1px solid #1e2330', borderRadius: '10px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', marginBottom: '4px' }}>Churn Risk Segments</div>
            <div style={{ fontSize: '11px', color: '#4a5568', marginBottom: '16px' }}>
              High-risk: inactive 60+ days OR 3+ complaints
            </div>
            <div style={{ height: '220px' }}>
              {chLoading || !doughnutData
                ? <p style={{ color: '#6b7280' }}>Loading...</p>
                : <Doughnut data={doughnutData} options={doughnutOpts} />
              }
            </div>
            {churn && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
                {[
                  { label: 'High Risk',    val: churn.overall.high_risk,    color: '#E24B4A' },
                  { label: 'Dissatisfied', val: churn.overall.dissatisfied, color: '#EF9F27' },
                  { label: 'New Users',    val: churn.overall.new_users,    color: '#4a90d9' },
                  { label: 'Loyal',        val: churn.overall.loyal,        color: '#1D9E75' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#1a1f2e', borderRadius: '6px', padding: '8px 12px' }}>
                    <div style={{ fontSize: '10px', color: s.color }}>{s.label}</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#e2e8f0' }}>{formatNumber(s.val)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Spend distribution */}
          <div style={{ background: '#13161f', border: '1px solid #1e2330', borderRadius: '10px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', marginBottom: '4px' }}>Monthly Spend Distribution</div>
            <div style={{ fontSize: '11px', color: '#4a5568', marginBottom: '16px' }}>
              {spend ? `Avg spend: ${formatKShs(spend.avg_spend)} · ${spend.currency}` : 'Loading...'}
            </div>
            <div style={{ height: '220px' }}>
              {spLoading || !spendData
                ? <p style={{ color: '#6b7280' }}>Loading...</p>
                : <Line data={spendData} options={spendOpts} />
              }
            </div>
          </div>
        </div>

        <InsightBox
          title="Loyal segment — Safaricom upsell opportunity"
          text="The loyal customer segment represents the safest upsell target. Safaricom's postpaid base is only 2.5% of subscribers (1.26M) despite strong ARPU. Targeted migration campaigns for high-spend prepaid users (KShs 2,000+) could grow ARPU by 30–40%."
          color="#1D9E75"
        />
        <InsightBox
          title="High-risk segment — Telkom most exposed"
          text="Telkom's combination of 60+ day inactivity and highest complaint rate puts a disproportionate share of its small subscriber base in the high-risk bucket. Without intervention, further market share loss is likely."
          color="#E24B4A"
        />
      </div>
    </div>
  )
}