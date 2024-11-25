import { Test, TestingModule } from '@nestjs/testing';
import { ListarProdutoController } from './listar-produto-controller';
import { ListarProdutoUseCase } from '../../use-cases/listar-produto-use-case';
import { ProdutoGateway } from '../gateways/produto-gateway';
import { ProdutoDTO } from '../../dto/produtoDTO';
import { Produto } from 'src/core/entities/produto';

describe('ListarProdutoController', () => {
  let listarProdutoController: ListarProdutoController;
  let listarProdutoUseCase: ListarProdutoUseCase;

  beforeEach(async () => {
    // Mock do ProdutoGateway
    const mockProdutoGateway = {};

    // Mock do ListarProdutoUseCase
    const mockListarProdutoUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListarProdutoController,
        { provide: ProdutoGateway, useValue: mockProdutoGateway },
        { provide: ListarProdutoUseCase, useValue: mockListarProdutoUseCase },
      ],
    }).compile();

    listarProdutoController = module.get<ListarProdutoController>(ListarProdutoController);
    listarProdutoUseCase = module.get<ListarProdutoUseCase>(ListarProdutoUseCase);
  });

  describe('execute', () => {
    it('Deve retornar uma lista de produtos quando o use case retornar produtos', async () => {
      const produtosMock: ProdutoDTO[] = [
        {
          id: 'produto-id-1',
          nome: 'X-Salada',
          descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
          categoria: 'LANCHE',
          valor: 25,
        },
        {
          id: 'produto-id-2',
          nome: 'X-Bacon',
          descricao: 'Pão brioche, hamburger, queijo, bacon e molho especial',
          categoria: 'LANCHE',
          valor: 30,
        },
      ];

      (listarProdutoUseCase.execute as jest.Mock).mockResolvedValue(produtosMock);

      const result = await listarProdutoController.execute();

      expect(listarProdutoUseCase.execute).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual(produtosMock);
    });

    it('Deve retornar uma lista vazia quando o use case retornar uma lista vazia', async () => {
      (listarProdutoUseCase.execute as jest.Mock).mockResolvedValue([]);

      const result = await listarProdutoController.execute();

      expect(listarProdutoUseCase.execute).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual([]);
    });

    it('Deve lançar uma exceção quando o use case lançar um erro', async () => {
      const erro = new Error('Erro ao listar produtos');
      (listarProdutoUseCase.execute as jest.Mock).mockRejectedValue(erro);

      await expect(listarProdutoController.execute()).rejects.toThrow(erro);

      expect(listarProdutoUseCase.execute).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});
