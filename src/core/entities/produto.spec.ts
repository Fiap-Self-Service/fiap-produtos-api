import { HttpException, HttpStatus } from '@nestjs/common';
import { Produto } from './produto'; 

describe('Produto', () => {
  describe('Constructor', () => {
    it('Deve criar um produto com sucesso quando os parâmetros forem válidos', () => {
      const produto = new Produto(
        'X-Salada',
        'Pão brioche, hamburger, queijo, alface e tomate',
        'LANCHE',
        25,
      );

      expect(produto.nome).toBe('X-Salada');
      expect(produto.descricao).toBe('Pão brioche, hamburger, queijo, alface e tomate');
      expect(produto.categoria).toBe('LANCHE');
      expect(produto.valor).toBe(25);
    });

    it('Deve lançar exceção quando o nome for nulo', () => {
      expect(() => {
        new Produto(null, 'Descrição válida', 'LANCHE', 25);
      }).toThrow(new HttpException('Nome inválido', HttpStatus.BAD_REQUEST));
    });

    it('Deve lançar exceção quando o nome for muito curto', () => {
      expect(() => {
        new Produto('X', 'Descrição válida', 'LANCHE', 25);
      }).toThrow(new HttpException('Nome inválido', HttpStatus.BAD_REQUEST));
    });

    it('Deve lançar exceção quando o nome for muito longo', () => {
      expect(() => {
        new Produto('X'.repeat(251), 'Descrição válida', 'LANCHE', 25);
      }).toThrow(new HttpException('Nome inválido', HttpStatus.BAD_REQUEST));
    });

    it('Deve lançar exceção quando a descrição for nula', () => {
      expect(() => {
        new Produto('X-Salada', null, 'LANCHE', 25);
      }).toThrow(new HttpException('descrição inválida', HttpStatus.BAD_REQUEST));
    });

    it('Deve lançar exceção quando a descrição for muito curta', () => {
      expect(() => {
        new Produto('X-Salada', 'X', 'LANCHE', 25);
      }).toThrow(new HttpException('descrição inválida', HttpStatus.BAD_REQUEST));
    });

    it('Deve lançar exceção quando a descrição for muito longa', () => {
      expect(() => {
        new Produto('X-Salada', 'X'.repeat(251), 'LANCHE', 25);
      }).toThrow(new HttpException('descrição inválida', HttpStatus.BAD_REQUEST));
    });

    it('Deve lançar exceção quando a categoria for nula', () => {
      expect(() => {
        new Produto('X-Salada', 'Descrição válida', null, 25);
      }).toThrow(new HttpException('Categoria inválida', HttpStatus.BAD_REQUEST));
    });
  });
});
