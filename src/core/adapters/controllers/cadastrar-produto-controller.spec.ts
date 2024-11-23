import { Test, TestingModule } from '@nestjs/testing';
import { CadastrarProdutoController } from './cadastrar-produto-controller';
import { CadastrarProdutoUseCase } from '../../use-cases/cadastrar-produto-use-case';
import { ProdutoGateway } from '../gateways/produto-gateway';
import { ProdutoDTO } from '../../dto/produtoDTO';
import { Produto } from '../../entities/produto'; // Certifique-se de ajustar o caminho conforme necessário

describe('CadastrarProdutoController', () => {
  let cadastrarProdutoController: CadastrarProdutoController;
  let cadastrarProdutoUseCase: CadastrarProdutoUseCase;
  let produtoGateway: ProdutoGateway;

  beforeEach(async () => {
    // Mock do CadastrarProdutoUseCase
    const mockCadastrarProdutoUseCase = {
      execute: jest.fn(), // Mock do método execute
    };

    const mockProdutoGateway = {};

    // Criando o módulo de teste e injetando as dependências mockadas
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CadastrarProdutoController,
        {
          provide: CadastrarProdutoUseCase,
          useValue: mockCadastrarProdutoUseCase,
        },
        { provide: ProdutoGateway, useValue: mockProdutoGateway },
      ],
    }).compile();

    // Instanciando os mocks
    cadastrarProdutoController = module.get<CadastrarProdutoController>(CadastrarProdutoController);
    cadastrarProdutoUseCase = module.get<CadastrarProdutoUseCase>(CadastrarProdutoUseCase);
    produtoGateway = module.get<ProdutoGateway>(ProdutoGateway);
  });

  describe('execute', () => {
    it('Deve chamar o CadastrarProdutoUseCase e retornar o ProdutoDTO correto', async () => {
      // Preparando os dados de entrada e o resultado esperado
      const produtoDTO: ProdutoDTO = {
        nome: 'X-Salada',
        descricao: 'Pão brioche, hamburger, queijo, alface e tomate',
        categoria: 'Lanches',
        valor: 25,
        id: null, // ID será gerado posteriormente
      };

      const produtoCadastrado: Produto = new Produto(
        produtoDTO.nome,
        produtoDTO.descricao,
        produtoDTO.categoria,
        produtoDTO.valor,
      );
      produtoCadastrado.id = 'produto-id'; // Simulando um ID gerado pelo sistema

      // Mockando o retorno do CadastrarProdutoUseCase
      (cadastrarProdutoUseCase.execute as jest.Mock).mockResolvedValue(produtoCadastrado);

      // Chamando o método execute do controller
      const result = await cadastrarProdutoController.execute(produtoDTO);

      // Verificando se o método execute foi chamado corretamente
      expect(cadastrarProdutoUseCase.execute).toHaveBeenCalledWith(
        produtoGateway,
        produtoDTO,
      );

      // Verificando se o resultado do método execute do controller é o esperado
      const expectedProdutoDTO: ProdutoDTO = {
        ...produtoCadastrado,
      };
      expect(result).toEqual(expectedProdutoDTO);
    });
  });
});
