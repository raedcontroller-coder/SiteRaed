"use server";

import { db } from '@/lib/db';
import { proposals } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

export async function saveProposal(title, clientName, content) {
  const session = await getSession();
  if (!session?.userId) throw new Error('Não autorizado');

  try {
    const result = await db.insert(proposals).values({
      userId: session.userId,
      title,
      clientName,
      content
    }).returning({ id: proposals.id });
    
    revalidatePath('/admin/propostas');
    return { success: true, id: result[0].id };
  } catch (error) {
    console.error('Save proposal error:', error);
    return { error: 'Erro ao salvar a proposta.' };
  }
}

export async function updateProposal(id, title, clientName, content) {
  const session = await getSession();
  if (!session?.userId) throw new Error('Não autorizado');

  try {
    await db.update(proposals)
      .set({ title, clientName, content, updatedAt: new Date() })
      .where(eq(proposals.id, id));
    
    revalidatePath('/admin/propostas');
    return { success: true };
  } catch (error) {
    console.error('Update proposal error:', error);
    return { error: 'Erro ao atualizar a proposta.' };
  }
}

export async function deleteProposal(id) {
  const session = await getSession();
  if (!session?.userId) throw new Error('Não autorizado');

  try {
    await db.delete(proposals).where(eq(proposals.id, id));
    revalidatePath('/admin/propostas');
    return { success: true };
  } catch (error) {
    console.error('Delete proposal error:', error);
    return { error: 'Erro ao deletar a proposta.' };
  }
}
