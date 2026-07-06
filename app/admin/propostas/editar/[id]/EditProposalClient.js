"use client";

import { useState } from 'react';
import { updateProposal, deleteProposal } from '@/app/actions/proposals';
import { useRouter } from 'next/navigation';

const SECTION_TITLES = {
  sumario: '1. Sumário Executivo',
  diagnostico: '2. Diagnóstico: O Desafio',
  estrategia: '3. Visão Estratégica e Pilares de Valor',
  metodologia: '4. Metodologia e Storytelling',
  solucao: '5. A Solução Proposta',
  cronograma: '6. Cronograma e Roadmap',
  investimento: '7. Investimento e Condições Gerais',
};

export default function EditProposalClient({ proposal }) {
  const router = useRouter();
  const [title, setTitle] = useState(proposal.title);
  const [clientName, setClientName] = useState(proposal.clientName);
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [sections, setSections] = useState(proposal.content || {
    sumario: '', diagnostico: '', estrategia: '', metodologia: '', solucao: '', cronograma: '', investimento: ''
  });

  const [refiningKey, setRefiningKey] = useState(null);
  const [refineInstruction, setRefineInstruction] = useState('');

  const handleRefine = async (key) => {
    if (!refineInstruction.trim()) {
      alert("Digite o que a IA deve alterar.");
      return;
    }
    setRefiningKey(key);
    try {
      const res = await fetch('/api/propostas/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentText: sections[key], instruction: refineInstruction })
      });
      if (res.ok) {
        const data = await res.json();
        setSections(prev => ({ ...prev, [key]: data.refinedText }));
        setRefineInstruction('');
      } else {
        alert("Erro ao refinar");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefiningKey(null);
    }
  };

  const handleSave = async () => {
    if (!title || !clientName) {
      alert("Preencha Título e Cliente para salvar.");
      return;
    }
    setSaving(true);
    try {
      const result = await updateProposal(proposal.id, title, clientName, sections);
      if (result.success) {
        alert("Proposta atualizada com sucesso!");
        router.push('/admin/propostas');
      } else {
        alert(result.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja deletar esta proposta?")) return;
    setDeleting(true);
    try {
      const result = await deleteProposal(proposal.id);
      if (result.success) {
        router.push('/admin/propostas');
      } else {
        alert(result.error);
        setDeleting(false);
      }
    } catch (e) {
      console.error(e);
      setDeleting(false);
    }
  };

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      let finalMarkdown = '# Proposta Comercial\n\n';
      Object.keys(SECTION_TITLES).forEach(key => {
        finalMarkdown += `## ${SECTION_TITLES[key]}\n\n${sections[key]}\n\n`;
      });
      const res = await fetch('/api/propostas/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: finalMarkdown })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'Proposta'}_RAED.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Erro ao exportar PDF");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="astra-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="astra-title" style={{ fontSize: '1.5rem' }}>
          <span>Astra</span> Agent — Editar Proposta
        </h1>
      </div>

      <div className="astra-meta">
        <input
          type="text"
          placeholder="Nome do Cliente"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="admin-input"
        />
        <input
          type="text"
          placeholder="Título Interno"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="admin-input"
        />
      </div>

      <div className="astra-sticky-bar">
        <h2>Revisão e Edição</h2>
        <div className="actions">
          <button onClick={handleDelete} disabled={deleting} className="btn-admin-danger">
            <i className="ph ph-trash" style={{ fontSize: '1rem' }}></i>
            {deleting ? 'Deletando...' : 'Deletar'}
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-admin-save">
            {saving ? (
              <><i className="ph ph-circle-notch spin" style={{ fontSize: '1rem' }}></i> Salvando...</>
            ) : (
              <><i className="ph ph-floppy-disk" style={{ fontSize: '1rem' }}></i> Salvar</>
            )}
          </button>
          <button onClick={handleExportPdf} disabled={exporting} className="btn-admin-export">
            {exporting ? (
              <><i className="ph ph-circle-notch spin" style={{ fontSize: '1rem' }}></i> Exportando...</>
            ) : (
              <><i className="ph ph-file-pdf" style={{ fontSize: '1rem' }}></i> Exportar PDF</>
            )}
          </button>
        </div>
      </div>

      {Object.keys(SECTION_TITLES).map((key) => (
        <div key={key} className="astra-section-block">
          <div className="astra-section-header">
            <h3>{SECTION_TITLES[key]}</h3>
          </div>
          <div className="astra-section-body">
            <textarea
              value={sections[key]}
              onChange={(e) => setSections(prev => ({ ...prev, [key]: e.target.value }))}
              rows={8}
              className="admin-textarea"
            />
            <div className="astra-refine-row">
              <input
                type="text"
                placeholder="Instrução para a IA (ex: Deixe mais formal, resuma...)"
                value={refiningKey === key ? refineInstruction : ''}
                onChange={(e) => {
                  if (refiningKey !== key) setRefineInstruction('');
                  setRefineInstruction(e.target.value);
                }}
                onFocus={() => { if (refiningKey !== key) setRefineInstruction(''); }}
                className="admin-refine-input"
              />
              <button
                onClick={() => handleRefine(key)}
                disabled={refiningKey === key}
                className="btn-admin-refine"
              >
                {refiningKey === key ? (
                  <><i className="ph ph-circle-notch spin" style={{ fontSize: '0.9rem' }}></i> Reescrevendo...</>
                ) : (
                  <><i className="ph ph-magic-wand" style={{ fontSize: '0.9rem' }}></i> Reescrever Bloco</>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
