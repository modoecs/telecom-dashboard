export default function Header({ title, subtitle }) {
  const now = new Date().toLocaleDateString('en-KE', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div style={{
      padding: '24px 32px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '24px',
    }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#e2e8f0' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
            {subtitle}
          </p>
        )}
      </div>
      <div style={{
        fontSize: '11px',
        color: '#4a5568',
        background: '#13161f',
        border: '1px solid #1e2330',
        borderRadius: '6px',
        padding: '6px 12px',
      }}>
        {now}
      </div>
    </div>
  )
}