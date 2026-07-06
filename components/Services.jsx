export default function Services() {
  return (
    <section id="services" className="container">
      <div className="section-header">
        <span className="mono-tag">Nossos Serviços</span>
        <h2>Soluções High-End</h2>
      </div>

      <div className="services-grid">
        {/* Automação */}
        <div className="service-card">
          <i className="ph ph-gear service-icon"></i>
          <div>
            <h3 className="service-title">Automação de Processos</h3>
            <p className="service-desc">
              Otimize fluxos de trabalho complexos. Eliminamos gargalos operacionais com
              sistemas autônomos e inteligentes.
            </p>
          </div>
        </div>

        {/* SaaS */}
        <div className="service-card">
          <i className="ph ph-cloud service-icon"></i>
          <div>
            <h3 className="service-title">SaaS Development</h3>
            <p className="service-desc">
              Arquitetura escalável e multi-tenant. Construímos o próximo unicórnio com
              stack moderna e resiliente.
            </p>
          </div>
        </div>

        {/* Sob Medida */}
        <div className="service-card">
          <i className="ph ph-code service-icon"></i>
          <div>
            <h3 className="service-title">Software Sob Medida</h3>
            <p className="service-desc">
              Soluções desenhadas para sua regra de negócio específica. Sem adaptações
              forçadas, apenas código preciso.
            </p>
          </div>
        </div>

        {/* AI Agents */}
        <div className="service-card">
          <i className="ph ph-robot service-icon"></i>
          <div>
            <h3 className="service-title">Chatbots & Agentes IA</h3>
            <p className="service-desc">
              Atendimento e operação 24/7 com LLMs de última geração. Inteligência real
              aplicada ao customer service.
            </p>
          </div>
        </div>

        {/* Mobile */}
        <div className="service-card">
          <i className="ph ph-device-mobile service-icon"></i>
          <div>
            <h3 className="service-title">Apps Mobile</h3>
            <p className="service-desc">
              Experiência nativa fluida para iOS e Android. Coloque sua empresa no bolso
              do seu cliente.
            </p>
          </div>
        </div>

        {/* Consultoria */}
        <div className="service-card">
          <i className="ph ph-strategy service-icon"></i>
          <div>
            <h3 className="service-title">Consultoria Tech</h3>
            <p className="service-desc">
              Análise profunda de arquitetura e stack para modernizar seu legado
              tecnológico.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
