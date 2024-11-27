import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ProdutoGateway } from "../adapters/gateways/produto-gateway";
import { ProdutoDTO } from "../dto/produtoDTO";
import { Produto } from "../entities/produto";
import { CategoriaProdutoType } from "../dto/categoria-produto-type-enum";

@Injectable()
export class CadastrarProdutoUseCase {
  async execute(produtoGateway: ProdutoGateway, produtoDTO: ProdutoDTO): Promise<Produto> {

    // Verifica se a categoria é válida
    if (!Object.values(CategoriaProdutoType).includes(produtoDTO.categoria as CategoriaProdutoType)) {
      throw new HttpException('Categoria inválida.', HttpStatus.BAD_REQUEST);
    }

    // Verifica se o valor a ser cadastrado é válido
    if (produtoDTO.valor <= 0) {
      throw new HttpException('Valor inválido.', HttpStatus.BAD_REQUEST);
    }

    const produto = new Produto(produtoDTO.nome, produtoDTO.descricao, produtoDTO.categoria, produtoDTO.valor);

    return await produtoGateway.cadastrarProduto(produto);
  }
}