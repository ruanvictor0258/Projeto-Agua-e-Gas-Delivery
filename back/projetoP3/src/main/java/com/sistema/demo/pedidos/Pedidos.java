package com.sistema.demo.pedidos;

import com.sistema.demo.usuario.User;
import com.sistema.demo.produto.Produto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "pedidos")
@Getter
@Setter
public class Pedidos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String endereco;
    private String pagamento;
    private String telefone;
    private int quantidade;
    private double valorTotal;

    @Enumerated(EnumType.STRING)
    private StatusPedido status = StatusPedido.PENDENTE; // valor padrão

    private LocalDateTime criadoEm = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private User usuario;

    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Produto produto;
}
