import { Injectable } from "@nestjs/common";
import { ProdutoGateway } from "../adapters/gateways/produto-gateway";
import { Produto } from "../entities/produto";

@Injectable()
export class BuscarProdutoPorCategoriaUseCase {
  
  async execute(produtoGateway: ProdutoGateway, categoriaId: string): Promise<Produto[]> {
    const produtos =  await produtoGateway.buscarProdutoPorCategoria(categoriaId);
    return produtos || [];
  }
}