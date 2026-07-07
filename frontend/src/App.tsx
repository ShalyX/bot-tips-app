import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Discovery from './pages/Discovery';
import Dashboard from './pages/Dashboard';
import CreatorProfile from './pages/CreatorProfile';
import './index.css';

export default function App() {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  
  // Get the current account from Privy's connected wallet or embedded wallet
  const currentAccount = wallets[0]?.address || user?.wallet?.address || "";

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar currentAccount={currentAccount} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discovery />} />
          <Route path="/dashboard" element={<Dashboard currentAccount={currentAccount} />} />
          <Route path="/creator/:address" element={<CreatorProfile currentAccount={currentAccount} />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
