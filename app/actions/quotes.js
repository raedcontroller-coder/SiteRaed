"use server";

import { db } from '@/lib/db';
import { projectQuotes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth/session';

export async function submitQuote(prevState, formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const whatsapp = formData.get('whatsapp');
  const instagram = formData.get('instagram');
  const linkedin = formData.get('linkedin');
  const totalEstimated = parseInt(formData.get('totalEstimated'), 10);
  const selections = JSON.parse(formData.get('selections'));

  if (!name || !email || !whatsapp) {
    return { error: 'Preencha todos os campos.' };
  }

  try {
    const [inserted] = await db.insert(projectQuotes).values({
      name,
      email,
      whatsapp,
      instagram,
      linkedin,
      totalEstimated,
      selections,
    }).returning({ id: projectQuotes.id });
    
    return { success: true, quoteId: inserted.id };
  } catch (error) {
    console.error('Failed to submit quote:', error);
    return { error: 'Erro ao salvar o orçamento. Tente novamente mais tarde.' };
  }
}

export async function updateQuoteInvestment(quoteId, investmentRange) {
  if (!quoteId || !investmentRange) return { error: 'Dados inválidos.' };
  
  try {
    const [quote] = await db.select().from(projectQuotes).where(eq(projectQuotes.id, quoteId));
    if (!quote) return { error: 'Orçamento não encontrado.' };

    const newSelections = {
      ...quote.selections,
      "Faixa de Investimento": investmentRange
    };

    await db.update(projectQuotes)
      .set({ selections: newSelections })
      .where(eq(projectQuotes.id, quoteId));
      
    return { success: true };
  } catch (error) {
    console.error('Failed to update quote investment:', error);
    return { error: 'Erro ao atualizar o investimento.' };
  }
}

export async function deleteQuote(id) {
  const session = await getSession();
  if (!session?.userId) {
    return { error: 'Não autorizado.' };
  }

  try {
    await db.delete(projectQuotes).where(eq(projectQuotes.id, id));
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete quote:', error);
    return { error: 'Erro ao deletar o orçamento.' };
  }
}
