import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, formatEther } from 'ethers';
import { useWallets } from '@privy-io/react-auth';
import { Link } from 'react-router-dom';
import { CREATOR_REGISTRY_ADDRESS, CREATOR_REGISTRY_ABI } from '../config/contracts';
import { shortenAddress } from '../lib/utils';

export default function Discovery() {
  const [creators, setCreators] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const { wallets } = useWallets();

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        if (wallets.length > 0) {
          const wallet = wallets[0];
          const ethereumProvider = await wallet.getEthereumProvider();
          const provider = new BrowserProvider(ethereumProvider);
          const registryContract = new Contract(CREATOR_REGISTRY_ADDRESS, CREATOR_REGISTRY_ABI, provider);
          
          const allCreators = await registryContract.getAllCreators();
          
          // Map to format
          const formatted = allCreators.map((c: any) => ({
            wallet: c.wallet,
            username: c.username,
            bio: c.bio,
            avatarUrl: c.avatarUrl,
            totalTipsReceived: parseFloat(formatEther(c.totalTipsReceived)),
            isRegistered: c.isRegistered,
            campaignTitle: c.campaignTitle,
            campaignTarget: c.campaignTarget.toString()
          }));

          // Sort by tips received (highest first)
          formatted.sort((a: any, b: any) => b.totalTipsReceived - a.totalTipsReceived);
          
          setCreators(formatted);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching creators:", error);
        setLoadError('Could not load creators from BOT Chain. Connect a wallet on the right network and refresh.');
        setIsLoading(false);
      }
    };

    fetchCreators();
  }, [wallets]);

  const filteredCreators = creators.filter(c => {
    const searchLower = searchQuery.toLowerCase();
    return c.username.toLowerCase().includes(searchLower) || 
           c.wallet.toLowerCase().includes(searchLower) || 
           c.bio.toLowerCase().includes(searchLower);
  });

  const topCreators = searchQuery === "" ? creators.slice(0, 3) : [];
  const standardCreators = searchQuery === "" ? creators.slice(3) : filteredCreators;

  const getRankBadge = (index: number) => {
    if (index === 0) return { label: "1st", color: "text-[#FFD700]", bg: "bg-[#FFD700]/20", border: "border-[#FFD700]/50 shadow-[0_0_20px_rgba(255,215,0,0.3)]" }; // Gold
    if (index === 1) return { label: "2nd", color: "text-[#C0C0C0]", bg: "bg-[#C0C0C0]/20", border: "border-[#C0C0C0]/50" }; // Silver
    if (index === 2) return { label: "3rd", color: "text-[#CD7F32]", bg: "bg-[#CD7F32]/20", border: "border-[#CD7F32]/50" }; // Bronze
    return { label: "", color: "", bg: "", border: "" };
  };

  const hasTips = topCreators.some(c => c.totalTipsReceived > 0);
  const podiumTitle = hasTips ? "Highest Tipped Creators" : "Featured Creators";

  return (
    <main className="flex-grow pt-[100px] px-gutter max-w-container-max mx-auto w-full flex flex-col gap-8 pb-[100px]">
      
      {/* Header & Filters */}
      <section className="flex flex-col gap-4">
        <h1 className="font-headline-xl text-headline-xl text-primary">Discover Creators</h1>
        <p className="font-body-md text-on-surface-variant max-w-2xl">Find and support the most innovative minds building on the BOT Chain. 100% of your tips go directly to their wallets instantly.</p>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mt-2">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text" 
              placeholder="Search by username, wallet, or bio..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-full py-3 pl-12 pr-4 text-primary font-body-sm focus:border-primary-fixed focus:outline-none neon-input transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 md:py-0 w-full md:w-auto">
            <span className="px-4 py-2 rounded-full border border-primary-fixed bg-primary-fixed/10 text-primary-fixed font-code-label text-code-label whitespace-nowrap">All Creators</span>
          </div>
        </div>
      </section>

      {/* Discovery Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <p className="font-code-label text-primary-fixed">Loading creators from BOT Chain...</p>
        </div>
      ) : loadError ? (
        <div className="flex justify-center items-center h-48 glass-panel rounded-xl px-6 text-center">
          <p className="font-code-label text-error">{loadError}</p>
        </div>
      ) : filteredCreators.length === 0 ? (
        <div className="flex justify-center items-center h-48 glass-panel rounded-xl px-6 text-center">
          <p className="font-code-label text-on-surface-variant">No creators match this search yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {/* Highest Tipped Creators Podium */}
          {topCreators.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                <span className="material-symbols-outlined text-3xl text-[#FFD700]">{hasTips ? 'emoji_events' : 'star'}</span>
                <h2 className="font-headline-lg-mobile text-primary">{podiumTitle}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topCreators.map((creator, index) => {
                  const badge = getRankBadge(index);
                  return (
                    <Link to={`/creator/${creator.wallet}`} key={creator.wallet} className={index === 0 ? "md:-mt-4" : ""}>
                      <div className={`glass-card rounded-xl p-6 flex flex-col gap-4 group cursor-pointer transition-all duration-300 hover:-translate-y-1 h-full ${badge.border} bg-surface-container`}>
                        <div className="flex items-start justify-between border-b border-white/5 pb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-full overflow-hidden border-2 flex items-center justify-center flex-shrink-0 bg-black ${badge.border}`}>
                              {creator.avatarUrl ? (
                                <img 
                                  alt={creator.username} 
                                  className="w-full h-full object-cover" 
                                  src={creator.avatarUrl.replace('_normal', '_400x400')} 
                                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${creator.username}`; }}
                                />
                              ) : (
                                <span className="material-symbols-outlined text-primary-fixed text-2xl">person</span>
                              )}
                            </div>
                            <div>
                              <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">{creator.username}</h3>
                              <p className="font-code-label text-code-label text-surface-tint">{shortenAddress(creator.wallet)}</p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1 ${badge.bg} ${badge.color} px-3 py-1 rounded-full font-bold`}>
                            {badge.label}
                          </div>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant flex-grow line-clamp-3">
                          {creator.bio || "A creator on the BOT Chain ecosystem."}
                        </p>
                        {creator.totalTipsReceived >= 100 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-3 py-1 bg-secondary/10 border border-secondary/20 text-secondary font-code-label text-[10px] rounded-full flex items-center gap-1 w-fit">
                                    <span className="material-symbols-outlined text-[12px]">workspace_premium</span>
                                    100+ $BOT Raised
                                </span>
                            </div>
                        )}
                        {creator.campaignTitle && creator.campaignTarget !== "0" && (
                            <div className="mt-2 p-3 rounded-lg bg-black/40 border border-white/5">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-code-label text-[10px] text-primary-fixed uppercase tracking-wider truncate mr-2">{creator.campaignTitle}</span>
                                    <span className="font-code-label text-[10px] text-on-surface-variant whitespace-nowrap">{creator.totalTipsReceived.toFixed(0)} / {creator.campaignTarget} $BOT</span>
                                </div>
                                <div className="w-full bg-surface h-1 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-primary-fixed h-full rounded-full transition-all duration-1000" 
                                        style={{ width: `${Math.min(100, (creator.totalTipsReceived / parseFloat(creator.campaignTarget)) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center justify-between pt-4 mt-auto">
                          <div className="flex gap-2 items-center">
                            <span className="material-symbols-outlined text-surface-tint text-sm">local_cafe</span>
                            <span className="font-code-label text-xs text-primary font-bold">{creator.totalTipsReceived.toFixed(2)} $BOT raised</span>
                          </div>
                          <span className="bg-transparent border border-white/10 text-primary-fixed px-4 py-2 rounded-DEFAULT font-button-text text-button-text group-hover:bg-primary-container group-hover:text-on-primary-fixed group-hover:border-primary-container transition-all">Support</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Standard Grid */}
          {standardCreators.length > 0 && (
            <section>
              {topCreators.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-headline-lg-mobile text-primary">All Creators</h2>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {standardCreators.map((creator) => (
                  <Link to={`/creator/${creator.wallet}`} key={creator.wallet}>
                    <div className="glass-card rounded-xl p-6 flex flex-col gap-4 group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] h-full">
                      <div className="flex items-start justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 bg-surface-container flex items-center justify-center flex-shrink-0">
                            {creator.avatarUrl ? (
                              <img 
                                alt={creator.username} 
                                className="w-full h-full object-cover" 
                                src={creator.avatarUrl.replace('_normal', '_400x400')} 
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${creator.username}`; }}
                              />
                            ) : (
                              <span className="material-symbols-outlined text-primary-fixed text-2xl">person</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">{creator.username}</h3>
                            <p className="font-code-label text-code-label text-surface-tint">{shortenAddress(creator.wallet)}</p>
                          </div>
                        </div>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant flex-grow line-clamp-3">
                        {creator.bio || "A creator on the BOT Chain ecosystem."}
                      </p>
                      {creator.totalTipsReceived >= 100 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                              <span className="px-3 py-1 bg-secondary/10 border border-secondary/20 text-secondary font-code-label text-[10px] rounded-full flex items-center gap-1 w-fit">
                                  <span className="material-symbols-outlined text-[12px]">workspace_premium</span>
                                  100+ $BOT Raised
                              </span>
                          </div>
                      )}
                      {creator.campaignTitle && creator.campaignTarget !== "0" && (
                          <div className="mt-2 p-3 rounded-lg bg-black/40 border border-white/5">
                              <div className="flex justify-between items-center mb-1">
                                  <span className="font-code-label text-[10px] text-primary-fixed uppercase tracking-wider truncate mr-2">{creator.campaignTitle}</span>
                                  <span className="font-code-label text-[10px] text-on-surface-variant whitespace-nowrap">{creator.totalTipsReceived.toFixed(0)} / {creator.campaignTarget} $BOT</span>
                              </div>
                              <div className="w-full bg-surface h-1 rounded-full overflow-hidden">
                                  <div 
                                      className="bg-primary-fixed h-full rounded-full transition-all duration-1000" 
                                      style={{ width: `${Math.min(100, (creator.totalTipsReceived / parseFloat(creator.campaignTarget)) * 100)}%` }}
                                  ></div>
                              </div>
                          </div>
                      )}
                      <div className="flex items-center justify-between pt-4 mt-auto">
                        <div className="flex gap-2 items-center">
                          <span className="material-symbols-outlined text-surface-tint text-sm">local_cafe</span>
                          <span className="font-code-label text-xs text-primary">{creator.totalTipsReceived.toFixed(2)} $BOT raised</span>
                        </div>
                        <span className="bg-transparent border border-white/10 text-primary-fixed px-4 py-2 rounded-DEFAULT font-button-text text-button-text group-hover:bg-primary-container group-hover:text-on-primary-fixed group-hover:border-primary-container transition-all">Support</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
