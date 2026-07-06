import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { projectQuotes } from '@/lib/db/schema';
import { desc, sql } from 'drizzle-orm';
import QuoteTable from './QuoteTable';
import Pagination from '@/app/components/Pagination';

const ITEMS_PER_PAGE = 10;

export default async function AdminDashboardPage({ searchParams }) {
  const session = await getSession();
  if (!session?.userId) return null;

  // Next.js 15 requires searchParams to be awaited if accessed dynamically, but in Page props it's fine for now, or just destructure safely.
  const pageParam = (await searchParams)?.page || '1';
  const currentPage = parseInt(pageParam, 10);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const countResult = await db.select({ count: sql`count(*)` }).from(projectQuotes);
  const totalQuotes = Number(countResult[0].count);
  const totalPages = Math.ceil(totalQuotes / ITEMS_PER_PAGE);

  const quotes = await db
    .select()
    .from(projectQuotes)
    .orderBy(desc(projectQuotes.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset(offset);

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-subtitle">Visão geral dos orçamentos recebidos pela calculadora de projetos.</p>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>
            <i className="ph ph-receipt" style={{ color: 'var(--accent)', fontSize: '1.1rem' }}></i>
            Orçamentos Recebidos
          </h2>
          <span className="badge">{totalQuotes}</span>
        </div>

        {totalQuotes === 0 ? (
          <div className="admin-card-empty">
            Nenhum orçamento recebido ainda.
          </div>
        ) : (
          <>
            <QuoteTable quotes={quotes} />
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </>
        )}
      </div>
    </div>
  );
}
