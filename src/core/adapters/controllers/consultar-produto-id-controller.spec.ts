import { Test, TestingModule } from '@nestjs/testing';
import { ConsultarProdutoPorIDController } from './consultar-produto-id-controller';
import { ProdutoGateway } from '../gateways/produto-gateway';
import { ConsultarProdutoPorIDUseCase } from '../../use-cases/consultar-produto-id-use-case';
import { ProdutoDTO } from '../../dto/produtoDTO';

describe('ConsultarProdutoPorIDController', () => {
  let consultarProdutoPorIDController: ConsultarProdutoPorIDController;
  let produtoGateway: ProdutoGateway;
  let consultarProdutoPorIDUseCase: ConsultarProdutoPorIDUseCase;

  beforeEach(async () => {
    // Mocks para dependências
    const mockProdutoGateway = {};
    const mockConsultarProdutoPorIDUseCase = {
      execute: jest.fn(),
    };

    // Configuração do módulo de teste
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultarProdutoPorIDController,
        { provide: ProdutoGateway, useValue: mockProdutoGateway },
        {
          provide: ConsultarProdutoPorIDUseCase,
          useValue: mockConsultarProdutoPorIDUseCase,
        },
      ],
    }).compile();

    consultarProdutoPorIDController = module.get<ConsultarProdutoPorIDController>(
      ConsultarProdutoPorIDController,
    );
    produtoGateway = module.get<ProdutoGateway>(ProdutoGateway);
    consultarProdutoPorIDUseCase = module.get<ConsultarProdutoPorIDUseCase>(
      ConsultarProdutoPorIDUseCase,
    );
  });

  it('Deve retornar o ProdutoDTO para um ID válido', async () => {
    const produtoMock: ProdutoDTO = {
      id: '1',
      nome: 'X-Salada',
      descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
      categoria: 'LANCHE',
      valor: 25,
    };

    // Mock do use case
    (consultarProdutoPorIDUseCase.execute as jest.Mock).mockResolvedValue(produtoMock);

    const id = '1';
    const result = await consultarProdutoPorIDController.execute(id);

    expect(consultarProdutoPorIDUseCase.execute).toHaveBeenCalledWith(produtoGateway, id);
    expect(result).toEqual(produtoMock);
  });

  it('Deve lançar uma exceção para um ID inexistente', async () => {
    const id = 'inexistente';

    // Mock do use case lançando erro
    (consultarProdutoPorIDUseCase.execute as jest.Mock).mockRejectedValue(
      new Error('Produto não encontrado.'),
    );

    await expect(consultarProdutoPorIDController.execute(id)).rejects.toThrow(
      'Produto não encontrado.',
    );

    expect(consultarProdutoPorIDUseCase.execute).toHaveBeenCalledWith(produtoGateway, id);
  });
});
