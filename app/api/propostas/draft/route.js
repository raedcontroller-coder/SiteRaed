import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
    try {
        const { briefing } = await req.json();

        const prompt = `Você é um especialista em vendas corporativas B2B da RAED.
Baseado no briefing do usuário, crie o conteúdo de uma proposta comercial dividida em seções.
Retorne EXCLUSIVAMENTE um objeto JSON válido contendo as seguintes chaves com seus respectivos textos em Markdown:
{
  "sumario": "texto markdown",
  "diagnostico": "texto markdown",
  "estrategia": "texto markdown",
  "metodologia": "texto markdown",
  "solucao": "texto markdown",
  "cronograma": "texto markdown",
  "investimento": "texto markdown"
}
Não inclua os títulos numéricos das seções no texto gerado (ex: "1. Sumário Executivo"), pois eles já estarão fixos na interface. Apenas gere o conteúdo de qualidade em Markdown. Use negritos, listas, e itálicos quando apropriado para um visual executivo.

BRIEFING DO USUÁRIO:
"${briefing}"
`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'system', content: 'Você responde apenas com JSON válido. Não coloque texto fora do JSON.' }, { role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            response_format: { type: 'json_object' }
        });

        const content = chatCompletion.choices[0]?.message?.content;
        if (!content) throw new Error("Sem resposta da IA");

        return NextResponse.json(JSON.parse(content));

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
