import { Test, TestingModule } from '@nestjs/testing';
import { BuscarProdutoPorCategoriaController } from './buscar-produto-por-categoria-controller'; 
import { BuscarProdutoPorCategoriaUseCase } from '../../use-cases/buscar-produto-por-categoria-use-case'; 
import { ProdutoGateway } from '../gateways/produto-gateway'; 
import { ProdutoDTO } from '../../dto/produtoDTO'; 

describe('BuscarProdutoPorCategoriaController', () => {
  let buscarProdutoPorCategoriaController: BuscarProdutoPorCategoriaController;
  let buscarProdutoUseCase: BuscarProdutoPorCategoriaUseCase;

  beforeEach(async () => {
    // Mock do ProdutoGateway
    const mockProdutoGateway = {};

    // Mock do BuscarProdutoPorCategoriaUseCase
    const mockBuscarProdutoUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuscarProdutoPorCategoriaController,
        { provide: ProdutoGateway, useValue: mockProdutoGateway },
        { provide: BuscarProdutoPorCategoriaUseCase, useValue: mockBuscarProdutoUseCase },
      ],
    }).compile();

    buscarProdutoPorCategoriaController = module.get<BuscarProdutoPorCategoriaController>(BuscarProdutoPorCategoriaController);
    buscarProdutoUseCase = module.get<BuscarProdutoPorCategoriaUseCase>(BuscarProdutoPorCategoriaUseCase);
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

      (buscarProdutoUseCase.execute as jest.Mock).mockResolvedValue(produtosMock);

      const result = await buscarProdutoPorCategoriaController.execute('LANCHE');

      expect(buscarProdutoUseCase.execute).toHaveBeenCalledWith(expect.any(Object), 'LANCHE');
      expect(result).toEqual(produtosMock);
    });

    it('Deve retornar uma lista vazia quando o use case retornar uma lista vazia', async () => {
      (buscarProdutoUseCase.execute as jest.Mock).mockResolvedValue([]);

      const result = await buscarProdutoPorCategoriaController.execute('BEBIDA');

      expect(buscarProdutoUseCase.execute).toHaveBeenCalledWith(expect.any(Object), 'BEBIDA');
      expect(result).toEqual([]);
    });

    it('Deve lançar uma exceção quando o use case lançar um erro', async () => {
      const erro = new Error('Erro ao buscar produtos por categoria');
      (buscarProdutoUseCase.execute as jest.Mock).mockRejectedValue(erro);

      await expect(buscarProdutoPorCategoriaController.execute('LANCHE')).rejects.toThrow(erro);

      expect(buscarProdutoUseCase.execute).toHaveBeenCalledWith(expect.any(Object), 'LANCHE');
    });
  });
});
