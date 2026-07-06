"use client";

import { useState } from 'react';
import { saveProposal } from '@/app/actions/proposals';
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

export default function AstraAgentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [briefing, setBriefing] = useState('');
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [sections, setSections] = useState({
    sumario: '', diagnostico: '', estrategia: '', metodologia: '', solucao: '', cronograma: '', investimento: ''
  });

  const [refiningKey, setRefiningKey] = useState(null);
  const [refineInstruction, setRefineInstruction] = useState('');

  const handleGenerateDraft = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/propostas/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefing })
      });
      if (res.ok) {
        const data = await res.json();
        setSections({
          sumario: data.sumario || '',
          diagnostico: data.diagnostico || '',
          estrategia: data.estrategia || '',
          metodologia: data.metodologia || '',
          solucao: data.solucao || '',
          cronograma: data.cronograma || '',
          investimento: data.investimento || ''
        });
        setStep(1);
      } else {
        alert("Erro ao gerar rascunho. Verifique a API Key.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
      const result = await saveProposal(title, clientName, sections);
      if (result.success) {
        alert("Proposta salva com sucesso!");
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
      {/* STEP 0: Briefing */}
      {step === 0 && (
        <>
          <div className="astra-header">
            <img src="/assets/img/Logo.svg" alt="RAED" />
            <h1 className="astra-title">
              <span>Astra</span> Agent
            </h1>
            <p className="astra-subtitle">
              Escreva o que você tem em mente de forma livre. A IA estruturará a proposta inteira e você poderá revisar bloco a bloco.
            </p>
          </div>

          <div className="astra-card" style={{ maxWidth: '720px', margin: '0 auto' }}>
            <form onSubmit={handleGenerateDraft} className="astra-form">
              <textarea
                required
                value={briefing}
                onChange={(e) => setBriefing(e.target.value)}
                rows={7}
                placeholder="Ex: Vou fazer uma convenção para a TIM com 130 pessoas em agosto. O desafio principal é baixo engajamento. A solução que pensei foi usar um App de gamificação com caça ao tesouro usando IA..."
              />
              <button
                disabled={loading || briefing.length < 10}
                type="submit"
                className="btn-generate"
              >
                {loading ? (
                  <><i className="ph ph-circle-notch spin" style={{ fontSize: '1.1rem' }}></i> Criando Estrutura...</>
                ) : (
                  <><i className="ph ph-sparkle" style={{ fontSize: '1.1rem' }}></i> Gerar Rascunho</>
                )}
              </button>
            </form>
          </div>
        </>
      )}

      {/* STEP 1: Review */}
      {step === 1 && (
        <>
          <div className="astra-header" style={{ marginBottom: '1.5rem' }}>
            <h1 className="astra-title" style={{ fontSize: '1.5rem' }}>
              <span>Astra</span> Agent — Nova Proposta
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
              placeholder="Título Interno (Ex: Proposta Gamificação 2026)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="admin-input"
            />
          </div>

          <div className="astra-sticky-bar">
            <h2>Revisão Final</h2>
            <div className="actions">
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
        </>
      )}
    </div>
  );
}
