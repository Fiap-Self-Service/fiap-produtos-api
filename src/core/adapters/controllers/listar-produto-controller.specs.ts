import { Test, TestingModule } from '@nestjs/testing';
import { ListarProdutoController } from './listar-produto-controller';
import { ListarProdutoUseCase } from '../../use-cases/listar-produto-use-case';
import { ProdutoGateway } from '../gateways/produto-gateway';
import { ProdutoDTO } from '../../dto/produtoDTO';

describe('ListarProdutoController', () => {
  let listarProdutoController: ListarProdutoController;
  let listarProdutoUseCase: ListarProdutoUseCase;
  let produtoGateway: ProdutoGateway;

  beforeEach(async () => {
    // Criando mocks para as dependências
    const mockListarProdutoUseCase = {
      execute: jest.fn(), // Mock do método execute
    };

    const mockProdutoGateway = {}; 

    // Criando o módulo de teste e injetando as dependências mockadas
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListarProdutoController,
        {
          provide: ListarProdutoUseCase,
          useValue: mockListarProdutoUseCase,
        },
        { provide: ProdutoGateway, useValue: mockProdutoGateway },
      ],
    }).compile();

    // Obtendo a instância do controller
    listarProdutoController = module.get<ListarProdutoController>(ListarProdutoController);
    listarProdutoUseCase = module.get<ListarProdutoUseCase>(ListarProdutoUseCase);
    produtoGateway = module.get<ProdutoGateway>(ProdutoGateway);
  });

  describe('execute', () => {
    it('Deve chamar o ListarProdutoUseCase e retornar o ProdutoDTO correto', async () => {
      // Preparando os dados de entrada e o resultado esperado
      const produtoDTO: ProdutoDTO = {
        nome: 'X-Salada',
        descricao: 'Pao brioche, hamburger, queijo, alface e tomate',
        categoria: 'Lanches',
        valor: 25,
        id: 'produto-id',
      };

      // Mockando o retorno do ListarProdutoUseCase
      (listarProdutoUseCase.execute as jest.Mock).mockResolvedValue(produtoDTO);

      // Chamando o método execute do controller
      const result = await listarProdutoController.execute();

      // Verificando se o método execute foi chamado corretamente
      expect(listarProdutoUseCase.execute).toHaveBeenCalledWith(
        produtoGateway
      );

      // Verificando se o resultado do método execute do controller é o esperado
      expect(result).toEqual(produtoDTO);
    });
  });
});