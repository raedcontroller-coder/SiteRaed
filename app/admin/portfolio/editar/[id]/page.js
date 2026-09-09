import { db } from '@/lib/db';
import { portfolioProjects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import EditPortfolioClient from './EditPortfolioClient';
import { getSession } from '@/lib/auth/session';

export default async function EditPortfolioPage({ params }) {
  const session = await getSession();
  if (!session?.userId) return null;

  const { id: idParam } = await params;
  const id = parseInt(idParam, 10);
  if (isNaN(id)) return notFound();

  const result = await db.select().from(portfolioProjects).where(eq(portfolioProjects.id, id)).limit(1);
  const project = result[0];

  if (!project) return notFound();

  return <EditPortfolioClient project={project} />;
}
