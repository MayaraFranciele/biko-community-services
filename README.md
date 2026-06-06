# Bíko — Conexões de Confiança na Sua Comunidade

Bíko é uma plataforma digital que conecta moradores a profissionais locais confiáveis, facilitando a busca, solicitação e contratação de serviços dentro da própria comunidade.

A solução foi criada para valorizar profissionais autônomos de bairros e regiões locais, oferecendo uma experiência simples, segura e acessível para clientes que precisam contratar serviços como eletricistas, encanadores, costureiras, pintores, diaristas e outros prestadores.

---

## Objetivo do Projeto

O Bíko busca fortalecer a economia local através da tecnologia, aproximando moradores e profissionais em um ambiente digital confiável.

A plataforma permite:

* Buscar profissionais por categoria;
* Encontrar prestadores próximos à região do usuário;
* Visualizar perfis profissionais;
* Solicitar serviços de forma rápida;
* Gerenciar solicitações através de uma API segura.

---

## Problema Resolvido

Encontrar profissionais confiáveis ainda é um desafio para muitas pessoas.

Atualmente, a maior parte das recomendações acontece por meio de grupos de WhatsApp, indicações informais ou redes sociais, dificultando a validação da qualidade e da disponibilidade dos serviços.

Além disso, plataformas maiores costumam priorizar empresas ou profissionais já consolidados, reduzindo a visibilidade de trabalhadores autônomos locais.

O Bíko resolve esse problema criando um marketplace hiperlocal que conecta moradores e profissionais da mesma comunidade, promovendo confiança, proximidade e geração de oportunidades.

---

## Funcionalidades

### Cliente

* Cadastro e autenticação
* Busca de profissionais por categoria
* Visualização de perfis
* Solicitação de serviços
* Acompanhamento das solicitações

### Profissional

* Cadastro profissional
* Perfil público
* Recebimento de solicitações
* Gerenciamento de serviços

### Sistema

* Autenticação JWT
* Validação de dados
* Controle de acesso
* Proteção contra ataques comuns
* Persistência em banco de dados MySQL

---

## Arquitetura

O Bíko foi desenvolvido utilizando uma arquitetura Monorepo, onde frontend e backend são mantidos em um único repositório. Essa abordagem facilita o gerenciamento do projeto, centraliza a documentação e simplifica o versionamento do código, mantendo uma separação clara entre as responsabilidades de cada camada da aplicação.

### Visão Geral da Arquitetura

```text
biko-community-services (Monorepo)
│
├── Frontend (HTML, CSS e JavaScript)
│        │
│        ▼
│   Consumo da API REST
│
├── Backend (Node.js + Express)
│        │
│        ▼
│      MySQL
│
└── Configurações Compartilhadas
    (.gitignore, package.json, render.yaml)
```

### Estrutura do Monorepo

```text
biko-community-services/
│
├── packages/
│   ├── frontend/
│   └── backend/
│
├── package.json
├── package-lock.json
├── render.yaml
└── README.md
```

### Componentes

**Frontend**

* Interface do usuário
* Navegação entre páginas
* Validação de formulários
* Consumo da API REST
* Design responsivo (mobile-first)

**Backend**

* API REST desenvolvida com Node.js e Express
* Autenticação via JWT
* Regras de negócio
* Integração com banco de dados MySQL
* Camadas de segurança e validação

**Banco de Dados**

* Persistência dos dados da aplicação
* Relacionamento entre entidades
* Migrations e Seeders utilizando Sequelize

### Benefícios da Arquitetura

* Centralização do projeto em um único repositório
* Facilidade de manutenção e versionamento
* Melhor organização entre frontend e backend
* Simplificação do processo de deploy
* Estrutura adequada para MVPs e projetos acadêmicos

---

## Tecnologias Utilizadas

### Frontend

| Tecnologia           | Finalidade                  |
| -------------------- | --------------------------- |
| HTML5                | Estrutura semântica         |
| CSS3                 | Interface responsiva        |
| JavaScript (Vanilla) | Lógica da aplicação         |
| Live Server          | Ambiente de desenvolvimento |

### Backend

| Tecnologia         | Finalidade             |
| ------------------ | ---------------------- |
| Node.js            | Ambiente de execução   |
| Express            | API REST               |
| Sequelize          | ORM                    |
| MySQL              | Banco de dados         |
| JWT                | Autenticação           |
| bcryptjs           | Criptografia de senhas |
| Helmet             | Headers de segurança   |
| CORS               | Controle de acesso     |
| Express Rate Limit | Proteção contra abuso  |

### Infraestrutura

| Serviço | Utilização              |
| ------- | ----------------------- |
| Render  | Hospedagem da aplicação |
| MySQL   | Persistência dos dados  |

---

## Como Executar Localmente

### Pré-requisitos

* Node.js 18+
* MySQL 8+
* Git

### 1. Clonar o projeto

```bash
git clone <url-do-repositorio>
cd biko-community-services
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie o arquivo:

```text
packages/backend/.env
```

Com o conteúdo:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=biko_db

JWT_SECRET=seu_segredo
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5500
```

### 4. Criar banco de dados

```sql
CREATE DATABASE biko_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### 5. Executar migrations e seeds

```bash
cd packages/backend

npx sequelize db:migrate
npx sequelize db:seed:all
```

### 6. Executar backend

```bash
npm run dev
```

API disponível em:

```text
http://localhost:3000
```

### 7. Executar frontend

Em outro terminal:

```bash
cd packages/frontend

npm run dev
```

Aplicação disponível em:

```text
http://localhost:5500
```

---

## Estrutura do Projeto

```text
biko-community-services/
│
├── packages/
│   │
│   ├── backend/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── models/
│   │   │   ├── middlewares/
│   │   │   └── config/
│   │   │
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── package.json
│   │
│   └── frontend/
│       ├── css/
│       ├── js/
│       ├── assets/
│       └── *.html
│
├── package.json
├── package-lock.json
├── render.yaml
└── README.md
```

---

## Requisitos Técnicos Atendidos

* HTML5 semântico
* CSS responsivo (mobile-first)
* JavaScript com validação de formulários
* API REST com Node.js e Express
* Rotas GET e POST
* Middleware de autenticação
* Validação utilizando express-validator
* Banco de dados MySQL
* Relacionamento entre tabelas
* Migrations e Seeders
* Consultas utilizando JOIN
* Senhas protegidas com bcryptjs
* Segurança com Helmet e Rate Limiting
* Deploy em ambiente de produção

---

## Equipe

| Integrante   | Responsabilidade     |
| ------------ | -------------------- |
| Mayara Silva | Frontend Development |
| Allan Reis   | Backend Development  |

---

## Slogan

**Bíko — Conexões de Confiança na Sua Comunidade.**
