import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoRepository } from './produto-repository'; // Ajuste o caminho conforme necessário
import { Repository } from 'typeorm';
import { ProdutoEntity } from './produto.entity'; // Ajuste o caminho conforme necessário
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProdutoRepository', () => {
  let produtoRepository: ProdutoRepository;
  let mockRepository: Repository<ProdutoEntity>;

  beforeEach(async () => {
    // Criando o mock do repositório TypeORM
    mockRepository = {
      findOneBy: jest.fn(),
      save: jest.fn(),
    } as any; // Usando "as any" para simular a interface do Repository

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProdutoRepository,
          useValue: new ProdutoRepository(mockRepository), // instanciando manualmente a classe, passando mock do banco de dados
        },
        {
          provide: getRepositoryToken(ProdutoEntity), // Para injecionar o mock no lugar do repositório real
          useValue: mockRepository,
        },
      ],
    }).compile();

    produtoRepository = module.get<ProdutoRepository>(ProdutoRepository);
  });

  describe('adquirirPorID', () => {
    it('Deve chamar o método findOneBy e retornar o produto correto', async () => {
      const produtoMock = new ProdutoEntity();
      produtoMock.id = 'produto-id';
      produtoMock.nome = 'Produto Teste';
      produtoMock.email = 'produto@teste.com';
      produtoMock.cpf = '12345678900';

      // Mockando o retorno do método findOneBy
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue(produtoMock);

      const result = await produtoRepository.adquirirPorID('produto-id');

      // Verificando se o método foi chamado com o parâmetro correto
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        id: 'produto-id',
      });

      // Verificando se o resultado é o esperado
      expect(result).toEqual(produtoMock);
    });
  });

  describe('adquirirPorEmail', () => {
    it('Deve chamar o método findOneBy e retornar o produto correto', async () => {
      const produtoMock = new ProdutoEntity();
      produtoMock.id = 'produto-id';
      produtoMock.nome = 'Produto Teste';
      produtoMock.email = 'produto@teste.com';
      produtoMock.cpf = '12345678900';

      // Mockando o retorno do método findOneBy
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue(produtoMock);

      const result =
        await produtoRepository.adquirirPorEmail('produto@teste.com');

      // Verificando se o método foi chamado com o parâmetro correto
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        email: 'produto@teste.com',
      });

      // Verificando se o resultado é o esperado
      expect(result).toEqual(produtoMock);
    });
  });

  describe('adquirirPorCPF', () => {
    it('Deve chamar o método findOneBy e retornar o produto correto', async () => {
      const produtoMock = new ProdutoEntity();
      produtoMock.id = 'produto-id';
      produtoMock.nome = 'Produto Teste';
      produtoMock.email = 'produto@teste.com';
      produtoMock.cpf = '12345678900';

      // Mockando o retorno do método findOneBy
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue(produtoMock);

      const result = await produtoRepository.adquirirPorCPF('12345678900');

      // Verificando se o método foi chamado com o parâmetro correto
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        cpf: '12345678900',
      });

      // Verificando se o resultado é o esperado
      expect(result).toEqual(produtoMock);
    });
  });

  describe('salvarProduto', () => {
    it('Deve chamar o método save e retornar o produto salvo', async () => {
      const produtoMock = new ProdutoEntity();
      produtoMock.id = 'produto-id';
      produtoMock.nome = 'Produto Teste';
      produtoMock.email = 'produto@teste.com';
      produtoMock.cpf = '12345678900';

      // Mockando o retorno do método save
      (mockRepository.save as jest.Mock).mockResolvedValue(produtoMock);

      const result = await produtoRepository.salvarProduto(produtoMock);

      // Verificando se o método foi chamado com o parâmetro correto
      expect(mockRepository.save).toHaveBeenCalledWith(produtoMock);

      // Verificando se o resultado é o esperado
      expect(result).toEqual(produtoMock);
    });
  });
});
