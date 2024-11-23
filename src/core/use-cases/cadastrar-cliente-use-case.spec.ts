import { Test, TestingModule } from '@nestjs/testing';
import { CadastrarClienteUseCase } from './cadastrar-produto-use-case'; // Ajuste o caminho conforme necessário
import { ClienteGateway } from '../adapters/gateways/produto-gateway'; // Ajuste o caminho conforme necessário
import { HttpException, HttpStatus } from '@nestjs/common';
import { ClienteDTO } from '../dto/produtoDTO'; // Ajuste o caminho conforme necessário
import { Cliente } from '../entities/produto'; // Ajuste o caminho conforme necessário

describe('CadastrarClienteUseCase', () => {
  let cadastrarClienteUseCase: CadastrarClienteUseCase;
  let clienteGatewayMock: ClienteGateway;

  beforeEach(async () => {
    // Mockando o ClienteGateway
    clienteGatewayMock = {
      adquirirPorCPF: jest.fn(),
      adquirirPorEmail: jest.fn(),
      salvarCliente: jest.fn(),
    } as any; // Mockando a interface ClienteGateway

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CadastrarClienteUseCase,
        {
          provide: ClienteGateway,
          useValue: clienteGatewayMock,
        },
      ],
    }).compile();

    cadastrarClienteUseCase = module.get<CadastrarClienteUseCase>(
      CadastrarClienteUseCase,
    );
  });

  describe('execute', () => {
    it('Deve lançar uma exceção se o CPF já estiver cadastrado', async () => {
      const clienteDTO: ClienteDTO = {
        nome: 'Cliente Teste',
        email: 'teste@cliente.com',
        cpf: '123.456.789-00',
        id: null,
      };

      // Mockando a resposta do ClienteGateway para indicar que o CPF já está cadastrado
      (clienteGatewayMock.adquirirPorCPF as jest.Mock).mockResolvedValueOnce(
        new Cliente('Cliente Teste', 'teste@cliente.com', '12345678900'),
      );
      (clienteGatewayMock.adquirirPorEmail as jest.Mock).mockResolvedValue(
        null,
      ); // E-mail não está cadastrado

      // Espera-se que a exceção seja lançada
      await expect(
        cadastrarClienteUseCase.execute(clienteGatewayMock, clienteDTO),
      ).rejects.toThrowError(
        new HttpException('CPF já cadastrado.', HttpStatus.BAD_REQUEST),
      );
    });

    it('Deve lançar uma exceção se o e-mail já estiver cadastrado', async () => {
      const clienteDTO: ClienteDTO = {
        nome: 'Cliente Teste',
        email: 'teste@cliente.com',
        cpf: '123.456.789-00',
        id: null,
      };

      // Mockando a resposta do ClienteGateway para indicar que o CPF não está cadastrado, mas o e-mail já está
      (clienteGatewayMock.adquirirPorCPF as jest.Mock).mockResolvedValue(null); // CPF não está cadastrado
      (clienteGatewayMock.adquirirPorEmail as jest.Mock).mockResolvedValueOnce(
        new Cliente('Cliente Teste', 'teste@cliente.com', '12345678900'),
      );

      // Espera-se que a exceção seja lançada
      await expect(
        cadastrarClienteUseCase.execute(clienteGatewayMock, clienteDTO),
      ).rejects.toThrowError(
        new HttpException('E-mail já cadastrado.', HttpStatus.BAD_REQUEST),
      );
    });

    it('Deve salvar o cliente se CPF e e-mail não estiverem cadastrados', async () => {
      const clienteDTO: ClienteDTO = {
        nome: 'Cliente Teste',
        email: 'teste@cliente.com',
        cpf: '123.456.789-00',
        id: null,
      };

      const clienteMock = new Cliente(
        'Cliente Teste',
        'teste@cliente.com',
        '12345678900',
      );

      // Mockando as respostas do ClienteGateway
      (clienteGatewayMock.adquirirPorCPF as jest.Mock).mockResolvedValue(null); // CPF não está cadastrado
      (clienteGatewayMock.adquirirPorEmail as jest.Mock).mockResolvedValue(
        null,
      ); // E-mail não está cadastrado
      (clienteGatewayMock.salvarCliente as jest.Mock).mockResolvedValue(
        clienteMock,
      ); // Salva o cliente

      const result = await cadastrarClienteUseCase.execute(
        clienteGatewayMock,
        clienteDTO,
      );

      // Verificando se o método salvarCliente foi chamado com o cliente correto
      expect(clienteGatewayMock.salvarCliente).toHaveBeenCalledWith(
        clienteMock,
      );

      // Verificando se o cliente retornado é o esperado
      expect(result).toEqual(clienteMock);
    });
  });
});
