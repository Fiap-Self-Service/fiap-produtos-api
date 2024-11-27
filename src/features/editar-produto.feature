Funcionalidade: Editar produto

Cenário: Editar um produto com sucesso
  Dado que o produto fornece um ID válido e dados atualizados
  Quando o produto solicita a edição
  Então o produto é atualizado com sucesso
  E os dados atualizados são retornados

Cenário: Editar um produto com ID inexistente
  Dado que o produto fornece um ID inexistente
  Quando o produto solicita a edição
  Então uma exceção informando que o produto não foi encontrado deve ser lançada

Cenário: Editar um produto com dados inválidos
  Dado que o produto fornece um ID válido
  E os dados fornecidos são inválidos
  Quando o produto solicita a edição
  Então uma exceção informando que os dados são inválidos deve ser lançada
