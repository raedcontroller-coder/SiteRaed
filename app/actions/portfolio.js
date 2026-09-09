"use server";

import { db } from '@/lib/db';
import { portfolioProjects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function parseTags(raw) {
  return (raw || '').split(',').map((t) => t.trim()).filter(Boolean);
}

export async function createPortfolioProject(prevState, formData) {
  const session = await getSession();
  if (!session?.userId) throw new Error('Não autorizado');

  const title = formData.get('title');
  const clientName = formData.get('clientName');
  const description = formData.get('description');
  const imageUrl = formData.get('imageUrl');
  const logoUrl = formData.get('logoUrl');
  const projectUrl = formData.get('projectUrl');
  const tags = parseTags(formData.get('tags'));

  if (!title || !description) {
    return { error: 'Preencha título e descrição.' };
  }

  try {
    await db.insert(portfolioProjects).values({
      title,
      clientName: clientName || null,
      description,
      imageUrl: imageUrl || null,
      logoUrl: logoUrl || null,
      projectUrl: projectUrl || null,
      tags,
    });
  } catch (error) {
    console.error('Create portfolio project error:', error);
    return { error: 'Erro ao salvar o projeto.' };
  }

  revalidatePath('/admin/portfolio');
  redirect('/admin/portfolio');
}

export async function updatePortfolioProject(id, prevState, formData) {
  const session = await getSession();
  if (!session?.userId) throw new Error('Não autorizado');

  const title = formData.get('title');
  const clientName = formData.get('clientName');
  const description = formData.get('description');
  const imageUrl = formData.get('imageUrl');
  const logoUrl = formData.get('logoUrl');
  const projectUrl = formData.get('projectUrl');
  const tags = parseTags(formData.get('tags'));

  if (!title || !description) {
    return { error: 'Preencha título e descrição.' };
  }

  try {
    await db.update(portfolioProjects)
      .set({
        title,
        clientName: clientName || null,
        description,
        imageUrl: imageUrl || null,
        logoUrl: logoUrl || null,
        projectUrl: projectUrl || null,
        tags,
        updatedAt: new Date(),
      })
      .where(eq(portfolioProjects.id, id));
  } catch (error) {
    console.error('Update portfolio project error:', error);
    return { error: 'Erro ao atualizar o projeto.' };
  }

  revalidatePath('/admin/portfolio');
  redirect('/admin/portfolio');
}

export async function deletePortfolioProject(id) {
  const session = await getSession();
  if (!session?.userId) throw new Error('Não autorizado');

  try {
    await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
  } catch (error) {
    console.error('Delete portfolio project error:', error);
    return { error: 'Erro ao deletar o projeto.' };
  }

  revalidatePath('/admin/portfolio');
  redirect('/admin/portfolio');
}
