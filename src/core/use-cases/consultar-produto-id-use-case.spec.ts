import { Test, TestingModule } from '@nestjs/testing';
import { ConsultarProdutoPorIDUseCase } from './consultar-produto-id-use-case';
import { ProdutoGateway } from '../adapters/gateways/produto-gateway';
import { Produto } from '../entities/produto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ConsultarProdutoPorIDUseCase', () => {
  let consultarProdutoPorIDUseCase: ConsultarProdutoPorIDUseCase;
  let produtoGateway: ProdutoGateway;

  beforeEach(async () => {
    // Mock para dependências
    const mockProdutoGateway = {
      buscarProdutoPorID: jest.fn(),
    };

    // Configuração do módulo de teste
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultarProdutoPorIDUseCase,
        { provide: ProdutoGateway, useValue: mockProdutoGateway },
      ],
    }).compile();

    consultarProdutoPorIDUseCase = module.get<ConsultarProdutoPorIDUseCase>(
      ConsultarProdutoPorIDUseCase,
    );
    produtoGateway = module.get<ProdutoGateway>(ProdutoGateway);
  });

  it('Deve retornar o produto quando o ID for válido', async () => {
    const produtoMock: Produto = {
      id: '1',
      nome: 'X-Salada',
      descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
      categoria: 'LANCHE',
      valor: 25,
    };

    // Mock do gateway retornando produto
    (produtoGateway.buscarProdutoPorID as jest.Mock).mockResolvedValue(produtoMock);

    const id = '1';
    const result = await consultarProdutoPorIDUseCase.execute(produtoGateway, id);

    expect(produtoGateway.buscarProdutoPorID).toHaveBeenCalledWith(id);
    expect(result).toEqual(produtoMock);
  });

  it('Deve lançar HttpException se o produto não for encontrado', async () => {
    const id = 'inexistente';

    // Mock do gateway retornando null
    (produtoGateway.buscarProdutoPorID as jest.Mock).mockResolvedValue(null);

    await expect(
      consultarProdutoPorIDUseCase.execute(produtoGateway, id),
    ).rejects.toThrow(
      new HttpException('Produto não encontrado.', HttpStatus.BAD_REQUEST),
    );

    expect(produtoGateway.buscarProdutoPorID).toHaveBeenCalledWith(id);
  });

  it('Deve lançar HttpException se o ID for inválido', async () => {
    const id = '';

    // Mock do gateway retornando null
    (produtoGateway.buscarProdutoPorID as jest.Mock).mockResolvedValue(null);

    await expect(
      consultarProdutoPorIDUseCase.execute(produtoGateway, id),
    ).rejects.toThrow(
      new HttpException('Produto não encontrado.', HttpStatus.BAD_REQUEST),
    );

    expect(produtoGateway.buscarProdutoPorID).toHaveBeenCalledWith(id);
  });
});
