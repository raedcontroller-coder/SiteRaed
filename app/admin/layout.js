import './admin.css';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { logoutAction } from '@/app/actions/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  const session = await getSession();
  if (!session?.userId) {
    redirect('/login');
  }

  const result = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  const user = result[0];

  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  const rawName = user.email.split('@')[0];
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <Link href="/">
            <img src="/assets/img/Logo.svg" alt="Raed" />
          </Link>
        </div>

        <div className="sidebar-user">
          <span className="label">Bem vindo, </span>
          <span className="name">
            {displayName} <span className="user-level">Lvl {user.level || 1}</span>
          </span>
        </div>

        <nav className="sidebar-nav">
          <Link href="/admin">
            <i className="ph ph-chart-bar" style={{ fontSize: '1.15rem' }}></i>
            Dashboard
          </Link>
          <Link href="/admin/propostas">
            <i className="ph ph-file-text" style={{ fontSize: '1.15rem' }}></i>
            Propostas Comerciais
          </Link>
          <Link href="/admin/sobre">
            <i className="ph ph-buildings" style={{ fontSize: '1.15rem' }}></i>
            Sobre a Raed
          </Link>
        </nav>

        <div className="sidebar-footer">
          <form action={logoutAction}>
            <button type="submit" className="btn-logout">
              <i className="ph ph-sign-out" style={{ fontSize: '1rem' }}></i>
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
