import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="flex-grow pt-[80px] px-gutter max-w-container-max mx-auto w-full flex flex-col gap-[40px] md:gap-[60px] pb-[100px]">
      <section className="min-h-[60vh] lg:min-h-[70vh] flex flex-col justify-center relative">
        <div className="absolute inset-0 z-[-1] opacity-40 flex justify-end items-center pointer-events-none pr-10">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-secondary-container/20 to-primary-container/10 blur-3xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-8">
            <h1 className="font-headline-xl text-headline-xl text-primary leading-tight">
              Send direct creator support in <span className="text-primary-fixed block md:inline">$BOT</span>
            </h1>

            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl text-lg">
              BOT-TIPS lets fans tip registered creators on BOT Chain. Creators keep the funds in their own wallet, and every tip is visible on-chain.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <Link to="/discover" className="bg-primary-container text-on-primary-fixed font-button-text px-8 py-4 rounded-lg flex items-center gap-2 hover:shadow-[0_0_20px_rgba(195,244,0,0.4)] transition-all group">
                Find a Creator
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <Link to="/dashboard" className="bg-surface-container border border-primary-fixed/40 text-primary-fixed font-button-text px-8 py-4 rounded-lg hover:bg-primary-fixed hover:text-on-primary-fixed transition-all">
                Register Your Profile
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-6 border-t border-white/5 pt-6">
              <div className="flex items-center gap-2 text-surface-tint font-code-label text-xs tracking-wide">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Wallet-owned profiles
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-surface-variant" />
              <div className="flex items-center gap-2 text-surface-tint font-code-label text-xs tracking-wide">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                Direct $BOT transfers
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-end relative">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-fixed to-secondary-container rounded-2xl blur opacity-20" />
              <div className="relative glass-card rounded-2xl p-6 border border-white/10 shadow-2xl flex flex-col gap-6 transform hover:-translate-y-2 transition-transform duration-500">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border border-primary-fixed/30 text-primary-fixed">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <div>
                      <div className="font-button-text text-primary">@demo_creator</div>
                      <div className="font-code-label text-xs text-on-surface-variant">0x7F...3B92</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-primary-fixed/10 border border-primary-fixed/20 text-primary-fixed font-code-label text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-pulse" />
                    Registered
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-on-surface-variant font-code-label text-xs uppercase">New tip received</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-xl text-primary text-4xl">25</span>
                    <span className="font-headline-lg text-primary-fixed text-xl">$BOT</span>
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-lg bg-black/40 border border-white/5 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-surface-tint font-button-text text-sm">From: Fan wallet</span>
                    <span className="text-on-surface-variant font-code-label text-xs">Just now</span>
                  </div>
                  <p className="text-on-surface-variant font-body-sm">"Love the work — sending support for the next drop."</p>
                </div>

                <div className="w-full bg-primary-fixed/10 border border-primary-fixed/30 text-primary-fixed py-3 rounded-lg font-button-text flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  On-chain receipt recorded
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 glass-card px-4 py-3 rounded-xl border border-white/10 shadow-xl flex items-center gap-3 animate-float">
                <span className="material-symbols-outlined text-secondary text-2xl">route</span>
                <div>
                  <div className="font-button-text text-primary text-sm">Direct wallet transfer</div>
                  <div className="font-code-label text-xs text-on-surface-variant">No platform balance to claim</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="font-headline-lg text-primary">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-xl p-8 flex flex-col gap-4">
            <span className="material-symbols-outlined text-primary-fixed text-4xl mb-2">person_add</span>
            <h3 className="font-headline-lg-mobile text-primary">Register a creator profile</h3>
            <p className="font-body-sm text-on-surface-variant">Creators connect X, add a short bio, and bind the profile to their BOT Chain wallet.</p>
          </div>
          <div className="glass-card rounded-xl p-8 flex flex-col gap-4 border-primary-fixed/30">
            <span className="material-symbols-outlined text-primary-fixed text-4xl mb-2">payments</span>
            <h3 className="font-headline-lg-mobile text-primary">Tip directly</h3>
            <p className="font-body-sm text-on-surface-variant">Fans send $BOT from their own wallet to the creator's registered address.</p>
          </div>
          <div className="glass-card rounded-xl p-8 flex flex-col gap-4">
            <span className="material-symbols-outlined text-secondary text-4xl mb-2">receipt_long</span>
            <h3 className="font-headline-lg-mobile text-primary">Review public activity</h3>
            <p className="font-body-sm text-on-surface-variant">Creator pages show recent supporters and campaign progress pulled from the registry.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
