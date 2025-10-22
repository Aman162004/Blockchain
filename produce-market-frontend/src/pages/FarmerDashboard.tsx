import { Suspense, useEffect, useState } from 'react';
import { getContract, inrToWei } from '../lib/contract';
import { Save } from 'lucide-react';
import QRCode from 'qrcode';
import { useWallet } from '../store/useWallet';

export default function FarmerDashboard() {
  const { address, connect } = useWallet();
  const [form, setForm] = useState({ name: '', originFarm: '', priceINR: '', qrData: '' });
  const [qrPreview, setQrPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  useEffect(() => {
    if (form.qrData) {
      QRCode.toDataURL(form.qrData, { width: 220, margin: 1 }).then(setQrPreview);
    } else {
      setQrPreview('');
    }
  }, [form.qrData]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!address) await connect();
      setLoading(true);
      const contract = await getContract(true);
      const tx = await contract.registerProduce(
        form.name,
        form.originFarm,
        inrToWei(form.priceINR),
        form.qrData,
      );
      const receipt = await tx.wait();
      setMessage('Produce registered successfully. Tx: ' + receipt?.hash);
      setForm({ name: '', originFarm: '', priceINR: '', qrData: '' });
    } catch (err: any) {
      setMessage(err?.shortMessage || err?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-3 gap-8">
        <form onSubmit={handleRegister} className="md:col-span-2 card-glass p-6">
          <h2 className="text-2xl font-semibold">Register Produce</h2>
          <p className="text-white/60 text-sm mt-1">Create an on-chain record with price and QR payload.</p>
          <div className="mt-6 grid grid-cols-1 gap-5">
            <label className="block">
              <span className="text-sm text-white/70">Name</span>
              <input required value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="mt-1 w-full rounded-lg bg-darkcard/60 border-white/10" />
            </label>
            <label className="block">
              <span className="text-sm text-white/70">Origin Farm</span>
              <input required value={form.originFarm} onChange={e=>setForm({...form, originFarm:e.target.value})} className="mt-1 w-full rounded-lg bg-darkcard/60 border-white/10" />
            </label>
            <label className="block">
              <span className="text-sm text-white/70">Price (INR)</span>
              <input required type="number" min="1" value={form.priceINR} onChange={e=>setForm({...form, priceINR:e.target.value})} className="mt-1 w-full rounded-lg bg-darkcard/60 border-white/10" />
            </label>
            <label className="block">
              <span className="text-sm text-white/70">QR Code Payload</span>
              <input required value={form.qrData} onChange={e=>setForm({...form, qrData:e.target.value})} placeholder="e.g. produce:123 or any metadata" className="mt-1 w-full rounded-lg bg-darkcard/60 border-white/10" />
            </label>
          </div>
          <div className="mt-6 flex gap-3">
            <button disabled={loading} className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 shadow-glow inline-flex items-center gap-2">
              <Save className="h-4 w-4"/> {loading? 'Submitting…' : 'Register'}
            </button>
          </div>
          {message && <p className="mt-4 text-sm text-white/70">{message}</p>}
        </form>
        <div className="card-glass p-6 flex flex-col items-center justify-center">
          <h3 className="font-medium mb-4">QR Preview</h3>
          {qrPreview ? (
            <img src={qrPreview} alt="QR Preview" className="rounded-xl bg-white p-3" />
          ) : (
            <div className="text-white/50 text-sm">Enter payload to preview QR</div>
          )}
        </div>
      </div>
      <div className="mt-8">
        <Suspense fallback={<div className="text-white/60">Loading your listings…</div>}>
          {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
          {(() => {
            const C = (require('./ManageProduce').default as any);
            return <C />;
          })()}
        </Suspense>
      </div>
    </div>
  );
}
