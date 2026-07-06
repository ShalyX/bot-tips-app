import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, formatEther, parseEther } from 'ethers';
import { useWallets, usePrivy } from '@privy-io/react-auth';
import { CREATOR_REGISTRY_ADDRESS, CREATOR_REGISTRY_ABI } from '../config/contracts';

export default function Dashboard({ currentAccount }: { currentAccount: string }) {
  const [balance, setBalance] = useState("0");
  const [tipsReceived, setTipsReceived] = useState("0");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [sentTransactions, setSentTransactions] = useState<any[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [creatorUsername, setCreatorUsername] = useState("");
  const [creatorAvatar, setCreatorAvatar] = useState("");
  
  // Registration form state
  const [regBio, setRegBio] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Withdraw state
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Campaign state
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignTarget, setCampaignTarget] = useState("");
  const [currentCampaignTitle, setCurrentCampaignTitle] = useState("");
  const [currentCampaignTarget, setCurrentCampaignTarget] = useState("0");
  const [isSettingCampaign, setIsSettingCampaign] = useState(false);
  
  const { wallets } = useWallets();
  const { user, createWallet, exportWallet } = usePrivy();

  const xUsername = user?.twitter?.username || user?.twitter?.name || "Anonymous";
  const xAvatar = user?.twitter?.profilePictureUrl || "";

  const fetchDashboardData = async () => {
    if (!currentAccount || wallets.length === 0) return;
    
    try {
      const wallet = wallets[0];
      const ethereumProvider = await wallet.getEthereumProvider();
      const provider = new BrowserProvider(ethereumProvider);
      
      // Fetch Native Balance
      const rawBalance = await provider.getBalance(currentAccount);
      setBalance(parseFloat(formatEther(rawBalance)).toFixed(2));

      const registryContract = new Contract(CREATOR_REGISTRY_ADDRESS, CREATOR_REGISTRY_ABI, provider);
      
      // Fetch Sent Tips via Event Logs
      const sentFilter = registryContract.filters.NewTip(currentAccount);
      const events = await registryContract.queryFilter(sentFilter);
      let sentTxs: any[] = [];
      events.forEach((event: any) => {
        const [from, to, timestamp, name, message, amount] = event.args;
        sentTxs.push({
          type: 'Sent',
          address: to,
          amount: `-${parseFloat(formatEther(amount)).toFixed(2)} $BOT`,
          message: message,
          status: 'Confirmed',
          timestamp: new Date(Number(timestamp) * 1000)
        });
      });
      sentTxs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setSentTransactions(sentTxs);

      // Fetch Creator
      const creator = await registryContract.getCreator(currentAccount);
      setIsRegistered(creator.isRegistered);
      setCreatorUsername(creator.username);
      setCreatorAvatar(creator.avatarUrl);

      if (creator.isRegistered) {
        setTipsReceived(parseFloat(formatEther(creator.totalTipsReceived)).toFixed(2));
        setCurrentCampaignTitle(creator.campaignTitle);
        setCurrentCampaignTarget(creator.campaignTarget.toString());
        
        // Fetch Tips Received
        const memos = await registryContract.getCreatorTips(currentAccount);
        let recentTxs: any[] = [];

        memos.forEach((memo: any) => {
          const amount = parseFloat(formatEther(memo.amount));
          recentTxs.push({
            type: 'Received',
            address: memo.from,
            amount: `+${amount.toFixed(2)} $BOT`,
            message: memo.message,
            status: 'Confirmed',
            timestamp: new Date(Number(memo.timestamp) * 1000)
          });
        });

        // Sort by newest
        recentTxs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setTransactions(recentTxs);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentAccount, wallets]);

  const registerCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount || wallets.length === 0) return;
    
    try {
      setIsRegistering(true);
      const wallet = wallets[0];
      const ethereumProvider = await wallet.getEthereumProvider();
      const provider = new BrowserProvider(ethereumProvider);
      const signer = await provider.getSigner();
      
      const registryContract = new Contract(CREATOR_REGISTRY_ADDRESS, CREATOR_REGISTRY_ABI, signer);
      
      const tx = await registryContract.registerCreator(xUsername, regBio || "Creator from X", xAvatar);
      await tx.wait();
      
      setIsRegistering(false);
      setRegBio("");
      fetchDashboardData();
    } catch (error) {
      console.error("Error registering:", error);
      setIsRegistering(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount || wallets.length === 0) return;
    
    try {
      setIsWithdrawing(true);
      const wallet = wallets[0];
      const ethereumProvider = await wallet.getEthereumProvider();
      const provider = new BrowserProvider(ethereumProvider);
      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: withdrawAddress,
        value: parseEther(withdrawAmount)
      });
      
      await tx.wait();
      
      setIsWithdrawing(false);
      setIsWithdrawModalOpen(false);
      setWithdrawAddress("");
      setWithdrawAmount("");
      fetchDashboardData();
      alert("Withdrawal successful!");
    } catch (error) {
      console.error("Error withdrawing:", error);
      alert("Withdrawal failed. Check console for details.");
      setIsWithdrawing(false);
    }
  };

  const handleSetCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount || wallets.length === 0) return;
    
    try {
      setIsSettingCampaign(true);
      const wallet = wallets[0];
      const ethereumProvider = await wallet.getEthereumProvider();
      const provider = new BrowserProvider(ethereumProvider);
      const signer = await provider.getSigner();
      
      const registryContract = new Contract(CREATOR_REGISTRY_ADDRESS, CREATOR_REGISTRY_ABI, signer);
      
      const tx = await registryContract.setCampaign(campaignTitle, campaignTarget);
      await tx.wait();
      
      setIsSettingCampaign(false);
      setCampaignTitle("");
      setCampaignTarget("");
      fetchDashboardData();
      alert("Campaign set successfully!");
    } catch (error) {
      console.error("Error setting campaign:", error);
      alert("Failed to set campaign.");
      setIsSettingCampaign(false);
    }
  };

  const handleDeposit = () => {
    if (currentAccount) {
      navigator.clipboard.writeText(currentAccount);
      alert(`Address ${currentAccount} copied to clipboard!\n\nYou can fund this address using any wallet or by visiting the BOT Chain Faucet at https://faucet.bohr.life/`);
    }
  };

  return (
    <main className="flex-grow pt-[100px] px-gutter max-w-container-max mx-auto w-full flex flex-col gap-8 pb-[100px] relative">
      <header className="mb-4">
        <h1 className="font-headline-xl text-headline-xl text-primary">Dashboard</h1>
        <p className="font-body-md text-on-surface-variant">Manage your tipping ecosystem and wallet balance.</p>
        
        {/* Wallet Connection / Creation State */}
        {!currentAccount && !user && (
          <p className="font-body-sm text-primary-fixed mt-2">Please log in to view your dashboard.</p>
        )}
        
        {!currentAccount && user && (
          <div className="mt-4 p-4 border border-secondary-container bg-secondary-container/10 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-button-text text-primary">Almost there!</h3>
              <p className="font-body-sm text-on-surface-variant">You're logged in with X as @{xUsername}, but you don't have a wallet yet.</p>
            </div>
            <button 
              onClick={() => { if(typeof createWallet === 'function') createWallet(); else alert("Wallet creation is handled by Privy automatically. Please refresh."); }}
              className="bg-primary-fixed text-on-primary-fixed font-button-text py-2 px-6 rounded-DEFAULT btn-glow whitespace-nowrap"
            >
              Create Secure Wallet
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between border-primary-fixed/30 bg-surface-container lg:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-code-label text-code-label text-outline-variant uppercase tracking-wider mb-2">Total Balance</h3>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-xl text-headline-xl text-primary-fixed">{balance}</span>
                <span className="font-headline-lg text-primary-fixed">$BOT</span>
              </div>
            </div>
            {currentAccount && (
              <button onClick={exportWallet} className="bg-white/5 border border-white/10 text-on-surface-variant px-3 py-1 rounded-full font-code-label text-xs hover:text-primary-fixed hover:border-primary-fixed/50 transition-colors" title="Wallet Settings">
                Wallet Settings
              </button>
            )}
          </div>
          <div className="flex gap-4 mt-8">
            <button onClick={() => setIsWithdrawModalOpen(true)} className="flex-1 bg-primary-fixed text-on-primary-fixed font-button-text py-2 rounded-DEFAULT btn-glow transition-all">Withdraw</button>
            <button onClick={handleDeposit} className="flex-1 glass-panel border border-white/10 text-on-surface font-button-text py-2 rounded-DEFAULT hover:border-primary-fixed/50 hover:text-primary-fixed transition-all">Deposit</button>
          </div>
        </div>

        {/* Tips Received */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between lg:col-span-1">
          <div className="flex justify-between items-start">
            <h3 className="font-code-label text-code-label text-outline-variant uppercase tracking-wider mb-2">Tips Received</h3>
            <span className="material-symbols-outlined text-primary-fixed">call_received</span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg text-primary">{tipsReceived}</span>
              <span className="font-headline-lg text-primary">$BOT</span>
            </div>
            {isRegistered ? (
              <div className="flex items-center gap-2 mt-2">
                {creatorAvatar && <img src={creatorAvatar.replace('_normal', '_400x400')} alt="Avatar" className="w-8 h-8 rounded-full border border-primary-fixed/50 object-cover" />}
                <p className="font-code-label text-xs text-primary-fixed flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Registered Creator: @{creatorUsername}
                </p>
              </div>
            ) : (
              <p className="font-code-label text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                Not a registered creator
              </p>
            )}
          </div>
          <div className="w-full bg-surface h-1 rounded-full overflow-hidden mt-6">
            <div className="bg-gradient-to-r from-primary-fixed to-secondary-container h-full rounded-full w-[80%]"></div>
          </div>
        </div>
        
        {/* Registration Form / Status */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between lg:col-span-1 border border-secondary-container/50 bg-secondary-container/5">
          {!isRegistered ? (
            <form onSubmit={registerCreator} className="flex flex-col gap-4 h-full justify-between">
              <div>
                <h3 className="font-headline-lg-mobile text-primary mb-1">Link X to On-Chain</h3>
                <p className="font-body-sm text-on-surface-variant mb-4">Register your X profile <span className="text-primary-fixed font-bold">@{xUsername}</span> on the BOT Chain Registry to receive instant tips.</p>
                <div className="flex flex-col gap-3">
                  <input 
                    type="text" 
                    placeholder="Short Bio (Optional)" 
                    value={regBio}
                    onChange={(e) => setRegBio(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded py-2 px-3 text-primary font-body-sm focus:border-primary-fixed focus:outline-none"
                  />
                </div>
              </div>
              <button disabled={isRegistering || !currentAccount} className="w-full bg-surface text-primary-fixed border border-primary-fixed/50 font-button-text py-2 rounded-DEFAULT hover:bg-primary-fixed hover:text-on-primary-fixed transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2">
                {xAvatar && <img src={xAvatar} alt="" className="w-6 h-6 rounded-full" />}
                {isRegistering ? "Registering..." : `Register as @${xUsername}`}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-fixed/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary-fixed">verified</span>
              </div>
              <div>
                <h3 className="font-headline-lg-mobile text-primary">You're Registered!</h3>
                <p className="font-body-sm text-on-surface-variant mt-2">Fans can now send you tips directly. 100% of tips are sent instantly to your wallet.</p>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/creator/${currentAccount}`);
                  alert("Profile link copied! Share it with your fans.");
                }}
                className="mt-2 bg-transparent border border-primary-fixed/50 text-primary-fixed px-6 py-2 rounded-full font-button-text hover:bg-primary-fixed hover:text-on-primary-fixed transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                Share Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Settings */}
      {isRegistered && (
        <div className="glass-card rounded-xl p-6 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between border border-primary-fixed/30 bg-surface-container mt-4">
          <div className="flex-1">
            <h2 className="font-headline-lg-mobile text-primary">Active Campaign</h2>
            <p className="font-body-sm text-on-surface-variant mt-1">Set a specific goal for your fans to rally behind.</p>
            {currentCampaignTarget !== "0" && (
                <div className="mt-4 p-4 rounded-lg bg-black/40 border border-white/5">
                    <p className="font-code-label text-xs text-primary-fixed uppercase tracking-wider mb-1">Current Goal</p>
                    <p className="font-button-text text-primary">{currentCampaignTitle} <span className="text-on-surface-variant">({currentCampaignTarget} $BOT)</span></p>
                </div>
            )}
          </div>
          <form onSubmit={handleSetCampaign} className="flex-1 flex flex-col gap-4 w-full">
            <input 
                type="text" 
                required
                placeholder="Campaign Title (e.g. New Laptop)" 
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded py-3 px-4 text-primary font-body-sm focus:border-primary-fixed focus:outline-none neon-input transition-colors"
            />
            <div className="relative">
                <input 
                type="number" 
                step="1"
                required
                placeholder="Target Amount" 
                value={campaignTarget}
                onChange={(e) => setCampaignTarget(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded py-3 pl-4 pr-16 text-primary font-body-sm focus:border-primary-fixed focus:outline-none neon-input transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-code-label text-surface-tint">$BOT</span>
            </div>
            <button 
                type="submit" 
                disabled={isSettingCampaign || !campaignTitle || !campaignTarget}
                className="w-full bg-surface-tint text-black font-button-text py-3 rounded-DEFAULT hover:bg-primary-fixed transition-all disabled:opacity-50"
            >
                {isSettingCampaign ? "Saving..." : "Set Campaign Goal"}
            </button>
          </form>
        </div>
      )}

      {/* Recent Transactions */}
      {isRegistered && (
        <div className="glass-card rounded-xl p-0 overflow-hidden mt-4">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="font-headline-lg-mobile text-primary">Recent Tips Received</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 font-code-label text-xs text-outline-variant uppercase tracking-wider">
                  <th className="p-6 font-medium">Type</th>
                  <th className="p-6 font-medium">From</th>
                  <th className="p-6 font-medium">Amount</th>
                  <th className="p-6 font-medium">Message</th>
                  <th className="p-6 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="font-code-label text-sm">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-on-surface-variant">No tips found. Share your profile!</td>
                  </tr>
                ) : (
                  transactions.map((tx, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-6 flex items-center gap-2 text-primary-fixed">
                        <span className="material-symbols-outlined text-[16px]">call_received</span>
                        {tx.type}
                      </td>
                      <td className="p-6 text-on-surface-variant">
                        {tx.address.slice(0, 6)}...{tx.address.slice(-4)}
                      </td>
                      <td className="p-6 font-medium text-primary">
                        {tx.amount}
                      </td>
                      <td className="p-6 text-on-surface-variant font-body-sm">{tx.message || "-"}</td>
                      <td className="p-6 text-on-surface-variant">
                        {tx.timestamp.toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sent Transactions */}
      {sentTransactions.length > 0 && (
        <div className="glass-card rounded-xl p-0 overflow-hidden mt-4">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="font-headline-lg-mobile text-primary">Recent Tips Sent</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 font-code-label text-xs text-outline-variant uppercase tracking-wider">
                  <th className="p-6 font-medium">Type</th>
                  <th className="p-6 font-medium">To</th>
                  <th className="p-6 font-medium">Amount</th>
                  <th className="p-6 font-medium">Message</th>
                  <th className="p-6 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="font-code-label text-sm">
                {sentTransactions.map((tx, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-6 flex items-center gap-2 text-surface-tint">
                      <span className="material-symbols-outlined text-[16px]">call_made</span>
                      {tx.type}
                    </td>
                    <td className="p-6 text-on-surface-variant">
                      {tx.address.slice(0, 6)}...{tx.address.slice(-4)}
                    </td>
                    <td className="p-6 font-medium text-surface-tint">
                      {tx.amount}
                    </td>
                    <td className="p-6 text-on-surface-variant font-body-sm">{tx.message || "-"}</td>
                    <td className="p-6 text-on-surface-variant">
                      {tx.timestamp.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel p-8 rounded-xl max-w-md w-full flex flex-col gap-6 relative">
            <button 
              onClick={() => setIsWithdrawModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <div>
              <h2 className="font-headline-lg-mobile text-primary">Withdraw Funds</h2>
              <p className="font-body-sm text-on-surface-variant mt-1">Send $BOT to any external wallet.</p>
            </div>

            <form onSubmit={handleWithdraw} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-code-label text-xs text-outline-variant uppercase">Destination Address</label>
                <input 
                  type="text" 
                  required
                  placeholder="0x..." 
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded py-3 px-4 text-primary font-body-sm focus:border-primary-fixed focus:outline-none neon-input transition-colors"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-code-label text-xs text-outline-variant uppercase">Amount ($BOT)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.0001"
                    required
                    max={balance}
                    placeholder="0.00" 
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded py-3 pl-4 pr-16 text-primary font-body-sm focus:border-primary-fixed focus:outline-none neon-input transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={() => setWithdrawAmount(balance)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-code-label bg-primary-fixed/20 text-primary-fixed px-2 py-1 rounded"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isWithdrawing || !withdrawAddress || !withdrawAmount}
                className="w-full mt-2 bg-primary-fixed text-on-primary-fixed font-button-text py-3 rounded-DEFAULT btn-glow transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isWithdrawing ? "Sending..." : "Send Transfer"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
