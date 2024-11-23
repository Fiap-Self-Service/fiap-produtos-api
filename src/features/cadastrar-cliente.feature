Funcionalidade: Cadastro de cliente

Cenário: Cadastro de cliente com sucesso
  Dado que cliente fornece um nome, email e CPF válidos
  Quando o cliente solicita o cadastro
  Então o cliente é cadastrado com sucesso
  E o sistema retorna um ID válido

Cenário: Cadastro de cliente com CPF já cadastrado
  Dado que cliente fornece um CPF já cadastrado
  Quando o cliente solicita o cadastro
  Então uma exceção informando que o CPF já existe deve ser lançada

Cenário: Cadastro de cliente com e-mail já cadastrado
  Dado que cliente fornece um e-mail já cadastrado
  Quando o cliente solicita o cadastro
  Então uma exceção informando que o e-mail já existe deve ser lançada

Cenário: Cadastro de cliente com CPF inválido
  Dado que cliente fornece um CPF inválido
  Quando o cliente solicita o cadastro
  Então uma exceção informando que o CPF é inválido deve ser lançada

Cenário: Cadastro de cliente com e-mail inválido
  Dado que cliente fornece um e-mail inválido
  Quando o cliente solicita o cadastro
  Então uma exceção informando que o e-mail é inválido deve ser lançada

Cenário: Cadastro de cliente com nome inválido
  Dado que cliente fornece um nome inválido
  Quando o cliente solicita o cadastro
  Então uma exceção informando que o nome é inválido deve ser lançada
