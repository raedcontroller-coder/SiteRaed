"use client";

import React, { useState, useActionState, useEffect, useRef } from 'react';
import { submitQuote, updateQuoteInvestment } from '@/app/actions/quotes';
import { generatePitch } from '@/app/actions/generatePitch';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const calculatorData = {
  questions: [
    {
      id: 1,
      title: "Em quais plataformas seu aplicativo estará disponível?",
      type: "options",
      is_multiple: false,
      options: [
        { label: "Mobile", value: 1.0, is_multiplier: true, icon: "/assets/img/mobile.svg" },
        { label: "Desktop", value: 1.0, is_multiplier: true, icon: "/assets/img/desktop.svg" },
        { label: "Ambos", value: 1.0, is_multiplier: true, icon: "/assets/img/deskmobile.svg" }
      ]
    },
    {
      id: 7,
      title: "Qual a categoria principal do seu aplicativo?",
      type: "options",
      is_multiple: false,
      options: [
        { label: "Marketplace", value: 5000.0 },
        { label: "Conteúdo e Ensino", value: 4000.0 },
        { label: "Gestão e Processos", value: 3000.0 },
        { label: "Financeiro", value: 4000.0 },
        { label: "Rede Social", value: 3500.0 },
        { label: "Outros", value: 4500.0 }
      ]
    },
    {
      id: 2,
      title: "Seu aplicativo precisa receber pagamentos (cartão, pix, boleto)?",
      type: "options",
      is_multiple: false,
      options: [
        { label: "Sim", value: 2500.0 },
        { label: "Não", value: 0.0 }
      ]
    },
    {
      id: 4,
      title: "Você vai precisar de um painel administrativo para gerenciar usuários e dados?",
      type: "options",
      is_multiple: false,
      options: [
        { label: "Sim", value: 3500.0 },
        { label: "Não", value: 0.0 }
      ]
    },
    {
      id: 3,
      title: "Como o aplicativo vai funcionar em relação à internet?",
      type: "options",
      is_multiple: false,
      options: [
        { label: "Apenas Online", value: 2200.0 },
        { label: "Apenas Offline", value: 2200.0 },
        { label: "Online e Offline (sincronização)", value: 3800.0 }
      ]
    },
    {
      id: 5,
      title: "Necessita integrar com outros sistemas (APIs externas, CRMs, ERPs)?",
      type: "options",
      is_multiple: false,
      options: [
        { label: "Sim", value: 6100.0 },
        { label: "Não", value: 2100.0 }
      ]
    },
    {
      id: 6,
      title: "O aplicativo vai usar algum destes recursos avançados?",
      type: "options",
      is_multiple: true,
      optional: true,
      options: [
        { label: "Chat em tempo real", value: 1300.0 },
        { label: "NFC / Bluetooth", value: 2000.0 },
        { label: "Mapas", value: 1000.0 },
        { label: "Geoprocessamento avançado", value: 1500.0 },
        { label: "Não sei informar", value: 0.0 }
      ]
    },
    {
      id: 100,
      title: "Quase lá!\nQual é o objetivo principal do aplicativo e como ele deve funcionar na prática?",
      type: "text",
      placeholder: "Ex: O aplicativo vai conectar clientes a prestadores de serviço, permitindo agendamentos e pagamentos..."
    },
    {
      id: 101,
      title: "Perfeito! Há alguma funcionalidade específica, referência ou detalhe importante que não foi coberto?",
      type: "textarea",
      placeholder: "Digite detalhes adicionais, links de referência, etc. (Opcional)"
    }
  ]
};

function calculateQuote(selections) {
  let baseValue = 0;
  let multiplierCount = 0;

  calculatorData.questions.forEach(question => {
    if (question.type !== "options") return;
    
    const selectedOptions = selections[question.id] || [];
    
    question.options.forEach(option => {
      if (selectedOptions.includes(option.label)) {
        const optionValue = parseFloat(option.value);
        if (option.is_multiplier) {
          multiplierCount += 1;
        } else {
          baseValue += optionValue;
        }
      }
    });
  });

  const finalMultiplier = Math.max(1, multiplierCount);
  return baseValue * finalMultiplier;
}

export default function CalculatorPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [total, setTotal] = useState(0);
  
  const [aiPitch, setAiPitch] = useState("");
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [investmentRange, setInvestmentRange] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);
  const router = useRouter();
  
  const investmentOptions = [
    { label: "Até R$ 10k", value: "<10k" },
    { label: "R$ 10k a 30k", value: "10k-30k" },
    { label: "R$ 30k a 50k", value: "30k-50k" },
    { label: "R$ 50k a 100k", value: "50k-100k" },
    { label: "R$ 100k a 200k", value: "100k-200k" },
    { label: "Acima de 200k", value: "200k+" }
  ];

  const [state, formAction, isPending] = useActionState(submitQuote, { error: null, success: false });

  const isFinished = currentStep >= calculatorData.questions.length;

  useEffect(() => {
    if (isFinished && !aiPitch && !isGeneratingPitch) {
      setIsGeneratingPitch(true);
      const contextData = calculatorData.questions.map(q => ({
        pergunta: q.title,
        resposta: selections[q.id]
      })).filter(item => item.resposta);
      
      generatePitch(JSON.stringify(contextData)).then((pitch) => {
        setAiPitch(pitch);
        setIsGeneratingPitch(false);
      });
    }
  }, [isFinished]);
  const currentQuestion = calculatorData.questions[currentStep];

  // Efeito de digitação (Typewriter)
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isFinished || !currentQuestion) return;
    
    const fullText = currentQuestion.title || "";
    setDisplayedTitle("");
    setIsTyping(true);
    
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedTitle(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, 15); // Velocidade de digitação (15ms por caractere)
    
    return () => clearInterval(intervalId);
  }, [currentStep, currentQuestion, isFinished]);

  const handleSelect = (question, optionLabel) => {
    setSelections(prev => {
      const currentSelected = prev[question.id] || [];
      
      let newSelected;
      if (question.is_multiple) {
        if (currentSelected.includes(optionLabel)) {
          newSelected = currentSelected.filter(l => l !== optionLabel);
        } else {
          newSelected = [...currentSelected, optionLabel];
        }
      } else {
        newSelected = [optionLabel];
      }
      
      return { ...prev, [question.id]: newSelected };
    });
  };

  const handleTextChange = (question, value) => {
    setSelections(prev => ({ ...prev, [question.id]: value }));
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  const handlePrev = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  useEffect(() => {
    setTotal(calculateQuote(selections));
  }, [selections]);

  const isNextDisabled = () => {
    if (!currentQuestion) return false;
    if (currentQuestion.type === "options") {
      if (currentQuestion.optional) return false;
      return !(selections[currentQuestion.id] && selections[currentQuestion.id].length > 0);
    }
    if (currentQuestion.type === "text") {
      return !(selections[currentQuestion.id] && selections[currentQuestion.id].trim().length > 0);
    }
    // Textarea (última pergunta) é opcional
    if (currentQuestion.type === "textarea") {
      return false; 
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-black" style={{ height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ width: '100%', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Link href="/">
            <img src="/assets/img/Logo.svg" alt="Raed" style={{ height: '32px', margin: '0 auto', filter: 'invert(1)', marginBottom: '1rem' }} />
          </Link>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '700', letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '0', lineHeight: '1.2' }}>
            Tire suas ideias do papel e <span style={{ color: 'var(--accent)' }}>transforme em projetos.</span>
          </h1>
        </div>

        <div className={isFinished && state?.success ? "" : "modal-content"} style={{ margin: '0 auto', maxWidth: (isFinished && state?.success) ? '1200px' : '800px', transform: 'none', position: 'relative', padding: (isFinished && state?.success) ? '0' : '2rem', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>

          {!isFinished && currentQuestion && (
            <div className="calculator-step flex-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* AI Typewriter Question */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    boxShadow: '0 0 10px rgba(255, 161, 3, 0.3)'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2z"/>
                      <path d="M19 13v-2a7 7 0 0 0-14 0v2"/>
                      <path d="M22 13v-2a10 10 0 0 0-20 0v2"/>
                      <path d="M12 22a5 5 0 0 0 5-5H7a5 5 0 0 0 5 5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                      {displayedTitle}
                      {isTyping && <span style={{ display: 'inline-block', width: '8px', height: '1.2rem', backgroundColor: 'var(--accent)', marginLeft: '4px', verticalAlign: 'text-bottom', animation: 'pulse 1s infinite' }}></span>}
                    </h3>
                    
                    {currentQuestion.type === "options" && currentQuestion.is_multiple && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        (Você pode marcar mais de uma opção) {currentQuestion.optional && "— Opcional"}
                      </p>
                    )}
                    {currentQuestion.type === "options" && !currentQuestion.is_multiple && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        (Escolha apenas uma opção)
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Inputs baseados no tipo de pergunta (só mostramos quando a digitação termina ou já podemos mostrar enquanto digita) */}
                <div style={{ opacity: isTyping ? 0.5 : 1, transition: 'opacity 0.3s ease', pointerEvents: isTyping ? 'none' : 'auto' }}>
                  
                  {currentQuestion.type === "options" && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '1.5rem' }}>
                      {currentQuestion.options.map((opt) => {
                        const isSelected = (selections[currentQuestion.id] || []).includes(opt.label);
                        return (
                          <div 
                            key={opt.label}
                            onClick={() => handleSelect(currentQuestion, opt.label)}
                            style={{
                              padding: '15px',
                              border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border-color)'}`,
                              backgroundColor: isSelected ? 'rgba(255, 161, 3, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                              textAlign: 'center',
                              fontWeight: isSelected ? '600' : '400',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '10px'
                            }}
                          >
                            {opt.icon && (
                              <img 
                                src={opt.icon} 
                                alt={opt.label} 
                                style={{ 
                                  height: '40px', 
                                  filter: isSelected ? 'invert(60%) sepia(90%) saturate(300%) hue-rotate(350deg)' : 'invert(1)',
                                  transition: 'filter 0.3s ease'
                                }} 
                              />
                            )}
                            <span>{opt.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {currentQuestion.type === "text" && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <input 
                        type="text" 
                        value={selections[currentQuestion.id] || ''}
                        onChange={(e) => handleTextChange(currentQuestion, e.target.value)}
                        placeholder={currentQuestion.placeholder}
                        style={{
                          width: '100%',
                          padding: '15px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                        autoFocus
                      />
                    </div>
                  )}

                  {currentQuestion.type === "textarea" && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <textarea 
                        value={selections[currentQuestion.id] || ''}
                        onChange={(e) => handleTextChange(currentQuestion, e.target.value)}
                        placeholder={currentQuestion.placeholder}
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '15px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          fontSize: '1rem',
                          outline: 'none',
                          resize: 'none'
                        }}
                        autoFocus
                      />
                    </div>
                  )}

                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <button 
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="btn-primary"
                  style={{ opacity: currentStep === 0 ? 0.5 : 1, cursor: currentStep === 0 ? 'not-allowed' : 'pointer', border: '1px solid var(--border-color)' }}
                >
                  Voltar
                </button>
                <div style={{ alignSelf: 'center', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  Passo {currentStep + 1} de {calculatorData.questions.length}
                </div>
                <button 
                  onClick={handleNext}
                  className="btn-hitech"
                  disabled={isNextDisabled() || isTyping}
                  style={{ opacity: (isNextDisabled() || isTyping) ? 0.5 : 1 }}
                >
                  {currentQuestion?.optional && (!selections[currentQuestion.id] || selections[currentQuestion.id].length === 0) ? 'Pular' : 'Avançar'}
                </button>
              </div>
            </div>
          )}

          {isFinished && !state?.success && (
            <div className="calculator-result flex-1" style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>Análise Concluída!</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Preencha seus dados para gerar a sua Visão Estratégica Raed e enviar seu cenário para a nossa equipe.
              </p>

              <form action={formAction} className="contact-form" style={{ textAlign: 'left' }}>
                <input type="hidden" name="selections" value={JSON.stringify(selections)} />
                <input type="hidden" name="totalEstimated" value={total} />
                
                <div className="form-group">
                  <label htmlFor="name">Nome Completo</label>
                  <input type="text" id="name" name="name" required placeholder="Seu nome" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <input type="email" id="email" name="email" required placeholder="seu@email.com" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="whatsapp">WhatsApp</label>
                  <input type="tel" id="whatsapp" name="whatsapp" required placeholder="(11) 99999-9999" />
                </div>

                {state?.error && (
                  <p style={{ color: '#ff4444', marginBottom: '1rem', textAlign: 'center' }}>{state.error}</p>
                )}

                <button 
                  type="submit" 
                  className="btn-hitech" 
                  style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                  disabled={isPending}
                >
                  {isPending ? 'Processando...' : 'Gerar Visão Estratégica'}
                </button>
              </form>
            </div>
          )}

          {isFinished && state?.success && (
             <div style={{ padding: '2rem 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
               {isGeneratingPitch ? (
                 <div style={{ textAlign: 'center', animation: 'pulse 2s infinite' }}>
                   <div style={{ 
                     width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent)', 
                     display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                     boxShadow: '0 0 20px rgba(255, 161, 3, 0.4)'
                   }}>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                       <path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2z"/>
                       <path d="M19 13v-2a7 7 0 0 0-14 0v2"/>
                       <path d="M22 13v-2a10 10 0 0 0-20 0v2"/>
                       <path d="M12 22a5 5 0 0 0 5-5H7a5 5 0 0 0 5 5z"/>
                     </svg>
                   </div>
                   <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                     Analisando seu cenário...
                   </h3>
                   <p style={{ color: 'var(--text-secondary)' }}>Nossa IA está gerando inteligência de negócios baseada nos seus dados.</p>
                 </div>
               ) : (
                 <div style={{ animation: 'fadeIn 1s ease', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'stretch' }}>
                      {/* Coluna Esquerda: IA Pitch */}
                      <div className="modal-content" style={{ flex: '2 1 600px', display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '3rem', margin: '0' }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          boxShadow: '0 0 15px rgba(255, 161, 3, 0.3)'
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2z"/>
                            <path d="M19 13v-2a7 7 0 0 0-14 0v2"/>
                            <path d="M22 13v-2a10 10 0 0 0-20 0v2"/>
                            <path d="M12 22a5 5 0 0 0 5-5H7a5 5 0 0 0 5 5z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>Visão Estratégica Raed</h3>
                          <div style={{ 
                            color: 'var(--text-primary)', 
                            fontSize: '1.1rem', 
                            lineHeight: '1.6', 
                            whiteSpace: 'pre-wrap',
                            textAlign: 'justify'
                          }}>
                            {aiPitch}
                          </div>
                        </div>
                      </div>

                      {/* Coluna Direita: Valores */}
                      <div className="modal-content" style={{ flex: '1 1 350px', padding: '3rem 2rem', margin: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Para alinharmos o projeto ideal:</h4>
                        <label style={{ display: 'block', fontWeight: '500', color: 'var(--text-primary)', fontSize: '1.2rem', lineHeight: '1.4', marginBottom: '1.5rem' }}>
                          Quanto está disposto a investir no sistema?
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                          {investmentOptions.map(opt => {
                            const isSelected = investmentRange === opt.value;
                            return (
                              <div 
                                key={opt.value}
                                onClick={() => setInvestmentRange(opt.value)}
                                style={{
                                  padding: '12px 10px',
                                  border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border-color)'}`,
                                  backgroundColor: isSelected ? 'rgba(255, 161, 3, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                                  textAlign: 'center',
                                  fontWeight: isSelected ? '600' : '400',
                                  fontSize: '0.9rem'
                                }}
                              >
                                {opt.label}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Nossa equipe de especialistas entrará em contato em breve pelo WhatsApp para discutirmos a execução estratégica do seu software.
                      </p>
                      <button 
                        className="btn-primary"
                        disabled={!investmentRange || isFinishing}
                        onClick={async (e) => {
                          e.preventDefault();
                          if (investmentRange && state?.quoteId) {
                            setIsFinishing(true);
                            await updateQuoteInvestment(state.quoteId, investmentRange);
                            router.push('/');
                          }
                        }}
                        style={{
                          opacity: (investmentRange && !isFinishing) ? 1 : 0.5,
                          cursor: (investmentRange && !isFinishing) ? 'pointer' : 'not-allowed',
                          pointerEvents: (investmentRange && !isFinishing) ? 'auto' : 'none',
                          border: 'none',
                          width: 'auto',
                          display: 'inline-block',
                          padding: '1.2rem 3rem',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          boxShadow: (investmentRange && !isFinishing) ? '0 0 20px rgba(255, 161, 3, 0.5)' : 'none',
                          transform: (investmentRange && !isFinishing) ? 'scale(1.05)' : 'scale(1)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {isFinishing ? 'Concluindo...' : (investmentRange ? 'Concluir e Voltar para a Home' : 'Selecione uma faixa de investimento')}
                      </button>
                    </div>
                 </div>
               )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
