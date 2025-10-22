import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getContract, formatRupees } from '../lib/contract';

export default function Details() {
  const { id } = useParams();
  const [data, setData] = useState<any>();
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      try {
        const contract = await getContract();
        const prod = await contract.getProduceDetails(BigInt(id!));
        const hist = await contract.getSaleHistory(BigInt(id!));
        setData(prod);
        setHistory(hist);
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      }
    })();
  }, [id]);

  if (error) return <div className="max-w-4xl mx-auto px-4 py-10 text-red-300">{error}</div>;
  if (!data) return <div className="max-w-4xl mx-auto px-4 py-10">Loading…</div>;
  const [pid, name, originalFarmer, currentSeller, status, price, origin] = data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="card-glass p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{name} (#{String(pid)})</h2>
            <p className="text-sm text-white/60">Origin: {origin} · Status: {status}</p>
          </div>
          <div className="text-2xl font-bold">{formatRupees(price)}</div>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-white/60">Original Farmer</div>
            <div className="font-mono text-sm break-all">{originalFarmer}</div>
          </div>
          <div>
            <div className="text-sm text-white/60">Current Seller</div>
            <div className="font-mono text-sm break-all">{currentSeller}</div>
          </div>
        </div>
      </div>

      <div className="mt-8 card-glass p-6">
        <h3 className="font-semibold">Sale History</h3>
        <div className="mt-4 space-y-3">
          {history.length === 0 && <div className="text-white/60 text-sm">No sales yet.</div>}
          {history.map((h, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="font-mono break-all">Buyer: {h.buyer}</div>
              <div className="font-mono break-all">Seller: {h.seller}</div>
              <div>{formatRupees(h.pricePaid)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
