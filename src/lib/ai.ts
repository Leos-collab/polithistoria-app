import { Question } from '../types';

const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_KEY || '';

// Special OpenRouter slug that automatically selects any currently available free model
const MODEL = 'openrouter/free';

export async function generateQuestionFromTopic(
  topic: string
): Promise<Partial<Question>> {
  if (!OPENROUTER_KEY) {
    throw new Error(
      'Chave do OpenRouter não configurada. Adicione VITE_OPENROUTER_KEY no seu arquivo .env'
    );
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Polithistória Quiz'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: `Você é um gerador de perguntas de quiz educacional em português brasileiro.

Gere exatamente UMA pergunta de múltipla escolha sobre o assunto: "${topic}"

Responda SOMENTE com um objeto JSON válido, sem markdown, sem texto extra:
{
  "text": "Texto da pergunta?",
  "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
  "correctOptionIndex": 0
}

Regras:
- Escreva em português do Brasil (pt-BR)
- Forneça exatamente 4 opções
- correctOptionIndex é o índice (0 a 3) da opção correta
- Torne as opções erradas plausíveis mas claramente incorretas`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 400
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const message = (err as any)?.error?.message || `Erro na API (${response.status})`;
    throw new Error(message);
  }

  const data = await response.json();
  const raw: string = data?.choices?.[0]?.message?.content || '';

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('A IA não retornou um formato válido. Tente novamente.');
    }
    parsed = JSON.parse(jsonMatch[0]);
  }

  if (
    typeof parsed.text !== 'string' ||
    !Array.isArray(parsed.options) ||
    parsed.options.length < 2 ||
    typeof parsed.correctOptionIndex !== 'number'
  ) {
    throw new Error('Resposta da IA inválida. Tente novamente.');
  }

  return {
    text: parsed.text,
    options: parsed.options,
    correctOptionIndex: parsed.correctOptionIndex
  };
}
