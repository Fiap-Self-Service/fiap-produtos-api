Funcionalidade: Buscar produto por categoria

Cenário: Consulta de produtos por categoria com sucesso
  Dado que a categoria de pesquisa é válida
  Quando o produto solicita a listagem de produtos por categoria
  Então os produtos da categoria pesquisada devem ser retornados

Cenário: Consulta de produtos por categoria inexistente
  Dado que a categoria de pesquisa não é válida
  Quando o produto solicita a listagem de produtos por categoria
  Então uma exceção informando que a categoria não foi encontrada deve ser lançada

Cenário: Consulta de produtos com categoria sem produtos cadastrados
  Dado que a categoria de pesquisa é válida
  E não existem produtos cadastrados para a categoria
  Quando o produto solicita a listagem de produtos por categoria
  Então uma lista vazia deve ser retornada
