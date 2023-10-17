# Desafio Mini Financeiro: Desenvolvimento de um Aplicativo PWA

Seu desafio consiste em criar um Progressive Web App (PWA) utilizando Vue 3, Pinia, Axios e Quasar para gerenciar registros de entradas e saídas financeiras. O objetivo é desenvolver uma aplicação que ofereça funcionalidades de registro, categorização e pesquisa, com destaque para o cálculo do saldo total.

## Principais Características

### Registro de Entrada e Saída
Os usuários devem ser capazes de registrar transações financeiras, indicando se se tratam de entradas ou saídas de recursos.

### Saldo Total
O aplicativo deve calcular e exibir o saldo total, considerando todas as transações registradas, proporcionando aos usuários uma visão rápida de sua situação financeira.

### Filtragem por Categorias
Os registros devem ser categorizados para facilitar a organização e a análise. Os usuários devem ser capazes de filtrar as transações por categorias específicas, tornando mais fácil a identificação de padrões de gastos.

### Pesquisa por Nome do Cliente
A aplicação deve permitir que os usuários pesquisem transações específicas com base no nome do cliente associado a cada transação. Isso simplificará a localização de informações relevantes.

## Tecnologias Utilizadas

Esta é uma oportunidade de demonstrar suas habilidades no desenvolvimento de aplicações web utilizando tecnologias de ponta. A combinação do Vue 3, Pinia e Quasar oferece um ambiente robusto para criar um aplicativo eficiente, responsivo e com ótima experiência do usuário. Seu trabalho incluirá a configuração do ambiente de desenvolvimento, a criação de componentes interativos e a integração de recursos avançados, como a filtragem por categorias e a pesquisa por nome do cliente. Além disso, certifique-se de que o aplicativo seja responsivo para funcionar em diferentes dispositivos.

## Principais Objetivos

1. **Desenvolvimento do Aplicativo:** Criar um aplicativo web usando Vue 3, Pinia e Quasar para permitir o registro de transações financeiras, com categorização de "entrada" e "saída", bem como a capacidade de consultar transações específicas por cliente e filtrar transações por categorias.

2. **Controle de Versão com Git Flow:** Implementar um fluxo de desenvolvimento eficiente com o Git Flow, facilitando a colaboração entre membros da equipe e o gerenciamento de versões do aplicativo.

3. **Dockerização do Aplicativo:** Containerizar o aplicativo usando Docker para garantir a portabilidade e a fácil distribuição do ambiente de desenvolvimento.

4. **Docker Compose:** Criar um arquivo Docker Compose para orquestrar os contêineres do aplicativo, do banco de dados e quaisquer outros serviços necessários.

## Estrutura do JSON Categorias e Clientes

```json
json-server -w db.json
{
  "categorias": [
    { "id": 1, "label": "CASA" },
    { "id": 2, "label": "INTERNET" },
    { "id": 3, "label": "SERVIÇO" }
  ],
  "clientes": [
    { "id": 1, "cliente": "JOSE" },
    { "id": 2, "cliente": "Maria" }
  ]
}

// sugestão
[
  {
    "categoria_id": 1,
    "cliente_id": 2,
    "tipo": "entrada",
    "valor": 10
  },
  {
    "categoria_id": 1,
    "cliente_id": 2,
    "tipo": "saida",
    "valor": -5.0
  }
]
