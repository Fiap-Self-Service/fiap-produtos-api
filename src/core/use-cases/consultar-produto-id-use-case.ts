import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Produto } from '../entities/produto';
import { ProdutoGateway } from '../adapters/gateways/produto-gateway';

@Injectable()
export class ConsultarProdutoPorIDUseCase {
  async execute(produtoGateway: ProdutoGateway, id: string): Promise<Produto> {
    // verifica se esse CPF já foi cadastrado
    const produto = await produtoGateway.buscarProdutoPorID(id);

    if (!produto) {
      throw new HttpException(
        'Produto não encontrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return produto;
  }
}