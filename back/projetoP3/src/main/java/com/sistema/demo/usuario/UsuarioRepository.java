package com.sistema.demo.usuario;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository <User, Long> {

    Optional<User> findByUsername(String username);

    List<User> findByTipoUsuario(String tipoUsuario);
}
