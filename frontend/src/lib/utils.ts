export function shortenAddress(address: string) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getFriendlyError(error: unknown, fallback = 'Something went wrong. Please try again.') {
  const raw = error instanceof Error ? error.message : String(error || '');
  const lower = raw.toLowerCase();

  if (lower.includes('user rejected') || lower.includes('rejected') || lower.includes('denied')) {
    return 'Transaction cancelled in your wallet.';
  }
  if (lower.includes('insufficient funds') || lower.includes('exceeds balance')) {
    return 'Your wallet does not have enough $BOT for this action.';
  }
  if (lower.includes('creator already registered')) {
    return 'This wallet is already registered as a creator.';
  }
  if (lower.includes('creator not registered')) {
    return 'This wallet is not registered as a creator yet.';
  }
  if (lower.includes('network') || lower.includes('chain') || lower.includes('unsupported')) {
    return 'Please switch to BOT Chain and try again.';
  }
  if (lower.includes('timeout')) {
    return 'The network took too long to respond. Please try again.';
  }

  return fallback;
}
