# UniFBingo Frontend

Este é o frontend do UniFBingo, um sistema de bingo online desenvolvido com [Next.js](https://nextjs.org/), React, Tailwind CSS e integração com backend Django REST.

---

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Principais Componentes](#principais-componentes)
- [Fluxo de Uso](#fluxo-de-uso)
- [Customização de Estilo](#customização-de-estilo)
- [Deploy](#deploy)
- [Licença](#licença)

---

## Sobre o Projeto

O UniFBingo é uma plataforma para criar, gerenciar e jogar bingos online, ideal para eventos, aulas e confraternizações. O frontend foi desenvolvido para ser responsivo, moderno e fácil de usar, com autenticação, criação de salas, sorteio de números e visualização de cartelas em tempo real.

---

## Funcionalidades

- **Autenticação de Usuário:** Login, registro e logout.
- **Entrar em Sala:** Formulário para entrar em uma sala existente usando o código.
- **Lobby:** Visualização dos participantes e controle do host.
- **Cartela de Bingo:** Cartela responsiva, com marcação automática dos números sorteados.
- **Sorteio de Números:** Host pode sortear o próximo número.
- **Responsividade:** Layout adaptado para mobile, tablet e desktop.
- **Logout:** Limpa cookies e localStorage, garantindo segurança.

---

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide React](https://lucide.dev) (ícones)
- [TypeScript](https://www.typescriptlang.org/)
- [Django REST Framework (backend)](https://www.django-rest-framework.org/)

---

## Como Rodar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/PedroBonfim21/unifbingo.git
   cd unifbingo
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Acesse no navegador:**
   ```
   http://localhost:3000
   ```

---

## Estrutura de Pastas

```
app/
  ├── (landing)/           # Landing page e layout principal
  ├── login/               # Página e formulário de login
  ├── register/            # Página de registro
  ├── join/                # Entrar em sala
  ├── lobby/               # Lobby da sala
  ├── room/                # Cartela e jogo
components/
  ├── navbar.tsx           # Barra de navegação responsiva
  ├── PlusButton.tsx       # Botão flutuante de criar sala
  ├── bingoBoard.tsx       # Cartela de bingo responsiva
  ├── ui/                  # Componentes de UI reutilizáveis
```

---

## Principais Componentes

- **Navbar:** Responsiva, com menu hambúrguer, links de navegação e botão de logout na extremidade direita.
- **BingoBoard:** Cartela de bingo, com células responsivas e marcação de números.
- **Footer:** Fixo na base, com a mesma cor do navbar.
- **Formulários:** Login, registro e entrada em sala, todos centralizados e adaptados para mobile.

---

## Fluxo de Uso

1. **Acesso:** Usuário acessa a landing page e pode se registrar ou logar.
2. **Criação de Sala:** Usuário logado pode criar uma sala clicando no botão "+".
3. **Entrar em Sala:** Usuário pode entrar em uma sala existente usando o código.
4. **Lobby:** Visualiza participantes e aguarda o host iniciar o jogo.
5. **Jogo:** Cartela é exibida, números são sorteados e marcados automaticamente.
6. **Logout:** Usuário pode sair, limpando todos os dados locais.

---

## Customização de Estilo

- **Paleta de Cores:** Roxo (`bg-purple-900`, `bg-purple-800`, etc.) predominante em todo o layout.
- **Responsividade:** Utiliza breakpoints do Tailwind (`sm:`, `md:`, `lg:`) para ajustar tamanhos de botões, cartelas e fontes.
- **Ícones:** Utiliza Lucide para ícones modernos e leves.

---

## Deploy

Para deploy, recomenda-se o uso do [Vercel](https://vercel.com/) para Next.js.  
Basta conectar o repositório e seguir as instruções da plataforma.

---

## Licença

Este projeto é open-source e está sob a licença MIT.

---

## Autores

- [Pedro Bonfim](https://github.com/PedroBonfim21)
- [Humberto Matheus](https://github.com/humbertomatheuz)