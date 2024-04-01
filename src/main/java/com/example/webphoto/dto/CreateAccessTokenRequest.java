package com.example.webphoto.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateAccessTokenRequest {

    private String username;
    private String password;
    private String refreshToken;
}
