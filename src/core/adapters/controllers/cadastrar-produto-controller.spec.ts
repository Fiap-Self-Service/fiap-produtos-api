import { Test, TestingModule } from '@nestjs/testing';
import { CadastrarProdutoController } from './cadastrar-produto-controller'; // Ajuste o caminho conforme necessário
import { CadastrarProdutoUseCase } from '../../use-cases/cadastrar-produto-use-case'; // Ajuste o caminho conforme necessário
import { ProdutoGateway } from '../gateways/produto-gateway'; // Ajuste o caminho conforme necessário
import { ProdutoDTO } from '../../dto/produtoDTO'; // Ajuste o caminho conforme necessário

describe('CadastrarProdutoController', () => {
  let cadastrarProdutoController: CadastrarProdutoController;
  let cadastrarProdutoUseCase: CadastrarProdutoUseCase;
  let produtoGateway: ProdutoGateway;

  beforeEach(async () => {
    // Criando mocks para as dependências
    const mockCadastrarProdutoUseCase = {
      execute: jest.fn(), // Mock do método execute
    };

    const mockProdutoGateway = {};

    // Criando o módulo de teste e injetando as dependências mockadas
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CadastrarProdutoController,
        {
          provide: CadastrarProdutoUseCase,
          useValue: mockCadastrarProdutoUseCase,
        },
        { provide: ProdutoGateway, useValue: mockProdutoGateway },
      ],
    }).compile();

    // Obtendo a instância do controller
    cadastrarProdutoController = module.get<CadastrarProdutoController>(
      CadastrarProdutoController,
    );
    cadastrarProdutoUseCase = module.get<CadastrarProdutoUseCase>(
      CadastrarProdutoUseCase,
    );
    produtoGateway = module.get<ProdutoGateway>(ProdutoGateway);
  });

  describe('execute', () => {
    it('Deve chamar o CadastrarProdutoUseCase e retornar o ProdutoDTO correto', async () => {
      // Preparando os dados de entrada e o resultado esperado
      const produtoDTO: ProdutoDTO = {
        nome: 'Produto Teste',
        email: 'produto@teste.com',
        cpf: '12345678900',
        id: null, // Inicialmente, sem ID
      };

      const produtoResult: ProdutoDTO = {
        nome: 'Produto Teste',
        email: 'produto@teste.com',
        cpf: '12345678900',
        id: 'novo-id-gerado', // ID gerado após o cadastro
      };

      // Mockando o retorno do CadastrarProdutoUseCase
      (cadastrarProdutoUseCase.execute as jest.Mock).mockResolvedValue(
        produtoResult,
      );

      // Chamar o método execute do controller
      const result = await cadastrarProdutoController.execute(produtoDTO);

      // Verificando se o método execute foi chamado corretamente
      expect(cadastrarProdutoUseCase.execute).toHaveBeenCalledWith(
        produtoGateway,
        produtoDTO,
      );

      // Verificando se o resultado do método execute do controller é o esperado
      expect(result).toEqual(produtoResult);
    });
  });
});