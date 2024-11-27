import { Test, TestingModule } from '@nestjs/testing';
import { BuscarProdutoPorCategoriaController } from './buscar-produto-por-categoria-controller'; 
import { BuscarProdutoPorCategoriaUseCase } from '../../use-cases/buscar-produto-por-categoria-use-case'; 
import { ProdutoGateway } from '../gateways/produto-gateway'; 
import { ProdutoDTO } from '../../dto/produtoDTO'; 
import { HttpException, HttpStatus } from '@nestjs/common';

describe('BuscarProdutoPorCategoriaController', () => {
  let buscarProdutoPorCategoriaController: BuscarProdutoPorCategoriaController;
  let produtoGateway: ProdutoGateway;
  let buscarProdutoUseCase: BuscarProdutoPorCategoriaUseCase;

  beforeEach(async () => {
    // Mocks para dependências
    const mockProdutoGateway = {
      buscarProdutoPorCategoria: jest.fn(),
    };

    const mockBuscarProdutoUseCase = {
      execute: jest.fn(),
    };

    // Configuração do módulo de teste
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuscarProdutoPorCategoriaController,
        { provide: ProdutoGateway, useValue: mockProdutoGateway },
        { provide: BuscarProdutoPorCategoriaUseCase, useValue: mockBuscarProdutoUseCase },
      ],
    }).compile();

    buscarProdutoPorCategoriaController = module.get<BuscarProdutoPorCategoriaController>(
      BuscarProdutoPorCategoriaController,
    );
    produtoGateway = module.get<ProdutoGateway>(ProdutoGateway);
    buscarProdutoUseCase = module.get<BuscarProdutoPorCategoriaUseCase>(BuscarProdutoPorCategoriaUseCase);
  });

  it('Deve retornar a lista de produtos para uma categoria válida', async () => {
    const categoriaId = 'LANCHE';
    const produtosMock: ProdutoDTO[] = [
      { id: '1', nome: 'X-Salada', descricao: 'Descrição', categoria: 'LANCHE', valor: 25 },
      { id: '2', nome: 'X-Bacon', descricao: 'Descrição', categoria: 'LANCHE', valor: 30 },
    ];

    // Mock do gateway e do use case
    (produtoGateway.buscarProdutoPorCategoria as jest.Mock).mockResolvedValue(produtosMock);
    (buscarProdutoUseCase.execute as jest.Mock).mockResolvedValue(produtosMock);

    const result = await buscarProdutoPorCategoriaController.execute(categoriaId);

    expect(produtoGateway.buscarProdutoPorCategoria).toHaveBeenCalledWith(categoriaId);
    expect(buscarProdutoUseCase.execute).toHaveBeenCalledWith(produtoGateway, categoriaId);
    expect(result).toEqual(produtosMock);
  });

  it('Deve lançar HttpException se nenhum produto for encontrado', async () => {
    const categoriaId = 'INEXISTENTE';

    // Mock do gateway retornando lista vazia
    (produtoGateway.buscarProdutoPorCategoria as jest.Mock).mockResolvedValue([]);

    await expect(
      buscarProdutoPorCategoriaController.execute(categoriaId),
    ).rejects.toThrow(new HttpException('Categoria não encontrada.', HttpStatus.BAD_REQUEST));

    expect(produtoGateway.buscarProdutoPorCategoria).toHaveBeenCalledWith(categoriaId);
    expect(buscarProdutoUseCase.execute).not.toHaveBeenCalled();
  });

  it('Deve lançar HttpException se a categoria for inválida', async () => {
    const categoriaId = 'INVALIDO';

    // Mock do gateway retornando null
    (produtoGateway.buscarProdutoPorCategoria as jest.Mock).mockResolvedValue(null);

    await expect(
      buscarProdutoPorCategoriaController.execute(categoriaId),
    ).rejects.toThrow(new HttpException('Categoria não encontrada.', HttpStatus.BAD_REQUEST));

    expect(produtoGateway.buscarProdutoPorCategoria).toHaveBeenCalledWith(categoriaId);
    expect(buscarProdutoUseCase.execute).not.toHaveBeenCalled();
  });
});
