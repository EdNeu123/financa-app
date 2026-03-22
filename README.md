# Quanto — Gestor Financeiro

> "Cada real no lugar certo."

Aplicação completa de gestão financeira pessoal com IA, cotações em tempo real, gamificação e educação financeira.

---

## Arquitetura

```
┌──────────────────────┐     ┌──────────────────────┐
│   Frontend (React)   │     │   Backend (Vercel)    │
│   Firebase Hosting   │────▶│   Serverless Funcs    │
│                      │     │                       │
│ • Auth (Firebase)    │     │ • /api/gemini   (IA)  │
│ • Firestore (dados)  │     │ • /api/stocks  (B3)   │
│ • PWA + Push         │     │ • /api/youtube (edu)  │
│ • Dashboard, Metas   │     │                       │
│ • Insights, Mercado  │     │ Keys protegidas:      │
│                      │     │ GEMINI_KEY             │
│ Nenhuma key sensível │     │ BRAPI_TOKEN            │
│ no bundle JS         │     │ YOUTUBE_KEY            │
└──────────────────────┘     └──────────────────────┘
         │                              │
         ▼                              ▼
┌──────────────────────┐     ┌──────────────────────┐
│   Firebase Auth      │     │   APIs externas       │
│   Firestore DB       │     │   (Google, brapi)     │
└──────────────────────┘     └──────────────────────┘
```

**Frontend** → Firebase Hosting (React + Vite + Tailwind)  
**Backend** → Vercel Serverless Functions (Node.js)  
**Banco** → Firestore (regras de segurança server-side)  
**Auth** → Firebase Authentication (Email + Google)

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, Framer Motion, Lucide |
| Backend | Vercel Serverless Functions (Node.js 18+) |
| Auth | Firebase Authentication |
| Banco | Cloud Firestore |
| IA | Gemini 2.0 Flash (via backend) |
| Cotações | brapi.dev (via backend) |
| Vídeos | YouTube Data API v3 (via backend) |
| Hosting | Firebase Hosting (front) + Vercel (back) |

---

## Funcionalidades

- **Dashboard** com receitas, despesas, guardado e disponível
- **Transações** CRUD com busca, filtros, CSV e recorrência
- **Categorias** personalizadas com ícones e cores
- **Metas** de economia com progresso visual
- **Orçamentos** por categoria com alertas de limite
- **Insights** com projeções matemáticas + análise IA
- **Mercado** com Ibovespa (gráfico real), 10 ações B3, sugestões IA e notícias
- **Educação** com artigos verificados e vídeos do YouTube
- **Conquistas** e gamificação (XP, níveis, streaks)
- **PWA** instalável com push notifications
- **Dark/Light mode** com design glass-morphism
- **Site público** com Home, Funcionalidades, Preços, Sobre e FAQ

---

## Pré-requisitos

- Node.js 18+
- Conta Firebase (gratuita)
- Conta Vercel (gratuita)
- API Key Google AI Studio (Gemini — gratuita)
- Token brapi.dev (gratuito)
- YouTube Data API v3 habilitada no Google Cloud

---

## Setup

### 1. Clone o repositório

```bash
git clone https://github.com/EdNeu123/financa-app.git
cd financa-app
```

### 2. Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative **Authentication** → Email/Senha + Google
3. Crie um banco **Firestore** em modo produção
4. Copie as regras de `firestore.rules` → aba Regras → Publicar
5. Crie os **índices compostos** (Firestore → Índices):

| Coleção | Campos | Escopo |
|---------|--------|--------|
| `transactions` | `userId` (ASC) + `date` (DESC) | Coleta |
| `categories` | `userId` (ASC) + `name` (ASC) | Coleta |

6. Copie as credenciais do projeto (Configurações → Apps → Web)

### 3. Backend (Vercel)

```bash
cd backend
```

1. Crie um projeto no [Vercel](https://vercel.com) e importe a pasta `backend`
2. Configure as **Environment Variables** no painel do Vercel:

```
GEMINI_KEY=sua_chave_do_google_ai_studio
BRAPI_TOKEN=seu_token_brapi_dev
YOUTUBE_KEY=sua_chave_youtube_data_api_v3
```

3. Deploy:

```bash
npx vercel --prod
```

4. Anote a URL do deploy (ex: `https://quanto-api.vercel.app`)

### 4. Frontend (Firebase Hosting)

```bash
cd frontend
cp .env.example .env
```

Preencha o `.env`:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_API_URL=https://quanto-api.vercel.app
```

Instale, teste e faça deploy:

```bash
npm install
npm run dev          # testa local em http://localhost:5173

npm run build        # gera o dist/
npx firebase login
npx firebase init hosting   # selecione o projeto, public: dist, SPA: yes
npx firebase deploy --only hosting
```

5. No Firebase Console, adicione o domínio do Hosting em **Authentication → Domínios autorizados**

---

## Variáveis de Ambiente

### Frontend (`.env`)

| Variável | Onde conseguir |
|----------|---------------|
| `VITE_FIREBASE_*` | Firebase Console → Configurações → Apps |
| `VITE_API_URL` | URL do deploy Vercel do backend |

### Backend (Vercel Environment Variables)

| Variável | Onde conseguir |
|----------|---------------|
| `GEMINI_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) |
| `BRAPI_TOKEN` | [brapi.dev](https://brapi.dev) → cadastro gratuito |
| `YOUTUBE_KEY` | [Google Cloud Console](https://console.cloud.google.com) → APIs → YouTube Data API v3 |

---

## Estrutura do Projeto

```
financa-app/
├── frontend/                  # React + Vite (Firebase Hosting)
│   ├── src/
│   │   ├── components/        # Logo
│   │   ├── contexts/          # Auth, Theme
│   │   ├── controllers/       # Validação + lógica (MVC)
│   │   ├── models/            # Firestore CRUD (MVC)
│   │   ├── hooks/             # useRecurring
│   │   ├── utils/             # api.js, gemini.js, insights, validators
│   │   ├── views/             # Todas as telas do app
│   │   │   ├── site/          # Páginas públicas (Home, Preços, etc)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Market.jsx     # Chama /api/stocks e /api/gemini
│   │   │   ├── Education.jsx  # Chama /api/youtube
│   │   │   ├── Insights.jsx   # Chama /api/gemini
│   │   │   └── ...
│   │   ├── App.jsx
│   │   ├── firebase.js
│   │   └── main.jsx
│   ├── public/                # PWA manifest, service worker, ícones
│   ├── firebase.json          # Config do Firebase Hosting
│   └── .env.example
│
├── backend/                   # Vercel Serverless Functions
│   ├── api/
│   │   ├── gemini.js          # POST — análise IA (stocks/spending)
│   │   ├── stocks.js          # GET  — cotações brapi + Ibovespa
│   │   └── youtube.js         # GET  — busca vídeos educativos
│   ├── vercel.json            # CORS headers
│   └── .env.example
│
├── firestore.rules            # Regras de segurança do Firestore
├── firestore.indexes.json     # Índices compostos
├── .gitignore
└── README.md
```

---

## Segurança

- **API Keys sensíveis** (Gemini, brapi, YouTube) ficam exclusivamente no backend Vercel. Nunca chegam ao browser.
- **Firebase Keys** são públicas por design — a segurança vem das Firestore Security Rules.
- **Firestore Rules** validam tipo de dado, limites, e garantem que cada usuário só acessa seus próprios documentos.
- **Validators** no frontend sanitizam inputs antes de enviar ao Firestore.

---

## Planos

| Recurso | Free | Pro |
|---------|------|-----|
| Transações | 50/mês | Ilimitado |
| Categorias | 8 | 50 |
| Metas | 2 | 30 |
| Orçamentos | 3 | 30 |
| Mercado | — | ✓ |

> Atualmente todos os usuários são Pro por padrão (monetização não implementada).

---

## Scripts

```bash
# Frontend
cd frontend
npm install          # instala dependências
npm run dev          # servidor local :5173
npm run build        # build de produção
npm run preview      # preview do build

# Backend
cd backend
npx vercel dev       # testa serverless local :3000
npx vercel --prod    # deploy produção
```

---

## Licença

Projeto privado. Todos os direitos reservados.
