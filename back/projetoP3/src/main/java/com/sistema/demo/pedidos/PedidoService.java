package com.sistema.demo.pedidos;

import com.sistema.demo.produto.Produto;
import com.sistema.demo.produto.ProdutoRepository;
import com.sistema.demo.usuario.User;
import com.sistema.demo.usuario.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository userRepository;

    public Pedidos criarPedido(Long usuarioId, Long produtoId, int quantidade, String endereco, String telefone, String pagamento) {
        User usuario = userRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        Pedidos pedido = new Pedidos();
        pedido.setUsuario(usuario);
        pedido.setProduto(produto);
        pedido.setEndereco(endereco);
        pedido.setTelefone(telefone);
        pedido.setPagamento(pagamento);
        pedido.setQuantidade(quantidade);
        pedido.setValorTotal(produto.getPreco() * quantidade);
        pedido.setStatus(StatusPedido.PENDENTE);

        return pedidoRepository.save(pedido);
    }

    public List<Pedidos> listarTodos() {
        return pedidoRepository.findAll();
    }

    public Pedidos atualizarStatus(Long pedidoId, StatusPedido novoStatus) {
        Pedidos pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        pedido.setStatus(novoStatus);
        return pedidoRepository.save(pedido);
    }
}
