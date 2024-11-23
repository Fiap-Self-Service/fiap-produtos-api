import { HttpException, HttpStatus } from '@nestjs/common';
import { Produto } from './produto'; // Ajuste o caminho conforme necessário

describe('Produto', () => {
  it('Deve lançar uma exceção se o nome for inválido', () => {
    // Testando nome inválido (menor que 3 caracteres)
    expect(() => new Produto('X', 'Pao brioche, hamburger, queijo, alface e tomate', 'LANCHES', 25)).toThrow(
      new HttpException('Nome inválido', HttpStatus.BAD_REQUEST),
    );

    // Testando nome inválido (maior que 250 caracteres)
    const nomeLongo = 'X'.repeat(251);
    expect(
      () => new Produto(nomeLongo, 'Pao brioche, hamburger, queijo, alface e tomate', 'LANCHES', 25),
    ).toThrow(new HttpException('Nome inválido', HttpStatus.BAD_REQUEST));
  });

  it('Deve criar um produto com dados válidos', () => {
    const produto = new Produto(
      'X-Salada',
      'Pao brioche, hamburger, queijo, alface e tomate',
      'LANCHES', 
      25,
    );

    // Verificando se a instância do produto foi criada corretamente
    expect(produto).toBeInstanceOf(Produto);
    expect(produto.nome).toBe('X-Salada');
    expect(produto.descricao).toBe('Pao brioche, hamburger, queijo, alface e tomate');
    expect(produto.categoria).toBe('LANCHES');
    expect(produto.valor).toBe(25);
  });
});