import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoAPIController } from './produto-api.controller'; 
import { CadastrarProdutoController } from '../../adapters/controllers/cadastrar-produto-controller'; 
import { BuscarProdutoPorCategoriaController } from '../../adapters/controllers/buscar-produto-por-categoria-controller'; 
import { ListarProdutoController } from '../../adapters/controllers/listar-produto-controller'; 
import { EditarProdutoController } from '../../adapters/controllers/editar-produto-controller'; 
import { DeletarProdutoController } from '../../adapters/controllers/deletar-produto-controller'; 
import { ProdutoDTO } from '../../dto/produtoDTO'; 
import { CategoriaProdutoType } from '../../dto/categoria-produto-type-enum'; 
import { ConsultarProdutoPorIDController } from '../../adapters/controllers/consultar-produto-id-controller';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ProdutoAPIController', () => {
  let produtoAPIController: ProdutoAPIController;
  let cadastrarProdutoController: CadastrarProdutoController;
  let buscarProdutoPorCategoriaController: BuscarProdutoPorCategoriaController;
  let listarProdutoController: ListarProdutoController;
  let editarProdutoController: EditarProdutoController;
  let deletarProdutoController: DeletarProdutoController;
  let consultarProdutoPorIDController: ConsultarProdutoPorIDController;

  beforeEach(async () => {
    // Criando mocks para os controladores
    const mockCadastrarProdutoController = { execute: jest.fn() };
    const mockBuscarProdutoPorCategoriaController = { execute: jest.fn() };
    const mockListarProdutoController = { execute: jest.fn() };
    const mockEditarProdutoController = { execute: jest.fn() };
    const mockDeletarProdutoController = { execute: jest.fn() };
    const mockConsultarProdutoPorIDController = { execute: jest.fn() };

    // Criando o módulo de teste e injetando os mocks
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoAPIController],
      providers: [
        { provide: CadastrarProdutoController, useValue: mockCadastrarProdutoController },
        { provide: BuscarProdutoPorCategoriaController, useValue: mockBuscarProdutoPorCategoriaController },
        { provide: ListarProdutoController, useValue: mockListarProdutoController },
        { provide: EditarProdutoController, useValue: mockEditarProdutoController },
        { provide: DeletarProdutoController, useValue: mockDeletarProdutoController },
        { provide: ConsultarProdutoPorIDController, useValue: mockConsultarProdutoPorIDController },
      ],
    }).compile();

    produtoAPIController = module.get<ProdutoAPIController>(ProdutoAPIController);
    cadastrarProdutoController = module.get<CadastrarProdutoController>(CadastrarProdutoController);
    buscarProdutoPorCategoriaController = module.get<BuscarProdutoPorCategoriaController>(BuscarProdutoPorCategoriaController);
    listarProdutoController = module.get<ListarProdutoController>(ListarProdutoController);
    editarProdutoController = module.get<EditarProdutoController>(EditarProdutoController);
    deletarProdutoController = module.get<DeletarProdutoController>(DeletarProdutoController);
    consultarProdutoPorIDController = module.get<ConsultarProdutoPorIDController>(ConsultarProdutoPorIDController);
  });

  describe('cadastarProduto', () => {
    it('Deve chamar o CadastrarProdutoController e retornar o ProdutoDTO', async () => {
      const produtoDTO: ProdutoDTO = {
        id: null,
        nome: 'X-Salada',
        descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
        categoria: CategoriaProdutoType.LANCHE,
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
        { id: '1', nome: 'X-Salada', descricao: 'Descrição', categoria: CategoriaProdutoType.LANCHE, valor: 25 },
        { id: '2', nome: 'X-Bacon', descricao: 'Descrição', categoria: CategoriaProdutoType.LANCHE, valor: 30 },
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
        { id: '1', nome: 'X-Salada', descricao: 'Descrição', categoria: CategoriaProdutoType.LANCHE, valor: 25 },
      ];

      (buscarProdutoPorCategoriaController.execute as jest.Mock).mockResolvedValue(produtosMock);

      const categoria: CategoriaProdutoType = CategoriaProdutoType.LANCHE;
      const result = await produtoAPIController.buscarProdutoPorCategoria(categoria);

      expect(buscarProdutoPorCategoriaController.execute).toHaveBeenCalledWith(categoria);
      expect(result).toEqual(produtosMock);
    });
  });

  describe('buscarProdutoPorID', () => {
    it('Deve chamar o ConsultarProdutoPorIDController e retornar o Produto encontrado', async () => {
      const produtoMock = {
        id: '1',
        nome: 'X-Salada',
        descricao: 'Descrição atualizada',
        categoria: CategoriaProdutoType.LANCHE,
        valor: 30,
      };

      (consultarProdutoPorIDController.execute as jest.Mock).mockResolvedValue(produtoMock);

      const id = '1';
      const result = await produtoAPIController.buscarProdutoPorID(id);

      expect(consultarProdutoPorIDController.execute).toHaveBeenCalledWith(id);
      expect(result).toEqual(produtoMock);
    });
  });

  describe('editarProduto', () => {
    it('Deve chamar o EditarProdutoController e retornar o ProdutoDTO atualizado', async () => {
      const produtoDTO: ProdutoDTO = {
        id: '1',
        nome: 'X-Salada Atualizado',
        descricao: 'Descrição atualizada',
        categoria: CategoriaProdutoType.LANCHE,
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
  
    it('Deve lançar exceção para dados inválidos', async () => {
      const produtoDTO: ProdutoDTO = {
        id: '1',
        nome: '',
        descricao: 'Descrição inválida',
        categoria: CategoriaProdutoType.LANCHE,
        valor: 30,
      };
  
      await expect(
        produtoAPIController.editarProduto('1', produtoDTO),
      ).rejects.toThrow(new HttpException('Dados inválidos.', HttpStatus.BAD_REQUEST));
    });
  
    it('Deve lançar exceção para valor inválido', async () => {
      const produtoDTO: ProdutoDTO = {
        id: '1',
        nome: 'X-Salada',
        descricao: 'Descrição válida',
        categoria: CategoriaProdutoType.LANCHE,
        valor: -10, // Valor inválido
      };
  
      await expect(
        produtoAPIController.editarProduto('1', produtoDTO),
      ).rejects.toThrow(new HttpException('Valor inválido.', HttpStatus.BAD_REQUEST));
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
