import { Test, TestingModule } from '@nestjs/testing';
import { DeletarProdutoController } from './deletar-produto-controller';
import { DeletarProdutoUseCase } from '../../use-cases/deletar-produto-use-case';
import { ProdutoGateway } from '../gateways/produto-gateway';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('DeletarProdutoController', () => {
  let deletarProdutoController: DeletarProdutoController;
  let deletarProdutoUseCase: DeletarProdutoUseCase;
  let produtoGateway: ProdutoGateway;

  beforeEach(async () => {
    // Mock do DeletarProdutoUseCase
    const mockDeletarProdutoUseCase = {
      execute: jest.fn(), // Mock do método execute
    };

    // Mock do ProdutoGateway (não necessário comportamento específico aqui)
    const mockProdutoGateway = {};

    // Criando o módulo de teste e injetando as dependências mockadas
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeletarProdutoController,
        {
          provide: DeletarProdutoUseCase,
          useValue: mockDeletarProdutoUseCase,
        },
        { provide: ProdutoGateway, useValue: mockProdutoGateway },
      ],
    }).compile();

    // Instanciando os mocks
    deletarProdutoController = module.get<DeletarProdutoController>(DeletarProdutoController);
    deletarProdutoUseCase = module.get<DeletarProdutoUseCase>(DeletarProdutoUseCase);
    produtoGateway = module.get<ProdutoGateway>(ProdutoGateway);
  });

  describe('execute', () => {
    it('Deve chamar o DeletarProdutoUseCase com o ID correto', async () => {
      // Mock para simular o comportamento do use case
      (deletarProdutoUseCase.execute as jest.Mock).mockResolvedValue(undefined);

      const produtoId = 'produto-id';

      // Chamando o método execute do controller
      await deletarProdutoController.execute(produtoId);

      // Verificando se o método execute foi chamado com os parâmetros corretos
      expect(deletarProdutoUseCase.execute).toHaveBeenCalledWith(
        produtoGateway,
        produtoId,
      );
    });

    it('Deve lançar uma exceção ao tentar deletar um produto não cadastrado', async () => {
      // Mock para simular um erro ao executar o use case
      (deletarProdutoUseCase.execute as jest.Mock).mockImplementation(() => {
        throw new HttpException('Produto não cadastrado.', HttpStatus.BAD_REQUEST);
      });

      const produtoId = 'produto-invalido';

      // Chamando o método execute e verificando se lança a exceção esperada
      await expect(deletarProdutoController.execute(produtoId)).rejects.toThrow(
        HttpException,
      );

      // Verificando se o método execute foi chamado com os parâmetros corretos
      expect(deletarProdutoUseCase.execute).toHaveBeenCalledWith(
        produtoGateway,
        produtoId,
      );
    });
  });
});
