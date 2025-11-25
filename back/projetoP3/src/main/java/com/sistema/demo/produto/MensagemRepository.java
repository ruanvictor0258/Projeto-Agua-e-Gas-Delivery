package com.sistema.demo.produto;

import org.springframework.stereotype.Repository;


@Repository
public class MensagemRepository {
    public String obterMensagem() {
        return "Olá do repositório";
    }
}
