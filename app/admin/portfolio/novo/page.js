"use client";

import { useActionState } from 'react';
import { createPortfolioProject } from '@/app/actions/portfolio';
import Link from 'next/link';

export default function NovoPortfolioPage() {
  const [state, formAction, isPending] = useActionState(createPortfolioProject, { error: null });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Projeto</h1>
          <p className="admin-page-subtitle">Adicione um case ao portfólio da Raed.</p>
        </div>
        <Link href="/admin/portfolio" className="btn-admin-secondary">
          Voltar
        </Link>
      </div>

      <form action={formAction} className="admin-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {state?.error && (
          <div style={{ color: '#ff4444', fontSize: '0.85rem' }}>{state.error}</div>
        )}
        <input type="text" name="title" placeholder="Título do Projeto" className="admin-input" required />
        <input type="text" name="clientName" placeholder="Cliente (opcional)" className="admin-input" />
        <textarea name="description" placeholder="Descrição do projeto" rows={6} className="admin-textarea" required />
        <input type="text" name="imageUrl" placeholder="URL da imagem de capa (opcional)" className="admin-input" />
        <input type="text" name="logoUrl" placeholder="URL do logo (opcional)" className="admin-input" />
        <input type="text" name="projectUrl" placeholder="Link do projeto (opcional)" className="admin-input" />
        <input type="text" name="tags" placeholder="Tags separadas por vírgula (ex: SaaS, IA, Mobile)" className="admin-input" />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={isPending} className="btn-admin-save">
            {isPending ? (
              <><i className="ph ph-circle-notch spin" style={{ fontSize: '1rem' }}></i> Salvando...</>
            ) : (
              <><i className="ph ph-floppy-disk" style={{ fontSize: '1rem' }}></i> Salvar Projeto</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
