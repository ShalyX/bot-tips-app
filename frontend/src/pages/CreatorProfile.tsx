import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers';
import { useWallets } from '@privy-io/react-auth';
import { useParams } from 'react-router-dom';
import { CREATOR_REGISTRY_ADDRESS, CREATOR_REGISTRY_ABI } from '../config/contracts';

export default function CreatorProfile({ currentAccount }: { currentAccount: string }) {
  const { address } = useParams();
  const targetAddress = address || "0x0000000000000000000000000000000000000000";

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("10");
  const [memos, setMemos] = useState<any[]>([]);
  const [isMining, setIsMining] = useState(false);
  
  // Creator Data
  const [creatorUsername, setCreatorUsername] = useState("");
  const [creatorBio, setCreatorBio] = useState("");
  const [creatorAvatar, setCreatorAvatar] = useState("");
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignTarget, setCampaignTarget] = useState("0");
  const [totalTipsReceived, setTotalTipsReceived] = useState(0);

  const { wallets } = useWallets();

  const getCreatorData = useCallback(async () => {
    try {
      if (CREATOR_REGISTRY_ADDRESS && wallets.length > 0) {
        const wallet = wallets[0];
        const ethereumProvider = await wallet.getEthereumProvider();
        const provider = new BrowserProvider(ethereumProvider);
        const registryContract = new Contract(CREATOR_REGISTRY_ADDRESS, CREATOR_REGISTRY_ABI, provider);
        
        const creator = await registryContract.getCreator(targetAddress);
        setIsRegistered(creator.isRegistered);
        
        if (creator.isRegistered) {
          setCreatorUsername(creator.username);
          setCreatorBio(creator.bio);
          setCreatorAvatar(creator.avatarUrl);
          setCampaignTitle(creator.campaignTitle);
          setCampaignTarget(creator.campaignTarget.toString());
          setTotalTipsReceived(parseFloat(formatEther(creator.totalTipsReceived)));
          
          const rawMemos = await registryContract.getCreatorTips(targetAddress);
          const memosCleaned = rawMemos.map((memo: any) => ({
            address: memo.from,
            timestamp: new Date(Number(memo.timestamp) * 1000),
            message: memo.message,
            name: memo.name,
            amount: formatEther(memo.amount)
          }));
          
          memosCleaned.sort((a: any, b: any) => b.timestamp - a.timestamp);
          setMemos(memosCleaned);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [targetAddress, wallets]);

  useEffect(() => {
    getCreatorData();
  }, [getCreatorData]);

  const buyCoffee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount) {
        alert("Please connect wallet first");
        return;
    }
    if (!isRegistered) {
        alert("This creator is not registered.");
        return;
    }
    try {
      if (wallets.length > 0) {
        const wallet = wallets[0];
        const ethereumProvider = await wallet.getEthereumProvider();
        const provider = new BrowserProvider(ethereumProvider);
        const signer = await provider.getSigner();
        const registryContract = new Contract(CREATOR_REGISTRY_ADDRESS, CREATOR_REGISTRY_ABI, signer);

        setIsMining(true);
        const tipTxn = await registryContract.sendTip(
          targetAddress,
          name ? name : "Anonymous",
          message ? message : "Enjoy your coffee!",
          { value: parseEther(amount || "0.1") }
        );

        await tipTxn.wait();
        setIsMining(false);
        
        setName("");
        setMessage("");
        setAmount("");
        
        getCreatorData();
      }
    } catch (error) {
      console.error(error);
      setIsMining(false);
    }
  };

  const currentRaised = memos.reduce((acc, memo) => acc + parseFloat(memo.amount), 0);
  const target = parseFloat(campaignTarget) > 0 ? parseFloat(campaignTarget) : Math.max(100, Math.ceil((currentRaised + 0.01) / 100) * 100);
  const goalProgress = Math.min(100, (currentRaised / target) * 100);

  if (isRegistered === false) {
    return (
      <main className="flex-grow pt-[100px] px-gutter max-w-container-max mx-auto w-full flex flex-col items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined text-6xl text-surface-tint mb-4 opacity-50">person_off</span>
        <h1 className="font-headline-xl text-primary mb-2">Creator Not Found</h1>
        <p className="font-body-md text-on-surface-variant text-center max-w-md">The wallet address {targetAddress.slice(0, 6)}...{targetAddress.slice(-4)} is not registered as a creator on the BOT Chain yet.</p>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-[100px] px-gutter max-w-container-max mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 pb-[100px]">
      <div className="lg:col-span-8 flex flex-col gap-8">
        <div className="glass-panel rounded-xl p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/5 rounded-full blur-3xl pointer-events-none"></div>
          {creatorAvatar ? (
            <img 
              src={creatorAvatar.replace('_normal', '_400x400')} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full border-2 border-primary-fixed/50 object-cover z-10 bg-black" 
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${creatorUsername}`; }}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-surface-container border-2 border-primary-fixed/20 flex items-center justify-center flex-shrink-0 z-10 shadow-lg shadow-black/50">
                <span className="material-symbols-outlined text-4xl text-primary-fixed">person</span>
            </div>
          )}
          <div className="flex flex-col gap-2 z-10 flex-1">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="font-headline-xl text-primary leading-tight">
                    {creatorUsername || "Loading..."}
                    </h1>
                    <p className="font-code-label text-sm text-primary-fixed/80 font-medium">
                    {targetAddress.slice(0, 6)}...{targetAddress.slice(-4)}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {memos.length >= 10 && (
                            <span className="px-3 py-1 bg-primary-fixed/10 border border-primary-fixed/20 text-primary-fixed font-code-label text-xs rounded-full flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                                Community Favorite
                            </span>
                        )}
                        {totalTipsReceived >= 100 && (
                            <span className="px-3 py-1 bg-secondary/10 border border-secondary/20 text-secondary font-code-label text-xs rounded-full flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                                100+ $BOT Raised
                            </span>
                        )}
                    </div>
                </div>
                <button 
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Profile link copied! Share it with your fans.");
                    }}
                    className="p-2 rounded-full bg-white/5 border border-white/10 text-on-surface-variant hover:text-primary-fixed hover:bg-primary-fixed/10 transition-colors"
                    title="Share Profile"
                >
                    <span className="material-symbols-outlined text-sm">share</span>
                </button>
            </div>
            <p className="font-body-md text-on-surface-variant mt-2 max-w-lg">
              {creatorBio || "A creator on the BOT Chain ecosystem."}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-8 flex flex-col gap-8 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-fixed/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center justify-between border-b border-white/5 pb-4 z-10">
            <h2 className="font-headline-lg-mobile text-primary">Support My Work</h2>
            <span className="material-symbols-outlined text-primary-fixed">local_cafe</span>
          </div>
          <div className="grid grid-cols-3 gap-4 z-10">
            <button type="button" onClick={() => setAmount("5")} className={`py-3 rounded-DEFAULT font-button-text text-center focus:outline-none transition-colors ${amount === "5" ? "bg-surface-tint/10 border border-primary-fixed text-primary-fixed" : "glass-panel border-white/10 text-on-surface hover:text-primary-fixed hover:border-surface-tint/50"}`}>
              5 $BOT
            </button>
            <button type="button" onClick={() => setAmount("10")} className={`py-3 rounded-DEFAULT font-button-text text-center focus:outline-none transition-colors ${amount === "10" ? "bg-surface-tint/10 border border-primary-fixed text-primary-fixed" : "glass-panel border-white/10 text-on-surface hover:text-primary-fixed hover:border-surface-tint/50"}`}>
              10 $BOT
            </button>
            <button type="button" onClick={() => setAmount("20")} className={`py-3 rounded-DEFAULT font-button-text text-center focus:outline-none transition-colors ${amount === "20" ? "bg-surface-tint/10 border border-primary-fixed text-primary-fixed" : "glass-panel border-white/10 text-on-surface hover:text-primary-fixed hover:border-surface-tint/50"}`}>
              20 $BOT
            </button>
          </div>
          <form onSubmit={buyCoffee} className="flex flex-col gap-6 z-10">
            <div className="flex gap-4 flex-col sm:flex-row">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="font-code-label text-outline-variant uppercase text-xs tracking-wider">Your Name</label>
                    <input 
                        className="w-full bg-black border border-white/10 rounded-DEFAULT py-3 px-4 text-primary font-body-md focus:border-primary-fixed focus:ring-0 focus:outline-none placeholder-surface-variant transition-colors neon-input" 
                        placeholder="e.g. Alice" 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="font-code-label text-outline-variant uppercase text-xs tracking-wider">Custom Amount</label>
                    <div className="relative">
                        <input 
                            className="w-full bg-black border border-white/10 rounded-DEFAULT py-3 px-4 text-primary font-body-md focus:border-primary-fixed focus:ring-0 focus:outline-none placeholder-surface-variant transition-colors neon-input" 
                            placeholder="Enter amount" 
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-code-label text-surface-tint">$BOT</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label className="font-code-label text-outline-variant uppercase text-xs tracking-wider">Message (Optional)</label>
                <textarea 
                    className="w-full bg-black border border-white/10 rounded-DEFAULT py-3 px-4 text-primary font-body-md focus:border-primary-fixed focus:ring-0 focus:outline-none placeholder-surface-variant resize-none transition-colors neon-input" 
                    placeholder="Leave a note of support..." 
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
            </div>
            <button type="submit" disabled={isMining} className="w-full bg-primary-fixed text-on-primary-fixed font-button-text py-4 rounded-DEFAULT btn-glow transition-all z-10 uppercase tracking-widest disabled:opacity-50">
                {isMining ? "SENDING..." : `SEND ${amount ? amount : '10'} $BOT`}
            </button>
          </form>
        </div>
      </div>
      <div className="lg:col-span-4 flex flex-col gap-8">
        <div className="glass-panel rounded-lg p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-button-text text-primary">{campaignTitle || "Creator Support Goal"}</h3>
            <span className="font-code-label text-xs text-surface-tint">
              {goalProgress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary-fixed to-secondary-container h-full rounded-full transition-all duration-1000" 
              style={{ width: `${goalProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between font-code-label text-xs text-on-surface-variant">
            <span>{currentRaised.toFixed(2)} $BOT raised</span>
            <span>{target} $BOT target</span>
          </div>
        </div>
        <div className="glass-panel rounded-lg p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-headline-lg-mobile text-primary text-xl">Recent Supporters</h3>
            <span className="material-symbols-outlined text-on-surface-variant">history</span>
          </div>
          <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto scrollbar-hide pr-2">
            {memos.length === 0 ? (
                <p className="font-body-sm text-on-surface-variant">No tips yet. Be the first!</p>
            ) : (
                memos.map((memo, index) => (
                    <div key={index} className={`flex gap-4 items-start ${index > 0 ? 'border-t border-white/5 pt-4' : ''}`}>
                        <div className="w-10 h-10 rounded-full bg-surface-container border border-white/10 flex-shrink-0 flex items-center justify-center font-code-label text-surface-tint">
                            {memo.name ? memo.name.substring(0, 2).toUpperCase() : "AN"}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-2">
                                <span className="font-button-text text-primary">{memo.name || "Anonymous"}</span>
                                <span className="font-code-label text-xs text-primary-fixed">tipped {memo.amount} $BOT</span>
                            </div>
                            <p className="font-body-sm text-on-surface-variant mt-1">"{memo.message}"</p>
                            <span className="font-code-label text-xs text-surface-variant mt-2">{memo.timestamp.toLocaleString()}</span>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
