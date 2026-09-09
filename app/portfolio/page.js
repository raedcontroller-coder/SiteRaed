import { db } from '@/lib/db';
import { portfolioProjects } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Portfólio | Raed',
  description: 'Produtos de software e IA construídos pela Raed, do problema de negócio ao sistema em produção.',
};

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
          <h1>Produtos que já colocamos no ar.</h1>
          <p className="portfolio-intro">
            Cada projeto abaixo nasceu de um problema de negócio real — não é vitrine, é sistema em produção.
          </p>
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
