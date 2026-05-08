import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',              icon: '▦',  label: 'Executive Overview'   },
  { to: '/services',      icon: '◈',  label: 'Service Performance'  },
  { to: '/regions',       icon: '◉',  label: 'Regional Analysis'    },
  { to: '/complaints',    icon: '⚠',  label: 'Complaint Insights'   },
  { to: '/churn',         icon: '◎',  label: 'Churn & Behavior'     },
]

export default function Sidebar() {
  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: '#13161f',
      borderRight: '1px solid #1e2330',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid #1e2330',
      }}>
        <div style={{ fontSize: '13px', color: '#4a90d9', fontWeight: 600, letterSpacing: '0.05em' }}>
          TELECOM CX
        </div>
        <div style={{ fontSize: '11px', color: '#4a5568', marginTop: '2px' }}>
          Analytics Dashboard
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ padding: '12px 0', flex: 1 }}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              fontSize: '13px',
              color: isActive ? '#e2e8f0' : '#6b7280',
              background: isActive ? '#1a1f2e' : 'transparent',
              borderLeft: isActive ? '2px solid #4a90d9' : '2px solid transparent',
              textDecoration: 'none',
              transition: 'all 0.15s',
            })}
          >
            <span style={{ fontSize: '14px' }}>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #1e2330',
        fontSize: '10px',
        color: '#374151',
      }}>
        Source: CA Kenya Q3 FY2024/25<br />
        Safaricom Annual Report FY2025
      </div>
    </aside>
  )
}