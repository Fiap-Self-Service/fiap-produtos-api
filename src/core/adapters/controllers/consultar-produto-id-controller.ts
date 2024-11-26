import { Injectable } from '@nestjs/common';
import { ProdutoGateway } from '../gateways/produto-gateway';
import { ConsultarProdutoPorIDUseCase } from '../../use-cases/consultar-produto-id-use-case';
import { ProdutoDTO } from '../../dto/produtoDTO';

@Injectable()
export class ConsultarProdutoPorIDController {
  constructor(
    private readonly produtoGateway: ProdutoGateway,
    private readonly consultarProdutoPorIDUseCase: ConsultarProdutoPorIDUseCase,
  ) {}

  async execute(cpf: string): Promise<ProdutoDTO> {
    const produto = await this.consultarProdutoPorIDUseCase.execute(
      this.produtoGateway,
      cpf,
    );
    const adapterPresenter: ProdutoDTO = { ...produto };

    return adapterPresenter;
  }
}