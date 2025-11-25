package com.sistema.demo.pedidos;


import org.springframework.data.jpa.repository.JpaRepository;
import com.sistema.demo.usuario.User;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedidos, Long> {
    List<Pedidos> findByUsuario(User usuario);
}
