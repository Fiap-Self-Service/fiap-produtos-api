import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { IProdutoRepository } from "./produto-repository.interface";
import { ProdutoEntity } from "./produto.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

@Injectable()
export class ProdutoRepository implements IProdutoRepository {
  constructor(
    @Inject(getRepositoryToken(ProdutoEntity))
    private produtoRepository: Repository<ProdutoEntity>
  ) {}

  async buscarProdutoPorID(id: string): Promise<ProdutoEntity>  {
    const produtoPorID = await this.produtoRepository.findOneBy({id ,
    });

    return produtoPorID;
  }

  async listarProdutos(): Promise<ProdutoEntity[]>  {
    return await this.produtoRepository.find();
  }

  async cadastrarProduto(produtoEntity: ProdutoEntity): Promise<ProdutoEntity>  {
    return await this.produtoRepository.save(produtoEntity);
  }

  async editarProduto(produtoEntity: ProdutoEntity): Promise<ProdutoEntity>  {
    return await this.produtoRepository.save(produtoEntity);
  }

  async deletarProduto(id: string) {
    await this.produtoRepository.delete(id);
  }

  async buscarProdutoPorCategoria(categoria: string): Promise<ProdutoEntity[]> {
    return await this.produtoRepository.find({ where: { categoria } });
  }
}