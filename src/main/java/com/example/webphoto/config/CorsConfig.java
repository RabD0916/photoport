package com.example.webphoto.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // 허용할 엔드포인트 패턴
                .allowedOrigins("http://localhost:3000") // 허용할 오리진
                .allowedMethods("GET", "POST", "PUT", "DELETE","OPTIONS"); // 허용할 HTTP 메소드
    }
}
