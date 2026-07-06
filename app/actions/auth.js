"use server";

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createSession, destroySession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export async function loginAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: 'E-mail e senha são obrigatórios.' };
  }

  try {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = result[0];

    if (!user) {
      return { error: 'Credenciais inválidas.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return { error: 'Credenciais inválidas.' };
    }

    await createSession(user.id);
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Ocorreu um erro ao tentar fazer login.' };
  }
  
  // Executado fora do try-catch pois o redirect lança um erro interno no Next.js
  redirect('/admin');
}

export async function logoutAction() {
  await destroySession();
  redirect('/login');
}
