Funcionalidade: Cadastro de produto

Cenário: Cadastro de produto com sucesso
  Dado que o produto fornece dados válidos
  Quando o produto solicita o cadastro
  Então o produto é cadastrado com sucesso
  E o sistema retorna um ID válido para o produto

Cenário: Cadastro de produto com categoria inválida
  Dado que o produto fornece uma categoria inválida
  Quando o produto solicita o cadastro
  Então uma exceção informando que a categoria é inválida deve ser lançada

Cenário: Cadastro de produto com valor inválido
  Dado que o produto fornece um valor inválido
  Quando o produto solicita o cadastro
  Então uma exceção informando que o valor é inválido deve ser lançada

