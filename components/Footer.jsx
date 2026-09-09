import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contact">
      <div className="container footer-grid">
        <div className="footer-col">
          <Link href="/" className="logo" style={{ display: 'block', marginBottom: '2rem' }}>
            <img src="/assets/img/Logo.svg" alt="Raed" style={{ height: '40px' }} />
          </Link>
          <span className="mono-tag">Status: Online</span>
        </div>

        <div className="footer-col">
          <h4>Empresa</h4>
          <ul>
            <li><Link href="/portfolio">Portfólio</Link></li>
            <li><Link href="/calculadora">Calculadora de Projetos</Link></li>
            <li><a href="#">Sobre Nós</a></li>
            <li><a href="#">Carreiras</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><Link href="/politica">Privacidade</Link></li>
            <li><Link href="/termos">Termos</Link></li>
            <li><Link href="/login">LOGIN</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Connect</h4>
          <ul>
            <li><a href="#">Twitter / X</a></li>
            <li><a href="https://www.instagram.com/raed.world/" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="#">LinkedIn</a></li>
            <li><a href="mailto:contact@raed.world" style={{ color: 'var(--accent)' }}>contact@raed.world</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
