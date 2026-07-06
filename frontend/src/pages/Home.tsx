import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="flex-grow pt-[80px] px-gutter max-w-container-max mx-auto w-full flex flex-col gap-[40px] md:gap-[60px] pb-[100px]">
      {/* Hero Section */}
      <section className="min-h-[60vh] lg:min-h-[70vh] flex flex-col justify-center relative">
        <div className="absolute inset-0 z-[-1] opacity-50 flex justify-end items-center pointer-events-none pr-10">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-secondary-container/20 to-primary-container/10 blur-3xl"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-8">
            <h1 className="font-headline-xl text-headline-xl text-primary leading-tight">
              Support creators directly in <span className="text-primary-fixed block md:inline"> $BOT</span>
            </h1>
            
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl text-lg">
              Tip your favorite creators on BOTchain with instant settlement, public proof, and zero platform middlemen.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <Link to="/discover" className="bg-primary-container text-on-primary-fixed font-button-text px-8 py-4 rounded-lg flex items-center gap-2 hover:shadow-[0_0_20px_rgba(195,244,0,0.4)] transition-all group">
                Tip a Creator 
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <Link to="/dashboard" className="glass-panel border-white/10 text-on-surface font-button-text px-8 py-4 rounded-lg hover:bg-white/5 transition-all">
                Create Profile
              </Link>
            </div>

            <div className="flex items-center gap-4 mt-6 border-t border-white/5 pt-6">
              <div className="flex items-center gap-2 text-surface-tint font-code-label text-xs uppercase tracking-widest">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Powered by BOTchain
              </div>
              <div className="w-1 h-1 rounded-full bg-surface-variant"></div>
              <div className="flex items-center gap-2 text-surface-tint font-code-label text-xs uppercase tracking-widest">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                Settled in $BOT
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-end relative">
            {/* Visual Mockup */}
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-fixed to-secondary-container rounded-2xl blur opacity-20"></div>
              <div className="relative glass-card rounded-2xl p-6 border border-white/10 shadow-2xl flex flex-col gap-6 transform hover:-translate-y-2 transition-transform duration-500">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border border-primary-fixed/30 text-primary-fixed">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <div>
                      <div className="font-button-text text-primary">@creator</div>
                      <div className="font-code-label text-xs text-on-surface-variant">0x7F...3B92</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-primary-fixed/10 border border-primary-fixed/20 text-primary-fixed font-code-label text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-pulse"></span>
                    Verified
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-on-surface-variant font-code-label text-xs uppercase">New Tip Received</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-xl text-primary text-4xl">100</span>
                    <span className="font-headline-lg text-primary-fixed text-xl">$BOT</span>
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-lg bg-black/40 border border-white/5 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-surface-tint font-button-text text-sm">From: Anonymous</span>
                    <span className="text-on-surface-variant font-code-label text-xs">Just now</span>
                  </div>
                  <p className="text-on-surface-variant font-body-sm">"Keep up the great work! Funding your next video campaign 🚀"</p>
                </div>

                <button className="w-full bg-primary-fixed/10 border border-primary-fixed/30 text-primary-fixed py-3 rounded-lg font-button-text flex items-center justify-center gap-2 cursor-default">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Instantly Settled
                </button>
              </div>

              {/* Decorative floating badge */}
              <div className="absolute -bottom-6 -left-6 glass-card px-4 py-3 rounded-xl border border-white/10 shadow-xl flex items-center gap-3 animate-float">
                <span className="material-symbols-outlined text-secondary text-2xl">workspace_premium</span>
                <div>
                  <div className="font-button-text text-primary text-sm">100+ $BOT Raised</div>
                  <div className="font-code-label text-xs text-on-surface-variant">On-chain Badge Earned</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="flex flex-col gap-8">
        <h2 className="font-headline-lg text-primary">How it Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-xl p-8 flex flex-col gap-4">
            <span className="material-symbols-outlined text-primary-fixed text-4xl mb-2">person_add</span>
            <h3 className="font-headline-lg-mobile text-primary">Create a Creator Profile</h3>
            <p className="font-body-sm text-on-surface-variant">Set your handle, bio, wallet, and active funding goal on the BOTchain registry.</p>
          </div>
          <div className="glass-card rounded-xl p-8 flex flex-col gap-4 glow-active border-primary-fixed/30">
            <span className="material-symbols-outlined text-primary-fixed text-4xl mb-2">payments</span>
            <h3 className="font-headline-lg-mobile text-primary">Tip in $BOT</h3>
            <p className="font-body-sm text-on-surface-variant">Fans send direct support with an optional message. Instant settlement, zero middleman fees.</p>
          </div>
          <div className="glass-card rounded-xl p-8 flex flex-col gap-4">
            <span className="material-symbols-outlined text-secondary text-4xl mb-2">workspace_premium</span>
            <h3 className="font-headline-lg-mobile text-primary">Build On-chain Reputation</h3>
            <p className="font-body-sm text-on-surface-variant">Every tip becomes public proof of support, campaign progress, and creator credibility.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
