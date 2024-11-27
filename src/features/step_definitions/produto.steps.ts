import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import assert from 'assert';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module'; 
import { ProdutoDTO } from '../../core/dto/produtoDTO';
import { DataSource } from 'typeorm';

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

Given('que o produto fornece uma categoria inválida', async () => {
  produtoDTO = { ...PRODUTO1, categoria: 'INVALIDA' }; 
});

Given('que o produto fornece um valor inválido', async () => {
  produtoDTO = { ...PRODUTO1, valor: -10 }; 
});

When('o produto solicita o cadastro', async () => {
  response = await request(app.getHttpServer())
    .post('/produtos')
    .send(produtoDTO); 
});

Then('o produto é cadastrado com sucesso', async () => {
  assert.equal(response.status, HttpStatus.CREATED); 
});

Then('o sistema retorna um ID válido para o produto', async () => {
  assert.ok(response.body.id); 
});

Then('uma exceção informando que a categoria é inválida deve ser lançada', async () => {
  assert.equal(response.status, HttpStatus.BAD_REQUEST); 
  assert.equal(response.body.message, 'Categoria inválida.'); 
});

Then('uma exceção informando que o valor é inválido deve ser lançada', async () => {
  assert.equal(response.status, HttpStatus.BAD_REQUEST); 
  assert.equal(response.body.message, 'Valor inválido.'); 
});

/**
 * Consultar Produto por Categoria
 */

// Cenário: Consulta de produtos por categoria com sucesso
Given('que a categoria de pesquisa é válida', async () => {
  categoriaPesquisa = PRODUTO1.categoria; 
  await request(app.getHttpServer()).post('/produtos').send(PRODUTO1);
});

When('o produto solicita a listagem de produtos por categoria', async () => {
  response = await request(app.getHttpServer())
    .get(`/produtos/categoria?categoria=${categoriaPesquisa}`)
    .send();
});

Then('os produtos da categoria pesquisada devem ser retornados', async () => {
  assert.equal(response.status, HttpStatus.OK); 
  assert.ok(response.body.length > 0); 
  response.body.forEach((produto: ProdutoDTO) => {
    assert.equal(produto.categoria, categoriaPesquisa); 
  });
});

// Cenário: Consulta de produtos por categoria inexistente
Given('que a categoria de pesquisa não é válida', async () => {
  categoriaPesquisa = 'INVALIDA'; 
});

Then('uma exceção informando que a categoria não foi encontrada deve ser lançada', async () => {
  assert.equal(response.status, HttpStatus.BAD_REQUEST); 
  assert.equal(response.body.message, 'Categoria não encontrada.'); 
});

// Cenário: Consulta de produtos com categoria sem produtos cadastrados
Given('não existem produtos cadastrados para a categoria', async () => {
  // Lista todos os produtos cadastrados
  const listResponse = await request(app.getHttpServer()).get('/produtos');
  const produtos = listResponse.body;

  // Exclui cada produto individualmente
  for (const produto of produtos) {
    await request(app.getHttpServer()).delete(`/produtos/${produto.id}`);
  }
});

Then('uma lista vazia deve ser retornada', async () => {
  assert.equal(response.status, HttpStatus.OK); 
  assert.ok(Array.isArray(response.body)); 
  assert.equal(response.body.length, 0); 
});

/**
 * Listar Produtos
 */

// Cenário: Listar todos os produtos com sucesso
Given('que existem produtos cadastrados no sistema', async () => {
  await request(app.getHttpServer()).post('/produtos').send(PRODUTO1);
});

When('o produto solicita a listagem de todos os produtos', async () => {
  response = await request(app.getHttpServer()).get('/produtos').send(); 
});

Then('todos os produtos cadastrados devem ser retornados', async () => {
  assert.equal(response.status, HttpStatus.OK); 
  assert.ok(response.body.length > 0); 
  assert.ok(response.body.some((produto: ProdutoDTO) => produto.nome === PRODUTO1.nome)); 
});

// Cenário: Listar produtos com o sistema vazio
Given('que não existem produtos cadastrados no sistema', async () => {
  // Lista todos os produtos cadastrados
  const listResponse = await request(app.getHttpServer()).get('/produtos');
  const produtos = listResponse.body;

  // Remove cada produto individualmente
  for (const produto of produtos) {
    await request(app.getHttpServer()).delete(`/produtos/${produto.id}`);
  }
});

Then('uma lista sem dados deve ser retornada', async () => {
  assert.equal(response.status, HttpStatus.OK); 
  assert.ok(Array.isArray(response.body)); 
  assert.equal(response.body.length, 0); 
});

/**
 * Editar Produto
 */

// Cenário: Editar um produto com sucesso
Given('que o produto fornece um ID válido e dados atualizados', async () => {
  const createdResponse = await request(app.getHttpServer())
    .post('/produtos')
    .send(PRODUTO1); // Cadastra PRODUTO1
  idProduto = createdResponse.body.id; // Armazena o ID do produto
  produtoDTO = { ...PRODUTO1, id: idProduto, nome: 'X-Salada Atualizado' }; // Define os dados atualizados
});

When('o produto solicita a edição', async () => {
  response = await request(app.getHttpServer())
    .put('/produtos/' + produtoDTO.id)
    .send(produtoDTO); // Requisição para editar o produto
});

Then('o produto é atualizado com sucesso', async () => {
  assert.equal(response.status, HttpStatus.OK); // Verifica o status HTTP
  assert.equal(response.body.nome, 'X-Salada Atualizado'); // Verifica se o nome foi atualizado
});

Then('os dados atualizados são retornados', async () => {
  assert.equal(response.body.nome, produtoDTO.nome); // Verifica o nome
  assert.equal(response.body.descricao, produtoDTO.descricao); // Verifica a descrição
  assert.equal(response.body.categoria, produtoDTO.categoria); // Verifica a categoria
  assert.equal(response.body.valor, produtoDTO.valor); // Verifica o valor
});

// Cenário: Editar um produto com ID inexistente
Given('que o produto fornece um ID inexistente', async () => {
  produtoDTO = { ...PRODUTO1, id: 'inexistente' }; // Define um ID inexistente
});

Then('uma exceção informando que o produto não foi encontrado deve ser lançada', async () => {
  assert.equal(response.status, HttpStatus.BAD_REQUEST); // Verifica o status HTTP
  assert.equal(response.body.message, 'Produto não cadastrado.'); // Verifica a mensagem de erro
});

// Cenário: Editar um produto com dados inválidos
Given('que o produto fornece um ID válido', async () => {
  const createdResponse = await request(app.getHttpServer())
    .post('/produtos')
    .send(PRODUTO1); // Cadastra PRODUTO1
  idProduto = createdResponse.body.id; // Armazena o ID do produto
});

Given('os dados fornecidos são inválidos', async () => {
  produtoDTO = { ...PRODUTO1, id: idProduto, nome: '' }; // Define dados inválidos (nome vazio)
});

Then('uma exceção informando que os dados são inválidos deve ser lançada', async () => {
  assert.equal(response.status, HttpStatus.BAD_REQUEST); // Verifica o status HTTP
  assert.equal(response.body.message, 'Dados inválidos.'); // Verifica a mensagem de erro
});

/**
 * Deletar Produto
 */

// Cenário: Deletar um produto com sucesso
Given('que o produto fornece um ID corretamente', async () => {
  // Cria um produto para ser excluído posteriormente
  const createdResponse = await request(app.getHttpServer()).post('/produtos').send(PRODUTO1);
  idProduto = createdResponse.body.id; // Armazena o ID para exclusão
  assert.ok(idProduto); // Verifica que o ID foi gerado
});

When('o produto solicita a exclusão', async () => {
  // Faz a requisição para excluir o produto pelo ID
  response = await request(app.getHttpServer()).delete(`/produtos/${idProduto}`).send();
});

Then('o produto é excluído com sucesso', async () => {
  assert.equal(response.status, HttpStatus.OK); 
});

// Cenário: Deletar um produto com ID inexistente
Given('que o produto fornece um ID que não existe', async () => {
  idProduto = 'id-inexistente'; // Define um ID que não existe
});

Then('uma exceção informando que o produto não existe deve ser lançada', async () => {
  // Verifica se o status retornado é de erro (BAD_REQUEST)
  assert.equal(response.status, HttpStatus.BAD_REQUEST);
  assert.equal(response.body.message, 'Produto não encontrado.'); // Verifica a mensagem de erro
});

/**
 * Consultar Produto por ID
 */
Given('que o id de pesquisa é válido', async () => {
  // Cadastro de um produto para garantir que temos um ID válido
  const createdResponse = await request(app.getHttpServer())
    .post('/produtos')
    .send(PRODUTO1);

  idProduto = createdResponse.body.id; // Armazena o ID do produto criado
});

Given('que a id de pesquisa não é válido', async () => {
  idProduto = 'invalido'; // Define um ID inválido
});

When('solicita o produto pelo id', async () => {
  response = await request(app.getHttpServer())
    .get(`/produtos/${idProduto}`)
    .send();
});

Then('o produto pesquisado deve ser retornado', async () => {
  // Verifica o status da resposta
  assert.equal(response.status, HttpStatus.OK);

  // Verifica se o ID do produto na resposta é o mesmo solicitado
  assert.equal(response.body.id, idProduto);

  // Verifica se os dados retornados correspondem aos do produto criado
  assert.equal(response.body.nome, PRODUTO1.nome);
  assert.equal(response.body.descricao, PRODUTO1.descricao);
  assert.equal(response.body.categoria, PRODUTO1.categoria);
  assert.equal(response.body.valor, PRODUTO1.valor);
});

Then('uma exceção informando que o id não foi encontrado deve ser lançada', async () => {
  // Verifica o status da resposta
  assert.equal(response.status, HttpStatus.BAD_REQUEST);

  // Verifica a mensagem de erro retornada
  assert.equal(response.body.message, 'Produto não encontrado.');
});
