export default function KPICard({ label, value, sub, color = '#e2e8f0', icon }) {
  return (
    <div style={{
      background: '#13161f',
      border: '1px solid #1e2330',
      borderRadius: '10px',
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
        {icon && <span style={{ fontSize: '16px' }}>{icon}</span>}
      </div>
      <div style={{ fontSize: '26px', fontWeight: 600, color }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '11px', color: '#4a5568' }}>
          {sub}
        </div>
      )}
    </div>
  )
}