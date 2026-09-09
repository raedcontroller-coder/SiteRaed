import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { portfolioProjects } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';

export default async function PortfolioPage() {
  const session = await getSession();
  if (!session?.userId) return null;

  const allProjects = await db.select().from(portfolioProjects).orderBy(desc(portfolioProjects.createdAt));

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Portfólio</h1>
          <p className="admin-page-subtitle">Projetos e cases entregues pela Raed.</p>
        </div>
        <Link href="/admin/portfolio/novo" className="btn-admin-primary">
          + Novo Projeto
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>
            <i className="ph ph-briefcase" style={{ color: 'var(--accent)', fontSize: '1.1rem' }}></i>
            Todos os Projetos
          </h2>
          <span className="badge">{allProjects.length}</span>
        </div>

        {allProjects.length === 0 ? (
          <div className="admin-card-empty">
            Nenhum projeto cadastrado ainda. Clique em &quot;+ Novo Projeto&quot; para começar.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Projeto</th>
                  <th>Cliente</th>
                  <th>Tags</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {allProjects.map((project) => (
                  <tr key={project.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="td-name">{project.title}</td>
                    <td className="td-accent">{project.clientName || '—'}</td>
                    <td>
                      {Array.isArray(project.tags) && project.tags.length > 0
                        ? project.tags.join(', ')
                        : <span style={{ color: 'var(--text-secondary)' }}>—</span>}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link href={`/admin/portfolio/editar/${project.id}`} className="btn-admin-secondary">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
