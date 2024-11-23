import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoAPIController } from './produto-api.controller'; 
import { CadastrarProdutoController } from '../../adapters/controllers/cadastrar-produto-controller'; 
import { BuscarProdutoPorCategoriaController } from '../../adapters/controllers/buscar-produto-por-categoria-controller'; 
import { ListarProdutoController } from '../../adapters/controllers/listar-produto-controller'; 
import { EditarProdutoController } from '../../adapters/controllers/editar-produto-controller'; 
import { DeletarProdutoController } from '../../adapters/controllers/deletar-produto-controller'; 
import { ProdutoDTO } from '../../dto/produtoDTO'; 
import { CategoriaProdutoType } from '../../dto/categoria-produto-type-enum'; 

describe('ProdutoAPIController', () => {
  let produtoAPIController: ProdutoAPIController;
  let cadastrarProdutoController: CadastrarProdutoController;
  let buscarProdutoPorCategoriaController: BuscarProdutoPorCategoriaController;
  let listarProdutoController: ListarProdutoController;
  let editarProdutoController: EditarProdutoController;
  let deletarProdutoController: DeletarProdutoController;

  beforeEach(async () => {
    // Criando mocks para os controladores
    const mockCadastrarProdutoController = {
      execute: jest.fn(),
    };
    const mockBuscarProdutoPorCategoriaController = {
      execute: jest.fn(),
    };
    const mockListarProdutoController = {
      execute: jest.fn(),
    };
    const mockEditarProdutoController = {
      execute: jest.fn(),
    };
    const mockDeletarProdutoController = {
      execute: jest.fn(),
    };

    // Criando o módulo de teste e injetando os mocks
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoAPIController],
      providers: [
        { provide: CadastrarProdutoController, useValue: mockCadastrarProdutoController },
        { provide: BuscarProdutoPorCategoriaController, useValue: mockBuscarProdutoPorCategoriaController },
        { provide: ListarProdutoController, useValue: mockListarProdutoController },
        { provide: EditarProdutoController, useValue: mockEditarProdutoController },
        { provide: DeletarProdutoController, useValue: mockDeletarProdutoController },
      ],
    }).compile();

    produtoAPIController = module.get<ProdutoAPIController>(ProdutoAPIController);
    cadastrarProdutoController = module.get<CadastrarProdutoController>(CadastrarProdutoController);
    buscarProdutoPorCategoriaController = module.get<BuscarProdutoPorCategoriaController>(BuscarProdutoPorCategoriaController);
    listarProdutoController = module.get<ListarProdutoController>(ListarProdutoController);
    editarProdutoController = module.get<EditarProdutoController>(EditarProdutoController);
    deletarProdutoController = module.get<DeletarProdutoController>(DeletarProdutoController);
  });

  describe('cadastarProduto', () => {
    it('Deve chamar o CadastrarProdutoController e retornar o ProdutoDTO', async () => {
      const produtoDTO: ProdutoDTO = {
        id: null,
        nome: 'X-Salada',
        descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
        categoria: 'Lanches',
        valor: 25,
      };

      (cadastrarProdutoController.execute as jest.Mock).mockResolvedValue(produtoDTO);

      const result = await produtoAPIController.cadastarProduto(produtoDTO);

      expect(cadastrarProdutoController.execute).toHaveBeenCalledWith(produtoDTO);
      expect(result).toEqual(produtoDTO);
    });
  });

  describe('listarProdutos', () => {
    it('Deve chamar o ListarProdutoController e retornar a lista de produtos', async () => {
      const produtosMock: ProdutoDTO[] = [
        { id: '1', nome: 'X-Salada', descricao: 'Descrição', categoria: 'Lanches', valor: 25 },
        { id: '2', nome: 'X-Bacon', descricao: 'Descrição', categoria: 'Lanches', valor: 30 },
      ];

      (listarProdutoController.execute as jest.Mock).mockResolvedValue(produtosMock);

      const result = await produtoAPIController.listarProdutos();

      expect(listarProdutoController.execute).toHaveBeenCalled();
      expect(result).toEqual(produtosMock);
    });
  });

  describe('buscarProdutoPorCategoria', () => {
    it('Deve chamar o BuscarProdutoPorCategoriaController e retornar a lista de produtos', async () => {
      const produtosMock: ProdutoDTO[] = [
        { id: '1', nome: 'X-Salada', descricao: 'Descrição', categoria: "LANCHE", valor: 25 },
      ];

      (buscarProdutoPorCategoriaController.execute as jest.Mock).mockResolvedValue(produtosMock);

      const categoria: CategoriaProdutoType = CategoriaProdutoType.LANCHE;
      const result = await produtoAPIController.buscarProdutoPorCategoria(categoria);

      expect(buscarProdutoPorCategoriaController.execute).toHaveBeenCalledWith(categoria);
      expect(result).toEqual(produtosMock);
    });
  });

  describe('editarProduto', () => {
    it('Deve chamar o EditarProdutoController e retornar o ProdutoDTO atualizado', async () => {
      const produtoDTO: ProdutoDTO = {
        id: '1',
        nome: 'X-Salada',
        descricao: 'Descrição atualizada',
        categoria: "LANCHE",
        valor: 30,
      };

      (editarProdutoController.execute as jest.Mock).mockResolvedValue(produtoDTO);

      const result = await produtoAPIController.editarProduto('1', produtoDTO);

      expect(editarProdutoController.execute).toHaveBeenCalledWith({
        id: '1',
        ...produtoDTO,
      });
      expect(result).toEqual(produtoDTO);
    });
  });

  describe('deletarProduto', () => {
    it('Deve chamar o DeletarProdutoController e não retornar nenhum valor', async () => {
      (deletarProdutoController.execute as jest.Mock).mockResolvedValue(undefined);

      const id = '1';
      const result = await produtoAPIController.deletarProduto(id);

      expect(deletarProdutoController.execute).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });
});
