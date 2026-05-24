# Electron + Vite + React

Base pré-configurada para desenvolvimento de aplicações desktop com **Electron**, **Vite** e **React** usando **TypeScript**.

## 🚀 Características

- ⚡ Vite com HMR (Hot Module Replacement)
- ⚛️ React 19 com TypeScript
- 🔧 Electron 41+ totalmente integrado
- 📦 Electron Builder para gerar builds em Windows, macOS e Linux
- ✅ ESLint configurado
- 🎨 Estrutura clara entre UI e processo principal

## 📁 Estrutura

```
src/
├── electron/          # Processo principal do Electron
│   ├── main.ts
│   ├── utils.ts
│   └── tsconfig.json
└── ui/                # Interface React
    ├── App.tsx
    ├── main.tsx
    ├── App.css
    └── assets/
```

## 🔨 Scripts Disponíveis

```bash
# Desenvolvimento - React + Electron em paralelo
npm run dev

# Apenas React (Vite)
npm run dev:react

# Apenas Electron
npm run dev:electron

# Build para produção
npm run build

# Verificar linting
npm run lint

# Gerar executável
npm run dist:mac      # macOS (ARM64)
npm run dist:win      # Windows (x64)
npm run dist:linux    # Linux (x64)
```

## 🛠️ Stack Tecnológico

- **React** 19.2.5
- **TypeScript** 6.0
- **Vite** 8.0
- **Electron** 41.3.0
- **Electron Builder** 26.8
- **ESLint** 10.2

## 📝 Primeiros Passos

1. Instale as dependências:
```bash
npm install
```

2. Inicie o desenvolvimento:
```bash
npm run dev
```

3. Edite os arquivos em `src/ui/` para a interface React ou `src/electron/main.ts` para lógica do processo principal.

## 📦 Build de Produção

```bash
npm run build      # Compila React e TypeScript
npm run dist:win   # Gera .exe para Windows
```

O executável estará em `dist/`.
