import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { WalletProvider } from './contexts/WalletContext'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { FarmerDashboard } from './pages/FarmerDashboard'
import { CustomerDashboard } from './pages/CustomerDashboard'
import { ProduceDetails } from './pages/ProduceDetails'
import { QRScannerPage } from './pages/QRScannerPage'
import './index.css'

function Navbar() {
  return (
    <div className="nav glass">
      <div className="brand">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L20 7L12 12L4 7L12 2Z" fill="#7c3aed"/>
          <path d="M12 12L20 7V17L12 22V12Z" fill="#00e5ff"/>
          <path d="M12 12L4 7V17L12 22V12Z" fill="#3b82f6"/>
        </svg>
        <Link to="/" style={{textDecoration:'none', color:'inherit'}}>AgriTrace</Link>
      </div>
      <div className="row">
        <Link to="/scan" className="badge">Scan QR</Link>
        <Link to="/login" className="btn btn-outline">Login</Link>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <WalletProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/produce/:id" element={<ProduceDetails />} />
          <Route path="/scan" element={<QRScannerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </WalletProvider>
    </BrowserRouter>
  )
}
