import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import ExecutiveOverview  from './pages/ExecutiveOverview'
import ServicePerformance from './pages/ServicePerformance'
import RegionalAnalysis   from './pages/RegionalAnalysis'
import ComplaintInsights  from './pages/ComplaintInsights'
import ChurnBehavior      from './pages/ChurnBehavior'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1117' }}>
        <Sidebar />
        <main style={{ marginLeft: '220px', flex: 1, padding: '32px 0', minHeight: '100vh' }}>
          <Routes>
            <Route path="/"           element={<ExecutiveOverview />}  />
            <Route path="/services"   element={<ServicePerformance />} />
            <Route path="/regions"    element={<RegionalAnalysis />}   />
            <Route path="/complaints" element={<ComplaintInsights />}  />
            <Route path="/churn"      element={<ChurnBehavior />}      />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}