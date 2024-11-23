Funcionalidade: Buscar Cliente por CPF

Cenário: Buscar Cliente cadastrado por CPF
  Dado que seja informado um CPF já cadastrado
  Quando realizado a busca do cliente por CPF
  Então os dados do cliente cadastrado devem ser retornados

Cenário: Buscar Cliente cadastrado por CPF não cadastrado
  Dado que seja informado um CPF não cadastrado
  Quando realizado a busca do cliente por CPF
  Então uma exceção informando que o cliente não foi encontrado deve ser lançada