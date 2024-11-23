import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoRepository } from './produto-repository'; 
import { Repository } from 'typeorm';
import { ProdutoEntity } from './produto.entity'; 
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriaProdutoType } from '../../dto/categoria-produto-type-enum';

describe('ProdutoRepository', () => {
  let produtoRepository: ProdutoRepository;
  let mockRepository: jest.Mocked<Repository<ProdutoEntity>>;

  beforeEach(async () => {
    // Criando o mock para o repositório TypeORM
    mockRepository = {
      findOneBy: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<ProdutoEntity>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoRepository,
        {
          provide: getRepositoryToken(ProdutoEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    produtoRepository = module.get<ProdutoRepository>(ProdutoRepository);
  });

  describe('buscarProdutoPorID', () => {
    it('Deve chamar o método findOne e retornar o produto correto', async () => {
      const produtoMock: ProdutoEntity = {
        id: 'produto-id',
        nome: 'X-Salada',
        descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
        categoria: 'LANCHE',
        valor: 25,
      };

      mockRepository.findOneBy.mockResolvedValue(produtoMock);

      const result = await produtoRepository.buscarProdutoPorID('produto-id');

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 'produto-id' });
      expect(result).toEqual(produtoMock);
    });

    it('Deve retornar null se o produto não for encontrado', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await produtoRepository.buscarProdutoPorID('produto-inexistente');

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 'produto-inexistente' });
      expect(result).toBeNull();
    });
  });

  describe('buscarProdutoPorCategoria', () => {
    it('Deve chamar o método find e retornar os produtos corretos', async () => {
      const produtosMock: ProdutoEntity[] = [
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

      mockRepository.find.mockResolvedValue(produtosMock);

      const result = await produtoRepository.buscarProdutoPorCategoria('LANCHE');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { categoria: 'LANCHE' },
      });
      expect(result).toEqual(produtosMock);
    });

    it('Deve retornar uma lista vazia se nenhum produto for encontrado', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await produtoRepository.buscarProdutoPorCategoria('BEBIDA');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { categoria: 'BEBIDA' },
      });
      expect(result).toEqual([]);
    });
  });

  describe('salvarProduto', () => {
    it('Deve chamar o método save e retornar o produto salvo', async () => {
      const produtoMock: ProdutoEntity = {
        id: 'produto-id',
        nome: 'X-Salada',
        descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
        categoria: 'LANCHE',
        valor: 25,
      };

      mockRepository.save.mockResolvedValue(produtoMock);

      const result = await produtoRepository.cadastrarProduto(produtoMock);

      expect(mockRepository.save).toHaveBeenCalledWith(produtoMock);
      expect(result).toEqual(produtoMock);
    });
  });
});
