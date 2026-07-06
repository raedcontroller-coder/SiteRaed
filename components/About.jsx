export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="container about-container">
        <div className="about-header">
          <span className="mono-tag" style={{ marginBottom: '1rem', display: 'block' }}>Sobre a Raed</span>
          <h3>Somos uma boutique de desenvolvimento focada em arquitetar sistemas vitais e IA de alta maturidade para operações complexas</h3>
        </div>
        <div className="about-stats">
          <div className="stat-item">
            <span className="stat-number">10+</span>
            <span className="stat-label">Produtos SaaS Lançados</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Projetos Entregues</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Foco em Performance</span>
          </div>
        </div>
      </div>

      {/* TRL Section */}
      <div className="container trl-container">
        <div className="trl-wrapper">
          <div className="trl-focus-badge">
            <img src="/assets/img/Logo.svg" alt="Raed" />
          </div>

          <div className="trl-grid">
            <div className="trl-item">
              <div className="trl-box">TRL 1</div>
              <span className="trl-desc">Ideia</span>
            </div>
            <div className="trl-item">
              <div className="trl-box">TRL 2</div>
              <span className="trl-desc">Conceito formulado</span>
            </div>
            <div className="trl-item">
              <div className="trl-box">TRL 3</div>
              <span className="trl-desc">Prova inicial</span>
            </div>
            <div className="trl-item">
              <div className="trl-box">TRL 4</div>
              <span className="trl-desc">Protótipo laboratório</span>
            </div>
            <div className="trl-item">
              <div className="trl-box">TRL 5</div>
              <span className="trl-desc">Validação em ambiente</span>
            </div>
            <div className="trl-item">
              <div className="trl-box">TRL 6</div>
              <span className="trl-desc">Protótipo funcional</span>
            </div>
            <div className="trl-item highlighted">
              <div className="trl-box">TRL 7</div>
              <span className="trl-desc">Demonstração em ambiente real</span>
            </div>
            <div className="trl-item highlighted">
              <div className="trl-box">TRL 8</div>
              <span className="trl-desc">Sistema completo validado</span>
            </div>
            <div className="trl-item highlighted">
              <div className="trl-box">TRL 9</div>
              <span className="trl-desc">Produto operacional no mercado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
