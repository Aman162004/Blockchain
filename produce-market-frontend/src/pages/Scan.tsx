import { useState } from 'react';
import { useZxing } from 'react-zxing';
import { getContract } from '../lib/contract';
import { Search } from 'lucide-react';

export default function Scan() {
  const [result, setResult] = useState<string>('');
  const [message, setMessage] = useState<string | undefined>();

  const { ref } = useZxing({
    onDecodeResult(res) {
      setResult(res.getText());
    },
    onError(err: unknown) {
      const name = (err as any)?.name ?? '';
      if (String(name).toLowerCase().includes('notfound')) return;
    },
  });

  async function queryByQr() {
    try {
      setMessage(undefined);
      if (!result) return;
      // Expect QR payload to contain an id number, e.g. "produce:1" or "1"
      const idMatch = /([0-9]+)$/.exec(result.trim());
      const id = BigInt(idMatch ? idMatch[1] : result.trim());
      const contract = await getContract();
      const details = await contract.getProduceDetails(id);
      const url = `/details/${String(details[0])}`;
      window.location.href = url;
    } catch (e: any) {
      setMessage(e?.message || 'Not found');
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold">Scan QR</h2>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="card-glass p-4">
          <video ref={ref} className="w-full rounded-xl bg-black" />
        </div>
        <div className="card-glass p-6">
          <div className="text-sm text-white/60">Decoded Text</div>
          <div className="mt-2 p-3 rounded-lg bg-black/40 border border-white/10 min-h-16 break-all">{result || '—'}</div>
          <button onClick={queryByQr} className="mt-4 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 shadow-glow inline-flex items-center gap-2">
            <Search className="h-4 w-4"/> Lookup Produce
          </button>
          {message && <p className="mt-3 text-sm text-white/70">{message}</p>}
        </div>
      </div>
    </div>
  );
}
