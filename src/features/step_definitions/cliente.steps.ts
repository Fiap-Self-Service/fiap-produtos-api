import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import assert from 'assert';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module'; 
import { ProdutoDTO } from '../../core/dto/produtoDTO';

let app: INestApplication;
let produtoDTO: ProdutoDTO;
let response: any;
let idProduto: string;
let categoriaPesquisa: string;

const PRODUTO1: ProdutoDTO = {
  nome: 'X-Salada',
  descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
  categoria: 'LANCHE',
  valor: 25,
  id: null,
};

const PRODUTO2: ProdutoDTO = {
  nome: 'X-Burger',
  descricao: 'Pão brioche, hamburger e queijo',
  categoria: 'LANCHE',
  valor: 20,
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

/**
 * Cadastro de Produto
 */
Given('que o produto fornece dados válidos', async () => {
  produtoDTO = PRODUTO1;
});

Given('que o produto fornece um nome já cadastrado', async () => {
  await request(app.getHttpServer()).post('/produtos').send(PRODUTO1);
  produtoDTO = { ...PRODUTO1 };
});

Given('que o produto fornece uma categoria inválida', async () => {
  produtoDTO = { ...PRODUTO1, categoria: 'INVALIDA' };
});

Given('que o produto fornece um nome inválido', async () => {
  produtoDTO = { ...PRODUTO1, nome: '' };
});

Given('que o produto fornece um valor inválido', async () => {
  produtoDTO = { ...PRODUTO1, valor: -10 };
});

When('o produto solicita o cadastro', async () => {
  response = await request(app.getHttpServer()).post('/produtos').send(produtoDTO);
});

Then('o produto é cadastrado com sucesso', async () => {
  assert.equal(response.status, HttpStatus.CREATED);
});

Then('o sistema retorna um ID válido para o produto', async () => {
  assert.ok(response.body.id);
});

/**
 * Listar Produtos
 */
Given('que existem produtos cadastrados no sistema', async () => {
  await request(app.getHttpServer()).post('/produtos').send(PRODUTO1);
  await request(app.getHttpServer()).post('/produtos').send(PRODUTO2);
});

Given('que não existem produtos cadastrados no sistema', async () => {
  // Garantindo que não há produtos cadastrados
  response = await request(app.getHttpServer()).delete('/produtos');
});

When('o produto solicita a listagem de todos os produtos', async () => {
  response = await request(app.getHttpServer()).get('/produtos').send();
});

Then('todos os produtos cadastrados devem ser retornados', async () => {
  assert.equal(response.status, HttpStatus.OK);
  assert.ok(response.body.length > 0);
});

Then('uma lista vazia deve ser retornada', async () => {
  assert.equal(response.status, HttpStatus.OK);
  assert.equal(response.body.length, 0);
});

/**
 * Consultar Produto por Categoria
 */
Given('que a categoria de pesquisa é válida', async () => {
  categoriaPesquisa = PRODUTO1.categoria;
});

Given('que a categoria de pesquisa não é válida', async () => {
  categoriaPesquisa = 'INVALIDA';
});

When('o produto solicita a listagem de produtos por categoria', async () => {
  response = await request(app.getHttpServer())
    .get('/produtos/categoria?categoria=' + categoriaPesquisa)
    .send();
});

Then('os produtos da categoria pesquisada devem ser retornados', async () => {
  assert.equal(response.status, HttpStatus.OK);
  assert.ok(response.body.length > 0);
  response.body.forEach((produto: ProdutoDTO) => {
    assert.equal(produto.categoria, categoriaPesquisa);
  });
});

Then('uma exceção informando que a categoria não foi encontrada deve ser lançada', async () => {
  assert.equal(response.status, HttpStatus.BAD_REQUEST);
  assert.equal(response.body.message, 'Categoria não encontrada.');
});

/**
 * Editar Produto
 */
Given('que o produto fornece um ID válido e dados atualizados', async () => {
  const createdResponse = await request(app.getHttpServer()).post('/produtos').send(PRODUTO1);
  idProduto = createdResponse.body.id;
  produtoDTO = { ...PRODUTO1, id: idProduto, nome: 'X-Salada Atualizado' };
});

Given('que o produto fornece um ID inexistente', async () => {
  produtoDTO = { ...PRODUTO1, id: 'inexistente' };
});

Given('que o produto fornece um ID inválido', async () => {
  produtoDTO = { ...PRODUTO1, id: '' };
});

Given('que o produto fornece dados inválidos', async () => {
  const createdResponse = await request(app.getHttpServer()).post('/produtos').send(PRODUTO1);
  idProduto = createdResponse.body.id;
  produtoDTO = { ...PRODUTO1, id: idProduto, nome: '' };
});

When('o produto solicita a edição', async () => {
  response = await request(app.getHttpServer())
    .put('/produtos/' + produtoDTO.id)
    .send(produtoDTO);
});

Then('o produto é atualizado com sucesso', async () => {
  assert.equal(response.status, HttpStatus.OK);
  assert.equal(response.body.nome, 'X-Salada Atualizado');
});

Then('uma exceção informando que o produto não foi encontrado deve ser lançada', async () => {
  assert.equal(response.status, HttpStatus.BAD_REQUEST);
  assert.equal(response.body.message, 'Produto não encontrado.');
});

Then('uma exceção informando que o ID é inválido deve ser lançada', async () => {
  assert.equal(response.status, HttpStatus.BAD_REQUEST);
  assert.equal(response.body.message, 'ID inválido.');
});

Then('uma exceção informando que os dados são inválidos deve ser lançada', async () => {
  assert.equal(response.status, HttpStatus.BAD_REQUEST);
  assert.equal(response.body.message, 'Dados inválidos.');
});

/**
 * Deletar Produto
 */
Given('que o produto fornece um ID válido', async () => {
  const createdResponse = await request(app.getHttpServer()).post('/produtos').send(PRODUTO1);
  idProduto = createdResponse.body.id;
});

Given('que o produto fornece um ID inexistente', async () => {
  idProduto = 'inexistente';
});

Given('que o produto fornece um ID inválido', async () => {
  idProduto = '';
});

When('o produto solicita a exclusão', async () => {
  response = await request(app.getHttpServer()).delete('/produtos/' + idProduto).send();
});

Then('o produto é excluído com sucesso', async () => {
  assert.equal(response.status, HttpStatus.OK);
});

Then('uma exceção informando que o produto não foi encontrado deve ser lançada', async () => {
  assert.equal(response.status, HttpStatus.BAD_REQUEST);
  assert.equal(response.body.message, 'Produto não encontrado.');
});

Then('uma exceção informando que o ID é inválido deve ser lançada', async () => {
  assert.equal(response.status, HttpStatus.BAD_REQUEST);
  assert.equal(response.body.message, 'ID inválido.');
});
