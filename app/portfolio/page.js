import { db } from '@/lib/db';
import { portfolioProjects } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Cases & Portfólio de Software e Inteligência Artificial',
  description: 'Conheça os produtos de software, SaaS, Voice AI e sistemas de inteligência artificial desenvolvidos sob medida pela Raed para empresas de alto impacto.',
  alternates: {
    canonical: 'https://raed.world/portfolio',
  },
  openGraph: {
    title: 'Cases & Portfólio de Software e IA | Raed',
    description: 'Produtos de software e IA construídos pela Raed, do problema de negócio ao sistema em produção.',
    url: 'https://raed.world/portfolio',
    type: 'website',
  },
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

const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: 'Profacher',
    clientName: null,
    description:
      'Profacher 2.0 é o ecossistema definitivo para avaliação de alta performance e integridade acadêmica. A plataforma elimina o trabalho exaustivo de correção ao aplicar Inteligência Artificial avançada capaz de avaliar desde respostas dissertativas complexas até cálculos matemáticos com desenvolvimento manuscrito, devolvendo horas valiosas aos professores.\n\nCom infraestrutura multi-tenant nativa, o Profacher permite que redes de ensino gerenciem múltiplas unidades e coordenem seu corpo docente em um ambiente centralizado e seguro. O monitoramento ao vivo dá controle total da sala de aula — sinalizando quedas de foco em tempo real — enquanto os alunos têm uma experiência de prova fluida e protegida contra quedas de energia ou conexão.',
    imageUrl: '/assets/portfolio/profacher-mockup.png',
    logoUrl: '/assets/portfolio/profacher-logo.svg',
    projectUrl: 'https://profacher.raed.world',
    tags: ['EdTech', 'Inteligência Artificial', 'Multi-Tenant'],
  },
  {
    id: 2,
    title: 'VoraSyncro',
    clientName: null,
    description:
      'O VoraSyncro é uma plataforma de Voice AI projetada para transformar operações comerciais e de atendimento com agentes de voz inteligentes e persuasivos. O sistema atua em ligações ativas e receptivas, qualificando leads, contornando objeções em tempo real e executando fluxos de fechamento com latência imperceptível.\n\nEquipada com motor de simulação via WebSocket, a solução centraliza a gestão de intenções cognitivas, catálogo de serviços e auditoria automatizada de chamadas. Toda a infraestrutura opera com arquitetura multi-tenant, permitindo às equipes de vendas treinar modelos sob medida e monitorar a conversão de ponta a ponta.',
    imageUrl: '/assets/portfolio/vorasyncro-mockup.png',
    logoUrl: null,
    projectUrl: 'https://vora.raed.world',
    tags: ['Voice AI', 'Vendas B2B', 'Agentes Autônomos'],
  },
  {
    id: 3,
    title: 'TimeToMe',
    clientName: null,
    description:
      'O TimeToMe é uma plataforma de agendamento para salões de beleza que conecta a gestão da agenda do estabelecimento diretamente aos seus clientes, criando uma experiência digital simples, centralizada e acessível.\n\nA solução foi desenvolvida para facilitar a rotina dos proprietários e profissionais de salões, permitindo que gerenciem seus próprios horários e compartilhem sua agenda com clientes, tornando o processo de agendamento mais eficiente, organizado e conveniente para ambas as partes.',
    imageUrl: '/assets/portfolio/timetome-mockup.png',
    logoUrl: '/assets/portfolio/timetome-logo.png',
    projectUrl: 'https://timetome.com.br/',
    tags: ['Agendamento', 'Marketplace', 'SaaS'],
  },
  {
    id: 4,
    title: 'VivaTerra',
    clientName: 'ONG VivaTerra',
    description:
      'VivaTerra é uma plataforma para a ONG VivaTerra que oferece uma solução prática e sustentável para o descarte do óleo de cozinha usado. A plataforma conecta consumidores a um sistema organizado de coleta, recompensas e acompanhamento do impacto ambiental gerado.\n\nA solução transforma o descarte de óleo em uma experiência simples e incentivada, permitindo solicitar coletas, acompanhar o processo e receber recompensas por sua contribuição. Ao mesmo tempo, promove a sustentabilidade por meio da gamificação, geração de benefícios aos usuários e monitoramento de indicadores como litros de água preservada e carbono compensado.',
    imageUrl: '/assets/portfolio/vivaterra-mockup.png',
    logoUrl: '/assets/portfolio/vivaterra-logo.png',
    projectUrl: null,
    tags: ['Sustentabilidade', 'Impacto Social', 'ONG'],
  },
];

export default async function PortfolioPage() {
  let projects = [];
  try {
    projects = await db.select().from(portfolioProjects).orderBy(desc(portfolioProjects.createdAt));
  } catch (error) {
    projects = [];
  }

  const listToRender = projects.length > 0 ? projects : DEFAULT_PROJECTS;

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

        {listToRender.length === 0 ? (
          <div className="container portfolio-empty">Em breve, novos projetos por aqui.</div>
        ) : (
          <div className="portfolio-list">
            {listToRender.map((project, index) => (
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
