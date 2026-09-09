import 'dotenv/config';
import { db } from '../lib/db/index.js';
import { portfolioProjects } from '../lib/db/schema.js';
import { eq } from 'drizzle-orm';

const projects = [
  {
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
    title: 'TimeToMe',
    clientName: null,
    description:
      'O TimeToMe é uma plataforma de agendamento para salões de beleza que conecta a gestão da agenda do estabelecimento diretamente aos seus clientes, criando uma experiência digital simples, centralizada e acessível.\n\nA solução foi desenvolvida para facilitar a rotina dos proprietários e profissionais de salões, permitindo que gerenciem seus próprios horários e compartilhem sua agenda com clientes, tornando o processo de agendamento mais eficiente, organizado e conveniente para ambas as partes.',
    imageUrl: '/assets/portfolio/timetome-mockup.png',
    logoUrl: '/assets/portfolio/timetome-logo.png',
    projectUrl: null,
    tags: ['Agendamento', 'Marketplace', 'SaaS'],
  },
  {
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

async function seedPortfolio() {
  console.log('Seeding portfolio projects...');

  for (const project of projects) {
    await db.delete(portfolioProjects).where(eq(portfolioProjects.title, project.title));
    await db.insert(portfolioProjects).values(project);
    console.log(`Portfolio project seeded: ${project.title}`);
  }

  process.exit(0);
}

seedPortfolio();
