import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

const PRODUTO1 = {
  nome: 'X-Salada',
  descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
  categoria: 'LANCHE',
  valor: 25,
  id: null,
};

describe('Testes de Integração', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Deve cadastrar Produto', () => {
    return request(app.getHttpServer())
      .post('/produtos')
      .send(PRODUTO1)
      .expect(HttpStatus.CREATED);
  });

  it('Deve buscar os dados do produto', async () => {
    await request(app.getHttpServer()).post('/produtos').send(PRODUTO1);

    return await request(app.getHttpServer())
      .get('/produtos')
      .send()
      .expect(HttpStatus.OK);
  });
});
