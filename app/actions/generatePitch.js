'use server';

import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function generatePitch(contextString) {
  try {
    const contextData = JSON.parse(contextString);
    
    let contextText = "Contexto do Projeto do Lead:\n";
    contextData.forEach(item => {
      if (item.resposta && item.resposta.length > 0) {
        contextText += `- Pergunta: ${item.pergunta}\n  Resposta: ${Array.isArray(item.resposta) ? item.resposta.join(', ') : item.resposta}\n`;
      }
    });

    const systemPrompt = `Você é um executivo de vendas sênior e estrategista de negócios em uma software house chamada "Raed".
Sua função é ler os requisitos de um lead (cliente B2B) que deseja criar um aplicativo para seus clientes finais (B2B2C).
O seu foco é vender o valor, os benefícios de negócio e a rentabilidade do software, focado em retorno financeiro, engajamento e inteligência de dados.

${contextText}

Sua tarefa:
Gere um pitch de vendas altamente persuasivo, escrito diretamente para o cliente em português do Brasil.
- NÃO dê soluções técnicas (arquitetura, linguagens de programação, etc).
- Foque em como o software ajuda a empresa a reter clientes, obter dados preditivos, aumentar a rentabilidade, Share of Wallet, etc.
- Baseie seu argumento nos dados reais preenchidos pelo lead no contexto acima.
- Crie um texto fluido e direto, dividido EXATAMENTE em DOIS parágrafos do mesmo tamanho (totalizando aproximadamente 160 palavras no texto inteiro).
  - O primeiro parágrafo deve focar no problema atual: mostre que o cenário em que ele se encontra (ou a forma convencional) é ineficiente, custoso e limitante, destacando a dor de não ter a tecnologia certa.
  - O segundo parágrafo deve apresentar o cenário ideal com a nossa solução: mostre os benefícios claros de nos contratar, como a nova plataforma trará eficiência operacional, rentabilidade e uma experiência superior.

Seja extremamente conciso, impactante e obedeça ao limite de aproximadamente 160 palavras. Foque nos benefícios e na conclusão, usando frases executivas de alto impacto. Não cumprimente com "Olá" nem termine com "Atenciosamente", vá direto ao ponto.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 512,
    });

    return chatCompletion.choices[0]?.message?.content || "Houve um erro ao processar sua solicitação.";
  } catch (error) {
    console.error("Erro ao gerar pitch com Groq:", error);
    return "Houve um erro na análise do projeto. A nossa equipe de especialistas já foi notificada e entrará em contato em breve.";
  }
}
