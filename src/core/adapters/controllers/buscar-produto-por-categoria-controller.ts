import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProdutoDTO } from '../../dto/produtoDTO';
import { ProdutoGateway } from '../gateways/produto-gateway';
import { BuscarProdutoPorCategoriaUseCase } from '../../use-cases/buscar-produto-por-categoria-use-case';
import { CategoriaProdutoType } from '../../dto/categoria-produto-type-enum';

@Injectable()
export class BuscarProdutoPorCategoriaController {

  constructor(
    private readonly produtoGateway: ProdutoGateway,
    private readonly buscarProdutoUseCase: BuscarProdutoPorCategoriaUseCase
  ) {}

  async execute(categoriaId: string): Promise<ProdutoDTO[]> {

    if (!Object.values(CategoriaProdutoType).includes(categoriaId as CategoriaProdutoType)) {
      throw new HttpException('Categoria não encontrada.', HttpStatus.BAD_REQUEST);
    }

    const produtos = await this.produtoGateway.buscarProdutoPorCategoria(categoriaId);

    if (!produtos || produtos.length === 0) {
      
      return [];
    }

    return await this.buscarProdutoUseCase.execute(this.produtoGateway, categoriaId);

  }
}