import { Test, TestingModule } from '@nestjs/testing';
import { CadastrarProdutoUseCase } from './cadastrar-produto-use-case'; 
import { ProdutoGateway } from '../adapters/gateways/produto-gateway'; 
import { ProdutoDTO } from '../dto/produtoDTO'; 
import { Produto } from '../entities/produto'; 
import { HttpException } from '@nestjs/common';

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
      const produtoDTO: ProdutoDTO = {
        nome: 'X-Salada',
        descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
        categoria: 'LANCHE',
        valor: 25,
        id: null,
      };

      const produtoCadastrado: Produto = new Produto(
        produtoDTO.nome,
        produtoDTO.descricao,
        produtoDTO.categoria,
        produtoDTO.valor,
      );
      produtoCadastrado.id = 'produto-id';

      (produtoGateway.cadastrarProduto as jest.Mock).mockResolvedValue(produtoCadastrado);

      const result = await cadastrarProdutoUseCase.execute(produtoGateway, produtoDTO);

      expect(produtoGateway.cadastrarProduto).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: produtoDTO.nome,
          descricao: produtoDTO.descricao,
          categoria: produtoDTO.categoria,
          valor: produtoDTO.valor,
        }),
      );

      expect(result).toEqual(produtoCadastrado);
    });

    it('Deve lançar exceção para categoria inválida', async () => {
      const produtoDTO: ProdutoDTO = {
        nome: 'X-Salada',
        descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
        categoria: 'INVALIDA', // Categoria inválida
        valor: 25,
        id: null,
      };

      await expect(cadastrarProdutoUseCase.execute(produtoGateway, produtoDTO))
        .rejects.toThrow(new HttpException('Categoria inválida.', 400));
    });

    it('Deve lançar exceção para valor inválido', async () => {
      const produtoDTO: ProdutoDTO = {
        nome: 'X-Salada',
        descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
        categoria: 'LANCHE',
        valor: -10, // Valor inválido
        id: null,
      };

      await expect(cadastrarProdutoUseCase.execute(produtoGateway, produtoDTO))
        .rejects.toThrow(new HttpException('Valor inválido.', 400));
    });
  });
});
