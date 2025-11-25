package com.sistema.demo.controller;

import com.sistema.demo.usuario.User;
import com.sistema.demo.usuario.UserDTO;
import com.sistema.demo.usuario.UserService;
import com.sistema.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;


    // Cadastro de usuário

    @PostMapping
    public ResponseEntity<?> criarUser(@RequestBody User user) {
        try {
            User novoUser = userService.cadastrarUser(user);
            UserDTO userDTO = new UserDTO(novoUser);
            return ResponseEntity.status(201).body(userDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("{\"erro\": \"" + e.getMessage() + "\"}");
        }
    }


    // Login

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            User logarUser = userService.login(user.getUsername(), user.getPassword());

            // Gera token JWT
            String token = jwtUtil.gerarToken(logarUser.getUsername(), logarUser.getTipoUsuario());

            // Retorna token + DTO do usuário
            return ResponseEntity.ok(new LoginResponse(token, new UserDTO(logarUser)));
        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body("{\"erro\": \"" + e.getMessage() + "\"}");
        }
    }



    // Logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("{\"msg\": \"Logout realizado com sucesso no cliente\"}");
    }


    // DTO para resposta de login

    public static class LoginResponse {
        private String token;
        private UserDTO usuario;

        public LoginResponse(String token, UserDTO usuario) {
            this.token = token;
            this.usuario = usuario;
        }

        public String getToken() { return token; }
        public UserDTO getUsuario() { return usuario; }
    }
}
