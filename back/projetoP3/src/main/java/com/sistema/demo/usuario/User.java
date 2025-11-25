package com.sistema.demo.usuario;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sistema.demo.pedidos.Pedidos;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name="users")
@Getter
@Setter
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(unique=true)
    private String username;

    private String password;

    private String tipoUsuario; // CLIENTE ou ADMIN


    @OneToMany(mappedBy = "usuario")
    @JsonIgnore
    private List<Pedidos> pedidos;
}
