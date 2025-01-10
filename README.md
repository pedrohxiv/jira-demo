# Projeto Demo Jira

## Descrição do Projeto

O Jira-Demo é um clone do popular aplicativo Jira, desenvolvido para demonstrar um sistema completo de gerenciamento de projetos com diversas funcionalidades essenciais para equipes. Ele oferece suporte a workspaces, projetos, tarefas, quadros kanban, calendários, sistema de convites, controle de acesso baseado em papéis, uploads de imagens, análise de dados, autenticação e muito mais. Este projeto foi construído com **Next.js 14**, estilizado com **Shadcn UI** e **TailwindCSS**, e integra o SDK do Appwrite para backend.

## Principais Funcionalidades

- **Workspaces:** Crie e gerencie workspaces para diferentes equipes e projetos.

- **Projetos:** Organize tarefas em projetos para maior clareza.

- **Tarefas:** Crie, edite e exclua tarefas com facilidade.

- **Quadro Kanban:** Visualize e gerencie tarefas em um formato de quadro kanban.

- **Visualização em Tabela:** Veja os dados em uma tabela detalhada.

- **Visualização de Calendário:** Planeje tarefas com a exibição de calendário.

- **Sistema de Convites:** Convide usuários para workspaces e projetos via e-mail.

- **Configurações de Workspace e Projeto:** Personalize workspaces e projetos conforme necessário.

- **Uploads de Imagens:** Adicione avatares e anexos diretamente.

- **Busca Avançada e Filtros:** Localize tarefas e projetos rapidamente.

- **Painel de Análises:** Acompanhe o progresso do projeto com gráficos detalhados.

- **Papéis e Permissões de Usuários:** Controle de acesso baseado em funções atribuídas.

- **Autenticação Segura:** OAuth e autenticação por e-mail.

- **Design Responsivo:** Totalmente otimizado para dispositivos móveis.

- **Integração com Appwrite SDK:** Backend robusto utilizando Appwrite.

- **Next.js 14 Framework:** Aproveite as novas funcionalidades do framework Next.js.

- **Estilo Moderno e Responsivo:** Design estilizado com Shadcn UI e TailwindCSS.

- **API com Hono.js:** Backend rápido e escalável utilizando Hono.js.

## Dependências

O projeto utiliza as seguintes dependências para seu funcionamento:

- `@hello-pangea/dnd`: ^17.0.0,
- `@hono/zod-validator`: ^0.4.1,
- `@hookform/resolvers`: ^3.9.1,
- `@radix-ui/react-avatar`: ^1.1.1,
- `@radix-ui/react-checkbox`: ^1.1.2,
- `@radix-ui/react-dialog`: ^1.1.2,
- `@radix-ui/react-dropdown-menu`: ^2.1.2,
- `@radix-ui/react-label`: ^2.1.0,
- `@radix-ui/react-popover`: ^1.1.2,
- `@radix-ui/react-scroll-area`: ^1.2.1,
- `@radix-ui/react-select`: ^2.1.2,
- `@radix-ui/react-separator`: ^1.1.0,
- `@radix-ui/react-slot`: ^1.1.0,
- `@radix-ui/react-tabs`: ^1.1.1,
- `@radix-ui/react-toast`: ^1.2.2,
- `@tanstack/react-query`: ^5.59.0,
- `@tanstack/react-table`: ^8.20.6,
- `class-variance-authority`: ^0.7.1,
- `clsx`: ^2.1.1,
- `date-fns`: ^3.6.0,
- `hono`: ^4.6.3,
- `lucide-react`: ^0.468.0,
- `next`: 14.2.14,
- `node-appwrite`: ^14.0.0,
- `nuqs`: ^1.19.1,
- `react`: ^18,
- `react-big-calendar`: ^1.14.1,
- `react-day-picker`: ^8.10.1,
- `react-dom`: ^18,
- `react-hook-form`: ^7.54.0,
- `react-icons`: ^5.4.0,
- `react-use`: ^17.6.0,
- `recharts`: ^2.14.1,
- `server-only`: ^0.0.1,
- `tailwind-merge`: ^2.5.5,
- `tailwindcss-animate`: ^1.0.7,
- `vaul`: ^1.1.1,
- `zod`: ^3.23.8,
- `@types/node`: ^20,
- `@types/react`: ^18,
- `@types/react-big-calendar`: ^1.8.11,
- `@types/react-dom`: ^18,
- `eslint`: ^8,
- `eslint-config-next`: 14.2.14,
- `postcss`: ^8,
- `tailwindcss`: ^3.4.1,
- `typescript`: ^5,

## Como Executar o Projeto

1. Clone este repositório em sua máquina local.
2. Certifique-se de ter o Node.js e o npm (ou yarn) instalados.
3. Instale as dependências do projeto utilizando o seguinte comando:

```bash
npm install
# ou
yarn install
```

4. Crie um arquivo `.env.local` na raiz do projeto com as seguintes chaves e seus respectivos valores:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APPWRITE_ENDPOINT=seu_valor_aqui
NEXT_PUBLIC_APPWRITE_PROJECT=seu_valor_aqui
NEXT_PUBLIC_APPWRITE_DATABASE_ID=seu_valor_aqui
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=seu_valor_aqui
NEXT_PUBLIC_APPWRITE_MEMBERS_ID=seu_valor_aqui
NEXT_PUBLIC_APPWRITE_PROJECTS_ID=seu_valor_aqui
NEXT_PUBLIC_APPWRITE_TASKS_ID=seu_valor_aqui
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=seu_valor_aqui
NEXT_APPWRITE_KEY=seu_valor_aqui
```

Certifique-se de substituir `seu_valor_aqui` pelos valores corretos de cada chave.

5. Inicie o servidor de desenvolvimento com o seguinte comando:

```bash
npm run dev
# ou
yarn dev
```

6. Acesse a aplicação em `http://localhost:3000` e explore as funcionalidades completas do Jira Demo e adapte-as conforme suas necessidades específicas.
