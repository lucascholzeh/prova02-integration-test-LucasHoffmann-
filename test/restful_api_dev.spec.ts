import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { faker } from '@faker-js/faker';
import { SimpleReporter } from '../simple-reporter';

/**
 * Testes de integração da Restful API Dev (https://restful-api.dev).
 * Fluxo CRUD encadeado: o objeto criado no primeiro teste tem o seu id
 * guardado no stash do PactumJS ($S{objectId}) e é reutilizado nos demais.
 * Os testes dependem da ordem de execução.
 */
describe('Restful API Dev', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api.restful-api.dev';
  const nomeObjeto = faker.commerce.productName();

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('OBJECTS', () => {
    // POST /objects: cria um objeto, valida o corpo e o schema da resposta
    // e guarda o "id" gerado com .stores() para os próximos testes.
    it('criar um novo objeto', async () => {
      await p
        .spec()
        .post(`${baseUrl}/objects`)
        .withJson({
          name: nomeObjeto,
          data: {
            year: 2024,
            price: 1849.99,
            color: 'Silver'
          }
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          name: nomeObjeto,
          data: { year: 2024, price: 1849.99, color: 'Silver' }
        })
        .expectJsonSchema({
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            createdAt: { type: 'number' }
          },
          required: ['id', 'name', 'createdAt']
        })
        .stores('objectId', 'id');
    });

    // GET /objects/{id}: busca o objeto criado e confirma que o id e o nome
    // retornados são os mesmos enviados no POST.
    it('buscar o objeto criado pelo id', async () => {
      await p
        .spec()
        .get(`${baseUrl}/objects/{id}`)
        .withPathParams('id', '$S{objectId}')
        .expectStatus(StatusCodes.OK)
        .expectJson('id', '$S{objectId}')
        .expectJsonLike({ name: nomeObjeto });
    });

    // PUT /objects/{id}: substitui o objeto inteiro e valida que todos os
    // campos (name e data) refletem os novos valores.
    it('atualizar o objeto por completo (PUT)', async () => {
      await p
        .spec()
        .put(`${baseUrl}/objects/{id}`)
        .withPathParams('id', '$S{objectId}')
        .withJson({
          name: `${nomeObjeto} atualizado`,
          data: {
            year: 2025,
            price: 2099.99,
            color: 'Black'
          }
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: '$S{objectId}',
          name: `${nomeObjeto} atualizado`,
          data: { year: 2025, price: 2099.99, color: 'Black' }
        });
    });

    // PATCH /objects/{id}: altera somente o "name" e confirma a mudança.
    it('atualizar o objeto parcialmente (PATCH)', async () => {
      await p
        .spec()
        .patch(`${baseUrl}/objects/{id}`)
        .withPathParams('id', '$S{objectId}')
        .withJson({ name: 'nome alterado via patch' })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: '$S{objectId}',
          name: 'nome alterado via patch'
        });
    });

    // DELETE /objects/{id}: remove o objeto e valida a mensagem de confirmação.
    it('deletar o objeto', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/objects/{id}`)
        .withPathParams('id', '$S{objectId}')
        .expectStatus(StatusCodes.OK)
        .expectBodyContains('has been deleted');
    });

    // GET /objects/{id}: cenário negativo. Após o DELETE, o objeto não deve
    // mais existir e a API deve responder 404.
    it('buscar o objeto deletado retorna 404', async () => {
      await p
        .spec()
        .get(`${baseUrl}/objects/{id}`)
        .withPathParams('id', '$S{objectId}')
        .expectStatus(StatusCodes.NOT_FOUND)
        .expectBodyContains('was not found');
    });
  });
});
