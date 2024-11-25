import { Test, TestingModule } from '@nestjs/testing';
import { EditarProdutoController } from './editar-produto-controller';
import { EditarProdutoUseCase } from '../../use-cases/editar-produto-use-case';
import { ProdutoGateway } from '../gateways/produto-gateway';
import { ProdutoDTO } from '../../dto/produtoDTO';

describe('EditarProdutoController', () => {
  let editarProdutoController: EditarProdutoController;
  let editarProdutoUseCase: EditarProdutoUseCase;
  let produtoGateway: ProdutoGateway;

  beforeEach(async () => {
    // Mock do EditarProdutoUseCase
    const mockEditarProdutoUseCase = {
      execute: jest.fn(), // Mock do método execute
    };

    // Mock do ProdutoGateway (não necessário comportamento específico aqui)
    const mockProdutoGateway = {};

    // Criando o módulo de teste e injetando as dependências mockadas
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EditarProdutoController,
        {
          provide: EditarProdutoUseCase,
          useValue: mockEditarProdutoUseCase,
        },
        { provide: ProdutoGateway, useValue: mockProdutoGateway },
      ],
    }).compile();

    // Instanciando os mocks
    editarProdutoController = module.get<EditarProdutoController>(EditarProdutoController);
    editarProdutoUseCase = module.get<EditarProdutoUseCase>(EditarProdutoUseCase);
    produtoGateway = module.get<ProdutoGateway>(ProdutoGateway);
  });

  describe('execute', () => {
    it('Deve chamar o EditarProdutoUseCase e retornar o ProdutoDTO correto', async () => {
      // Preparando os dados de entrada e o resultado esperado
      const produtoDTO: ProdutoDTO = {
        nome: 'X-Salada',
        descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
        categoria: 'Lanches',
        valor: 25,
        id: 'produto-id',
      };

      // Mockando o retorno do EditarProdutoUseCase
      (editarProdutoUseCase.execute as jest.Mock).mockResolvedValue(produtoDTO);

      // Chamando o método execute do controller
      const result = await editarProdutoController.execute(produtoDTO);

      // Verificando se o método execute foi chamado corretamente
      expect(editarProdutoUseCase.execute).toHaveBeenCalledWith(
        produtoGateway,
        produtoDTO,
      );

      // Verificando se o resultado do método execute do controller é o esperado
      expect(result).toEqual(produtoDTO);
    });
  });
});
