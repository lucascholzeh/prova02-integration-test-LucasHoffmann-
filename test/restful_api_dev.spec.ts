import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { faker } from '@faker-js/faker';
import { SimpleReporter } from '../simple-reporter';

describe('Restful API Dev', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api.restful-api.dev';
  const nomeObjeto = faker.commerce.productName();

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('OBJECTS', () => {
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

    it('buscar o objeto criado pelo id', async () => {
      await p
        .spec()
        .get(`${baseUrl}/objects/{id}`)
        .withPathParams('id', '$S{objectId}')
        .expectStatus(StatusCodes.OK)
        .expectJson('id', '$S{objectId}')
        .expectJsonLike({ name: nomeObjeto });
    });

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

    it('deletar o objeto', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/objects/{id}`)
        .withPathParams('id', '$S{objectId}')
        .expectStatus(StatusCodes.OK)
        .expectBodyContains('has been deleted');
    });

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
