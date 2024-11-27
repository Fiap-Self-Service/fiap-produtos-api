Funcionalidade: Deletar produto

Cenário: Deletar um produto com sucesso
  Dado que o produto fornece um ID válido
  Quando o produto solicita a exclusão
  Então o produto é excluído com sucesso

Cenário: Deletar um produto com ID inexistente
  Dado que o produto fornece um ID inexistente
  Quando o produto solicita a exclusão
  Então uma exceção informando que o produto não foi encontrado deve ser lançada
