import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { proposals } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';

export default async function PropostasPage() {
  const session = await getSession();
  if (!session?.userId) return null;

  const allProposals = await db.select().from(proposals).orderBy(desc(proposals.createdAt));

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Propostas Comerciais</h1>
          <p className="admin-page-subtitle">Gerencie suas propostas criadas com o Astra Agent.</p>
        </div>
        <Link href="/admin/propostas/nova" className="btn-admin-primary">
          + Nova Proposta
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>
            <i className="ph ph-file-text" style={{ color: 'var(--accent)', fontSize: '1.1rem' }}></i>
            Todas as Propostas
          </h2>
          <span className="badge">{allProposals.length}</span>
        </div>

        {allProposals.length === 0 ? (
          <div className="admin-card-empty">
            Nenhuma proposta comercial criada ainda. Clique em &quot;+ Nova Proposta&quot; para começar.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Título</th>
                  <th>Cliente</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {allProposals.map((prop) => (
                  <tr key={prop.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(prop.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="td-name">{prop.title}</td>
                    <td className="td-accent">{prop.clientName}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link href={`/admin/propostas/editar/${prop.id}`} className="btn-admin-secondary">
                        Editar / PDF
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
