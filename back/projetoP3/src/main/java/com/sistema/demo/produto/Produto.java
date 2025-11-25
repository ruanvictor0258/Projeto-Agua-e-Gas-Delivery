package com.sistema.demo.produto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;



@Entity
@Table(name="produtos")
@Getter
@Setter
public class Produto {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    private String nome;

    private Double preco;

    private String descricao;

    private String  imagem;


    public Produto() {}

    public Produto(String nome, Double preco, String descricao, String imagem) {
        this.nome = nome;
        this.preco = preco;
        this.descricao = descricao;
        this.imagem = imagem;
    }
}