export default function InsightBox({ title, text, color = '#4a90d9' }) {
  return (
    <div style={{
      background: '#13161f',
      borderLeft: `3px solid ${color}`,
      borderRadius: '0 8px 8px 0',
      padding: '12px 16px',
      marginBottom: '10px',
    }}>
      <div style={{ fontSize: '12px', fontWeight: 500, color: '#e2e8f0', marginBottom: '4px' }}>
        {title}
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.6 }}>
        {text}
      </div>
    </div>
  )
}