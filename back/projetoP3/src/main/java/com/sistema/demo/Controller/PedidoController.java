package com.sistema.demo.controller;

import com.sistema.demo.pedidos.Pedidos;
import com.sistema.demo.pedidos.PedidoRepository;
import com.sistema.demo.produto.Produto;
import com.sistema.demo.usuario.User;
import com.sistema.demo.usuario.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidosRepository;

    @Autowired
    private UserService userService;

    @PostMapping("/criar")
    public ResponseEntity<?> criarPedido(@RequestBody Pedidos pedido, HttpServletRequest request) {
        String username = (String) request.getAttribute("username");

        if (username == null) {
            return ResponseEntity.status(401)
                    .body("{\"erro\": \"Usuário não autenticado\"}");
        }

        User usuarioLogado = userService.findByUsername(username);

        if (usuarioLogado == null) {
            return ResponseEntity.status(404)
                    .body("{\"erro\": \"Usuário não encontrado no sistema\"}");
        }

        pedido.setUsuario(usuarioLogado);


        Produto produto = pedido.getProduto();
        if (produto != null) {
            produto.getNome();
            produto.getPreco();
            produto.getDescricao();
            produto.getImagem();
        }

        Pedidos novoPedido = pedidosRepository.save(pedido);

        return ResponseEntity.status(201).body(novoPedido);
    }


    @GetMapping("/listar")
    public ResponseEntity<?> listarPedidos(HttpServletRequest request) {
        String username = (String) request.getAttribute("username");
        String tipoUsuario = (String) request.getAttribute("tipoUsuario");

        if (username == null) {
            return ResponseEntity.status(401)
                    .body("{\"erro\": \"Usuário não autenticado\"}");
        }

        List<Pedidos> pedidos;

        if ("ADMIN".equalsIgnoreCase(tipoUsuario)) {
            pedidos = pedidosRepository.findAll();
            pedidos.forEach(p -> {
                if (p.getUsuario() != null) p.getUsuario().getUsername();
                if (p.getProduto() != null) p.getProduto().getNome();
            });

        } else {
            User usuarioLogado = userService.findByUsername(username);
            pedidos = pedidosRepository.findByUsuario(usuarioLogado);

            pedidos.forEach(p -> {
                if (p.getProduto() != null) p.getProduto().getNome();
            });
        }

        return ResponseEntity.ok(pedidos);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletarPedido(@PathVariable Long id) {
        Optional<Pedidos> pedido = pedidosRepository.findById(id);
        if (pedido.isPresent()) {
            pedidosRepository.deleteById(id);
            return ResponseEntity.ok("Pedido deletado com sucesso");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pedido não encontrado");
        }
    }

}
