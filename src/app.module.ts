import { Module } from "@nestjs/common";
import { CadastrarProdutoUseCase } from "./core/use-cases/cadastrar-produto-use-case";
import { ProdutoRepository } from "./core/external/repository/produto-repository";
import { ProdutoGateway } from "./core/adapters/gateways/produto-gateway";
import { BuscarProdutoPorCategoriaUseCase } from "./core/use-cases/buscar-produto-por-categoria-use-case";
import { ListarProdutoUseCase } from "./core/use-cases/listar-produto-use-case";
import { EditarProdutoUseCase } from "./core/use-cases/editar-produto-use-case";
import { DeletarProdutoUseCase } from "./core/use-cases/deletar-produto-use-case";
import { DataSource } from "typeorm";
import { ProdutoEntity } from "./core/external/repository/produto.entity";
import { ProdutoAPIController } from "./core/external/api/produto-api.controller";
import { DatabaseModule } from "src/infrastructure/database/database.module";
import { IProdutoRepository } from "./core/external/repository/produto-repository.interface";
import { CadastrarProdutoController } from "./core/adapters/controllers/cadastrar-produto-controller";
import { BuscarProdutoPorCategoriaController } from "./core/adapters/controllers/buscar-produto-por-categoria-controller";
import { ListarProdutoController } from "./core/adapters/controllers/listar-produto-controller";
import { EditarProdutoController } from "./core/adapters/controllers/editar-produto-controller";
import { DeletarProdutoController } from "./core/adapters/controllers/deletar-produto-controller";

@Module({
  providers: [
    //gateway
    ProdutoGateway,

    // use case
    CadastrarProdutoUseCase,
    BuscarProdutoPorCategoriaUseCase,
    ListarProdutoUseCase,
    EditarProdutoUseCase,
    DeletarProdutoUseCase,

    // controllers
    CadastrarProdutoController,
    BuscarProdutoPorCategoriaController,
    ListarProdutoController,
    EditarProdutoController,
    DeletarProdutoController,

    // external repository
    {
      provide: IProdutoRepository,
      useClass: ProdutoRepository,
    },
    {
      provide: "PRODUTO_REPOSITORY",
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(ProdutoEntity),
      inject: ["DATA_SOURCE"],
    },
  ],
  controllers: [ProdutoAPIController],
  imports: [DatabaseModule],
  exports: [ProdutoGateway]
})
export class AppModule {}
