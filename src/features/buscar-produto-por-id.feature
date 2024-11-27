Funcionalidade: Buscar produto por id

Cenário: Consulta de produtos por id com sucesso
  Dado que o id de pesquisa é válido
  Quando solicita o produto pelo id
  Então o produto pesquisado deve ser retornado

Cenário: Consulta de produtos por id inexistente
  Dado que a id de pesquisa não é válido
  Quando solicita o produto pelo id
  Então uma exceção informando que o id não foi encontrado deve ser lançada
