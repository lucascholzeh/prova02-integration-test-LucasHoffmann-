# API test automation with Jest and PactumJS

> Simple integration between JestJS and PactumJS.

## GitHub Actions

[![Node.js CI](https://github.com/ugioni/integration-tests-jest/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/ugioni/integration-tests-jest/actions/workflows/node.js.yml)

## SonarCloud

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ugioni_integration-tests-jest&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ugioni_integration-tests-jest)

# Getting Started

### Pactum docs:
 - [PactumJS](https://pactumjs.github.io/)

### Prerequisites:
 - NodeJS `v22`

### How to run?

Inside of the project folder run:

 1. `npm install --save-dev`
 1. `npm run ci`

After that you should see a `./output` folder with some `HTML` reports.

### Docs to Api under tests: 
 - [Restful API Dev](https://restful-api.dev/)
 - [Dummyjson](https://dummyjson.com/docs)
 - [Gorest](https://gorest.co.in/)
 - [Toolshop API](https://api.practicesoftwaretesting.com/api/documentation)
 - [Deck of Cards](https://deckofcardsapi.com/)
 - [JSON placeholder](https://jsonplaceholder.typicode.com/)
 - [http bin](http://httpbin.org/)
 - [rick and morty api](https://rickandmortyapi.com/documentation/#rest)
 - [Petstore](https://petstore.swagger.io/#/) 
 - [ServeRest](https://serverest.dev/#/)
 - [ServeRest - Datadog](https://p.datadoghq.eu/sb/421fcfee-35ec-11ee-b87f-da7ad0900005-2aaf85264a89d11b7001bcab452a266e?refresh_mode=sliding&theme=light&tpl_var_env%5B0%5D=serverest.dev&from_ts=1699931511294&to_ts=1699932411294&live=true)

## Testes da Restful API Dev

Arquivo: [`test/restful_api_dev.spec.ts`](test/restful_api_dev.spec.ts)

API pública, sem autenticação, com CRUD completo de objetos (`https://api.restful-api.dev/objects`).
Os testes formam um fluxo encadeado: o `id` do objeto criado no POST é guardado com `.stores()` e
reutilizado nos demais cenários via `$S{objectId}`, portanto **dependem da ordem de execução**.

| # | Cenário | Método e endpoint | Resultado esperado |
|---|---------|-------------------|--------------------|
| 1 | Criar um novo objeto | `POST /objects` | `200`; corpo com `name` e `data` enviados; schema com `id`, `name` e `createdAt`; `id` guardado |
| 2 | Buscar o objeto criado pelo id | `GET /objects/{id}` | `200`; `id` e `name` iguais aos do POST |
| 3 | Atualizar o objeto por completo | `PUT /objects/{id}` | `200`; `name` e `data` substituídos pelos novos valores |
| 4 | Atualizar o objeto parcialmente | `PATCH /objects/{id}` | `200`; apenas o `name` alterado |
| 5 | Deletar o objeto | `DELETE /objects/{id}` | `200`; mensagem `has been deleted` |
| 6 | Buscar o objeto deletado (negativo) | `GET /objects/{id}` | `404`; mensagem `was not found` |

Recursos do PactumJS usados: `spec()`, `withJson`, `withPathParams`, `expectStatus`, `expectJson`,
`expectJsonLike`, `expectJsonSchema`, `expectBodyContains`, `stores` e `$S{}` (stash).

Para rodar somente esses testes:

```
npx jest restful_api_dev.spec.ts --config ./jest.config.js
```
