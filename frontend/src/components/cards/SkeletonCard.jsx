export default function SkeletonCard() {
  return (
    <div style={{
      background: '#13161f',
      border: '1px solid #1e2330',
      borderRadius: '10px',
      padding: '18px 20px',
      animation: 'pulse 1.5s infinite',
    }}>
      <div style={{ height: '11px', width: '60%', background: '#1e2330', borderRadius: '4px', marginBottom: '12px' }} />
      <div style={{ height: '26px', width: '40%', background: '#1e2330', borderRadius: '4px', marginBottom: '8px' }} />
      <div style={{ height: '11px', width: '50%', background: '#1e2330', borderRadius: '4px' }} />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}