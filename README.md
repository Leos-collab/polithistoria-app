# Polithistória Quiz

Um aplicativo interativo de questionário com temática de História e Política, contendo um painel administrativo poderoso integrado com Inteligência Artificial para geração automática de perguntas e imagens.

## 🚀 Tecnologias Utilizadas

* **React + Vite**: Biblioteca principal e bundler ultrarrápido para construção da interface.
* **TypeScript**: Para tipagem estática, garantindo um código mais seguro e previsível.
* **Tailwind CSS**: Framework utilitário de CSS para estilização rápida, moderna e responsiva.
* **Lucide React**: Biblioteca de ícones elegantes e consistentes.
* **Supabase**: Backend-as-a-Service (BaaS) open-source usado como banco de dados (PostgreSQL) para persistir as perguntas e os cadastros dos usuários.
* **OpenRouter API**: Integração com Inteligência Artificial (modelos gratuitos) para geração automática de perguntas e opções de respostas estruturadas em JSON.
* **Unsplash API**: Integração para buscar automaticamente imagens de alta qualidade relacionadas ao tema gerado pela IA.

## ✨ Principais Funcionalidades

### Área do Usuário
* Tela de apresentação com formulário de cadastro (Nome e Data de Nascimento).
* Sistema de navegação de perguntas com interface moderna e *glassmorphism*.
* Pontuação automática no final, mostrando os acertos, erros (revelando as corretas) e porcentagem total.
* Design responsivo e imersivo com divisão visual (Metade História / Metade Política).

### Painel Administrativo (ADM)
* Visualização, criação, edição e exclusão de perguntas.
* **Gerador por IA**: Ao digitar um tema (ex: "Roma Antiga") e clicar em gerar, a IA constrói a pergunta inteira, 4 opções plausíveis, marca a resposta correta e busca uma imagem de fundo no Unsplash.
* Opção de reordenar as respostas para cima ou para baixo dinamicamente.
* Configuração manual de respostas corretas, deleção e inserção flexível de opções (mín. 2, máx. 8).

---

## 🛠️ Como Instalar e Rodar Localmente

### 1. Pré-requisitos
* Node.js (versão 16 ou superior)
* Git instalado
* Contas gratuitas no: [Supabase](https://supabase.com/), [OpenRouter](https://openrouter.ai/) e [Unsplash Developers](https://unsplash.com/developers)

### 2. Clonando e Instalando Dependências

Abra o terminal e execute:
```bash
# Clone este repositório (substitua pela URL do seu repo)
git clone https://github.com/Leos-collab/polithistoria-app.git

# Entre na pasta
cd polithistoria-app

# Instale as dependências
npm install
```

### 3. Configurando Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto e preencha com as suas credenciais:

```env
# Banco de Dados
VITE_SUPABASE_URL=sua_url_do_supabase_aqui
VITE_SUPABASE_ANON_KEY=sua_anon_key_do_supabase_aqui

# Inteligência Artificial
VITE_OPENROUTER_KEY=sua_chave_do_openrouter_aqui

# Banco de Imagens
VITE_UNSPLASH_ACCESS_KEY=sua_access_key_do_unsplash_aqui
```

### 4. Configuração do Supabase (Banco de Dados)

No painel do Supabase, acesse o **SQL Editor** e rode o seguinte script para criar suas tabelas e desativar o bloqueio de segurança inicial (RLS) para facilitar os testes:

```sql
-- Criar tabela de perguntas
CREATE TABLE questions (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    imageUrl TEXT,
    options JSONB NOT NULL,
    correctOptionIndex INTEGER NOT NULL,
    createdAt BIGINT NOT NULL
);

-- Criar tabela de usuários/respostas
CREATE TABLE user_registrations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    birthDate TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    answers JSONB NOT NULL,
    createdAt TEXT NOT NULL
);

-- Desativar RLS para permitir leitura e gravação livre (Atenção em produção!)
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_registrations DISABLE ROW LEVEL SECURITY;
```

### 5. Rodando a Aplicação

No terminal, execute:
```bash
npm run dev
```
Acesse `http://localhost:5173/` no seu navegador. Para acessar a área restrita, basta clicar no discreto botão "adm" no canto inferior esquerdo da tela inicial.

---

## 📦 Construindo para Produção

Para gerar a versão de produção (arquivos minificados e otimizados prontos para hospedagem como Vercel ou Netlify):

```bash
npm run build
```
A pasta `dist` será gerada. Você pode visualizar a build localmente com:
```bash
npm run preview
```

---

## 🧠 Lembretes Úteis da Estrutura

* **`src/types.ts`**: Arquivo central que contém todas as interfaces TypeScript (tipagem) do projeto (`Question`, `UserRegistration`, `UserAnswer`).
* **`src/lib/supabase.ts`**: Lógica de conexão com o banco de dados. Implementa fallback silencioso (LocalStorage) caso a API do Supabase falhe ou esteja sem internet.
* **`src/lib/ai.ts`**: Faz chamadas reais para a API do OpenRouter e Unsplash. Aqui é onde acontece o shuffle (embaralhamento de opções) com o algoritmo *Fisher-Yates* antes da pergunta ir pro formulário.
* **`src/components/SplitBackground.tsx`**: Controla o visual do plano de fundo imersivo usando classes flexíveis e gradientes.

Feito com 💡 e muita tecnologia!
