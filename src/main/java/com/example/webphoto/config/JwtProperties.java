package com.example.webphoto.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties("jwt")
public class JwtProperties {

    private String issuer; // 토큰 발급자

    private String secretKey; // 토큰을 서명하기 위한 비밀 키

    private int duration; // 엑세스 토큰 유효 기간

    private int refreshDuration; // 리프레시 토큰의 유효 기간
}
