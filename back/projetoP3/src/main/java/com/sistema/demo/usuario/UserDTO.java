package com.sistema.demo.usuario;

public class UserDTO {
    private Long id;
    private String username;
    private String tipoUsuario;


    public UserDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.tipoUsuario = user.getTipoUsuario();
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(String tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }
}
