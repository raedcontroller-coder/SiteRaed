import { db } from '@/lib/db';
import { proposals } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import EditProposalClient from './EditProposalClient';
import { getSession } from '@/lib/auth/session';

export default async function EditProposalPage({ params }) {
  const session = await getSession();
  if (!session?.userId) return null;

  const id = parseInt(params.id);
  if (isNaN(id)) return notFound();

  const result = await db.select().from(proposals).where(eq(proposals.id, id)).limit(1);
  const proposal = result[0];

  if (!proposal) return notFound();

  return <EditProposalClient proposal={proposal} />;
}
