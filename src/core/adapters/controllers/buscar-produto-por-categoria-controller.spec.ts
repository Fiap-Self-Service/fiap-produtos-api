import { Test, TestingModule } from '@nestjs/testing';
import { BuscarProdutoPorCategoriaController } from './buscar-produto-por-categoria-controller'; 
import { BuscarProdutoPorCategoriaUseCase } from '../../use-cases/buscar-produto-por-categoria-use-case'; 
import { ProdutoGateway } from '../gateways/produto-gateway'; 
import { ProdutoDTO } from '../../dto/produtoDTO'; 
import { HttpException, HttpStatus } from '@nestjs/common';
import { CategoriaProdutoType } from '../../dto/categoria-produto-type-enum';

describe('BuscarProdutoPorCategoriaController', () => {
  let controller: BuscarProdutoPorCategoriaController;
  let produtoGateway: ProdutoGateway;
  let buscarProdutoUseCase: BuscarProdutoPorCategoriaUseCase;

  beforeEach(async () => {
    const mockProdutoGateway = {
      buscarProdutoPorCategoria: jest.fn(),
    };

    const mockBuscarProdutoUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuscarProdutoPorCategoriaController,
        {
          provide: ProdutoGateway,
          useValue: mockProdutoGateway,
        },
        {
          provide: BuscarProdutoPorCategoriaUseCase,
          useValue: mockBuscarProdutoUseCase,
        },
      ],
    }).compile();

    controller = module.get<BuscarProdutoPorCategoriaController>(
      BuscarProdutoPorCategoriaController,
    );
    produtoGateway = module.get<ProdutoGateway>(ProdutoGateway);
    buscarProdutoUseCase = module.get<BuscarProdutoPorCategoriaUseCase>(
      BuscarProdutoPorCategoriaUseCase,
    );
  });

  it('Deve retornar os produtos da categoria pesquisada com sucesso', async () => {
    const categoriaId = CategoriaProdutoType.LANCHE;
    const produtosMock: ProdutoDTO[] = [
      { id: '1', nome: 'X-Salada', descricao: 'Descrição', categoria: 'LANCHE', valor: 25 },
    ];

    jest
      .spyOn(produtoGateway, 'buscarProdutoPorCategoria')
      .mockResolvedValue(produtosMock);
    jest
      .spyOn(buscarProdutoUseCase, 'execute')
      .mockResolvedValue(produtosMock);

    const result = await controller.execute(categoriaId);

    expect(produtoGateway.buscarProdutoPorCategoria).toHaveBeenCalledWith(categoriaId);
    expect(buscarProdutoUseCase.execute).toHaveBeenCalledWith(produtoGateway, categoriaId);
    expect(result).toEqual(produtosMock);
  });

  it('Deve lançar uma exceção se a categoria não for válida', async () => {
    const categoriaId = 'INVALIDA';

    await expect(controller.execute(categoriaId)).rejects.toThrow(
      new HttpException('Categoria não encontrada.', HttpStatus.BAD_REQUEST),
    );
  });

  it('Deve retornar uma lista vazia se não houver produtos na categoria', async () => {
    const categoriaId = CategoriaProdutoType.BEBIDA;

    jest
      .spyOn(produtoGateway, 'buscarProdutoPorCategoria')
      .mockResolvedValue([]);

    const result = await controller.execute(categoriaId);

    expect(produtoGateway.buscarProdutoPorCategoria).toHaveBeenCalledWith(categoriaId);
    expect(result).toEqual([]);
  });
});
