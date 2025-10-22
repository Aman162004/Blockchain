import { Route, Routes } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './pages/Home';
import Market from './pages/Market';
import FarmerDashboard from './pages/FarmerDashboard';
import Scan from './pages/Scan';
import Details from './pages/Details';
import './index.css';

function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/details/:id" element={<Details />} />
        </Routes>
      </main>
      <footer className="mt-16 py-10 text-center text-white/40 text-sm">
        Built for transparent agriculture • AgriTrace
      </footer>
    </div>
  );
}

export default App
