import { Question } from '../types';

const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_KEY || '';
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || '';

// Special OpenRouter slug that automatically selects any currently available free model
const MODEL = 'openrouter/free';

async function fetchUnsplashImage(keyword: string): Promise<string> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('VITE_UNSPLASH_ACCESS_KEY não configurada. Nenhuma imagem será carregada.');
    return '';
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(keyword)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    if (!response.ok) {
      console.warn(`Unsplash API error: ${response.status}`);
      return '';
    }
    const data = await response.json();
    return data?.urls?.regular || '';
  } catch (error) {
    console.warn('Falha ao buscar imagem no Unsplash:', error);
    return '';
  }
}

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
  "correctOptionIndex": 0,
  "searchKeyword": "english keyword for image search"
}

Regras:
- Escreva em português do Brasil (pt-BR)
- Forneça exatamente 4 opções
- correctOptionIndex é o índice (0 a 3) da opção correta
- Torne as opções erradas plausíveis mas claramente incorretas
- searchKeyword DEVE ser em INGLÊS e focar no elemento principal visual da pergunta, contendo de 1 a 3 palavras no máximo (ex: "french revolution", "pyramids", "abraham lincoln")`
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
  
  let imageUrl = '';
  if (parsed.searchKeyword && typeof parsed.searchKeyword === 'string') {
    imageUrl = await fetchUnsplashImage(parsed.searchKeyword);
  }

  // Embaralhar as opções
  const optionsWithIndex = parsed.options.map((opt: string, idx: number) => ({ 
    text: opt, 
    isCorrect: idx === parsed.correctOptionIndex 
  }));
  
  // Algoritmo Fisher-Yates shuffle
  for (let i = optionsWithIndex.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
  }
  
  const shuffledOptions = optionsWithIndex.map((o: any) => o.text);
  const finalCorrectIndex = optionsWithIndex.findIndex((o: any) => o.isCorrect);

  return {
    text: parsed.text,
    options: shuffledOptions,
    correctOptionIndex: finalCorrectIndex,
    imageUrl: imageUrl || undefined
  };
}
