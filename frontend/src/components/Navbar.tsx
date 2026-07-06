import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';

export default function Navbar({ currentAccount }: { currentAccount: string }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { login, logout, user, authenticated } = usePrivy();

  const copyAddress = () => {
    if (currentAccount) {
      navigator.clipboard.writeText(currentAccount);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayName = user?.twitter?.username ? `@${user.twitter.username}` : (currentAccount ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` : '');

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/40 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(195,244,0,0.15)]">
      <div className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
        <Link to="/" className="flex items-center gap-4">
          <img alt="BOT-TIPS Logo" className="h-8 w-8 rounded-DEFAULT" src="https://lh3.googleusercontent.com/aida/AP1WRLslTVqNUM9YdFCh5GZDand7NE6-D-0phqhpFpb5uythQwusOio87zmc_zoTv1LZJfc17FdSyM4-tH4ljcBPXwHuY8NnIvxoQxUN-IDeHO3o7-sw9xpTZG5I1lh8aU20d7Ym_Qfwgo6b7heUjBqTDRY1w-yzlXq-ZXe_u-9LlY1-Bv6xMyfIW3zR-CKfai4Zyf7Afgi4r3P92heRqDS7d02JE3lUFNvzGJRqo45Ya7bvJgI6_flsMmVBrWM"/>
          <span className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary-fixed tracking-tighter">BOT-TIPS</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/discover" className="text-on-surface-variant hover:text-primary-fixed transition-colors duration-300 font-button-text text-button-text">Discovery</Link>
          <Link to="/dashboard" className="text-on-surface-variant hover:text-primary-fixed transition-colors duration-300 font-button-text text-button-text">Dashboard</Link>
          {currentAccount && (
            <Link to={`/creator/${currentAccount}`} className="text-on-surface-variant hover:text-primary-fixed transition-colors duration-300 font-button-text text-button-text">My Profile</Link>
          )}
        </nav>
        
        {authenticated ? (
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-surface-container text-on-surface font-code-label text-code-label px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 hover:border-primary-fixed/50 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-primary-fixed shadow-[0_0_8px_#c3f400]"></div>
              {displayName}
              <span className="material-symbols-outlined text-[16px]">{dropdownOpen ? 'expand_less' : 'expand_more'}</span>
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-container border border-white/10 rounded-lg shadow-xl overflow-hidden py-1 z-50">
                <button 
                  onClick={copyAddress}
                  className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/5 flex items-center justify-between"
                >
                  <span>Copy Address</span>
                  {copied ? (
                    <span className="material-symbols-outlined text-[16px] text-primary-fixed">check</span>
                  ) : (
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  )}
                </button>
                <div className="h-[1px] w-full bg-white/10 my-1"></div>
                <button 
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 flex items-center justify-between"
                >
                  <span>Disconnect</span>
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={login} className="bg-primary-container text-on-primary-fixed font-button-text text-button-text px-6 py-2 rounded-lg hover:shadow-[0_0_20px_rgba(195,244,0,0.3)] transition-all active:scale-95">
            Connect
          </button>
        )}
      </div>
    </header>
  );
}
