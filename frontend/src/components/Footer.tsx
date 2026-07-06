export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest w-full py-margin-desktop border-t border-white/5 flat no shadows mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop gap-stack-gap max-w-container-max mx-auto">
        <div className="font-code-label text-code-label text-surface-tint">
          © {new Date().getFullYear()} BOT-TIPS
        </div>
        <nav className="flex flex-wrap gap-6 justify-center">
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-all" href="https://faucet.botchain.ai/basic" target="_blank" rel="noreferrer">Faucet</a>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-all" href="https://scan.bohr.life/" target="_blank" rel="noreferrer">Explorer</a>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-all" href="https://twitter.com/Botchain_" target="_blank" rel="noreferrer">Twitter</a>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-all" href="https://discord.gg/botchain" target="_blank" rel="noreferrer">Discord</a>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-all" href="https://docs.botchain.ai/" target="_blank" rel="noreferrer">Docs</a>
        </nav>
      </div>
    </footer>
  );
}
