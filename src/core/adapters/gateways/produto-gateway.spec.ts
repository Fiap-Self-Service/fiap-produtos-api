import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoGateway } from './produto-gateway'; 
import { IProdutoRepository } from '../../external/repository/produto-repository.interface'; 
import { Produto } from '../../entities/produto'; 

describe('ProdutoGateway', () => {
  let produtoGateway: ProdutoGateway;
  let produtoRepository: jest.Mocked<IProdutoRepository>;

  beforeEach(async () => {
    // Mock do ProdutoRepository
    produtoRepository = {
      buscarProdutoPorID: jest.fn(),
      listarProdutos: jest.fn(),
      cadastrarProduto: jest.fn(),
      editarProduto: jest.fn(),
      deletarProduto: jest.fn(),
      buscarProdutoPorCategoria: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoGateway,
        { provide: IProdutoRepository, useValue: produtoRepository },
      ],
    }).compile();

    produtoGateway = module.get<ProdutoGateway>(ProdutoGateway);
  });

  describe('buscarProdutoPorID', () => {
    it('Deve chamar o método buscarProdutoPorID do repositório e retornar o produto', async () => {
      const produtoMock: Produto = {
        id: 'produto-id',
        nome: 'X-Salada',
        descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
        categoria: 'LANCHE',
        valor: 25,
      };

      produtoRepository.buscarProdutoPorID.mockResolvedValue(produtoMock);

      const result = await produtoGateway.buscarProdutoPorID('produto-id');

      expect(produtoRepository.buscarProdutoPorID).toHaveBeenCalledWith('produto-id');
      expect(result).toEqual(produtoMock);
    });
  });

  describe('listarProdutos', () => {
    it('Deve chamar o método listarProdutos do repositório e retornar os produtos', async () => {
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

      produtoRepository.listarProdutos.mockResolvedValue(produtosMock);

      const result = await produtoGateway.listarProdutos();

      expect(produtoRepository.listarProdutos).toHaveBeenCalled();
      expect(result).toEqual(produtosMock);
    });
  });

  describe('cadastrarProduto', () => {
    it('Deve chamar o método cadastrarProduto do repositório e retornar o produto cadastrado', async () => {
      const produtoMock: Produto = {
        id: 'produto-id',
        nome: 'X-Salada',
        descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
        categoria: 'LANCHE',
        valor: 25,
      };

      produtoRepository.cadastrarProduto.mockResolvedValue(produtoMock);

      const result = await produtoGateway.cadastrarProduto(produtoMock);

      expect(produtoRepository.cadastrarProduto).toHaveBeenCalledWith(produtoMock);
      expect(result).toEqual(produtoMock);
    });
  });

  describe('editarProduto', () => {
    it('Deve chamar o método editarProduto do repositório e retornar o produto editado', async () => {
      const produtoMock: Produto = {
        id: 'produto-id',
        nome: 'X-Salada Atualizado',
        descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
        categoria: 'LANCHE',
        valor: 30,
      };

      produtoRepository.editarProduto.mockResolvedValue(produtoMock);

      const result = await produtoGateway.editarProduto(produtoMock);

      expect(produtoRepository.editarProduto).toHaveBeenCalledWith(produtoMock);
      expect(result).toEqual(produtoMock);
    });
  });

  describe('deletarProduto', () => {
    it('Deve chamar o método deletarProduto do repositório', async () => {
      produtoRepository.deletarProduto.mockResolvedValue(undefined);

      await produtoGateway.deletarProduto('produto-id');

      expect(produtoRepository.deletarProduto).toHaveBeenCalledWith('produto-id');
    });
  });

  describe('buscarProdutoPorCategoria', () => {
    it('Deve chamar o método buscarProdutoPorCategoria do repositório e retornar os produtos', async () => {
      const produtosMock: Produto[] = [
        {
          id: 'produto-id-1',
          nome: 'X-Salada',
          descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
          categoria: 'LANCHE',
          valor: 25,
        },
      ];

      produtoRepository.buscarProdutoPorCategoria.mockResolvedValue(produtosMock);

      const result = await produtoGateway.buscarProdutoPorCategoria('LANCHE');

      expect(produtoRepository.buscarProdutoPorCategoria).toHaveBeenCalledWith('LANCHE');
      expect(result).toEqual(produtosMock);
    });
  });
});
