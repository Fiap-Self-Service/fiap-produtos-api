import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoRepository } from './produto-repository'; 
import { Repository } from 'typeorm';
import { ProdutoEntity } from './produto.entity'; 
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';

describe('ProdutoRepository', () => {
  let produtoRepository: ProdutoRepository;
  let mockRepository: jest.Mocked<Repository<ProdutoEntity>>;

  beforeEach(async () => {
    // Mock do repositório TypeORM
    mockRepository = {
      findOneBy: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<ProdutoEntity>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoRepository,
        { provide: getRepositoryToken(ProdutoEntity), useValue: mockRepository },
      ],
    }).compile();

    produtoRepository = module.get<ProdutoRepository>(ProdutoRepository);
  });

  describe('buscarProdutoPorID', () => {
    it('Deve retornar o produto quando um ID válido for fornecido', async () => {
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

  describe('listarProdutos', () => {
    it('Deve retornar todos os produtos cadastrados', async () => {
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

      const result = await produtoRepository.listarProdutos();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(produtosMock);
    });

    it('Deve retornar uma lista vazia se não houver produtos cadastrados', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await produtoRepository.listarProdutos();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('cadastrarProduto', () => {
    it('Deve salvar o produto e retorná-lo', async () => {
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

  describe('editarProduto', () => {
    it('Deve editar o produto e retorná-lo', async () => {
      const produtoMock: ProdutoEntity = {
        id: 'produto-id',
        nome: 'X-Salada Atualizado',
        descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
        categoria: 'LANCHE',
        valor: 30,
      };

      mockRepository.save.mockResolvedValue(produtoMock);

      const result = await produtoRepository.editarProduto(produtoMock);

      expect(mockRepository.save).toHaveBeenCalledWith(produtoMock);
      expect(result).toEqual(produtoMock);
    });
  });

  describe('deletarProduto', () => {
    it('Deve deletar o produto quando um ID válido for fornecido', async () => {
      const deleteResult: DeleteResult = {
        raw: {},
        affected: 1,
      };

      mockRepository.delete.mockResolvedValue(deleteResult);

      await produtoRepository.deletarProduto('produto-id');

      expect(mockRepository.delete).toHaveBeenCalledWith('produto-id');
    });

    it('Não deve lançar erro mesmo se nenhum produto for deletado', async () => {
      const deleteResult: DeleteResult = {
        raw: {},
        affected: 0,
      };

      mockRepository.delete.mockResolvedValue(deleteResult);

      await produtoRepository.deletarProduto('produto-inexistente');

      expect(mockRepository.delete).toHaveBeenCalledWith('produto-inexistente');
    });
  });

  describe('buscarProdutoPorCategoria', () => {
    it('Deve retornar os produtos da categoria especificada', async () => {
      const produtosMock: ProdutoEntity[] = [
        {
          id: 'produto-id-1',
          nome: 'X-Salada',
          descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
          categoria: 'LANCHE',
          valor: 25,
        },
      ];

      mockRepository.find.mockResolvedValue(produtosMock);

      const result = await produtoRepository.buscarProdutoPorCategoria('LANCHE');

      expect(mockRepository.find).toHaveBeenCalledWith({ where: { categoria: 'LANCHE' } });
      expect(result).toEqual(produtosMock);
    });

    it('Deve retornar uma lista vazia se nenhum produto for encontrado para a categoria', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await produtoRepository.buscarProdutoPorCategoria('BEBIDA');

      expect(mockRepository.find).toHaveBeenCalledWith({ where: { categoria: 'BEBIDA' } });
      expect(result).toEqual([]);
    });
  });
});
