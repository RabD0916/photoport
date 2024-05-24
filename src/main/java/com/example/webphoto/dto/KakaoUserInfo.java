package com.example.webphoto.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class KakaoUserInfo {
    private String email;
    private String nickname;
    private String name;
    private String birthday;
    private String phoneNumber;
}