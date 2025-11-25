package com.sistema.demo.pedidos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PedidoRequest {
    private Long usuarioId;
    private Long produtoId;
    private int quantidade;
    private String endereco;
    private String telefone;
    private String pagamento;
}
