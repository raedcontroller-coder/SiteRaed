"use client";
import React, { useState } from 'react';

export default function ContactModal({ isOpen, onClose }) {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.target);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus('idle');
        }, 4000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className={`modal-overlay active`} onClick={(e) => { if (e.target.classList.contains('modal-overlay')) onClose(); }}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-header">
          <h2>Iniciar Projeto</h2>
          <p style={{ color: status === 'success' ? '#4CAF50' : 'var(--text-secondary)' }}>
            {status === 'success' 
              ? 'Recebemos sua mensagem! Nossa equipe entrará em contato em até 24 horas.' 
              : 'Conte-nos sobre sua ideia. Retornaremos em breve.'}
          </p>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input type="hidden" name="access_key" value="d28a3e9f-d987-4772-ae58-b1e88269a881" />
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input type="text" id="name" name="name" placeholder="Seu nome" required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefone</label>
            <input type="tel" id="phone" name="phone" placeholder="(11) 99999-9999" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" placeholder="seu@email.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="idea">Sobre o Projeto</label>
            <textarea id="idea" name="idea" rows="4" placeholder="Descreva brevemente sua ideia ou necessidade..." required></textarea>
          </div>
          <button 
            type="submit" 
            className="btn-hitech" 
            style={{ 
              width: '100%', 
              justifyContent: 'center',
              backgroundColor: status === 'success' ? '#4CAF50' : status === 'error' ? '#ff4444' : undefined,
              boxShadow: status === 'success' ? '0 0 20px rgba(76, 175, 80, 0.4)' : undefined,
            }}
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? 'Enviando...' 
              : status === 'success' ? 'Sucesso! Respondemos em 24h' 
              : status === 'error' ? 'Erro ao enviar!' 
              : 'Enviar Solicitação'}
          </button>
        </form>
      </div>
    </div>
  );
}
