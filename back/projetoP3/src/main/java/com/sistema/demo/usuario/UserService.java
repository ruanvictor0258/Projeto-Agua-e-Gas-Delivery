package com.sistema.demo.usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public User cadastrarUser(User usuario) {
        Optional<User> existente = usuarioRepository.findByUsername(usuario.getUsername());
        if (existente.isPresent()) {
            throw new RuntimeException("Usuario já existente!");
        }

        long totalRegistros = usuarioRepository.count();
        usuario.setTipoUsuario(totalRegistros == 0 ? "ADMIN" : "CLIENTE");

        return usuarioRepository.save(usuario);
    }

    public User login(String username, String password) {
        Optional<User> usuario = usuarioRepository.findByUsername(username);
        if (usuario.isEmpty() || !usuario.get().getPassword().equals(password)) {
            throw new RuntimeException("Credenciais inválidas!");
        }
        return usuario.get();
    }

    public List<User> listarUsuarios() {
        return usuarioRepository.findAll();
    }


    public User findByUsername(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
}
