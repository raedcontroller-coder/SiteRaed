import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
    try {
        const { currentText, instruction } = await req.json();

        const prompt = `Você é um redator especialista em propostas comerciais corporativas.
Aqui está um bloco de texto atual da proposta comercial em Markdown:
---
${currentText}
---

Instrução do usuário para reescrever/refinar:
"${instruction}"

Reescreva todo o bloco de texto seguindo a instrução, melhorando a redação e mantendo o formato Markdown adequado.
Retorne EXCLUSIVAMENTE um objeto JSON no formato:
{ "refinedText": "novo texto aqui" }
`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'system', content: 'Responda apenas com JSON válido.' }, { role: 'user', content: prompt }],
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
