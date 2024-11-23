import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoGateway } from './produto-gateway'; // Ajuste o caminho conforme necessário
import { IProdutoRepository } from '../../external/repository/produto-repository.interface'; // Ajuste o caminho conforme necessário
import { Produto } from '../../entities/produto'; // Ajuste o caminho conforme necessário

describe('ProdutoGateway', () => {
  let produtoGateway: ProdutoGateway;
  let produtoRepository: IProdutoRepository;

  beforeEach(async () => {
    // Criando o mock do repositório
    const mockProdutoRepository = {
      adquirirPorID: jest.fn(),
      adquirirPorCategoria: jest.fn(),
      salvarProduto: jest.fn(),
    };

    // Criando o módulo de teste e injetando as dependências mockadas
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoGateway,
        { provide: IProdutoRepository, useValue: mockProdutoRepository },
      ],
    }).compile();

    // Obtendo as instâncias do gateway e do repositório
    produtoGateway = module.get<ProdutoGateway>(ProdutoGateway);
    produtoRepository = module.get<IProdutoRepository>(IProdutoRepository);
  });

  describe('buscarProdutoPorID', () => {
    it('Deve chamar o método buscarProdutoPorID do repositório e retornar o produto', async () => {
      const produtoMock: Produto = {
        id: 'produto-id',
        nome: 'X-Salada',
        descricao: 'Pao brioche, hamburger, queijo, alface e tomate',
        categoria: 'Lanches',
        valor: 25,
      };

      // Mockando o comportamento do repositório
      (produtoRepository.buscarProdutoPorID as jest.Mock).mockResolvedValue(
        produtoMock,
      );

      const result = await produtoGateway.buscarProdutoPorID('produto-id');

      // Verificando se o método foi chamado corretamente
      expect(produtoRepository.buscarProdutoPorID).toHaveBeenCalledWith(
        'produto-id',
      );

      // Verificando se o resultado é o esperado
      expect(result).toEqual(produtoMock);
    });
  });

  describe('buscarProdutoPorCategoria', () => {
    it('Deve chamar o método buscarProdutoPorCategoria do repositório e retornar o produto', async () => {
      const produtoMock: Produto = {
        id: 'produto-id',
        nome: 'X-Salada',
        descricao: 'Pao brioche, hamburger, queijo, alface e tomate',
        categoria: 'Lanches',
        valor: 25,
      };

      // Mockando o comportamento do repositório
      (produtoRepository.buscarProdutoPorCategoria as jest.Mock).mockResolvedValue(
        produtoMock,
      );

      const result = await produtoGateway.buscarProdutoPorCategoria('Lanches');

      // Verificando se o método foi chamado corretamente
      expect(produtoRepository.buscarProdutoPorCategoria).toHaveBeenCalledWith(
        'Lanches',
      );

      // Verificando se o resultado é o esperado
      expect(result).toEqual(produtoMock);
    });
  });

  describe('cadastrarProduto', () => {
    it('Deve chamar o método cadastrarProduto do repositório e retornar o produto salvo', async () => {
      const produtoMock: Produto = {
        id: 'produto-id',
        nome: 'X-Salada',
        descricao: 'Pao brioche, hamburger, queijo, alface e tomate',
        categoria: 'Lanches',
        valor: 25,
      };

      // Mockando o comportamento do repositório
      (produtoRepository.cadastrarProduto as jest.Mock).mockResolvedValue(
        produtoMock,
      );

      const result = await produtoGateway.cadastrarProduto(produtoMock);

      // Verificando se o método foi chamado corretamente
      expect(produtoRepository.cadastrarProduto).toHaveBeenCalledWith(produtoMock);

      // Verificando se o resultado é o esperado
      expect(result).toEqual(produtoMock);
    });
  });
});
