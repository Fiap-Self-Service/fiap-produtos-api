import { Test, TestingModule } from '@nestjs/testing';
import { ListarProdutoUseCase } from './listar-produto-use-case'; 
import { ProdutoGateway } from '../adapters/gateways/produto-gateway'; 
import { Produto } from '../entities/produto'; 

describe('ListarProdutoUseCase', () => {
  let listarProdutoUseCase: ListarProdutoUseCase;
  let produtoGateway: ProdutoGateway;

  beforeEach(async () => {
    // Mock do ProdutoGateway
    const mockProdutoGateway = {
      listarProdutos: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListarProdutoUseCase,
        { provide: ProdutoGateway, useValue: mockProdutoGateway },
      ],
    }).compile();

    listarProdutoUseCase = module.get<ListarProdutoUseCase>(ListarProdutoUseCase);
    produtoGateway = module.get<ProdutoGateway>(ProdutoGateway);
  });

  describe('execute', () => {
    it('Deve listar os produtos quando houver produtos cadastrados', async () => {
      const produtosMock: Produto[] = [
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

      // Mockando o comportamento do listarProdutos
      (produtoGateway.listarProdutos as jest.Mock).mockResolvedValue(produtosMock);

      const result = await listarProdutoUseCase.execute(produtoGateway);

      // Verificando se listarProdutos foi chamado
      expect(produtoGateway.listarProdutos).toHaveBeenCalled();

      // Verificando se o resultado é o esperado
      expect(result).toEqual(produtosMock);
    });

    it('Deve retornar uma lista vazia quando não houver produtos cadastrados', async () => {
      // Mockando o comportamento do listarProdutos para retornar uma lista vazia
      (produtoGateway.listarProdutos as jest.Mock).mockResolvedValue([]);

      const result = await listarProdutoUseCase.execute(produtoGateway);

      // Verificando se listarProdutos foi chamado
      expect(produtoGateway.listarProdutos).toHaveBeenCalled();

      // Verificando se o resultado é uma lista vazia
      expect(result).toEqual([]);
    });
  });
});
