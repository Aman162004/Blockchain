import { useEffect, useState } from 'react';
import { getContract, formatRupees } from '../lib/contract';
import { ShoppingCart, RefreshCcw, QrCode } from 'lucide-react';
import { useWallet } from '../store/useWallet';

interface Produce {
  id: bigint;
  name: string;
  originalFarmer: string;
  currentSeller: string;
  registrationTimeStamp: bigint;
  currentStatus: string;
  priceinRupees: bigint;
  originFarm: string;
  QRCode: string;
}

export default function Market() {
  const [items, setItems] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const { address, connect } = useWallet();

  async function load() {
    setLoading(true);
    try {
      const contract = await getContract();
      const nextId: bigint = await contract.nextProduceId();
      const list: Produce[] = [];
      for (let i = 1n; i < nextId; i++) {
        const pi = await contract.produceItems(i);
        if (pi.id !== 0n) list.push(pi);
      }
      setItems(list);
    } catch (e: any) {
      setMessage(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function buy(id: bigint, price: bigint) {
    try {
      if (!address) await connect();
      const contract = await getContract(true);
      const tx = await contract.buyProduce(id, { value: price });
      await tx.wait();
      setMessage('Purchase complete');
      await load();
    } catch (e: any) {
      setMessage(e?.shortMessage || e?.message || 'Purchase failed');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Marketplace</h2>
        <button onClick={load} className="px-3 py-2 rounded-xl bg-darkcard/60 border border-white/10 hover:border-neon/50 inline-flex items-center gap-2">
          <RefreshCcw className="h-4 w-4"/> Refresh
        </button>
      </div>
      {message && <p className="mb-4 text-sm text-white/70">{message}</p>}
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={String(it.id)} className="card-glass p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{it.name}</h3>
                <p className="text-xs text-white/60">Origin: {it.originFarm}</p>
              </div>
              <span className="px-2 py-1 rounded-lg bg-brand-600/20 text-brand-300 text-xs border border-brand-600/30">{it.currentStatus}</span>
            </div>
            <div className="mt-4 text-2xl font-bold">{formatRupees(it.priceinRupees)}</div>
            <div className="mt-4 flex gap-3">
              <button onClick={()=>buy(it.id, it.priceinRupees)} className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 shadow-glow inline-flex items-center gap-2">
                <ShoppingCart className="h-4 w-4"/> Buy
              </button>
              <a href={`/details/${String(it.id)}`} className="px-4 py-2 rounded-xl bg-darkcard/60 border border-white/10 hover:border-neon/50 inline-flex items-center gap-2">
                <QrCode className="h-4 w-4"/> Details
              </a>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && !loading && (
        <div className="text-white/60">No items yet.</div>
      )}
    </div>
  );
}
