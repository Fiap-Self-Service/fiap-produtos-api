import { BuscarProdutoPorCategoriaUseCase } from './buscar-produto-por-categoria-use-case';
import { ProdutoGateway } from '../adapters/gateways/produto-gateway';
import { Produto } from '../entities/produto';

describe('BuscarProdutoPorCategoriaUseCase', () => {
  let buscarProdutoPorCategoriaUseCase: BuscarProdutoPorCategoriaUseCase;
  let produtoGateway: jest.Mocked<ProdutoGateway>;

  beforeEach(() => {
    // Mock do ProdutoGateway
    produtoGateway = {
      buscarProdutoPorCategoria: jest.fn(),
    } as unknown as jest.Mocked<ProdutoGateway>;

    buscarProdutoPorCategoriaUseCase = new BuscarProdutoPorCategoriaUseCase();
  });

  describe('execute', () => {
    it('Deve retornar uma lista de produtos quando o gateway retornar produtos', async () => {
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

      produtoGateway.buscarProdutoPorCategoria.mockResolvedValue(produtosMock);

      const result = await buscarProdutoPorCategoriaUseCase.execute(produtoGateway, 'LANCHE');

      expect(produtoGateway.buscarProdutoPorCategoria).toHaveBeenCalledWith('LANCHE');
      expect(result).toEqual(produtosMock);
    });

    it('Deve retornar uma lista vazia quando o gateway retornar uma lista vazia', async () => {
      produtoGateway.buscarProdutoPorCategoria.mockResolvedValue([]);

      const result = await buscarProdutoPorCategoriaUseCase.execute(produtoGateway, 'BEBIDA');

      expect(produtoGateway.buscarProdutoPorCategoria).toHaveBeenCalledWith('BEBIDA');
      expect(result).toEqual([]);
    });

    it('Deve lançar uma exceção quando o gateway lançar um erro', async () => {
      const erro = new Error('Erro ao buscar produtos por categoria');
      produtoGateway.buscarProdutoPorCategoria.mockRejectedValue(erro);

      await expect(buscarProdutoPorCategoriaUseCase.execute(produtoGateway, 'LANCHE')).rejects.toThrow(erro);

      expect(produtoGateway.buscarProdutoPorCategoria).toHaveBeenCalledWith('LANCHE');
    });
  });
});
