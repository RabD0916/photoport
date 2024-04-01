package com.example.webphoto.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddUserRequest {

    private String username;

    private String password;

    private String userNick;

    private String phone;

    private String birth;

    private String email;

    private LocalDateTime userConn;
}
