import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProdutoDTO } from '../../dto/produtoDTO';
import { ProdutoGateway } from '../gateways/produto-gateway';
import { BuscarProdutoPorCategoriaUseCase } from '../../use-cases/buscar-produto-por-categoria-use-case';

@Injectable()
export class BuscarProdutoPorCategoriaController {

  constructor(
    private readonly produtoGateway: ProdutoGateway,
    private readonly buscarProdutoUseCase: BuscarProdutoPorCategoriaUseCase
  ) {}

  async execute(categoriaId: string): Promise<ProdutoDTO[]> {
    const produtos = await this.produtoGateway.buscarProdutoPorCategoria(categoriaId);

    if (!produtos || produtos.length === 0) {
      
      return [];
    }

    return await this.buscarProdutoUseCase.execute(this.produtoGateway, categoriaId);

  }
}