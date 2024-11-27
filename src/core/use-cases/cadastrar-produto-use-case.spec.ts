import { Test, TestingModule } from '@nestjs/testing';
import { CadastrarProdutoUseCase } from './cadastrar-produto-use-case'; 
import { ProdutoGateway } from '../adapters/gateways/produto-gateway'; 
import { ProdutoDTO } from '../dto/produtoDTO'; 
import { Produto } from '../entities/produto'; 

describe('CadastrarProdutoUseCase', () => {
  let cadastrarProdutoUseCase: CadastrarProdutoUseCase;
  let produtoGateway: ProdutoGateway;

  beforeEach(async () => {
    // Mock do ProdutoGateway
    const mockProdutoGateway = {
      cadastrarProduto: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CadastrarProdutoUseCase,
        { provide: ProdutoGateway, useValue: mockProdutoGateway },
      ],
    }).compile();

    cadastrarProdutoUseCase = module.get<CadastrarProdutoUseCase>(CadastrarProdutoUseCase);
    produtoGateway = module.get<ProdutoGateway>(ProdutoGateway);
  });

  describe('execute', () => {
    it('Deve chamar o ProdutoGateway.cadastrarProduto e retornar o Produto criado', async () => {
      // Dados de entrada (ProdutoDTO)
      const produtoDTO: ProdutoDTO = {
        nome: 'X-Salada',
        descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
        categoria: 'LANCHE',
        valor: 25,
        id: null, // O ID será gerado no cadastro
      };

      // Produto esperado (após o cadastro)
      const produtoCadastrado: Produto = new Produto(
        produtoDTO.nome,
        produtoDTO.descricao,
        produtoDTO.categoria,
        produtoDTO.valor,
      );
      produtoCadastrado.id = 'produto-id'; // ID gerado pelo sistema

      // Mockando o comportamento do ProdutoGateway
      (produtoGateway.cadastrarProduto as jest.Mock).mockResolvedValue(produtoCadastrado);

      // Chamando o método execute do use case
      const result = await cadastrarProdutoUseCase.execute(produtoGateway, produtoDTO);

      // Verificando se o método cadastrarProduto foi chamado corretamente
      expect(produtoGateway.cadastrarProduto).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: produtoDTO.nome,
          descricao: produtoDTO.descricao,
          categoria: produtoDTO.categoria,
          valor: produtoDTO.valor,
        }),
      );

      // Verificando se o resultado é o esperado
      expect(result).toEqual(produtoCadastrado);
    });
  });
});
