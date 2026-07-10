"use client";

import { useState } from 'react';
import Modal from '@/app/components/Modal';
import { deleteQuote } from '@/app/actions/quotes';
import { useRouter } from 'next/navigation';

export default function QuoteTable({ quotes }) {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja deletar este orçamento?")) {
      setIsDeleting(true);
      await deleteQuote(id);
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Cliente</th>
            <th>Contato</th>
            <th>Faixa de Investimento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr key={quote.id}>
              <td style={{ whiteSpace: 'nowrap' }}>
                {new Date(quote.createdAt).toLocaleDateString('pt-BR')}
              </td>
              <td>
                <div className="td-name">{quote.name}</div>
                <div className="td-sub">{quote.email}</div>
              </td>
              <td className="td-accent">{quote.whatsapp}</td>
              <td>
                {quote.selections && quote.selections["Faixa de Investimento"] 
                  ? <span style={{ background: 'rgba(255, 161, 3, 0.1)', color: 'var(--accent)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                      {quote.selections["Faixa de Investimento"]}
                    </span> 
                  : <span style={{ color: 'var(--text-secondary)' }}>N/A</span>}
              </td>
              <td style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  onClick={() => setSelectedQuote(quote)}
                  className="btn-hitech"
                  style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                  Detalhes
                </button>
                <button 
                  onClick={() => handleDelete(quote.id)}
                  disabled={isDeleting}
                  style={{ 
                    padding: '6px 12px', 
                    fontSize: '0.85rem', 
                    background: 'transparent',
                    border: '1px solid #ff4444',
                    color: '#ff4444',
                    borderRadius: '8px',
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                    opacity: isDeleting ? 0.5 : 1
                  }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Detalhes */}
      <Modal 
        isOpen={!!selectedQuote} 
        onClose={() => setSelectedQuote(null)}
        title={`Detalhes do Orçamento - ${selectedQuote?.name}`}
      >
        {selectedQuote && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem', fontSize: '1rem' }}>Informações de Contato</h4>
              <p><strong>Nome:</strong> {selectedQuote.name}</p>
              <p><strong>E-mail:</strong> {selectedQuote.email}</p>
              <p><strong>WhatsApp:</strong> {selectedQuote.whatsapp}</p>
              {selectedQuote.instagram && <p><strong>Instagram:</strong> {selectedQuote.instagram}</p>}
              {selectedQuote.linkedin && <p><strong>LinkedIn:</strong> {selectedQuote.linkedin}</p>}
              <p><strong>Data:</strong> {new Date(selectedQuote.createdAt).toLocaleString('pt-BR')}</p>
              <p><strong>Estimativa:</strong> R$ {selectedQuote.totalEstimated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem', fontSize: '1rem' }}>Respostas do Formulário</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {Object.entries(selectedQuote.selections).map(([questionId, selectedOpts]) => (
                  <li key={questionId} style={{ borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem' }}>
                    <div style={{ fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px', fontSize: '0.9rem' }}>
                      {questionId.replace(/-/g, ' ')}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                      {Array.isArray(selectedOpts) ? selectedOpts.join(', ') : selectedOpts}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
