import { create } from 'zustand';
import { BrowserProvider } from 'ethers';
import { getProvider } from '../lib/contract';

interface WalletState {
  address?: string;
  chainId?: number;
  connecting: boolean;
  error?: string;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const useWallet = create<WalletState>((set) => ({
  connecting: false,
  async connect() {
    try {
      set({ connecting: true, error: undefined });
      const provider: BrowserProvider = await getProvider();
      const accounts: string[] = await (provider.send('eth_requestAccounts', []) as Promise<string[]>);
      const network = await provider.getNetwork();
      set({ address: accounts[0], chainId: Number(network.chainId), connecting: false });
      (window as any).ethereum?.on?.('accountsChanged', (accs: string[]) => set({ address: accs?.[0] }));
      (window as any).ethereum?.on?.('chainChanged', () => window.location.reload());
    } catch (e: any) {
      set({ error: e?.message ?? 'Failed to connect', connecting: false });
    }
  },
  disconnect() {
    set({ address: undefined, chainId: undefined });
  },
}));
