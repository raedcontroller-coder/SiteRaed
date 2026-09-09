"use client";

import { useActionState } from 'react';
import { updatePortfolioProject, deletePortfolioProject } from '@/app/actions/portfolio';
import Link from 'next/link';

export default function EditPortfolioClient({ project }) {
  const [state, formAction, isPending] = useActionState(
    updatePortfolioProject.bind(null, project.id),
    { error: null }
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deletePortfolioProject.bind(null, project.id),
    { error: null }
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Editar Projeto</h1>
          <p className="admin-page-subtitle">{project.title}</p>
        </div>
        <Link href="/admin/portfolio" className="btn-admin-secondary">
          Voltar
        </Link>
      </div>

      <div className="admin-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {(state?.error || deleteState?.error) && (
          <div style={{ color: '#ff4444', fontSize: '0.85rem' }}>{state?.error || deleteState?.error}</div>
        )}

        <form id="edit-portfolio-form" action={formAction} style={{ display: 'contents' }}>
          <input type="text" name="title" placeholder="Título do Projeto" defaultValue={project.title} className="admin-input" required />
          <input type="text" name="clientName" placeholder="Cliente (opcional)" defaultValue={project.clientName || ''} className="admin-input" />
          <textarea name="description" placeholder="Descrição do projeto" defaultValue={project.description} rows={6} className="admin-textarea" required />
          <input type="text" name="imageUrl" placeholder="URL da imagem de capa (opcional)" defaultValue={project.imageUrl || ''} className="admin-input" />
          <input type="text" name="logoUrl" placeholder="URL do logo (opcional)" defaultValue={project.logoUrl || ''} className="admin-input" />
          <input type="text" name="projectUrl" placeholder="Link do projeto (opcional)" defaultValue={project.projectUrl || ''} className="admin-input" />
          <input type="text" name="tags" placeholder="Tags separadas por vírgula" defaultValue={(project.tags || []).join(', ')} className="admin-input" />
        </form>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <form
            action={deleteAction}
            onSubmit={(e) => {
              if (!confirm('Tem certeza que deseja deletar este projeto?')) e.preventDefault();
            }}
          >
            <button type="submit" disabled={isDeleting} className="btn-admin-danger">
              <i className="ph ph-trash" style={{ fontSize: '1rem' }}></i>
              {isDeleting ? 'Deletando...' : 'Deletar'}
            </button>
          </form>
          <button type="submit" form="edit-portfolio-form" disabled={isPending} className="btn-admin-save">
            {isPending ? (
              <><i className="ph ph-circle-notch spin" style={{ fontSize: '1rem' }}></i> Salvando...</>
            ) : (
              <><i className="ph ph-floppy-disk" style={{ fontSize: '1rem' }}></i> Salvar Alterações</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
