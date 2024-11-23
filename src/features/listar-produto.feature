Funcionalidade: Listar produtos

Cenário: Listar todos os produtos com sucesso
  Dado que existem produtos cadastrados no sistema
  Quando o produto solicita a listagem de todos os produtos
  Então todos os produtos cadastrados devem ser retornados

Cenário: Listar produtos com o sistema vazio
  Dado que não existem produtos cadastrados no sistema
  Quando o produto solicita a listagem de todos os produtos
  Então uma lista vazia deve ser retornada
