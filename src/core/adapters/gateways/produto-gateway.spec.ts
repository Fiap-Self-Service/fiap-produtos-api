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
      adquirirPorEmail: jest.fn(),
      adquirirPorCPF: jest.fn(),
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

  describe('adquirirPorID', () => {
    it('Deve chamar o método adquirirPorID do repositório e retornar o produto', async () => {
      const produtoMock: Produto = {
        id: 'produto-id',
        nome: 'Produto Teste',
        email: 'produto@teste.com',
        cpf: '12345678900',
      };

      // Mockando o comportamento do repositório
      (produtoRepository.adquirirPorID as jest.Mock).mockResolvedValue(
        produtoMock,
      );

      const result = await produtoGateway.adquirirPorID('produto-id');

      // Verificando se o método foi chamado corretamente
      expect(produtoRepository.adquirirPorID).toHaveBeenCalledWith(
        'produto-id',
      );

      // Verificando se o resultado é o esperado
      expect(result).toEqual(produtoMock);
    });
  });

  describe('adquirirPorEmail', () => {
    it('Deve chamar o método adquirirPorEmail do repositório e retornar o produto', async () => {
      const produtoMock: Produto = {
        id: 'produto-id',
        nome: 'Produto Teste',
        email: 'produto@teste.com',
        cpf: '12345678900',
      };

      // Mockando o comportamento do repositório
      (produtoRepository.adquirirPorEmail as jest.Mock).mockResolvedValue(
        produtoMock,
      );

      const result = await produtoGateway.adquirirPorEmail('produto@teste.com');

      // Verificando se o método foi chamado corretamente
      expect(produtoRepository.adquirirPorEmail).toHaveBeenCalledWith(
        'produto@teste.com',
      );

      // Verificando se o resultado é o esperado
      expect(result).toEqual(produtoMock);
    });
  });

  describe('adquirirPorCPF', () => {
    it('Deve chamar o método adquirirPorCPF do repositório e retornar o produto', async () => {
      const produtoMock: Produto = {
        id: 'produto-id',
        nome: 'Produto Teste',
        email: 'produto@teste.com',
        cpf: '12345678900',
      };

      // Mockando o comportamento do repositório
      (produtoRepository.adquirirPorCPF as jest.Mock).mockResolvedValue(
        produtoMock,
      );

      const result = await produtoGateway.adquirirPorCPF('12345678900');

      // Verificando se o método foi chamado corretamente
      expect(produtoRepository.adquirirPorCPF).toHaveBeenCalledWith(
        '12345678900',
      );

      // Verificando se o resultado é o esperado
      expect(result).toEqual(produtoMock);
    });
  });

  describe('salvarProduto', () => {
    it('Deve chamar o método salvarProduto do repositório e retornar o produto salvo', async () => {
      const produtoMock: Produto = {
        id: 'produto-id',
        nome: 'Produto Teste',
        email: 'produto@teste.com',
        cpf: '12345678900',
      };

      // Mockando o comportamento do repositório
      (produtoRepository.salvarProduto as jest.Mock).mockResolvedValue(
        produtoMock,
      );

      const result = await produtoGateway.salvarProduto(produtoMock);

      // Verificando se o método foi chamado corretamente
      expect(produtoRepository.salvarProduto).toHaveBeenCalledWith(produtoMock);

      // Verificando se o resultado é o esperado
      expect(result).toEqual(produtoMock);
    });
  });
});
