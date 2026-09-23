import { db } from '@/lib/db';
import { portfolioProjects } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Portfólio | Raed',
  description: 'Produtos de software e IA construídos pela Raed, do problema de negócio ao sistema em produção.',
};

const PROCESS_STEPS = [
  'Descoberta do problema',
  'Proposta e orçamento',
  'Protótipo',
  'Desenvolvimento',
  'Validação',
  'Entrega e suporte',
];

function PortfolioCase({ project, reversed }) {
  const paragraphs = project.description.split('\n\n');

  return (
    <article className={`portfolio-case container${reversed ? ' reversed' : ''}`}>
      <div className="portfolio-case-media">
        <img src={project.imageUrl || '/assets/portfolio/default-mockup.svg'} alt={project.title} />
      </div>
      <div className="portfolio-case-content">
        {project.logoUrl && (
          <img src={project.logoUrl} alt={`Logo ${project.title}`} className="portfolio-case-logo" />
        )}
        <h2>{project.title}</h2>
        {project.clientName && <span className="portfolio-case-client">{project.clientName}</span>}
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        {project.tags?.length > 0 && (
          <div className="portfolio-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="portfolio-tag">{tag}</span>
            ))}
          </div>
        )}
        {project.projectUrl && (
          <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <i className="ph ph-arrow-up-right"></i>
            Visitar projeto
          </a>
        )}
      </div>
    </article>
  );
}

export default async function PortfolioPage() {
  const projects = await db.select().from(portfolioProjects).orderBy(desc(portfolioProjects.createdAt));

  return (
    <>
      <Header />
      <main className="portfolio-page">
        <section className="portfolio-hero container">
          <span className="mono-tag">Portfólio</span>
          <h1>Tecnologia sob medida para o problema que sua empresa realmente tem.</h1>
          <p className="portfolio-intro">
            A Raed é uma boutique de desenvolvimento de software e IA. Transformamos operações complexas em
            sistemas reais, validados e em produção. Não entregamos protótipo. Entregamos produto operando no
            mercado.
          </p>
        </section>

        <section className="portfolio-about container">
          <div className="portfolio-about-grid">
            <div className="portfolio-about-block">
              <h3>Para quem é</h3>
              <p>
                Atendemos empresas B2B de qualquer porte com um processo para automatizar ou uma necessidade
                que o mercado ainda não resolveu com solução pronta. Se sua operação depende de planilhas,
                retrabalho manual ou sistemas engessados, o problema é nosso escopo.
              </p>
            </div>
            <div className="portfolio-about-block">
              <h3>Soluções</h3>
              <p>
                Atuamos em automação de processos, desenvolvimento SaaS, software sob medida, agentes de IA e
                chatbots, apps mobile e consultoria técnica. Quando a necessidade foge do padrão, construímos a
                solução do zero. Personalização não é exceção na Raed. É o método.
              </p>
            </div>
          </div>

          <div className="portfolio-differentiators">
            <div className="portfolio-diff-item">
              <i className="ph ph-target"></i>
              <p>Foco absoluto em performance. Cada decisão técnica é avaliada pelo impacto real no negócio.</p>
            </div>
            <div className="portfolio-diff-item">
              <i className="ph ph-rocket-launch"></i>
              <p>Da ideia ao produto em produção. Medimos sucesso por sistema rodando, não por protótipo bonito.</p>
            </div>
            <div className="portfolio-diff-item">
              <i className="ph ph-users-three"></i>
              <p>
                Time 100% Raed, sem terceirização. Especialistas em IA e engenharia que dominam algoritmos,
                LLMs e sistemas cognitivos na prática.
              </p>
            </div>
          </div>
        </section>

        <section className="portfolio-process container">
          <span className="mono-tag">Como fazemos</span>
          <h2>Nosso processo</h2>

          <div className="portfolio-process-grid">
            {PROCESS_STEPS.map((step, i) => (
              <div className="portfolio-process-item" key={step}>
                <div className="portfolio-process-number">{i + 1}</div>
                <span className="portfolio-process-label">{step}</span>
              </div>
            ))}
          </div>

          <p className="portfolio-process-note">
            O ponto de partida depende da reunião inicial: às vezes o cliente já sabe o que quer construir, às
            vezes cabe a nós diagnosticar o processo antes de propor a solução certa. Nos dois casos, o caminho
            é o mesmo: entender o problema a fundo antes de escrever a primeira linha de código.
          </p>
        </section>

        <section className="portfolio-cases-header container">
          <span className="mono-tag">Cases</span>
          <h2>Projetos que já colocamos no ar.</h2>
        </section>

        {projects.length === 0 ? (
          <div className="container portfolio-empty">Em breve, novos projetos por aqui.</div>
        ) : (
          <div className="portfolio-list">
            {projects.map((project, index) => (
              <PortfolioCase key={project.id} project={project} reversed={index % 2 === 1} />
            ))}
          </div>
        )}

        <section className="portfolio-cta container">
          <h2>Quer ser o próximo case?</h2>
          <a
            href="https://wa.me/5511952424741?text=Desejo%20falar%20com%20um%20Especialista"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hitech"
          >
            Falar com Especialista
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
