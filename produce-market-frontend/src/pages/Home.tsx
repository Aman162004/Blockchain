import { Link } from 'react-router-dom';
import { ArrowRight, ScanLine, Store, Sprout } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Transparent Farm-to-Table on Blockchain
            </h1>
            <p className="mt-4 text-white/80 max-w-xl">
              Register produce on-chain, set fair prices, and let consumers verify origin, quality, and payment trail using a QR code.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/farmer" className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 shadow-glow inline-flex items-center gap-2">
                <Sprout className="h-5 w-5"/> Farmer Dashboard <ArrowRight className="h-4 w-4"/>
              </Link>
              <Link to="/market" className="px-5 py-3 rounded-xl bg-darkcard/60 border border-white/10 hover:border-neon/50 inline-flex items-center gap-2">
                <Store className="h-5 w-5"/> Explore Market
              </Link>
              <Link to="/scan" className="px-5 py-3 rounded-xl bg-darkcard/60 border border-white/10 hover:border-neon/50 inline-flex items-center gap-2">
                <ScanLine className="h-5 w-5"/> Scan QR
              </Link>
            </div>
          </div>
          <div className="card-glass p-6">
            <video autoPlay loop muted playsInline className="rounded-xl w-full opacity-90">
              <source src="https://assets.mixkit.co/videos/preview/mixkit-hud-digital-display-41464-large.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>
    </div>
  );
}
