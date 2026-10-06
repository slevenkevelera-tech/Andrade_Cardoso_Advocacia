# Setup - Andrade Cardoso Advocacia

## 🚀 Instruções de Instalação e Execução

### Requisitos
- Node.js 16+
- npm ou yarn

### Passos para Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/slevenkevelera-tech/Andrade_Cardoso_Advocacia.git
   cd Andrade_Cardoso_Advocacia
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   - Crie um arquivo `.env.local` na raiz do projeto
   - Configure as variáveis necessárias (Google GenAI, Firebase, etc.)
   ```bash
   cp .env.example .env.local
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   O servidor estará disponível em `http://localhost:3000`

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento (porta 3000)
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run start` - Compila e inicia em modo produção
- `npm run lint` - Verifica tipos TypeScript
- `npm run clean` - Remove arquivos de build

### Dependências Principais

- **React 19.0.1** - Framework UI
- **Vite 8.3.0** - Build tool
- **TypeScript 7.0.2** - Type safety
- **Tailwind CSS 4.3.3** - Styling
- **Firebase 12.19.0** - Backend/Auth
- **Google GenAI 2.4.0** - AI Integration
- **Express 4.21.2** - Server backend
- **Lucide React** - Icon library
- **Motion 12.23.24** - Animations

### 🌐 Deploy no Firebase Hosting

O Firebase Hosting já está inicializado e configurado através de `firebase.json` e `.firebaserc`.

1. **Autenticação no Firebase**:
   ```bash
   firebase login
   ```
   *(Ou `firebase login:ci` para ambientes de integração contínua)*

2. **Vincular projeto ativo (se necessário)**:
   ```bash
   firebase use gen-lang-client-0716115579
   ```

3. **Compilar e publicar**:
   ```bash
   npm run deploy:hosting
   ```
   *O comando executa `vite build` e publica o diretório `dist/` com reescrita SPA para `/index.html` e cabeçalhos de segurança HTTP ativados.*

### Troubleshooting

#### Porta 3000 já está em uso
O Vite está configurado para usar a porta 3000. Se ela estiver ocupada, o Vite procurará a próxima porta disponível.

#### Problemas com módulos
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

#### Erros de TypeScript
```bash
npm run lint
```

### Estrutura do Projeto

```
├── src/
│   ├── components/     # Componentes React
│   ├── pages/          # Páginas
│   ├── styles/         # Estilos Tailwind
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Entrada da aplicação
├── public/             # Arquivos estáticos
├── package.json        # Dependências
├── vite.config.ts      # Configuração Vite
├── tsconfig.json       # Configuração TypeScript
├── tailwind.config.js  # Configuração Tailwind
└── postcss.config.js   # Configuração PostCSS
```

## 📝 Notas Importantes

- O projeto usa Vite para build rápido
- TypeScript está habilitado para type safety
- Tailwind CSS está configurado com PostCSS e Autoprefixer
- Firebase e Google GenAI precisam de credenciais configuradas

## 🔗 Recursos Úteis

- [Documentação Vite](https://vitejs.dev/)
- [Documentação React](https://react.dev/)
- [Documentação Tailwind CSS](https://tailwindcss.com/)
- [Documentação Firebase](https://firebase.google.com/docs)
- [Documentação Google GenAI](https://ai.google.dev/)
