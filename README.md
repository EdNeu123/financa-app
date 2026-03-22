# Finança — Gestor Financeiro

App de gestão financeira pessoal com arquitetura **MVC**, validação em duas camadas (client + Firestore rules) e interface moderna.

## Arquitetura MVC

```
src/
├── models/               # M — Acesso a dados (Firestore CRUD puro)
│   ├── TransactionModel.js
│   ├── CategoryModel.js
│   └── GoalModel.js
│
├── views/                # V — Componentes React (apresentação pura)
│   ├── AuthPage.jsx
│   ├── Layout.jsx
│   ├── Dashboard.jsx
│   ├── Transactions.jsx
│   ├── Categories.jsx
│   └── Goals.jsx
│
├── controllers/          # C — Validação, sanitização, lógica de negócio
│   ├── AuthController.js
│   ├── TransactionController.js
│   ├── CategoryController.js
│   └── GoalController.js
│
├── contexts/             # React contexts (auth state)
├── utils/                # Validadores, formatadores, constantes
│   ├── validators.js     # Validação central de TODA entrada
│   ├── formatters.js     # Formatação de moeda/data (display only)
│   └── constants.js      # Emojis, cores, defaults
│
├── firebase.js           # Inicialização Firebase (sem lógica)
├── App.jsx               # Conecta Controllers às Views
└── main.jsx              # Entry point
```

### Fluxo de dados

```
View (input do usuário)
  → Controller (valida + sanitiza)
    → Model (persiste no Firestore)
      → Firestore Rules (valida NOVAMENTE no servidor)
```

## Segurança — Duas camadas

### Camada 1: Client (validators.js + Controllers)
- Valores: mín R$ 0,01 / máx R$ 9.999.999,99
- Strings: sanitização HTML/XSS, limites de comprimento
- Datas: formato YYYY-MM-DD, range 2000–2056
- Tags: máx 10 tags, 30 chars cada, lowercase
- Tipos: whitelist fixa (income/expense/both)
- Cores: whitelist de hex válidos
- Ícones: whitelist de emojis permitidos

### Camada 2: Firestore Rules (server-side)
- **Repete TODAS as validações no servidor**
- Impede bypass via DevTools (F12) / API direta
- Valida ownership (userId == auth.uid)
- Bloqueia amounts negativos, zero, e > 9.999.999,99
- Valida tamanho de strings e formato de datas
- Deny-all fallback para coleções não mapeadas

## Setup

### 1. Instalar

```bash
git clone <repo>
cd financa-app
npm install
```

### 2. Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative **Authentication** (Email/Senha + Google)
3. Ative **Cloud Firestore**
4. Copie as credenciais do app web

### 3. Variáveis de ambiente

```bash
cp .env.example .env
# Preencha com suas credenciais Firebase
```

### 4. Deploy das regras

```bash
npm i -g firebase-tools
firebase login
firebase deploy --only firestore:rules,firestore:indexes
```

### 5. Rodar

```bash
npm run dev
```

## Deploy na Vercel

```bash
vercel
```

Ou importe o repo na [dashboard da Vercel](https://vercel.com), adicione as env vars, e deploy.

## Stack

React 18 · Vite · Tailwind CSS · Recharts · Framer Motion · Lucide · Firebase Auth + Firestore
