import { Test, TestingModule } from '@nestjs/testing';
import { EditarProdutoUseCase } from './editar-produto-use-case'; 
import { ProdutoGateway } from '../../core/adapters/gateways/produto-gateway'; 
import { ProdutoDTO } from '../../core/dto/produtoDTO'; 
import { Produto } from '../../core/entities/produto'; 
import { HttpException, HttpStatus } from '@nestjs/common';

describe('EditarProdutoUseCase', () => {
  let editarProdutoUseCase: EditarProdutoUseCase;
  let produtoGateway: ProdutoGateway;

  beforeEach(async () => {
    // Mock do ProdutoGateway
    const mockProdutoGateway = {
      buscarProdutoPorID: jest.fn(),
      editarProduto: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EditarProdutoUseCase,
        { provide: ProdutoGateway, useValue: mockProdutoGateway },
      ],
    }).compile();

    editarProdutoUseCase = module.get<EditarProdutoUseCase>(EditarProdutoUseCase);
    produtoGateway = module.get<ProdutoGateway>(ProdutoGateway);
  });

  describe('execute', () => {
    it('Deve editar o produto quando um ID válido e dados atualizados forem fornecidos', async () => {
      const produtoDTO: ProdutoDTO = {
        id: 'produto-id',
        nome: 'X-Salada Atualizado',
        descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
        categoria: 'LANCHE',
        valor: 30,
      };

      const produtoAtualizado: Produto = {
        ...produtoDTO,
      };

      // Mockando o comportamento de buscarProdutoPorID e editarProduto
      (produtoGateway.buscarProdutoPorID as jest.Mock).mockResolvedValue(produtoAtualizado);
      (produtoGateway.editarProduto as jest.Mock).mockResolvedValue(produtoAtualizado);

      const result = await editarProdutoUseCase.execute(produtoGateway, produtoDTO);

      // Verificando se buscarProdutoPorID foi chamado corretamente
      expect(produtoGateway.buscarProdutoPorID).toHaveBeenCalledWith(produtoDTO.id);

      // Verificando se editarProduto foi chamado corretamente
      expect(produtoGateway.editarProduto).toHaveBeenCalledWith(produtoDTO);

      // Verificando se o resultado é o esperado
      expect(result).toEqual(produtoAtualizado);
    });

    it('Deve lançar uma HttpException quando o produto não for encontrado', async () => {
      const produtoDTO: ProdutoDTO = {
        id: 'produto-invalido',
        nome: 'Produto Não Existente',
        descricao: 'Descrição',
        categoria: 'LANCHE',
        valor: 25,
      };

      // Mockando o comportamento de buscarProdutoPorID para retornar null
      (produtoGateway.buscarProdutoPorID as jest.Mock).mockResolvedValue(null);

      // Chamando o método e verificando se lança a exceção esperada
      await expect(editarProdutoUseCase.execute(produtoGateway, produtoDTO)).rejects.toThrow(
        new HttpException('Produto não cadastrado.', HttpStatus.BAD_REQUEST),
      );

      // Verificando se buscarProdutoPorID foi chamado corretamente
      expect(produtoGateway.buscarProdutoPorID).toHaveBeenCalledWith(produtoDTO.id);

      // Verificando que editarProduto não foi chamado
      expect(produtoGateway.editarProduto).not.toHaveBeenCalled();
    });

    it('Deve lançar uma HttpException quando o ID do produto não for fornecido', async () => {
      const produtoDTO: ProdutoDTO = {
        id: '',
        nome: 'Produto Sem ID',
        descricao: 'Descrição',
        categoria: 'LANCHE',
        valor: 25,
      };

      // Chamando o método e verificando se lança a exceção esperada
      await expect(editarProdutoUseCase.execute(produtoGateway, produtoDTO)).rejects.toThrow(
        new HttpException('Produto não cadastrado.', HttpStatus.BAD_REQUEST),
      );

      // Verificando que buscarProdutoPorID e editarProduto não foram chamados
      expect(produtoGateway.buscarProdutoPorID).not.toHaveBeenCalled();
      expect(produtoGateway.editarProduto).not.toHaveBeenCalled();
    });
  });
});
