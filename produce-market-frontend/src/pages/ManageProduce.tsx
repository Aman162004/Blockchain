import { useEffect, useState } from 'react';
import { getContract, formatRupees } from '../lib/contract';
import { Pencil, Tag, RefreshCcw } from 'lucide-react';
import { useWallet } from '../store/useWallet';

export default function ManageProduce() {
  const { address, connect } = useWallet();
  const [items, setItems] = useState<any[]>([]);
  const [message, setMessage] = useState<string | undefined>();

  async function load() {
    try {
      const c = await getContract();
      const nextId: bigint = await c.nextProduceId();
      const arr: any[] = [];
      for (let i = 1n; i < nextId; i++) {
        const pi = await c.produceItems(i);
        if (pi.id !== 0n && pi.currentSeller.toLowerCase() === address?.toLowerCase()) arr.push(pi);
      }
      setItems(arr);
    } catch (e: any) {
      setMessage(e?.message || 'Failed to load');
    }
  }

  useEffect(() => { load(); }, [address]);

  async function updatePrice(id: bigint) {
    const newPrice = prompt('Enter new price (INR)');
    if (!newPrice) return;
    try {
      if (!address) await connect();
      const c = await getContract(true);
      const tx = await c.updateProducePrice(id, BigInt(newPrice));
      await tx.wait();
      await load();
    } catch (e: any) {
      setMessage(e?.message || 'Update failed');
    }
  }

  async function updateStatus(id: bigint) {
    const newStatus = prompt('Enter new status');
    if (!newStatus) return;
    try {
      if (!address) await connect();
      const c = await getContract(true);
      const tx = await c.updateProduceStatus(id, newStatus);
      await tx.wait();
      await load();
    } catch (e: any) {
      setMessage(e?.message || 'Update failed');
    }
  }

  return (
    <div className="card-glass p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Your Listings</h3>
        <button onClick={load} className="px-3 py-2 rounded-xl bg-darkcard/60 border border-white/10 hover:border-neon/50 inline-flex items-center gap-2">
          <RefreshCcw className="h-4 w-4"/> Refresh
        </button>
      </div>
      <div className="mt-4 space-y-4">
        {items.length === 0 && <div className="text-white/60 text-sm">No items under your address.</div>}
        {items.map((it)=> (
          <div key={String(it.id)} className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/10">
            <div>
              <div className="font-medium">{it.name} <span className="text-xs text-white/50">(#{String(it.id)})</span></div>
              <div className="text-sm text-white/60">Status: {it.currentStatus} · {formatRupees(it.priceinRupees)}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>updatePrice(it.id)} className="px-3 py-2 rounded-lg bg-brand-600/20 border border-brand-600/40 text-brand-200 inline-flex items-center gap-2"><Tag className="h-4 w-4"/>Price</button>
              <button onClick={()=>updateStatus(it.id)} className="px-3 py-2 rounded-lg bg-brand-600/20 border border-brand-600/40 text-brand-200 inline-flex items-center gap-2"><Pencil className="h-4 w-4"/>Status</button>
              <a href={`/details/${String(it.id)}`} className="px-3 py-2 rounded-lg bg-darkcard/60 border border-white/10 hover:border-neon/50">Details</a>
            </div>
          </div>
        ))}
      </div>
      {message && <p className="mt-3 text-sm text-white/70">{message}</p>}
    </div>
  );
}
