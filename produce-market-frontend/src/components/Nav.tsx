import { Link, NavLink } from 'react-router-dom';
import { useWallet } from '../store/useWallet';
import { Wallet, Sprout, LogIn } from 'lucide-react';

export default function Nav() {
  const { address, connect, disconnect, connecting } = useWallet();
  return (
    <header className="sticky top-0 z-40 bg-darkbg/70 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-glow">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="font-semibold tracking-wide">AgriTrace</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/market" className={({isActive})=>`hover:text-neon ${isActive?'text-neon':'text-white/80'}`}>Market</NavLink>
          <NavLink to="/farmer" className={({isActive})=>`hover:text-neon ${isActive?'text-neon':'text-white/80'}`}>Farmer</NavLink>
          <NavLink to="/scan" className={({isActive})=>`hover:text-neon ${isActive?'text-neon':'text-white/80'}`}>Scan QR</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {address ? (
            <button onClick={disconnect} className="px-3 py-2 rounded-xl border border-white/10 hover:border-neon/50 bg-darkcard/60 text-white/90 hover:text-neon transition flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:block">{address.slice(0,6)}…{address.slice(-4)}</span>
            </button>
          ) : (
            <button disabled={connecting} onClick={connect} className="px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 transition shadow-glow flex items-center gap-2">
              <LogIn className="h-4 w-4"/>
              <span>{connecting? 'Connecting…': 'Connect Wallet'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
