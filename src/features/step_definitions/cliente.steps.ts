import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ClienteDTO } from '../../core/dto/produtoDTO';
import assert from 'assert';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';

let app: INestApplication;
let clienteDTO: ClienteDTO;
let response: any;
let cpfPesquisa: string;

const CLIENTE1 = {
  nome: 'Cliente de Teste',
  email: 'cliente@teste.com',
  cpf: '70234146061',
  id: null,
};

const CLIENTE2 = {
  nome: 'Cliente de Teste 2',
  email: 'cliente2@teste.com',
  cpf: '70234146062',
  id: null,
};

Before(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});

After(async () => {
  await app.close();
});

Given('que cliente fornece um nome, email e CPF válidos', async () => {
  clienteDTO = CLIENTE1;
});

Given('que cliente fornece um CPF inválido', async () => {
  clienteDTO = { ...CLIENTE1, cpf: '000' };
});

Given('que cliente fornece um e-mail inválido', async () => {
  clienteDTO = { ...CLIENTE1, email: 'email' };
});

Given('que cliente fornece um nome inválido', async () => {
  clienteDTO = { ...CLIENTE1, nome: 'a' };
});

Given('que cliente fornece um CPF já cadastrado', async () => {
  await request(app.getHttpServer()).post('/clientes').send(CLIENTE1);

  clienteDTO = {
    ...CLIENTE1,
    email: CLIENTE2.email,
  };
});

Given('que cliente fornece um e-mail já cadastrado', async () => {
  await request(app.getHttpServer()).post('/clientes').send(CLIENTE1);

  clienteDTO = {
    ...CLIENTE1,
    cpf: CLIENTE2.cpf,
  };
});

Given('que seja informado um CPF já cadastrado', async () => {
  await request(app.getHttpServer()).post('/clientes').send(CLIENTE1);

  cpfPesquisa = CLIENTE1.cpf;
});

Given('que seja informado um CPF não cadastrado', async () => {
  cpfPesquisa = CLIENTE1.cpf;
});

When('o cliente solicita o cadastro', async () => {
  response = await request(app.getHttpServer())
    .post('/clientes')
    .send(clienteDTO);
});

When('realizado a busca do cliente por CPF', async () => {
  response = await request(app.getHttpServer())
    .get('/clientes/' + cpfPesquisa)
    .send();
});

Then('o cliente é cadastrado com sucesso', async () => {
  assert.equal(response.status, HttpStatus.CREATED);
});

Then('o sistema retorna um ID válido', async () => {
  assert.ok(response.body.id);
});

Then(
  'uma exceção informando que o CPF já existe deve ser lançada',
  async () => {
    assert.equal(response.status, HttpStatus.BAD_REQUEST);
    assert.equal(response.body.message, 'CPF já cadastrado.');
  },
);

Then(
  'uma exceção informando que o e-mail já existe deve ser lançada',
  async () => {
    assert.equal(response.status, HttpStatus.BAD_REQUEST);
    assert.equal(response.body.message, 'E-mail já cadastrado.');
  },
);

Then(
  'uma exceção informando que o CPF é inválido deve ser lançada',
  async () => {
    assert.equal(response.status, HttpStatus.BAD_REQUEST);
    assert.equal(response.body.message, 'CPF inválido');
  },
);

Then(
  'uma exceção informando que o e-mail é inválido deve ser lançada',
  async () => {
    assert.equal(response.status, HttpStatus.BAD_REQUEST);
    assert.equal(response.body.message, 'e-mail inválido');
  },
);

Then(
  'uma exceção informando que o nome é inválido deve ser lançada',
  async () => {
    assert.equal(response.status, HttpStatus.BAD_REQUEST);
    assert.equal(response.body.message, 'Nome inválido');
  },
);

Then('os dados do cliente cadastrado devem ser retornados', async () => {
  assert.equal(response.status, HttpStatus.OK);
  assert.equal(response.body.cpf, CLIENTE1.cpf);
});

Then(
  'uma exceção informando que o cliente não foi encontrado deve ser lançada',
  async () => {
    assert.equal(response.status, HttpStatus.BAD_REQUEST);
    assert.equal(response.body.message, 'Cliente não encontrado.');
  },
);
