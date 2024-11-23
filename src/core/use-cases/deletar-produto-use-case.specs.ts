import { Test, TestingModule } from '@nestjs/testing';
import { DeletarProdutoUseCase } from './deletar-produto-use-case'; 
import { ProdutoGateway } from '../../core/adapters/gateways/produto-gateway'; 
import { HttpException, HttpStatus } from '@nestjs/common';
import { Produto } from '../../core/entities/produto'; 

describe('DeletarProdutoUseCase', () => {
  let deletarProdutoUseCase: DeletarProdutoUseCase;
  let produtoGateway: ProdutoGateway;

  beforeEach(async () => {
    // Mock do ProdutoGateway
    const mockProdutoGateway = {
      buscarProdutoPorID: jest.fn(),
      deletarProduto: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeletarProdutoUseCase,
        { provide: ProdutoGateway, useValue: mockProdutoGateway },
      ],
    }).compile();

    deletarProdutoUseCase = module.get<DeletarProdutoUseCase>(DeletarProdutoUseCase);
    produtoGateway = module.get<ProdutoGateway>(ProdutoGateway);
  });

  describe('execute', () => {
    it('Deve deletar o produto quando um ID válido é fornecido', async () => {
      const produtoMock: Produto = {
        id: 'produto-id',
        nome: 'X-Salada',
        descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
        categoria: 'LANCHE',
        valor: 25,
      };

      // Mockando o comportamento do buscarProdutoPorID e deletarProduto
      (produtoGateway.buscarProdutoPorID as jest.Mock).mockResolvedValue(produtoMock);
      (produtoGateway.deletarProduto as jest.Mock).mockResolvedValue(undefined);

      const id = 'produto-id';

      // Chamando o método execute do use case
      await deletarProdutoUseCase.execute(produtoGateway, id);

      // Verificando se buscarProdutoPorID foi chamado corretamente
      expect(produtoGateway.buscarProdutoPorID).toHaveBeenCalledWith(id);

      // Verificando se deletarProduto foi chamado corretamente
      expect(produtoGateway.deletarProduto).toHaveBeenCalledWith(id);
    });

    it('Deve lançar uma HttpException quando o produto não for encontrado', async () => {
      // Mockando o comportamento do buscarProdutoPorID para retornar null
      (produtoGateway.buscarProdutoPorID as jest.Mock).mockResolvedValue(null);

      const id = 'produto-invalido';

      // Chamando o método e verificando se lança a exceção esperada
      await expect(deletarProdutoUseCase.execute(produtoGateway, id)).rejects.toThrow(
        new HttpException('Produto não cadastrado.', HttpStatus.BAD_REQUEST),
      );

      // Verificando se buscarProdutoPorID foi chamado corretamente
      expect(produtoGateway.buscarProdutoPorID).toHaveBeenCalledWith(id);

      // Verificando que deletarProduto não foi chamado
      expect(produtoGateway.deletarProduto).not.toHaveBeenCalled();
    });

    it('Deve lançar uma HttpException quando o ID não é fornecido', async () => {
      const id = ''; // ID vazio

      // Chamando o método e verificando se lança a exceção esperada
      await expect(deletarProdutoUseCase.execute(produtoGateway, id)).rejects.toThrow(
        new HttpException('Produto não cadastrado.', HttpStatus.BAD_REQUEST),
      );

      // Verificando que buscarProdutoPorID e deletarProduto não foram chamados
      expect(produtoGateway.buscarProdutoPorID).not.toHaveBeenCalled();
      expect(produtoGateway.deletarProduto).not.toHaveBeenCalled();
    });
  });
});
